import os
import time
import numpy as np
from main_app import encode_audio, decode_audio, get_ml_guided_positions

def run_timing_analysis(input_folder="original"):
    """Measures the average encoding and decoding time for each method."""
    files = [os.path.join(input_folder, f) for f in os.listdir(input_folder) if f.lower().endswith(".wav")]
    if not files:
        print("No .wav files found in the 'original' folder.")
        return

    message = b"This is a standard message for timing analysis."
    password = "password123"
    results = {"Randomized LSB": [], "ML-guided LSB": []}
    
    for file_path in files:
        print(f"--- Timing on: {os.path.basename(file_path)} ---")
        temp_stego_path = "temp_timing_stego.wav"

        for method in ["Randomized LSB", "ML-guided LSB"]:
            try:
                # --- Time the full process (encode + decode) ---
                start_time = time.perf_counter()
                
                # Encoding part
                positions = None
                if method == "ML-guided LSB":
                    positions = get_ml_guided_positions(file_path, for_decoding=True)
                encode_audio(file_path, temp_stego_path, message, password, positions_to_use=positions)
                
                # Decoding part
                decode_audio(temp_stego_path, password, positions_to_use=positions)

                end_time = time.perf_counter()
                total_time = end_time - start_time
                results[method].append(total_time)

            except Exception as e:
                print(f"Error during timing test for {method}: {e}")
            
        if os.path.exists(temp_stego_path):
            os.remove(temp_stego_path)

    # --- Calculate and Print Averages ---
    print("\n--- Average Total Time (Encode + Decode) ---")
    for method, times in results.items():
        avg_time = np.mean(times) if times else 0
        print(f"  - {method}: {avg_time:.4f}s")

if __name__ == "__main__":
    run_timing_analysis()