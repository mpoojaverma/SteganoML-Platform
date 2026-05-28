import os
import numpy as np
import soundfile as sf
import subprocess
import tempfile
from main_app import encode_audio, decode_audio, get_ml_guided_positions

def apply_mp3_compression(input_path, bitrate="128k"):
    """Compresses a WAV file to MP3 and back to WAV to simulate compression artifacts."""
    # Create temporary file paths
    temp_mp3 = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3").name
    temp_wav_out = tempfile.NamedTemporaryFile(delete=False, suffix=".wav").name
    
    try:
        # To MP3 and back to WAV. Capture output to hide FFmpeg messages.
        subprocess.run(['ffmpeg', '-y', '-i', input_path, '-b:a', bitrate, temp_mp3], check=True, capture_output=True, text=True)
        subprocess.run(['ffmpeg', '-y', '-i', temp_mp3, temp_wav_out], check=True, capture_output=True, text=True)
        # Return the PATH to the attacked wav file, not its data
        return temp_wav_out
    finally:
        # Clean up the intermediate mp3 file
        if os.path.exists(temp_mp3):
            os.remove(temp_mp3)

def run_robustness_test(file_path, method):
    """Encodes, attacks, and tries to decode a message, returning 'Success' or 'Fail'."""
    message = "robustness_check"
    password = "password123"
    
    temp_stego_path = None
    attacked_wav_path = None
    
    try:
        # 1. Encode the original file
        temp_stego_path = tempfile.NamedTemporaryFile(delete=False, suffix=".wav").name
        positions = None
        if method == "ML-guided":
            positions = get_ml_guided_positions(file_path, for_decoding=True)
        encode_audio(file_path, temp_stego_path, message.encode(), password, positions_to_use=positions)

        # 2. Apply the MP3 compression attack
        attacked_wav_path = apply_mp3_compression(temp_stego_path)

        # 3. Attempt to decode from the attacked .wav FILE
        decode_audio(attacked_wav_path, password, positions_to_use=positions)
        result = 'Success' # If the line above doesn't crash, it's a success
    except Exception:
        result = 'Fail'
    finally:
        # 4. Clean up all temporary files
        if temp_stego_path and os.path.exists(temp_stego_path):
            os.remove(temp_stego_path)
        if attacked_wav_path and os.path.exists(attacked_wav_path):
            os.remove(attacked_wav_path)

    return result

if __name__ == "__main__":
    input_folder = "original"
    if not os.path.exists(input_folder):
        raise FileNotFoundError(f"Folder not found: {input_folder}")

    files_to_test = [os.path.join(input_folder, f) for f in os.listdir(input_folder) if f.lower().endswith(".wav")]
    
    print("--- Running Robustness Tests (MP3 Compression Attack) ---")
    for file_path in files_to_test:
        try:
            filename = os.path.basename(file_path)
            print(f"\n🛡️  Attacking: {filename}")
            
            result_random = run_robustness_test(file_path, "Randomized")
            print(f"  - Randomized LSB Result: {result_random}")

            result_ml = run_robustness_test(file_path, "ML-guided")
            print(f"  - ML-guided LSB Result:  {result_ml}")
        
        except Exception as e:
            print(f"❗️ SKIPPING FILE: Could not run robustness test on {os.path.basename(file_path)}. Error: {e}")
            continue
    print("\n✅ Robustness tests complete!")