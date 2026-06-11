import os
import sys
import uuid
import numpy as np
import soundfile as sf

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.stego_engine import encode_message, decode_message

def create_dummy_wav(filepath, duration_sec=5, sample_rate=44100):
    t = np.linspace(0, duration_sec, int(sample_rate * duration_sec), endpoint=False)
    data = 0.5 * np.sin(2 * np.pi * 440 * t)
    data_int16 = (data * 32767).astype(np.int16)
    sf.write(filepath, data_int16, sample_rate, subtype='PCM_16')

def run_validation_cycles():
    carrier_path = "temp_validation_carrier.wav"
    create_dummy_wav(carrier_path)
    
    password = "ValidationPassword123!"
    secret_text = "SteganoML validation payload: reliability check OK."
    
    print("=" * 60)
    print("         STEGANOML END-TO-END VALIDATION REPORT         ")
    print("=" * 60)
    
    results = {
        "random_fallback": {"success": 0, "total": 10},
        "ml_fallback": {"success": 0, "total": 10},
        "db_lookup": {"success": 0, "total": 10}
    }
    
    temp_files = [carrier_path]

    # --- 1. Randomized LSB Fallback (Renamed File) ---
    print("\n--- Phase 1: Randomized LSB Fallback (Renamed) ---")
    for i in range(10):
        temp_stego = f"temp_rand_stego_{i}.wav"
        renamed_stego = f"temp_rand_renamed_{uuid.uuid4().hex[:8]}.wav"
        
        try:
            # Encode
            encode_message(
                input_audio_path=carrier_path,
                output_audio_path=temp_stego,
                secret_message=f"{secret_text} Cycle {i}",
                password=password,
                method="random"
            )
            # Rename (bypassing DB name index)
            os.rename(temp_stego, renamed_stego)
            temp_files.append(renamed_stego)
            
            # Decode
            dec_res = decode_message(
                audio_path=renamed_stego,
                password=password,
                method="random"
            )
            
            if dec_res["status"] == "success" and dec_res["message"] == f"{secret_text} Cycle {i}":
                results["random_fallback"]["success"] += 1
                print(f"Cycle {i+1}/10: Success")
            else:
                print(f"Cycle {i+1}/10: Failed - {dec_res.get('message')}")
        except Exception as e:
            print(f"Cycle {i+1}/10: Error - {str(e)}")
            if os.path.exists(temp_stego):
                os.remove(temp_stego)

    # --- 2. ML-Guided Fallback (Renamed File) ---
    print("\n--- Phase 2: ML-Guided Fallback (Renamed) ---")
    for i in range(10):
        temp_stego = f"temp_ml_stego_{i}.wav"
        renamed_stego = f"temp_ml_renamed_{uuid.uuid4().hex[:8]}.wav"
        
        try:
            # Encode
            encode_message(
                input_audio_path=carrier_path,
                output_audio_path=temp_stego,
                secret_message=f"{secret_text} Cycle {i}",
                password=password,
                method="ml"
            )
            # Rename (bypassing DB name index)
            os.rename(temp_stego, renamed_stego)
            temp_files.append(renamed_stego)
            
            # Decode
            dec_res = decode_message(
                audio_path=renamed_stego,
                password=password,
                method="ml"
            )
            
            if dec_res["status"] == "success" and dec_res["message"] == f"{secret_text} Cycle {i}":
                results["ml_fallback"]["success"] += 1
                print(f"Cycle {i+1}/10: Success")
            else:
                print(f"Cycle {i+1}/10: Failed - {dec_res.get('message')}")
        except Exception as e:
            print(f"Cycle {i+1}/10: Error - {str(e)}")
            if os.path.exists(temp_stego):
                os.remove(temp_stego)

    # --- 3. Database Lookup Path ---
    print("\n--- Phase 3: Database Lookup Path ---")
    for i in range(10):
        temp_stego = f"temp_db_stego_{i}.wav"
        
        try:
            # Encode
            encode_message(
                input_audio_path=carrier_path,
                output_audio_path=temp_stego,
                secret_message=f"{secret_text} Cycle {i}",
                password=password,
                method="ml"
            )
            temp_files.append(temp_stego)
            
            # Decode (no renaming, queries DB directly)
            dec_res = decode_message(
                audio_path=temp_stego,
                password=password,
                method="ml"
            )
            
            if dec_res["status"] == "success" and dec_res["message"] == f"{secret_text} Cycle {i}":
                results["db_lookup"]["success"] += 1
                print(f"Cycle {i+1}/10: Success")
            else:
                print(f"Cycle {i+1}/10: Failed - {dec_res.get('message')}")
        except Exception as e:
            print(f"Cycle {i+1}/10: Error - {str(e)}")
            if os.path.exists(temp_stego):
                os.remove(temp_stego)

    print("\n" + "=" * 60)
    print("                  FINAL REPORT SUMMARY                  ")
    print("=" * 60)
    print(f"Randomized LSB Fallback: {results['random_fallback']['success']}/10 Success")
    print(f"ML-Guided Fallback:      {results['ml_fallback']['success']}/10 Success")
    print(f"Database Lookup Path:    {results['db_lookup']['success']}/10 Success")
    print("=" * 60)
    
    # Cleanup all temp files
    for f in temp_files:
        if os.path.exists(f):
            try:
                os.remove(f)
            except:
                pass

if __name__ == "__main__":
    run_validation_cycles()
