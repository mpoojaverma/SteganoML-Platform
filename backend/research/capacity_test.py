import os
import numpy as np
import pandas as pd
import soundfile as sf
import matplotlib.pyplot as plt
from main_app import encode_audio, get_ml_guided_positions
from evaluation_script import psnr

def run_capacity_analysis(file_path):
    print(f"--- Running Capacity Analysis on: {os.path.basename(file_path)} ---")
    payload_sizes_kb = [1, 5, 10, 20, 50, 100] # Adjusted test sizes
    results = {"Randomized LSB": {}, "ML-guided LSB": {}}
    
    orig_data, sr = sf.read(file_path, dtype='int16')
    orig_bytes = orig_data.tobytes()

    # --- Step 1: Determine the maximum capacity for each method ---
    print("Analyzing audio to determine capacity...")
    ml_positions = get_ml_guided_positions(file_path, for_decoding=True)
    ml_capacity_bits = len(ml_positions) if ml_positions else 0
    random_capacity_bits = len(orig_bytes) * 8
    print(f"  - Randomized LSB Max Capacity: {random_capacity_bits / 8 / 1024:.2f} KB")
    print(f"  - ML-guided LSB Max Capacity:  {ml_capacity_bits / 8 / 1024:.2f} KB")

    # --- Step 2: Run tests within the capacity limits ---
    for method in ["Randomized LSB", "ML-guided LSB"]:
        print(f"\nTesting method: {method}")
        
        max_bits = random_capacity_bits
        positions_to_use = None
        if method == "ML-guided LSB":
            max_bits = ml_capacity_bits
            positions_to_use = ml_positions

        for size_kb in payload_sizes_kb:
            payload_bits = size_kb * 1024 * 8
            
            # Only run the test if the payload fits
            if payload_bits > max_bits:
                print(f"  - {size_kb} KB Payload -> SKIPPED (Exceeds capacity)")
                continue

            try:
                message = os.urandom(size_kb * 1024)
                temp_stego_path = "temp_capacity_stego.wav"
                
                encode_audio(file_path, temp_stego_path, message, "password123", positions_to_use=positions_to_use)
                
                stego_data, _ = sf.read(temp_stego_path, dtype='int16')
                psnr_val = psnr(orig_bytes, stego_data.tobytes())
                
                results[method][size_kb] = psnr_val
                print(f"  - {size_kb} KB Payload -> PSNR: {psnr_val:.2f} dB")
            except Exception as e:
                print(f"  - {size_kb} KB Payload -> FAILED. {e}")
            finally:
                if 'temp_stego_path' in locals() and os.path.exists(temp_stego_path):
                    os.remove(temp_stego_path)
    return results

def plot_capacity_results(results, filename):
    df = pd.DataFrame(results)
    
    plt.style.use('seaborn-v0_8-whitegrid')
    df.plot(kind='line', marker='o', figsize=(10, 6), xlim=(0, max(max(results.values(), key=lambda d: list(d.keys())[-1] if d else 0).keys()) + 5))
    
    plt.title(f'Payload Capacity vs. PSNR for {os.path.basename(filename)}', fontsize=16)
    plt.xlabel("Payload Size (KB)", fontsize=12)
    plt.ylabel("PSNR (dB)", fontsize=12)
    plt.legend(title="Method")
    plt.tight_layout()
    
    output_path = f"results/capacity_analysis_{os.path.splitext(os.path.basename(filename))[0]}.png"
    plt.savefig(output_path)
    print(f"\n✅ Capacity plot saved to {output_path}")
    plt.show()

if __name__ == "__main__":
    input_folder = "original"
    test_file = os.path.join(input_folder, os.listdir(input_folder)[0]) 
    
    capacity_data = run_capacity_analysis(test_file)
    plot_capacity_results(capacity_data, test_file)