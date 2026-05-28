import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import soundfile as sf
from main_app import encode_audio, decode_audio, get_ml_guided_positions

# --- Utilities ---
def safe_read_wav(file_path):
    """Read WAV safely and return int16 numpy array and sampling rate."""
    data, sr = sf.read(file_path, dtype='float32')
    int16_data = np.clip(data * 32767, -32768, 32767).astype(np.int16)
    return int16_data, sr

def psnr(orig_bytes, stego_bytes):
    orig = np.frombuffer(orig_bytes, dtype=np.int32)
    stego = np.frombuffer(stego_bytes, dtype=np.int32)
    mse = np.mean((orig - stego)**2)
    if mse == 0:
        return 100.0
    return 20 * np.log10(32767 / np.sqrt(mse))

def ber(orig_bytes, stego_bytes):
    orig_bits = np.unpackbits(np.frombuffer(orig_bytes, dtype=np.uint8))
    stego_bits = np.unpackbits(np.frombuffer(stego_bytes, dtype=np.uint8))
    min_len = min(len(orig_bits), len(stego_bits))
    errors = np.sum(orig_bits[:min_len] != stego_bits[:min_len])
    return errors / min_len

def normalized_correlation(orig_bytes, stego_bytes):
    orig = np.frombuffer(orig_bytes, dtype=np.int32)
    stego = np.frombuffer(stego_bytes, dtype=np.int32)
    return np.corrcoef(orig, stego)[0,1]

def snr(orig_bytes, stego_bytes):
    orig = np.frombuffer(orig_bytes, dtype=np.int32).astype(np.float32)
    noise = orig - np.frombuffer(stego_bytes, dtype=np.int32).astype(np.float32)
    signal_power = np.mean(orig**2)
    noise_power = np.mean(noise**2)
    if noise_power == 0:
        return 100.0
    return 10 * np.log10(signal_power / noise_power)

# --- Evaluate single file ---
def evaluate_file(file_path, message="TESTMSG123456"):
    results = []
    methods = ["Randomized LSB", "ML-guided LSB"]
    temp_stego_path = "temp_stego.wav"

    orig_data, sr = safe_read_wav(file_path)
    orig_bytes = orig_data.astype(np.int32).tobytes()

    for method in methods:
        positions = None
        if method == "ML-guided LSB":
            positions = get_ml_guided_positions(file_path, for_decoding=True)

        # Encode audio
        encode_audio(file_path, temp_stego_path, message.encode(), "password123", positions_to_use=positions)

        # Read stego bytes
        stego_data, _ = safe_read_wav(temp_stego_path)
        stego_bytes = stego_data.astype(np.int32).tobytes()

        # Metrics
        results.append({
            "File": os.path.basename(file_path),
            "Method": method,
            "PSNR_dB": psnr(orig_bytes, stego_bytes),
            "BER": ber(orig_bytes, stego_bytes),
            "NC": normalized_correlation(orig_bytes, stego_bytes),
            "SNR_dB": snr(orig_bytes, stego_bytes),
        })

    if os.path.exists(temp_stego_path):
        os.remove(temp_stego_path)
    return results

# --- Batch Evaluation ---
def run_batch_evaluation(input_folder="original"):
    all_results = []
    if not os.path.exists(input_folder):
        raise FileNotFoundError(f"Folder not found: {input_folder}")
    files = [os.path.join(input_folder, f) for f in os.listdir(input_folder) if f.lower().endswith(".wav")]

    for f in files:
        try:
            print(f"📈 Evaluating: {os.path.basename(f)}...")
            results = evaluate_file(f)
            all_results.extend(results)
        except Exception as e:
            print(f"❗️ SKIPPING FILE: Could not process {os.path.basename(f)}. Error: {e}")
            continue

    if not all_results:
        print("⚠️ No valid files were processed. The results CSV will be empty.")
        return

    df = pd.DataFrame(all_results)
    if not os.path.exists("results"):
        os.mkdir("results")
    df.to_csv("results/evaluation_results.csv", index=False)
    print("\n✅ Quantitative evaluation complete!")

    # --- Create and Save Summary Table ---
    metrics = ["PSNR_dB", "BER", "NC", "SNR_dB"]
    summary = df.groupby("Method")[metrics].agg(['mean','std']).round(6)
    summary_path = os.path.join("results", "summary.csv")
    summary.to_csv(summary_path)
    print(f"✅ Summary table saved to {summary_path}")
    print("\n--- Summary ---")
    print(summary)

# --- Main ---
if __name__ == "__main__":
    run_batch_evaluation("original")