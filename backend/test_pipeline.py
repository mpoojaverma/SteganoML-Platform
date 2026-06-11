import os
import sys
import numpy as np
import soundfile as sf

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.stego_engine import encode_message, decode_message
from core.utils import generate_deterministic_positions
from core.ml_pipeline import get_ml_guided_positions

def create_dummy_wav(filepath, duration_sec=5, sample_rate=44100):
    t = np.linspace(0, duration_sec, int(sample_rate * duration_sec), endpoint=False)
    # 440 Hz sine wave
    data = 0.5 * np.sin(2 * np.pi * 440 * t)
    # Convert to 16-bit PCM integer scale
    data_int16 = (data * 32767).astype(np.int16)
    sf.write(filepath, data_int16, sample_rate, subtype='PCM_16')
    print(f"Created dummy WAV: {filepath}")

def test_pipeline():
    input_wav = "temp_dummy_input.wav"
    stego_wav_ml = "temp_stego_ml.wav"
    stego_wav_rand = "temp_stego_rand.wav"
    
    password = "SuperSecurePassword123"
    message = "Test message: SteganoML integration checks."
    
    # Create clean input
    create_dummy_wav(input_wav)
    
    try:
        # 1. Test Randomized LSB method
        print("\n--- Testing Randomized LSB Method ---")
        enc_res_rand = encode_message(
            input_audio_path=input_wav,
            output_audio_path=stego_wav_rand,
            secret_message=message,
            password=password,
            method="random"
        )
        print("Encode Success:", enc_res_rand["status"], "| bits embedded:", enc_res_rand["bits_embedded"])
        
        # Decode Randomized LSB
        dec_res_rand = decode_message(
            audio_path=stego_wav_rand,
            password=password,
            method="random"
        )
        print("Decode Result:", dec_res_rand)
        
        # 2. Test ML-guided method
        print("\n--- Testing ML-guided Method ---")
        enc_res_ml = encode_message(
            input_audio_path=input_wav,
            output_audio_path=stego_wav_ml,
            secret_message=message,
            password=password,
            method="ml"
        )
        print("Encode Success:", enc_res_ml["status"], "| bits embedded:", enc_res_ml["bits_embedded"])
        
        # Decode ML-guided
        dec_res_ml = decode_message(
            audio_path=stego_wav_ml,
            password=password,
            method="ml"
        )
        print("Decode Result:", dec_res_ml)
        
    finally:
        # Cleanup
        for path in [input_wav, stego_wav_ml, stego_wav_rand]:
            if os.path.exists(path):
                os.remove(path)
                print(f"Cleaned up {path}")

if __name__ == "__main__":
    test_pipeline()
