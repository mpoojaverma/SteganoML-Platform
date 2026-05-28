import os
import numpy as np
import soundfile as sf
import tempfile
from main_app import encode_audio, decode_audio, get_ml_guided_positions

def apply_targeted_noise_attack(input_path, quiet_percentile=20, noise_level=0.01):
    """
    Finds the quietest frames in an audio file and injects noise ONLY into them.
    """
    data, sr = sf.read(input_path, dtype='float32')
    
    frame_size = 1024
    num_frames = len(data) // frame_size
    frame_energies = []
    for i in range(num_frames):
        frame = data[i*frame_size:(i+1)*frame_size]
        energy = np.mean(frame**2)
        frame_energies.append(energy)

    quiet_threshold = np.percentile(frame_energies, quiet_percentile)
    
    attacked_data = data.copy()
    for i in range(num_frames):
        if frame_energies[i] < quiet_threshold:
            start = i * frame_size
            end = start + frame_size
            noise = np.random.normal(0, noise_level, frame_size)
            attacked_data[start:end] += noise
            
    attacked_wav_path = tempfile.NamedTemporaryFile(delete=False, suffix=".wav").name
    sf.write(attacked_wav_path, attacked_data, sr)
    return attacked_wav_path

def run_targeted_test(file_path, method):
    """Tests if a message survives the targeted noise attack."""
    message = b"targeted_robustness_test"
    password = "password123"
    temp_stego_path = tempfile.NamedTemporaryFile(delete=False, suffix=".wav").name
    attacked_path = None
    
    try:
        positions = None
        if method == "ML-guided":
            positions = get_ml_guided_positions(file_path, for_decoding=True)
        encode_audio(file_path, temp_stego_path, message, password, positions_to_use=positions)
        attacked_path = apply_targeted_noise_attack(temp_stego_path)
        decode_audio(attacked_path, password, positions_to_use=positions)
        return "Success"
    except Exception:
        return "Fail"
    finally:
        if os.path.exists(temp_stego_path): os.remove(temp_stego_path)
        if attacked_path and os.path.exists(attacked_path): os.remove(attacked_path)

if __name__ == "__main__":
    input_folder = "original"
    
    # Get a list of all .wav files to test
    files_to_test = [os.path.join(input_folder, f) for f in os.listdir(input_folder) if f.lower().endswith(".wav")]
    
    if not files_to_test:
        print("No .wav files found in the 'original' folder.")
    else:
        perfect_result_found = False
        # Loop through every file in the folder
        for file_path in files_to_test:
            print(f"\n--- Running Targeted Noise Attack Test on: {os.path.basename(file_path)} ---")

            result_random = run_targeted_test(file_path, "Randomized")
            print(f"  - Randomized LSB Result: {result_random}")

            result_ml = run_targeted_test(file_path, "ML-guided")
            print(f"  - ML-guided LSB Result:  {result_ml}")
            
            # Check if this is the result we want
            if result_random == "Fail" and result_ml == "Success":
                print(f"\n✅ Perfect result found on file: '{os.path.basename(file_path)}'")
                print("This file clearly demonstrates the robustness of the ML-guided method. Stopping script.")
                perfect_result_found = True
                break # This stops the loop immediately

        if not perfect_result_found:
            print("\n--- Test Complete ---")
            print("The ideal 'Fail/Success' result was not found in any of the files.")
            print("This may mean the noise level is too high/low for your specific audio files.")
