import tkinter as tk
from tkinter import messagebox, filedialog
import os
import subprocess
import threading
import wave
import base64
import tempfile
import sys
import random
import uuid
import struct
import hashlib
import time
import numpy as np
import joblib  # For loading the model and scaler
import librosa  # For SOTA feature extraction
import sqlite3
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.fernet import Fernet, InvalidToken
from playsound import playsound
import smtplib
from email.message import EmailMessage

# --- Database and User Authentication Functions ---
DB_FILE = "users.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT)')
    conn.commit()
    conn.close()

def hash_password(password): 
    return hashlib.sha256(password.encode()).hexdigest()

def register_user(name, email, password):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, hash_password(password)))
        conn.commit()
        return True, "User registered successfully."
    except sqlite3.IntegrityError:
        return False, "Email already exists."
    finally:
        conn.close()

def login_user(email, password):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, hash_password(password)))
    user = c.fetchone()
    conn.close()
    return user

# --- Key Derivation & Encryption Functions ---
def _ensure_bytes_for_salt(salt):
    # Robust conversion helper for salt -> always return bytes
    if isinstance(salt, bytes):
        return salt
    if isinstance(salt, bytearray):
        return bytes(salt)
    if isinstance(salt, str):
        return salt.encode()
    try:
        return bytes(salt)
    except Exception:
        return str(salt).encode()

def derive_key_from_password(password, salt):
    """
    Derive a Fernet-compatible key from a password + salt.
    This function always converts salt to immutable bytes before calling PBKDF2HMAC.
    """
    salt_bytes = _ensure_bytes_for_salt(salt)
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt_bytes, iterations=100000, backend=default_backend())
    raw_key = kdf.derive(password.encode())  # <-- PBKDF2HMAC.derive(bytes) is correct
    return base64.urlsafe_b64encode(raw_key)

def encrypt_message(message_bytes, key):
    return Fernet(key).encrypt(message_bytes)

def decrypt_message(encrypted_message_bytes, key):
    return Fernet(key).decrypt(encrypted_message_bytes)

# --- SOTA Feature Extraction ---
CHUNK_SAMPLE_SIZE = 2048

def extract_SOTA_features(audio_samples, sample_rate):
    if len(audio_samples) < CHUNK_SAMPLE_SIZE:
        return None
    audio_float = audio_samples.astype(np.float32) / 32768.0
    energy = np.mean(audio_float**2)
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=audio_float))
    spec_cent = np.mean(librosa.feature.spectral_centroid(y=audio_float, sr=sample_rate))
    mfccs = librosa.feature.mfcc(y=audio_float, sr=sample_rate, n_mfcc=13)
    mfccs_mean = np.mean(mfccs, axis=1)
    chroma = librosa.feature.chroma_stft(y=audio_float, sr=sample_rate)
    chroma_mean, chroma_std = np.mean(chroma, axis=1), np.std(chroma, axis=1)
    contrast = librosa.feature.spectral_contrast(y=audio_float, sr=sample_rate)
    contrast_mean, contrast_std = np.mean(contrast, axis=1), np.std(contrast, axis=1)
    onset_env = librosa.onset.onset_strength(y=audio_float, sr=sample_rate)
    tempo = librosa.beat.tempo(onset_envelope=onset_env, sr=sample_rate)
    tempo_mean = np.mean(tempo) if tempo.size > 0 else 0.0
    tempo_std = np.std(tempo) if tempo.size > 0 else 0.0
    feature_vector = np.concatenate([
        [energy, zcr, spec_cent],
        mfccs_mean, chroma_mean, chroma_std,
        contrast_mean, contrast_std, [tempo_mean, tempo_std]
    ])
    return feature_vector.tolist()

# --- Deterministic seed (return integer for random.seed) ---
def get_deterministic_seed(password_str):
    return int.from_bytes(hashlib.sha256(password_str.encode()).digest(), 'big')

# --- FULLY REVISED ML ANALYSIS FUNCTION ---
def get_ml_guided_positions(audio_path, for_decoding=False):
    """
    Analyzes an audio file to find robust byte indices for steganography.
    If for_decoding=True we first 'clean' the audio by zeroing out all LSBs
    to better replicate encoding conditions (ensures consistent ML decisions).
    Returns a sorted unique list of byte positions (0..N-1).
    """
    analysis_target_path = audio_path
    temp_wav_file = None

    try:
        if for_decoding:
            with wave.open(audio_path, 'rb') as song:
                params = song.getparams()
                frame_bytes = bytearray(song.readframes(song.getnframes()))
            for i in range(len(frame_bytes)):
                frame_bytes[i] &= 254
            temp_wav_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
            with wave.open(temp_wav_file.name, 'wb') as temp_song:
                temp_song.setparams(params)
                temp_song.writeframes(frame_bytes)
            analysis_target_path = temp_wav_file.name
            temp_wav_file.close()

        # load model+scaler
        model = joblib.load('final_model/catboost_model_final.pkl')
        scaler = joblib.load('final_model/scaler_FINAL.pkl')

        # load via librosa (preserve native sr)
        samples, sr = librosa.load(analysis_target_path, sr=None, mono=True)
        # convert to int16-like values aligning with PCM16 bytes
        samples_int16 = (samples * 32767).astype(np.int16)
        robust_byte_indices = []

        # iterate per chunk (samples)
        for i in range(0, len(samples_int16), CHUNK_SAMPLE_SIZE):
            chunk_samples = samples_int16[i:i+CHUNK_SAMPLE_SIZE]
            features = extract_SOTA_features(chunk_samples, sr)
            if features:
                scaled_features = scaler.transform([features])
                prediction = model.predict(scaled_features)
                if int(prediction[0]) == 1:
                    # compute byte range (2 bytes per int16 sample)
                    start_byte_index = i * 2
                    end_byte_index = start_byte_index + (len(chunk_samples) * 2)
                    robust_byte_indices.extend(range(start_byte_index, end_byte_index))

        # dedupe & sort, ensure ints and non-negative
        robust_byte_indices = sorted(set(int(x) for x in robust_byte_indices if int(x) >= 0))
        return robust_byte_indices

    except FileNotFoundError:
        raise RuntimeError("Model files ('catboost_model_final.pkl' and 'scaler_FINAL.pkl') not found in 'final_model' folder.")
    finally:
        if for_decoding and temp_wav_file and os.path.exists(temp_wav_file.name):
            try:
                os.remove(temp_wav_file.name)
            except Exception:
                pass

# --- File Handling and Helper Functions ---
def convert_to_wav(input_path, force_conversion=False):
    if not input_path:
        return None, False
    if input_path.lower().endswith(".wav") and not force_conversion:
        return input_path, False
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    unique_name = f"temp_converted_{base_name}_{uuid.uuid4().hex}.wav"
    output_path = os.path.join(tempfile.gettempdir(), unique_name)
    try:
        ffmpeg_path = "ffmpeg"
        command = [ffmpeg_path, "-y", "-i", input_path, "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "1", output_path]
        startupinfo = None
        if os.name == 'nt':
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, startupinfo=startupinfo)
        return output_path, True
    except Exception as e:
        raise RuntimeError(f"FFmpeg failed. Ensure it's installed and in your PATH. Error: {e}")

def play_audio(file_path):
    if not file_path or not os.path.exists(file_path):
        messagebox.showerror("Error", "Audio file not found!")
        return
    temp_play_path = None
    try:
        temp_play_path, was_converted = convert_to_wav(file_path, force_conversion=True)
        def play_and_cleanup(path, is_temp):
            try:
                playsound(path)
            except Exception as e:
                root.after(0, lambda err=e: messagebox.showerror("Playback Error", f"Could not play audio: {err}"))
            finally:
                if is_temp and os.path.exists(path):
                    try:
                        time.sleep(0.5)
                        os.remove(path)
                    except PermissionError:
                        pass

        threading.Thread(target=play_and_cleanup, args=(temp_play_path, was_converted), daemon=True).start()
    except Exception as e:
        messagebox.showerror("Error", f"Failed to prepare audio for playback:\n{e}")
        if temp_play_path and os.path.exists(temp_play_path):
            os.remove(temp_play_path)

def send_audio_email(sender_email, smtp_password, receiver_email, audio_file_path):
    try:
        msg = EmailMessage()
        msg.set_content("You have received a secure audio file.\nUse the shared secret password to decode the message within.")
        msg['Subject'] = 'Secure Audio Message Received'
        msg['From'] = sender_email
        msg['To'] = receiver_email
        with open(audio_file_path, 'rb') as audio_file:
            msg.add_attachment(audio_file.read(), maintype='audio', subtype='wav', filename=os.path.basename(audio_file_path))
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(sender_email, smtp_password)
            smtp.send_message(msg)
    except smtplib.SMTPAuthenticationError:
        raise RuntimeError("Email login failed. Please check your email and 'App Password'.")
    except Exception as e:
        raise RuntimeError(f"Failed to send email: {e}")

# --- Steganography Core Functions ---
def encode_audio(input_file, output_file, data_to_hide, password_key, positions_to_use=None):
    with wave.open(input_file, 'rb') as song:
        frame_bytes = bytearray(list(song.readframes(song.getnframes())))
        params = song.getparams()
    data_len_bytes = struct.pack('>I', len(data_to_hide))
    payload = data_len_bytes + data_to_hide
    bits = ''.join([format(byte, '08b') for byte in payload])
    n_bits = len(bits)

    if positions_to_use is None:
        if n_bits > len(frame_bytes):
            raise ValueError("Message is too large for this audio file.")
        positions_to_search = list(range(len(frame_bytes)))
    else:
        positions_to_search = [p for p in positions_to_use if 0 <= p < len(frame_bytes)]
        if n_bits > len(positions_to_search):
            raise ValueError(f"Message is too large for the robust parts of this audio. Required: {n_bits} bits, Available: {len(positions_to_search)} bits.")

    seed_int = get_deterministic_seed(password_key)
    random.seed(seed_int)
    random.shuffle(positions_to_search)
    final_positions = positions_to_search[:n_bits]

    for i, pos in enumerate(final_positions):
        frame_bytes[pos] = (frame_bytes[pos] & 254) | int(bits[i])

    with wave.open(output_file, 'wb') as mod_audio:
        mod_audio.setparams(params)
        mod_audio.writeframes(frame_bytes)

def decode_audio(file_path, password_key, positions_to_use=None):
    with wave.open(file_path, mode='rb') as song:
        frame_bytes = bytearray(list(song.readframes(song.getnframes())))

    if positions_to_use is None:
        positions_to_search = list(range(len(frame_bytes)))
    else:
        positions_to_search = [p for p in positions_to_use if 0 <= p < len(frame_bytes)]
        if len(positions_to_search) < 32:
            positions_to_search = list(range(len(frame_bytes)))

    seed_int = get_deterministic_seed(password_key)
    random.seed(seed_int)
    random.shuffle(positions_to_search)

    if len(positions_to_search) < 32:
        raise InvalidToken("File is too short or not enough robust positions were found.")

    len_bits = "".join([str(frame_bytes[pos] & 1) for pos in positions_to_search[:32]])
    try:
        data_len = int(len_bits, 2)
    except Exception:
        raise InvalidToken("Failed to decode length header (bitstream invalid).")

    total_bits_to_extract = 32 + (data_len * 8)
    if total_bits_to_extract > len(positions_to_search):
        raise InvalidToken("Password may be incorrect or data is corrupt (invalid length).")

    payload_bits = "".join([str(frame_bytes[pos] & 1) for pos in positions_to_search[32:total_bits_to_extract]])
    byte_list = [int(payload_bits[i:i+8], 2) for i in range(0, len(payload_bits), 8)]
    extracted_data = bytes(byte_list)  # explicit bytes (immutable)

    # extracted_data = salt(16) + encrypted_message
    salt = extracted_data[:16]                # bytes
    encrypted_message = extracted_data[16:]   # bytes
    return encrypted_message, salt

# --- GUI Windows and Logic ---
root = tk.Tk()
init_db()
current_user = None

BG_COLOR = "#F0F0F0"
FRAME_COLOR = "#E0E0E0"
BUTTON_COLOR = "#2F4F4F"
TEXT_COLOR = "#FFFFFF"

root.title("Audio Steganography Research Tool")
root.geometry("500x400")
root.configure(bg=BG_COLOR)
screen_width, screen_height = root.winfo_screenwidth(), root.winfo_screenheight()
x, y = int((screen_width / 2) - (500 / 2)), int((screen_height / 2) - (400 / 2))
root.geometry(f"500x400+{x}+{y}")

def show_login_window():
    login_win = tk.Toplevel(root)
    login_win.title("User Login")
    login_win.geometry("400x200")
    login_win.configure(bg=BG_COLOR)
    form_frame = tk.Frame(login_win, bg=BG_COLOR, padx=10, pady=10)
    form_frame.pack(expand=True)
    form_frame.columnconfigure(1, weight=1)
    tk.Label(form_frame, text="Email:", bg=BG_COLOR).grid(row=0, column=0, sticky="w", padx=5, pady=5)
    email_entry = tk.Entry(form_frame, width=40)
    email_entry.grid(row=0, column=1, padx=5, pady=5)
    tk.Label(form_frame, text="Password:", bg=BG_COLOR).grid(row=1, column=0, sticky="w", padx=5, pady=5)
    pass_entry = tk.Entry(form_frame, width=40, show="*")
    pass_entry.grid(row=1, column=1, padx=5, pady=5)
    def attempt_login():
        global current_user
        user = login_user(email_entry.get(), pass_entry.get())
        if user:
            current_user = user
            messagebox.showinfo("Login Successful", f"Welcome {user[1]}!", parent=login_win)
            login_win.destroy()
        else:
            messagebox.showerror("Login Failed", "Invalid credentials", parent=login_win)
    tk.Button(form_frame, text="Login", font=("Arial", 10), bg=BUTTON_COLOR, fg=TEXT_COLOR, command=attempt_login).grid(row=2, column=0, columnspan=2, pady=10)
    tk.Button(form_frame, text="Register", font=("Arial", 10), command=lambda: (login_win.destroy(), show_register_window())).grid(row=3, column=0, columnspan=2)

def show_register_window():
    reg_win = tk.Toplevel(root)
    reg_win.title("Register")
    reg_win.geometry("400x250")
    reg_win.configure(bg=BG_COLOR)
    form_frame = tk.Frame(reg_win, bg=BG_COLOR, padx=10, pady=10)
    form_frame.pack(expand=True)
    form_frame.columnconfigure(1, weight=1)
    tk.Label(form_frame, text="Name:", bg=BG_COLOR).grid(row=0, column=0, sticky="w", padx=5, pady=5)
    name_entry = tk.Entry(form_frame, width=40)
    name_entry.grid(row=0, column=1, padx=5, pady=5)
    tk.Label(form_frame, text="Email:", bg=BG_COLOR).grid(row=1, column=0, sticky="w", padx=5, pady=5)
    email_entry = tk.Entry(form_frame, width=40)
    email_entry.grid(row=1, column=1, padx=5, pady=5)
    tk.Label(form_frame, text="Password:", bg=BG_COLOR).grid(row=2, column=0, sticky="w", padx=5, pady=5)
    pass_entry = tk.Entry(form_frame, width=40, show="*")
    pass_entry.grid(row=2, column=1, padx=5, pady=5)
    def attempt_register():
        success, msg = register_user(name_entry.get(), email_entry.get(), pass_entry.get())
        if success:
            messagebox.showinfo("Success", msg, parent=reg_win)
            reg_win.destroy()
            show_login_window()
        else:
            messagebox.showerror("Error", msg, parent=reg_win)
    tk.Button(form_frame, text="Register", font=("Arial", 10), bg=BUTTON_COLOR, fg=TEXT_COLOR, command=attempt_register).grid(row=3, column=0, columnspan=2, pady=10)

def on_hide_click(mode):
    if not current_user:
        messagebox.showwarning("Login Required", "Please login first.")
        return
    show_encode_window(mode)

def on_extract_click():
    if not current_user:
        messagebox.showwarning("Login Required", "Please login first.")
        return
    show_decode_window()

def show_encode_window(mode):
    title = "Encode (Randomized LSB)" if mode == "randomized" else "Encode (Supervised ML - CatBoost)"
    win = tk.Toplevel(root)
    win.title(title)
    win.geometry("700x350")
    win.configure(bg=BG_COLOR)
    form_frame = tk.Frame(win, bg=BG_COLOR, padx=10, pady=10)
    form_frame.pack(expand=True, fill="both")
    form_frame.columnconfigure(1, weight=1)
    tk.Label(form_frame, text="Audio File:", bg=BG_COLOR).grid(row=0, column=0, sticky="w", padx=5, pady=5)
    file_entry = tk.Entry(form_frame, width=60)
    file_entry.grid(row=0, column=1, padx=5, pady=5)
    tk.Label(form_frame, text="Secret Message:", bg=BG_COLOR).grid(row=1, column=0, sticky="w", padx=5, pady=5)
    msg_entry = tk.Entry(form_frame, width=60)
    msg_entry.grid(row=1, column=1, padx=5, pady=5)
    tk.Label(form_frame, text="Shared Secret Password:", bg=BG_COLOR).grid(row=2, column=0, sticky="w", padx=5, pady=5)
    pass_entry = tk.Entry(form_frame, width=60, show="*")
    pass_entry.grid(row=2, column=1, padx=5, pady=5)
    tk.Label(form_frame, text="Sender Email (Gmail):", bg=BG_COLOR).grid(row=3, column=0, sticky="w", padx=5, pady=5)
    email_entry = tk.Entry(form_frame, width=60)
    email_entry.grid(row=3, column=1, padx=5, pady=5)
    tk.Label(form_frame, text="Gmail App Password:", bg=BG_COLOR).grid(row=4, column=0, sticky="w", padx=5, pady=5)
    smtp_pass_entry = tk.Entry(form_frame, width=60, show='*')
    smtp_pass_entry.grid(row=4, column=1, padx=5, pady=5)
    tk.Label(form_frame, text="Receiver Email:", bg=BG_COLOR).grid(row=5, column=0, sticky="w", padx=5, pady=5)
    recv_entry = tk.Entry(form_frame, width=60)
    recv_entry.grid(row=5, column=1, padx=5, pady=5)
    
    def browse_audio_file():
        filename = filedialog.askopenfilename(filetypes=[("Audio Files", ".wav *.mp3 *.m4a *.aac *.flac *.ogg *.wma"), ("All Files", ".*")])
        file_entry.delete(0, tk.END)
        file_entry.insert(0, filename)
    
    tk.Button(form_frame, text="Browse...", command=browse_audio_file).grid(row=0, column=2, padx=5)
    tk.Button(form_frame, text="Play Audio", command=lambda: play_audio(file_entry.get())).grid(row=0, column=3, padx=5)
    
    def start_encoding_thread():
        threading.Thread(target=start_encoding, daemon=True).start()
    
    def start_encoding():
        temp_path = None
        try:
            input_original = file_entry.get()
            password = pass_entry.get()
            message = msg_entry.get()
            if not all([input_original, password, message]):
                messagebox.showerror("Error", "All fields must be filled.", parent=win)
                return
            
            win.title(f"{title} - Processing...")
            temp_path, _ = convert_to_wav(input_original, force_conversion=True)
            # 🔥 Capacity check before actual encoding
            if mode == "randomized":
                available_bits = os.path.getsize(temp_path) * 8
            else:
                robust_byte_indices = get_ml_guided_positions(temp_path, for_decoding=True)
                if not robust_byte_indices:
                    available_bits = os.path.getsize(temp_path) * 8
                else:
                    available_bits = len(robust_byte_indices)

            max_payload_bytes = available_bits // 8
            max_message_bytes = max_payload_bytes - 20  # minus salt+length
            messagebox.showinfo(
                "Capacity Analysis",
                f"This audio can embed up to {max_message_bytes} characters.\n"
                f"Your message length: {len(message)} characters."
            )

            salt = os.urandom(16)  # bytes
            key = derive_key_from_password(password, salt)
            encrypted_message = encrypt_message(message.encode(), key)
            data_to_hide = salt + encrypted_message
            output_path = filedialog.asksaveasfilename(defaultextension=".wav", filetypes=[("WAV files", "*.wav")], initialfile="stego_output.wav", parent=win)
            if not output_path:
                win.title(title)
                return
                
            if mode == "randomized":
                encode_audio(temp_path, output_path, data_to_hide, password)
            else: # Supervised ML Mode
                robust_byte_indices = get_ml_guided_positions(temp_path, for_decoding=True)
                if not robust_byte_indices:
                    encode_audio(temp_path, output_path, data_to_hide, password)
                else:
                    encode_audio(temp_path, output_path, data_to_hide, password, positions_to_use=robust_byte_indices)
            
            if all([email_entry.get(), smtp_pass_entry.get(), recv_entry.get()]):
                send_audio_email(email_entry.get(), smtp_pass_entry.get(), recv_entry.get(), output_path)
            messagebox.showinfo("Success", "Audio encoded successfully!", parent=win)
        except Exception as e:
            messagebox.showerror("Encoding Error", f"An unexpected error occurred: {e}", parent=win)
        finally:
            if temp_path and os.path.exists(temp_path) and temp_path != input_original:
                try:
                    os.remove(temp_path)
                except:
                    pass
            win.title(title)
            
    tk.Button(form_frame, text="Encode and Save", font=("Arial", 10, "bold"), bg=BUTTON_COLOR, fg=TEXT_COLOR, command=start_encoding_thread).grid(row=6, column=0, columnspan=4, pady=20)

def show_decode_window():
    win = tk.Toplevel(root)
    win.title("Decode Message (Receiver)")
    win.geometry("600x250")
    win.configure(bg=BG_COLOR)
    form_frame = tk.Frame(win, bg=BG_COLOR, padx=10, pady=10)
    form_frame.pack(expand=True, fill="both")
    form_frame.columnconfigure(1, weight=1)
    
    tk.Label(form_frame, text="Stego Audio File:", bg=BG_COLOR).grid(row=0, column=0, sticky="w", padx=5, pady=5)
    file_entry = tk.Entry(form_frame, width=60)
    file_entry.grid(row=0, column=1, padx=5, pady=5)
    tk.Label(form_frame, text="Shared Secret Password:", bg=BG_COLOR).grid(row=1, column=0, sticky="w", padx=5, pady=5)
    pass_entry = tk.Entry(form_frame, width=60, show="*")
    pass_entry.grid(row=1, column=1, padx=5, pady=5)
    
    tk.Label(form_frame, text="Decoding Method:", bg=BG_COLOR).grid(row=2, column=0, sticky="w", padx=5, pady=5)
    decode_mode = tk.StringVar(value="randomized")
    tk.Radiobutton(form_frame, text="Randomized LSB", variable=decode_mode, value="randomized", bg=BG_COLOR).grid(row=2, column=1, sticky="w", padx=5)
    tk.Radiobutton(form_frame, text="Supervised ML", variable=decode_mode, value="supervised", bg=BG_COLOR).grid(row=2, column=1, padx=(150, 0))

    def browse_file():
        filename = filedialog.askopenfilename(filetypes=[("WAV files", "*.wav")])
        file_entry.delete(0, tk.END)
        file_entry.insert(0, filename)
        
    tk.Button(form_frame, text="Browse...", command=browse_file).grid(row=0, column=2, padx=5)
    
    def start_decoding():
        try:
            input_path = file_entry.get()
            password = pass_entry.get()
            mode = decode_mode.get()

            if not all([input_path, password]):
                messagebox.showerror("Error", "All fields must be filled.", parent=win)
                return

            positions = None
            if mode == "supervised":
                win.title("Decoding (Analyzing Audio with ML...)")
                root.update_idletasks()
                positions = get_ml_guided_positions(input_path, for_decoding=True)
                if not positions:
                    positions = None
                    win.title("Decode Message (Receiver)")

            encrypted_message, salt = decode_audio(input_path, password, positions_to_use=positions)
            key = derive_key_from_password(password, salt)
            decrypted_message = decrypt_message(encrypted_message, key).decode('utf-8', 'ignore')

            messagebox.showinfo("Secret Message", f"The secret message is:\n\n{decrypted_message}", parent=win)
        except InvalidToken as e:
            messagebox.showerror("Decoding Error", f"Failed to decode. Check the password or the file may be corrupt.\nDetails: {e}", parent=win)
        except Exception as e:
            messagebox.showerror("Decoding Error", f"An unexpected error occurred: {e}", parent=win)
        finally:
            win.title("Decode Message (Receiver)")

    tk.Button(form_frame, text="Decode and Extract", font=("Arial", 10, "bold"), bg=BUTTON_COLOR, fg=TEXT_COLOR, command=start_decoding).grid(row=3, column=0, columnspan=3, pady=20)

# --- Main Window Layout ---
main_frame = tk.Frame(root, bg=BG_COLOR, pady=20)
main_frame.pack(expand=True)
tk.Label(main_frame, text="Audio Steganography Research Tool", font=("Arial", 16, "bold"), bg=BG_COLOR).pack(pady=10)
tk.Button(main_frame, text="Login / Register", font=("Arial", 12), bg=BUTTON_COLOR, fg=TEXT_COLOR, command=show_login_window, width=25, height=2).pack(pady=10)
button_container = tk.Frame(main_frame, bg=FRAME_COLOR, padx=20, pady=20)
button_container.pack(pady=20)
tk.Label(button_container, text="Choose Encoding Method:", font=("Arial", 10), bg=FRAME_COLOR).pack(pady=5)
tk.Button(button_container, text="Encode (Randomized LSB)", font=("Arial", 12, "bold"), bg=BUTTON_COLOR, fg=TEXT_COLOR, command=lambda: on_hide_click("randomized"), width=30).pack(pady=5)
tk.Button(button_container, text="Encode (Supervised ML - CatBoost)", font=("Arial", 12, "bold"), bg=BUTTON_COLOR, fg=TEXT_COLOR, command=lambda: on_hide_click("supervised"), width=30).pack(pady=5)
tk.Button(main_frame, text="Decode Message (Receiver)", font=("Arial", 12), command=on_extract_click, width=25, height=2).pack(pady=10)

root.mainloop()
