import random
import hashlib
import joblib
import librosa
import numpy as np

from pathlib import Path


# =========================================================
# MODEL PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "catboost_model_final.pkl"
SCALER_PATH = BASE_DIR / "models" / "scaler_FINAL.pkl"


# =========================================================
# LOAD MODEL + SCALER
# =========================================================

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


# =========================================================
# FEATURE EXTRACTION
# =========================================================

def extract_audio_features(audio_path: str):

    y, sr = librosa.load(audio_path, sr=None)

    frame_length = 2048
    hop_length = 512

    rms = librosa.feature.rms(
        y=y,
        frame_length=frame_length,
        hop_length=hop_length
    )[0]

    zcr = librosa.feature.zero_crossing_rate(
        y,
        frame_length=frame_length,
        hop_length=hop_length
    )[0]

    spectral_centroid = librosa.feature.spectral_centroid(
        y=y,
        sr=sr,
        hop_length=hop_length
    )[0]

    spectral_bandwidth = librosa.feature.spectral_bandwidth(
        y=y,
        sr=sr,
        hop_length=hop_length
    )[0]

    mfcc = librosa.feature.mfcc(
        y=y,
        sr=sr,
        n_mfcc=20,
        hop_length=hop_length
    )

    mfcc_delta = librosa.feature.delta(mfcc)

    chroma = librosa.feature.chroma_stft(
        y=y,
        sr=sr,
        hop_length=hop_length
    )

    features = []

    total_frames = len(rms)

    for i in range(total_frames):

        feature_vector = [

            rms[i],
            zcr[i],
            spectral_centroid[i],
            spectral_bandwidth[i]

        ]

        feature_vector.extend(mfcc[:, i])
        feature_vector.extend(mfcc_delta[:, i])
        feature_vector.extend(chroma[:, i])

        features.append(feature_vector)

    return np.array(features), sr, hop_length


# =========================================================
# DETERMINISTIC ML POSITIONS
# =========================================================

def get_ml_guided_positions(
    audio_path: str,
    required_bits: int,
    password: str
):

    features, sr, hop_length = extract_audio_features(
        audio_path
    )

    scaled_features = scaler.transform(features)

    predictions = model.predict_proba(
        scaled_features
    )[:, 1]

    ranked_frames = np.argsort(
        predictions,
        kind="stable"
    )[::-1]

    # -----------------------------------------------------
    # UNIQUE POSITION COLLECTION
    # -----------------------------------------------------

    candidate_positions = []

    used_positions = set()

    for frame_idx in ranked_frames:

        start = frame_idx * hop_length
        end = start + hop_length

        for pos in range(start, end):

            if pos not in used_positions:

                candidate_positions.append(pos)

                used_positions.add(pos)

    # -----------------------------------------------------
    # PASSWORD-SEEDED SHUFFLE
    # -----------------------------------------------------

    seed = int(
        hashlib.sha256(
            password.encode()
        ).hexdigest(),
        16
    ) % (2**32)

    rng = random.Random(seed)

    rng.shuffle(candidate_positions)

    # -----------------------------------------------------
    # FINAL POSITION COUNT
    # -----------------------------------------------------

    return candidate_positions[:required_bits]