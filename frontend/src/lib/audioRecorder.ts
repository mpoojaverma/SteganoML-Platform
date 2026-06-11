export class AudioRecorder {
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private leftChannel: Float32Array[] = [];
  private recordingLength = 0;
  private sampleRate = 44100;
  private onProcessCallback: ((volume: number) => void) | null = null;

  constructor(options?: { onProcess?: (volume: number) => void }) {
    if (options?.onProcess) {
      this.onProcessCallback = options.onProcess;
    }
  }

  async start(): Promise<void> {
    this.leftChannel = [];
    this.recordingLength = 0;

    // 1. Get access to the microphone
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // 2. Initialize AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass();
    this.sampleRate = this.audioContext.sampleRate;

    // 3. Set up the audio nodes
    this.source = this.audioContext.createMediaStreamSource(this.stream);
    
    // Create script processor with buffer size 4096 and 1 input channel, 1 output channel
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Store samples
      this.leftChannel.push(new Float32Array(inputData));
      this.recordingLength += inputData.length;

      // Calculate real-time volume/amplitude for visualizer
      if (this.onProcessCallback) {
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        // Normalize volume to range 0-100
        const volume = Math.min(100, Math.round(rms * 100 * 2));
        this.onProcessCallback(volume);
      }
    };

    // Connect nodes
    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  async pause(): Promise<void> {
    if (this.audioContext && this.audioContext.state === "running") {
      await this.audioContext.suspend();
    }
  }

  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  async stop(): Promise<{ blob: Blob; duration: number; size: number }> {
    // Disconnect nodes
    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
    }
    if (this.source) {
      this.source.disconnect();
    }
    if (this.audioContext) {
      await this.audioContext.close();
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    // Export to WAV
    const mergedBuffer = this.mergeBuffers(this.leftChannel, this.recordingLength);
    const wavBuffer = this.encodeWAV(mergedBuffer);
    const blob = new Blob([wavBuffer], { type: "audio/wav" });
    const duration = this.recordingLength / this.sampleRate;

    return {
      blob,
      duration,
      size: blob.size,
    };
  }

  private mergeBuffers(channelBuffer: Float32Array[], length: number): Float32Array {
    const result = new Float32Array(length);
    let offset = 0;
    for (let i = 0; i < channelBuffer.length; i++) {
      result.set(channelBuffer[i], offset);
      offset += channelBuffer[i].length;
    }
    return result;
  }

  private encodeWAV(samples: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    this.writeString(view, 0, "RIFF");
    /* file length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    this.writeString(view, 8, "WAVE");
    /* format chunk identifier */
    this.writeString(view, 12, "fmt ");
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, this.sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, this.sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    this.writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    this.floatTo16BitPCM(view, 44, samples);

    return buffer;
  }

  private floatTo16BitPCM(output: DataView, offset: number, input: Float32Array): void {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
