import os
import numpy as np
import soundfile as sf
import matplotlib.pyplot as plt
from main_app import encode_audio, get_ml_guided_positions
import tempfile

def generate_comparison_plots(file_path, output_dir="results/plots"):
    """Generates and saves a plot grid comparing original and stego signals."""
    print(f"🎨 Plotting: {os.path.basename(file_path)}...")

    # Load Original Audio
    orig_data, sr = sf.read(file_path, dtype='float32')
    if orig_data.ndim > 1:
        orig_data = np.mean(orig_data, axis=1)

    # Create Stego Versions
    message = "This is a test message for visual analysis of signal quality."
    password = "password123"
    temp_random_path = os.path.join(tempfile.gettempdir(), "temp_random.wav")
    temp_ml_path = os.path.join(tempfile.gettempdir(), "temp_ml.wav")

    encode_audio(file_path, temp_random_path, message.encode(), password)
    stego_data_random, _ = sf.read(temp_random_path, dtype='float32')

    ml_positions = get_ml_guided_positions(file_path, for_decoding=True)
    encode_audio(file_path, temp_ml_path, message.encode(), password, positions_to_use=ml_positions)
    stego_data_ml, _ = sf.read(temp_ml_path, dtype='float32')

    min_len = min(len(orig_data), len(stego_data_random), len(stego_data_ml))
    orig_data, stego_data_random, stego_data_ml = orig_data[:min_len], stego_data_random[:min_len], stego_data_ml[:min_len]

    # Create Plots
    fig, axs = plt.subplots(3, 2, figsize=(16, 15))
    fig.suptitle(f'Visual Analysis: {os.path.basename(file_path)}', fontsize=20)
    time_axis = np.linspace(0, len(orig_data) / sr, num=len(orig_data))

    def plot_waveform(ax, data, title):
        ax.plot(time_axis, data, color='b')
        ax.set_title(title, fontsize=12)
        ax.set_xlabel("Time (s)"); ax.set_ylabel("Amplitude"); ax.grid(True)

    def plot_spectrogram(ax, data, title):
        ax.specgram(data, Fs=sr, cmap='viridis')
        ax.set_title(title, fontsize=12)
        ax.set_xlabel("Time (s)"); ax.set_ylabel("Frequency (Hz)")

    plot_waveform(axs[0, 0], orig_data, "(a) Original Waveform")
    plot_spectrogram(axs[0, 1], orig_data, "(b) Original Spectrogram")
    plot_waveform(axs[1, 0], stego_data_random, "(c) Stego Waveform (Randomized LSB)")
    plot_spectrogram(axs[1, 1], stego_data_random, "(d) Stego Spectrogram (Randomized LSB)")
    plot_waveform(axs[2, 0], stego_data_ml, "(e) Stego Waveform (ML-guided)")
    plot_spectrogram(axs[2, 1], stego_data_ml, "(f) Stego Spectrogram (ML-guided)")

    plt.tight_layout(rect=[0, 0.03, 1, 0.96])
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    output_filename = os.path.join(output_dir, f"{os.path.splitext(os.path.basename(file_path))[0]}_comparison.png")
    plt.savefig(output_filename, dpi=300)
    plt.close(fig)

    os.remove(temp_random_path)
    os.remove(temp_ml_path)

if __name__ == "__main__":
    input_folder = "original"
    if not os.path.exists(input_folder):
        raise FileNotFoundError(f"The input folder '{input_folder}' was not found.")

    files_to_process = [os.path.join(input_folder, f) for f in os.listdir(input_folder) if f.lower().endswith(".wav")]
    for audio_file in files_to_process:
        try:
            generate_comparison_plots(audio_file)
        except Exception as e:
            print(f"❗️ SKIPPING FILE: Could not generate plot for {os.path.basename(audio_file)}. Error: {e}")
            continue
    print("\n✅ Plot generation complete!")