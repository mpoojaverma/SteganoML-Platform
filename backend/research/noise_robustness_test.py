import os
import numpy as np
import soundfile as sf
import tempfile
from main_app import encode_audio, decode_audio, get_ml_guided_positions

def add_gaussian_noise(audio_data, noise_level):
    """Adds a specific level of Gaussian noise to a float audio signal."""
    noise = np.random.normal(0, noise_level, audio_data.shape)
    return audio_data + noise

def run_noise_test(file_path, method, noise_level):
    """Tests if a message can be decoded after adding a specific level of noise."""
    message = b"noise_robustness_test"
    password = "password123"
    temp_stego_path = tempfile.NamedTemporaryFile(delete=False, suffix=".wav").name
    
    try:
        # Encode
        positions = None
        if method == "ML-guided":
            positions = get_ml_guided_positions(file_path, for_decoding=True)
        encode_audio(file_path, temp_stego_path, message, password, positions_to_use=positions)

        # Attack
        stego_data, sr = sf.read(temp_stego_path, dtype='float32')
        attacked_data = add_gaussian_noise(stego_data, noise_level)
        
        # Save attacked file before decoding
        attacked_wav_path = tempfile.NamedTemporaryFile(delete=False, suffix=".wav").name
        sf.write(attacked_wav_path, attacked_data, sr)
        
        # Attempt to Decode
        decode_audio(attacked_wav_path, password, positions_to_use=positions)
        return "Success"
    except Exception:
        return "Fail"
    finally:
        # Cleanup
        if os.path.exists(temp_stego_path): os.remove(temp_stego_path)
        if 'attacked_wav_path' in locals() and os.path.exists(attacked_wav_path): os.remove(attacked_wav_path)

if __name__ == "__main__":
    input_folder = "original"
    test_file = os.path.join(input_folder, os.listdir(input_folder)[0])
    
    # Define a range of noise levels to test, from high to very low
    noise_levels = [0.001, 0.0005, 0.0001, 0.00005, 0.00001]
    
    print(f"--- Running Noise Robustness Analysis on: {os.path.basename(test_file)} ---")

    for method in ["Randomized LSB", "ML-guided LSB"]:
        print(f"\n--- Testing Method: {method} ---")
        for level in noise_levels:
            result = run_noise_test(test_file, method, level)
            print(f"  - Noise Level {level:.5f}: {result}")