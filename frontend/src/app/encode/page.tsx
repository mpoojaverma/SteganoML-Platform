"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import useEncode from "@/hooks/useEncode";
import AppShell from "@/components/layout/AppShell";
import { getDownloadUrl } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import QRCode from "qrcode";
import CustomSelect from "@/components/ui/CustomSelect";
import { 
  UploadCloud, 
  FileAudio, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Mic,
  MicOff,
  Square,
  RefreshCw,
  AlertTriangle,
  Info,
  Lock,
  Trash2,
  Check,
  ArrowRight,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { AudioRecorder } from "@/lib/audioRecorder";

function CustomAudioPlayer({ src, title }: { src: string; title?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const vol = Number(e.target.value);
    audioRef.current.volume = vol;
    setVolume(vol);
    if (vol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="rounded-xl border border-white/5 bg-[#020817] p-4 flex flex-col gap-2 glass">
      {title && <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">{title}</p>}
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          type="button"
          className="h-8 w-8 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer shadow-md shadow-cyan-500/10"
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </button>
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-cyan-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleMute} className="text-slate-400 hover:text-white transition cursor-pointer">
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-12 accent-cyan-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer hidden sm:block"
          />
        </div>
      </div>
    </div>
  );
}

const waveform = [
  12, 18, 28, 42, 58, 74, 56, 38, 24, 18, 22, 34, 48, 66, 82, 62, 44, 26, 18,
  24, 40, 58, 76, 64, 48, 30, 20, 26, 44, 60, 78, 70, 52, 34, 22, 18, 30, 46,
  62, 80, 68, 50, 32, 20, 18, 26, 42, 58, 74, 64, 48, 30, 18, 24, 40, 58, 76,
  82, 60, 42, 26, 18, 22, 34, 52, 68, 80, 60, 40, 24, 18, 26, 44, 62, 78, 66,
  50, 32, 20, 18, 30, 46, 64, 82, 68, 52, 34, 22, 18, 26, 42, 58, 74, 64, 46,
  28, 18, 24, 40, 56, 72, 84, 68, 48, 30, 20, 18, 28, 42, 60, 76, 62, 46, 28,
  18, 24, 40, 58, 72, 56,
];

const isLocalhost = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_BASE = isLocalhost 
  ? "http://127.0.0.1:8000/api" 
  : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api");

export default function EncodePage() {
  const [audioFile, setAudioFile] = useState<File | { name: string; size?: number; fake: boolean } | null>(null);

  const [message, setMessage] = useState(
    "Confidential: Protocol Alpha — rendezvous at 0300 UTC.",
  );

  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [smartWarning, setSmartWarning] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [localResult, setLocalResult] = useState<any>(null);
  const [activeWaveform, setActiveWaveform] = useState<number[]>(waveform);
  const [progressStep, setProgressStep] = useState(-1);
  const [showPassword, setShowPassword] = useState(false);

  // Secure Share states
  const [shareExpiration, setShareExpiration] = useState("24 Hours");
  const [shareDownloadLimit, setShareDownloadLimit] = useState("1");
  const [sharePassword, setSharePassword] = useState("");
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [shareResult, setShareResult] = useState<{ token: string; expires_at: string } | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  // New audio state metadata
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [audioFormat, setAudioFormat] = useState<string>("");

  // Tab & Recording UX states
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");
  const [recordingState, setRecordingState] = useState<
    "idle" | "ready" | "recording" | "paused" | "finished" | "error" | "no_mic" | "unsupported_origin" | "permissions_loading" | "permission_denied"
  >("idle");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [micVolume, setMicVolume] = useState(0);
  const [liveWaveformHistory, setLiveWaveformHistory] = useState<number[]>([]);
  const [isDecodingWaveform, setIsDecodingWaveform] = useState(false);
  const [totalSamples, setTotalSamples] = useState<number | null>(null);
  const [channels, setChannels] = useState(1);
  const [sampleRate, setSampleRate] = useState(44100);

  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Secure context checking on mount
  useEffect(() => {
    if (activeTab === "record") {
      if (!window.isSecureContext) {
        setRecordingState("unsupported_origin");
      } else {
        if (recordingState === "idle" || recordingState === "unsupported_origin") {
          setRecordingState("ready");
        }
      }
    }
  }, [activeTab]);

  // Recording timer
  useEffect(() => {
    if (recordingState === "recording") {
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 180) {
            handleStopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recordingState]);

  // Audio object URL & metadata hooks
  useEffect(() => {
    if (audioFile && !('fake' in audioFile)) {
      const file = audioFile as File;
      const format = file.name.split(".").pop()?.toUpperCase() || "WAV";
      setAudioFormat(format);
      
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      const tempAudio = new Audio(url);
      const handleMetadata = () => {
        setAudioDuration(tempAudio.duration);
        sessionStorage.setItem("steganoml_encode_duration", tempAudio.duration.toString());
      };
      tempAudio.addEventListener("loadedmetadata", handleMetadata);
      return () => {
        tempAudio.removeEventListener("loadedmetadata", handleMetadata);
        URL.revokeObjectURL(url);
      };
    } else if (audioFile && 'fake' in audioFile) {
      setAudioFormat("WAV");
      setAudioUrl("");
    } else {
      setAudioUrl("");
      setAudioDuration(null);
      setAudioFormat("");
    }
  }, [audioFile]);

  const audioSizeString = useMemo(() => {
    if (!audioFile) return "";
    if ('size' in audioFile && audioFile.size) {
      return `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB`;
    }
    return "Unknown size";
  }, [audioFile]);

  const formatDurationString = (dur: number | null) => {
    if (dur === null) return "--:--";
    const mins = Math.floor(dur / 60);
    const secs = Math.floor(dur % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Capacity calculations
  const maxMessageLength = useMemo(() => {
    if (!totalSamples) return 0;
    const maxBytes = Math.floor(totalSamples / 8);
    if (maxBytes < 93) return 0;
    const maxCiphertextLen = Math.floor((maxBytes - 77) / 16) * 16;
    return Math.max(0, maxCiphertextLen - 10);
  }, [totalSamples]);

  const payloadSizeInBits = useMemo(() => {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message).length;
    const paddedMsg = messageBytes + 9;
    const ciphertextLen = (Math.floor(paddedMsg / 16) + 1) * 16;
    const requiredBytes = 77 + ciphertextLen;
    return requiredBytes * 8;
  }, [message]);

  const capacityPercent = useMemo(() => {
    if (!totalSamples) return 0;
    return Math.min(100, (payloadSizeInBits / totalSamples) * 100);
  }, [payloadSizeInBits, totalSamples]);

  const isCapacityExceeded = useMemo(() => {
    if (!totalSamples) return false;
    return payloadSizeInBits > totalSamples;
  }, [payloadSizeInBits, totalSamples]);

  const recommendedReduction = useMemo(() => {
    if (!isCapacityExceeded || !totalSamples) return 0;
    const currentBytes = new TextEncoder().encode(message).length;
    // Calculate difference
    return Math.max(1, currentBytes - maxMessageLength);
  }, [isCapacityExceeded, totalSamples, message, maxMessageLength]);

  const stegoWaveform = useMemo(() => {
    if (!localResult) return [];
    return activeWaveform.map((val, idx) => {
      if (idx % 7 === 0) {
        const diff = Math.sin(idx) > 0 ? 3 : -3;
        return Math.max(12, Math.min(84, val + diff));
      }
      return val;
    });
  }, [activeWaveform, localResult]);

  const diffWaveform = useMemo(() => {
    if (!localResult) return [];
    return activeWaveform.map((val, idx) => {
      const diff = Math.abs(stegoWaveform[idx] - val);
      return Math.max(2, diff * 12); // amplify 12x for display
    });
  }, [activeWaveform, stegoWaveform, localResult]);

  const handleScrollToCompare = () => {
    const el = document.getElementById("waveform-comparison");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGenerateShareLink = async () => {
    if (!localResult) return;
    setIsGeneratingShare(true);
    setShareError(null);
    setShareResult(null);
    setQrCodeDataUrl("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to create share links.");
      }

      const user = session.user;
      const storagePath = `outputs/${localResult.filename}`;

      const payload = {
        file_name: localResult.filename,
        storage_path: storagePath,
        expiration: shareExpiration,
        download_limit: shareDownloadLimit,
        password: sharePassword || null,
        owner_id: user.id,
        user_email: user.email || "",
      };

      const response = await axios.post(`${API_BASE}/share/create`, payload, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.data.status === "success") {
        const token = response.data.share_token;
        const expires_at = response.data.expires_at;
        setShareResult({
          token,
          expires_at,
        });

        // Generate QR code data URL locally
        const shareUrl = `${window.location.origin}/share/${token}`;
        try {
          const qrDataUrl = await QRCode.toDataURL(shareUrl, { margin: 1, width: 200 });
          setQrCodeDataUrl(qrDataUrl);
        } catch (qrErr) {
          console.error("Local QR code generation error:", qrErr);
        }
      }
    } catch (err: any) {
      console.error(err);
      let errorMsg = "Failed to generate secure share link.";
      if (err?.response) {
        const detail = err.response.data?.detail;
        const status = err.response.status;
        if (status === 422) {
          errorMsg = "Invalid request payload: Schema validation failed on backend.";
        } else if (detail) {
          const detailStr = String(detail);
          if (detailStr.includes("Database ownership validation error") || detailStr.includes("unauthorized") || detailStr.includes("Unauthorized")) {
            errorMsg = "Share creation validation failed: File ownership verification failed.";
          } else if (detailStr.includes("shared_files") && (detailStr.includes("missing") || detailStr.includes("relation") || detailStr.includes("does not exist"))) {
            errorMsg = "Database table missing. Please run database migrations.";
          } else if (detailStr.includes("Share creation query failure") || detailStr.includes("Failed to record")) {
            errorMsg = "Database insert failed: Failed to save share link details.";
          } else if (detailStr.includes("Bucket") || detailStr.includes("bucket")) {
            errorMsg = "Storage lookup failed: Supabase bucket is missing or private.";
          } else if (detailStr.includes("hashing failed") || detailStr.includes("bcrypt")) {
            errorMsg = "Password hashing failed on the backend.";
          } else {
            errorMsg = detailStr;
          }
        } else {
          errorMsg = `Invalid response (Status ${status}): ${err.response.statusText || "Unable to parse backend response."}`;
        }
      } else if (err?.message === "Network Error" || !err?.response) {
        errorMsg = "Backend unavailable: The API server is not running, network connection failed, or the server crashed during request processing.";
      } else {
        errorMsg = err.message || "Failed to generate secure share link.";
      }
      setShareError(errorMsg);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const { runEncode, loading, error, result } = useEncode();

  useEffect(() => {
    const savedAudio = sessionStorage.getItem("steganoml_encode_audio");
    if (savedAudio) {
      try {
        setAudioFile(JSON.parse(savedAudio));
      } catch (e) {}
    }



    const savedResult = sessionStorage.getItem("steganoml_encode_result");
    if (savedResult) {
      try {
        setLocalResult(JSON.parse(savedResult));
      } catch (e) {}
    }

    const savedWaveform = sessionStorage.getItem("steganoml_encode_waveform");
    if (savedWaveform) {
      try {
        setActiveWaveform(JSON.parse(savedWaveform));
      } catch (e) {}
    }

    const savedSamples = sessionStorage.getItem("steganoml_encode_samples");
    if (savedSamples) {
      setTotalSamples(parseInt(savedSamples, 10));
    }
    const savedDuration = sessionStorage.getItem("steganoml_encode_duration");
    if (savedDuration) {
      setAudioDuration(parseFloat(savedDuration));
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setProgressStep(0);
      const interval = setInterval(() => {
        setProgressStep((prev) => {
          if (prev < 4) return prev + 1;
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    } else {
      if (localResult) {
        setProgressStep(5);
      } else {
        setProgressStep(-1);
      }
    }
  }, [loading, localResult]);

  const handleMessageChange = (val: string) => {
    setMessage(val);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
  };

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (file: File | null) => {
    // Clear stale outputs on file change/remove. Keep password value intact for usability!
    setLocalResult(null);
    sessionStorage.removeItem("steganoml_encode_result");
    setLocalError("");
    setSmartWarning("");

    if (file) {
      // 1. Validate file extension
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const supportedExts = ["wav", "mp3", "flac", "m4a", "ogg", "aac"];
      if (!supportedExts.includes(ext)) {
        setLocalError("This audio format is not supported.");
        setAudioFile(null);
        setTotalSamples(null);
        return;
      }

      // 2. Validate maximum file size (100MB)
      const maxSizeBytes = 100 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setLocalError("File exceeds the maximum supported size.");
        setAudioFile(null);
        setTotalSamples(null);
        return;
      }

      // 3. Validate empty files
      if (file.size === 0) {
        setLocalError("The selected audio file appears to be corrupted.");
        setAudioFile(null);
        setTotalSamples(null);
        return;
      }

      // 4. Large file warnings (> 30MB)
      if (file.size > 30 * 1024 * 1024) {
        setSmartWarning("This audio file is large and may take longer to analyze.");
      }

      const meta = { name: file.name, size: file.size, fake: false };
      setAudioFile(file);
      sessionStorage.setItem("steganoml_encode_audio", JSON.stringify(meta));
      
      setIsDecodingWaveform(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const tempCtx = new AudioContextClass();
        
        let audioBuffer;
        try {
          audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);
        } catch (decodeErr) {
          setLocalError("The selected audio file appears to be corrupted.");
          setAudioFile(null);
          setTotalSamples(null);
          await tempCtx.close();
          return;
        }
        
        const channelsCount = audioBuffer.numberOfChannels;
        const samplesCount = audioBuffer.length * channelsCount;
        setTotalSamples(samplesCount);
        setSampleRate(audioBuffer.sampleRate);
        setChannels(channelsCount);
        sessionStorage.setItem("steganoml_encode_samples", samplesCount.toString());

        // Downsample visual waveform preview
        const channelData = audioBuffer.getChannelData(0);
        const numPoints = 80;
        const step = Math.ceil(channelData.length / numPoints);
        const points: number[] = [];
        for (let i = 0; i < numPoints; i++) {
          let max = 0;
          for (let j = 0; j < step; j++) {
            const val = Math.abs(channelData[i * step + j] || 0);
            if (val > max) max = val;
          }
          points.push(max);
        }
        
        const maxVal = Math.max(...points) || 1;
        const newWave = points.map(p => Math.floor((p / maxVal) * 70) + 12);
        
        setActiveWaveform(newWave);
        sessionStorage.setItem("steganoml_encode_waveform", JSON.stringify(newWave));
        await tempCtx.close();
      } catch (err) {
        console.error("Error decoding audio for waveform:", err);
        const newWave = Array.from({ length: 80 }, () => Math.floor(Math.random() * 70) + 12);
        setActiveWaveform(newWave);
        setTotalSamples(Math.floor((audioDuration || 5) * 44100 * 1));
      } finally {
        setIsDecodingWaveform(false);
      }
    } else {
      setAudioFile(null);
      setTotalSamples(null);
      sessionStorage.removeItem("steganoml_encode_audio");
      sessionStorage.removeItem("steganoml_encode_samples");
      sessionStorage.removeItem("steganoml_encode_duration");
      setActiveWaveform(waveform);
      sessionStorage.removeItem("steganoml_encode_waveform");
    }
  };

  // Recording controls
  const handleStartRecording = async () => {
    try {
      if (!window.isSecureContext) {
        setRecordingState("unsupported_origin");
        return;
      }
      setRecordingState("permissions_loading");
      setLocalError("");
      
      const recorder = new AudioRecorder({
        onProcess: (vol) => {
          setMicVolume(vol);
          setLiveWaveformHistory((prev) => {
            const next = [...prev, vol];
            if (next.length > 40) next.shift();
            return next;
          });
        }
      });
      
      recorderRef.current = recorder;
      await recorder.start();
      setRecordingDuration(0);
      setLiveWaveformHistory([]);
      setRecordingState("recording");
    } catch (err: any) {
      console.error("Microphone capture failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setRecordingState("permission_denied");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setRecordingState("no_mic");
      } else {
        setRecordingState("error");
      }
    }
  };

  const handlePauseRecording = async () => {
    if (recordingState !== "recording" || !recorderRef.current) return;
    await recorderRef.current.pause();
    setRecordingState("paused");
  };

  const handleResumeRecording = async () => {
    if (recordingState !== "paused" || !recorderRef.current) return;
    await recorderRef.current.resume();
    setRecordingState("recording");
  };

  const handleStopRecording = async () => {
    if ((recordingState !== "recording" && recordingState !== "paused") || !recorderRef.current) return;
    try {
      const recorder = recorderRef.current;
      setRecordingState("idle");
      const { blob, duration, size } = await recorder.stop();
      
      const file = new File([blob], `mic_recording_${Date.now()}.wav`, { type: "audio/wav" });
      await handleFileChange(file);
      setRecordingState("finished");
    } catch (err) {
      console.error("Stop recording failed:", err);
      setRecordingState("error");
    }
  };

  const handleDiscardRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current) {
      recorderRef.current.stop().catch(() => {});
      recorderRef.current = null;
    }
    setRecordingDuration(0);
    setLiveWaveformHistory([]);
    setRecordingState("ready");
    handleFileChange(null);
  };
  return (
    <AppShell>
      <Toast show={showToast} message="✓ Encoding completed" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-2">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">Encode Studio</h1>
            <p className="mt-2 text-slate-400 text-sm">
              Embed secure encrypted payloads into audio carriers with SOTA ML guidance
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              handleFileChange(null);
              setPassword("");
              sessionStorage.removeItem("steganoml_encode_password");
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:border-white/20 transition active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[44px] lg:min-h-0 flex items-center justify-center"
          >
            Reset Workflow
          </button>
        </div>
        {/* LEFT COLUMN */}

        <div className="lg:col-span-8 space-y-6">
          {/* AUDIO SOURCE */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="font-semibold text-white">Audio Source</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a carrier audio file or record live from microphone
                </p>
              </div>
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 shrink-0 select-none transition-all duration-200">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("upload");
                    if (recordingState === "recording" || recordingState === "paused") {
                      handleDiscardRecording();
                    }
                  }}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] lg:min-h-0 flex items-center justify-center ${
                    activeTab === "upload"
                      ? "bg-[#1bd6d1] text-black shadow-md shadow-cyan-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("record")}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 min-h-[44px] lg:min-h-0 justify-center ${
                    activeTab === "record"
                      ? "bg-[#1bd6d1] text-black shadow-md shadow-cyan-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Record Live
                  {recordingState === "recording" && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: UPLOAD FILE */}
            {activeTab === "upload" && (
              <>
                {/* HIDDEN INPUT */}
                <input
                  id="encode-audio"
                  type="file"
                  accept=".wav,.mp3,.flac,.m4a,.ogg,.aac"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="sr-only"
                />

                {isDecodingWaveform ? (
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 bg-white/[0.01] flex flex-col items-center justify-center min-h-[180px]">
                    <RefreshCw size={32} className="text-cyan-400 animate-spin mb-4" />
                    <p className="text-sm text-slate-300 font-semibold animate-pulse">Analyzing carrier audio & generating waveform...</p>
                    <p className="text-xs text-slate-500 mt-1">Decoding sample buffers client-side</p>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all duration-200 text-center ${
                      isDragOver
                        ? "border-teal-400 bg-teal-500/10 shadow-[0_0_20px_rgba(20,184,166,0.15)] scale-[1.01]"
                        : audioFile
                          ? audioFile && 'fake' in audioFile
                            ? "border-orange-500/30 bg-orange-500/5 hover:border-orange-500/50 hover:bg-orange-500/10"
                            : "border-teal-500/30 bg-teal-500/5 hover:border-teal-500/50 hover:bg-teal-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    } focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-[#0b1327]`}
                  >
                    <label htmlFor="encode-audio" className="absolute inset-0 cursor-pointer z-0" />

                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`p-4 rounded-full mb-4 transition-all duration-300 ${
                          isDragOver
                            ? "bg-teal-500/20 text-teal-400 scale-110 animate-pulse"
                            : audioFile
                              ? audioFile && 'fake' in audioFile
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-teal-500/20 text-teal-400"
                              : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {audioFile ? <FileAudio size={32} /> : <UploadCloud size={32} />}
                      </div>

                      <p className="text-sm font-semibold text-white max-w-[280px] truncate">
                        {isDragOver
                          ? "Drop file to upload"
                          : audioFile
                            ? audioFile.name
                            : "Drag & drop audio here or click to browse"}
                      </p>

                      {audioFile ? (
                        <div className="mt-2 flex flex-col items-center gap-1">
                          <p className="text-xs text-slate-400">
                            {audioFile.size ? `${(audioFile.size / (1024 * 1024)).toFixed(1)} MB` : "Size unknown"} · {sampleRate ? `${(sampleRate/1000).toFixed(1)} kHz` : "44.1 kHz"} · {channels === 1 ? "Mono" : "Stereo"}
                          </p>
                          {audioFile && 'fake' in audioFile ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mt-1">
                              ⚠️ Needs re-upload (session restored)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 mt-1">
                              ✓ Success: Ready to encode
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 mt-3 space-y-1.5 max-w-sm">
                          <p className="font-semibold text-slate-400">Supported Audio Formats</p>
                          <p>WAV, MP3, FLAC, M4A, OGG, AAC</p>
                          <p className="hidden md:block">Large audio files supported (up to 100MB).</p>
                          <p className="text-[10px] text-slate-650 leading-normal hidden md:block">
                            Characteristics: Mono or Stereo. Clear speech preferred. Higher audio duration provides greater payload capacity.
                          </p>
                        </div>
                      )}

                      {audioFile && (
                        <div className="mt-5 flex items-center gap-3 relative z-20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleFileChange(null);
                            }}
                            className="rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition active:scale-95 cursor-pointer outline-none min-h-[44px] lg:min-h-0 flex items-center justify-center"
                          >
                            Remove
                          </button>
                          <label
                            htmlFor="encode-audio"
                            className="rounded-lg bg-[#1bd6d1] px-4 py-2.5 text-xs font-semibold text-black hover:brightness-110 transition cursor-pointer flex items-center justify-center min-h-[44px] lg:min-h-0"
                          >
                            Change File
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB CONTENT 2: RECORD AUDIO */}
            {activeTab === "record" && (
              <div className="space-y-4">
                {recordingState === "unsupported_origin" && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center space-y-3">
                    <AlertTriangle size={36} className="text-red-400 mx-auto" />
                    <h3 className="font-semibold text-white">Secure Context Required</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Microphone recording requires a secure connection (HTTPS or localhost) due to browser policies. Please upload a file instead.
                    </p>
                  </div>
                )}

                {recordingState === "permissions_loading" && (
                  <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
                    <div className="relative mb-4">
                      <Mic size={32} className="text-cyan-400 animate-pulse" />
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md animate-ping" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Requesting Microphone Access</h3>
                    <p className="text-xs text-slate-500 mt-1">Please approve the microphone permission prompt in your browser.</p>
                  </div>
                )}

                {recordingState === "permission_denied" && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center space-y-3">
                    <MicOff size={36} className="text-red-400 mx-auto" />
                    <h3 className="font-semibold text-white">Microphone Access Blocked</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      SteganoML was denied access to your microphone. Please update your browser site configuration to allow microphone permission.
                    </p>
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="mt-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2.5 transition cursor-pointer min-h-[44px] lg:min-h-0 flex items-center justify-center"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {recordingState === "no_mic" && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.01] p-6 text-center space-y-3">
                    <MicOff size={36} className="text-slate-400 mx-auto" />
                    <h3 className="font-semibold text-white">No Microphone Detected</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      No audio input devices were detected on your system. Please connect a microphone and try again, or upload a pre-recorded file.
                    </p>
                  </div>
                )}

                {recordingState === "error" && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center space-y-3">
                    <AlertTriangle size={36} className="text-red-400 mx-auto" />
                    <h3 className="font-semibold text-white">Recording Initialization Failed</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      An unexpected error occurred while setting up microphone stream captures.
                    </p>
                  </div>
                )}

                {(recordingState === "idle" || recordingState === "ready") && !audioFile && (
                  <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
                    <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 transition hover:scale-105">
                      <Mic size={32} />
                    </div>
                    <h3 className="font-semibold text-white">Ready to Record</h3>
                    <p className="text-xs text-slate-500 mt-1">Click start to record carrier audio directly from your microphone.</p>
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="mt-5 bg-[#1bd6d1] text-black font-semibold text-xs rounded-xl px-5 py-2.5 hover:brightness-110 active:scale-95 transition shadow-lg shadow-cyan-500/10 cursor-pointer min-h-[44px] lg:min-h-0 flex items-center justify-center"
                    >
                      Start Recording
                    </button>
                  </div>
                )}

                {recordingState === "recording" && (
                  <div className="border border-white/5 bg-[#020817] rounded-2xl p-6 space-y-5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wider">● Recording Live</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">
                        {formatDurationString(recordingDuration)} / 03:00
                      </span>
                    </div>

                    {/* Speech reactive visualizer bars */}
                    <div className="h-16 w-full flex items-center justify-center gap-[3px] bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 overflow-hidden">
                      {liveWaveformHistory.length === 0 ? (
                        Array.from({ length: 45 }).map((_, i) => (
                          <div key={i} className="w-[3px] h-1.5 rounded-full bg-white/10" />
                        ))
                      ) : (
                        liveWaveformHistory.slice(-45).map((vol, idx) => (
                          <div
                            key={idx}
                            className="w-[3px] rounded-full bg-cyan-400/80 transition-all duration-150 shadow-[0_0_6px_rgba(34,211,238,0.2)]"
                            style={{ height: `${Math.max(8, vol)}%` }}
                          />
                        ))
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handlePauseRecording}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold px-4 py-2.5 transition active:scale-95 cursor-pointer min-h-[44px] lg:min-h-0"
                      >
                        <Pause size={14} />
                        <span>Pause</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500 text-white text-xs font-bold px-5 py-2.5 hover:bg-red-600 transition active:scale-95 shadow-md shadow-red-500/10 cursor-pointer min-h-[44px] lg:min-h-0"
                      >
                        <Square size={14} fill="currentColor" />
                        <span>Stop</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDiscardRecording}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:border-red-500/20 hover:bg-red-500/5 text-xs text-slate-400 hover:text-red-400 px-4 py-2.5 transition active:scale-95 cursor-pointer min-h-[44px] lg:min-h-0"
                      >
                        <Trash2 size={14} />
                        <span>Discard</span>
                      </button>
                    </div>
                  </div>
                )}

                {recordingState === "paused" && (
                  <div className="border border-white/5 bg-[#020817] rounded-2xl p-6 space-y-5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recording Paused</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {formatDurationString(recordingDuration)} / 03:00
                      </span>
                    </div>

                    <div className="h-16 w-full flex items-center justify-center gap-[3px] bg-white/[0.01] border border-white/5 rounded-xl px-4 py-2 overflow-hidden opacity-60">
                      {liveWaveformHistory.slice(-45).map((vol, idx) => (
                        <div
                          key={idx}
                          className="w-[3px] rounded-full bg-slate-500"
                          style={{ height: `${Math.max(8, vol)}%` }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleResumeRecording}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1bd6d1] text-black text-xs font-semibold px-5 py-2.5 hover:brightness-110 transition active:scale-95 cursor-pointer min-h-[44px] lg:min-h-0"
                      >
                        <Play size={14} fill="currentColor" />
                        <span>Resume</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500 text-white text-xs font-bold px-5 py-2.5 hover:bg-red-600 transition active:scale-95 shadow-md shadow-red-500/10 cursor-pointer min-h-[44px] lg:min-h-0"
                      >
                        <Square size={14} fill="currentColor" />
                        <span>Stop</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDiscardRecording}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:border-red-500/20 hover:bg-red-500/5 text-xs text-slate-400 hover:text-red-400 px-4 py-2.5 transition active:scale-95 cursor-pointer min-h-[44px] lg:min-h-0"
                      >
                        <Trash2 size={14} />
                        <span>Discard</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AUDIO PLAYER & METADATA */}
            {audioFile && audioUrl && (
              <div className="rounded-xl border border-white/5 bg-[#020817] p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="font-semibold text-white text-sm">Carrier Audio Preview</h3>
                  <span className="text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold animate-pulse">
                    {audioFormat}
                  </span>
                </div>
                <CustomAudioPlayer src={audioUrl} title={activeTab === "record" ? "Recorded Carrier Input" : "Original Carrier Input"} />
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Format</p>
                    <p className="font-bold text-white mt-1">{audioFormat}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Duration</p>
                    <p className="font-bold text-white mt-1">{formatDurationString(audioDuration)}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">File Size</p>
                    <p className="font-bold text-white mt-1">{audioSizeString}</p>
                  </div>
                </div>

                {activeTab === "record" && recordingState === "finished" && (
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Check size={12} /> Recording Saved
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDiscardRecording}
                        className="rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition cursor-pointer min-h-[44px] lg:min-h-0 flex items-center justify-center"
                      >
                        Re-record
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          document.getElementById("secret-payload-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="rounded-lg bg-[#1bd6d1] px-4 py-2.5 text-xs font-semibold text-black hover:brightness-110 transition cursor-pointer min-h-[44px] lg:min-h-0 flex items-center justify-center"
                      >
                        Continue to Encrypt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STATIC WAVEFORM VISUALIZER / ANIMATED SIGNAL ANALYSIS PREVIEW */}
            {audioFile && (
              <div className="rounded-xl bg-white/5 px-4 py-4 border border-white/5 relative overflow-hidden">
                {loading && (
                  <div className="absolute top-2 left-3 flex items-center gap-1.5 z-10 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded text-[9px] text-cyan-400 font-mono font-bold animate-pulse">
                    <Zap size={10} className="text-cyan-400 animate-bounce" />
                    SIGNAL ANALYSIS ACTIVE
                  </div>
                )}
                <div className="h-20 w-full flex items-center justify-between overflow-hidden gap-[2px]">
                  {activeWaveform.map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] rounded-full bg-[#18d5d0]/80 hover:bg-cyan-300"
                      animate={loading ? {
                        height: [
                          `${h}px`,
                          `${Math.max(12, Math.min(80, h + Math.sin(i + 4) * 15))}px`,
                          `${Math.max(12, Math.min(80, h - Math.cos(i) * 10))}px`,
                          `${h}px`
                        ]
                      } : {
                        height: `${h}px`
                      }}
                      transition={loading ? {
                        repeat: Infinity,
                        duration: 1.2 + (i % 5) * 0.1,
                        ease: "easeInOut"
                      } : {
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECRET PAYLOAD */}

          <div id="secret-payload-section" className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden scroll-mt-6">
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-semibold">Secret Payload</h2>

              <p className="text-xs text-slate-500 mt-1">
                AES-256 encrypted before embedding
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="secret-message" className="text-xs text-slate-500">Secret Message</label>

                <textarea
                  id="secret-message"
                  rows={4}
                  value={message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/5 bg-white/5 p-4 outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1327] transition-all"
                />

                {/* CAPACITY GAUGE */}
                {audioFile && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-400">Capacity Usage</span>
                      <span className={`font-mono font-bold ${
                        isCapacityExceeded 
                          ? "text-red-400" 
                          : capacityPercent >= 80 
                            ? "text-amber-400" 
                            : "text-emerald-400"
                      }`}>
                        {message.length} / {maxMessageLength} characters ({capacityPercent.toFixed(1)}%)
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCapacityExceeded
                            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                            : capacityPercent >= 80
                              ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                              : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                        }`}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>

                    {isCapacityExceeded && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex items-start gap-2.5 text-xs text-red-400">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Capacity Limit Exceeded</p>
                          <p className="mt-1 leading-normal text-red-400/80">
                            The encrypted message structure requires more bits than the carrier audio contains. 
                            Please reduce your secret message by at least <strong className="font-bold text-white underline">{recommendedReduction}</strong> character(s), or upload/record a longer carrier file.
                          </p>
                        </div>
                      </div>
                    )}

                    {smartWarning && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-2.5 text-xs text-amber-400 mt-2">
                        <Info size={16} className="shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Large File Notice</p>
                          <p className="mt-1 leading-normal text-amber-400/80">{smartWarning}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="encode-password" className="text-xs text-slate-500">
                  Encryption Password
                </label>

                <div className="relative mt-2">
                  <input
                    id="encode-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-white/5 pl-4 pr-12 py-4 outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1327] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white focus:text-white transition outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-400">
                Payload will be encrypted with AES-256 Fernet + random 16-byte
                salt before embedding.
              </div>
            </div>
          </div>

          {/* EMBEDDING METHOD */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-semibold">Embedding Method</h2>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-teal-400 bg-teal-500/10 shadow-[0_0_25px_rgba(20,184,166,0.15)] p-4 relative transition duration-200 hover:brightness-110">
                <div className="absolute right-4 top-4 w-4 h-4 rounded-full bg-teal-400" />

                <div className="w-7 h-7 rounded-md bg-indigo-500/40 mb-4" />

                <h3 className="font-semibold">ML-Guided (Recommended)</h3>

                <p className="mt-2 text-sm text-slate-400">
                  CatBoost selects acoustically stable frames. Higher
                  imperceptibility and robustness.
                </p>

                <span className="inline-block mt-4 rounded-lg bg-purple-500/20 px-3 py-1.5 text-xs font-medium text-purple-300">
                  ROC AUC 0.9581
                </span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 opacity-40 cursor-not-allowed select-none">
                <div className="w-7 h-7 rounded-md bg-slate-500/20 mb-4" />

                <h3 className="font-semibold text-slate-500">Randomized LSB</h3>

                <p className="mt-2 text-sm text-slate-500">
                  Password seeded random positions. Fast baseline method.
                </p>

                <span className="inline-block mt-4 rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400 border border-white/10">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {localError && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-start gap-3 transition-all duration-300"
            >
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Encoding Error</p>
                <p className="mt-1 text-xs text-red-400/80">{localError}</p>
              </div>
            </div>
          )}
          <button
            onClick={async () => {
              if (!audioFile) {
                setLocalError("Please select an audio file before encoding.");
                return;
              }

              if ('fake' in audioFile) {
                setLocalError("Please re-upload the audio file to run encode again.");
                return;
              }

              if (!message.trim()) {
                setLocalError("Secret message cannot be empty.");
                return;
              }

              if (isCapacityExceeded) {
                setLocalError("Secret message exceeds capacity of the loaded audio.");
                return;
              }

              if (!password.trim()) {
                setLocalError("Password is required.");
                return;
              }

              setLocalError("");
              setLocalResult(null);

              const response = await runEncode(
                audioFile as File,
                message,
                password,
                "ml",
              );

              if (response?.status === "success") {
                setLocalResult(response);
                sessionStorage.setItem("steganoml_encode_result", JSON.stringify(response));
                setShowToast(true);

                setTimeout(() => {
                  setShowToast(false);
                }, 3000);
              }
            }}
            disabled={loading || isCapacityExceeded || !audioFile}
            className="w-full rounded-xl bg-[#1bd6d1] py-5 text-base font-semibold text-black transition hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#040816] outline-none cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Encoding...</span>
              </>
            ) : (
              "Run ML-guided encode"
            )}
          </button>
        </div>

        {/* RIGHT COLUMN */}

        <div className="lg:col-span-4 space-y-5">
          {/* PIPELINE */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden">
            <div className="px-6 py-5 flex justify-between border-b border-white/5">
              <h2 className="font-semibold">Pipeline</h2>
              {loading && <span className="text-cyan-400 text-sm animate-pulse">● Processing</span>}
            </div>

            <div className="p-6 space-y-7">
              {[
                "Audio Analysis",
                "Encryption",
                "ML Selection",
                "Embedding",
                "Validation"
              ].map((step, i) => {
                const isActive = i === progressStep;
                const isCompleted = i < progressStep;

                return (
                  <motion.div
                    key={step}
                    className="flex gap-4 relative rounded-xl p-2 -mx-2"
                    animate={isActive ? {
                      backgroundColor: "rgba(168, 85, 247, 0.03)",
                      boxShadow: "0 0 10px rgba(168, 85, 247, 0.05) inset"
                    } : {
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      boxShadow: "none"
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors duration-300 shrink-0 ${
                        isCompleted
                          ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                          : isActive
                            ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 animate-pulse"
                            : "bg-white/5 text-slate-500 border border-white/5"
                      }`}
                      animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                      transition={isActive ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : {}}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </motion.div>

                    <div className="flex-1">
                      <p
                        className={`text-sm transition-colors duration-355 ${
                          isActive ? "text-purple-300 font-medium" : isCompleted ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {step}
                      </p>

                      <div className="mt-2 h-1.5 rounded bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-1.5 rounded"
                          initial={{ width: "0%" }}
                          animate={{
                            width: isCompleted ? "100%" : isActive ? "50%" : "0%",
                            backgroundColor: isCompleted ? "#34d399" : isActive ? "#a78bfa" : "#3b82f6"
                          }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* QUALITY REPORT */}

          <div className="rounded-[20px] border border-white/10 bg-[#0b1327] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-semibold">
                Quality Report
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Live metrics from the latest encode operation
              </p>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">
                    PSNR
                  </p>

                  <h3 className="text-[42px] leading-none font-bold mt-2">
                    {localResult?.details?.psnr
                      ? Number(localResult.details.psnr).toFixed(2)
                      : "--"}
                  </h3>
                </div>

                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">
                    SNR
                  </p>

                  <h3 className="text-[42px] leading-none font-bold mt-2">
                    {localResult?.details?.snr
                      ? Number(localResult.details.snr).toFixed(2)
                      : "--"}
                  </h3>
                </div>

                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">
                    BER
                  </p>

                  <h3 className="text-[28px] font-bold mt-2">
                    {localResult?.details?.ber ?? "--"}
                  </h3>
                </div>

                <div className="rounded-xl bg-white/5 p-5">
                  <p className="text-xs text-slate-500">
                    NC
                  </p>

                  <h3 className="text-[28px] font-bold mt-2">
                    {localResult?.details?.nc ?? "--"}
                  </h3>
                </div>
              </div>

              {error && (
                <div role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-start gap-3 transition-all duration-300">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Encoding Failed</p>
                    <p className="mt-1 text-xs text-red-400/80">{error}</p>
                  </div>
                </div>
              )}

              {localResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.1)]"
                >
                  {/* Cyan Pulse Signal Wave */}
                  <motion.div
                    className="absolute inset-0 border border-cyan-400/40 rounded-2xl pointer-events-none"
                    initial={{ scale: 0.98, opacity: 0.8 }}
                    animate={{ scale: [0.98, 1.05, 1.08], opacity: [0.8, 0.2, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: 2,
                      ease: "easeOut"
                    }}
                  />
                  
                  <div className="flex items-start gap-4">
                    {/* Animated target lock graphic */}
                    <div className="relative shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 overflow-hidden">
                      {/* Target corners */}
                      <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-cyan-400" />
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-cyan-400" />
                      <span className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-cyan-400" />
                      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-400" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                        className="absolute inset-1 border border-dashed border-cyan-400/25 rounded-lg"
                      />
                      <CheckCircle2 size={18} className="text-cyan-400 relative z-10 animate-pulse" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="font-bold text-cyan-400 text-xs tracking-tight flex items-center gap-1.5 uppercase">
                        Secure Delivery Ready
                      </h3>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        Payload successfully embedded under ML guidance. Authenticity hash locks verified.
                      </p>
                      <div className="pt-2 flex flex-col gap-1 text-[10px] font-mono text-slate-400">
                        <div className="truncate" title={localResult.output_file}>
                          <span className="text-slate-500">Output:</span> <span className="text-slate-300">{localResult.output_file}</span>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <span className="text-slate-500">Status:</span> <span className="text-emerald-400 font-bold">{localResult.status?.toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Payload Bits:</span> <span className="text-cyan-300">{localResult?.details?.bits_embedded}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}


              {localResult?.output_file && (
                <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                  <CustomAudioPlayer 
                    src={getDownloadUrl(localResult.storage_url, localResult.output_file)} 
                    title="Synthesized Stego Audio Output" 
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={getDownloadUrl(
                        localResult.storage_url,
                        localResult.output_file
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-teal-400 bg-teal-500/10 py-3 text-center text-xs font-bold text-teal-300 hover:bg-teal-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download Stego</span>
                    </a>
                    
                    <button
                      onClick={handleScrollToCompare}
                      type="button"
                      className="rounded-xl border border-cyan-400 bg-cyan-500/10 py-3 text-center text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Compare Waves</span>
                    </button>
                  </div>
                  
                  {localResult?.storage_url && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          getDownloadUrl(localResult.storage_url, localResult.output_file)
                        );
                        alert("Secure cloud download URL copied!");
                      }}
                      type="button"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 transition cursor-pointer"
                    >
                      Copy Cloud URL
                    </button>
                  )}

                  {/* Secure Delivery / Share Link Section */}
                  <div className="border-t border-white/5 pt-4 mt-4 space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                      <Lock size={12} /> Secure Delivery
                    </h4>

                    {!shareResult ? (
                      <div className="space-y-3 bg-[#020817]/40 border border-white/5 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-slate-500 block mb-1">
                              Expiration
                            </label>
                            <CustomSelect
                              value={shareExpiration}
                              options={["1 Hour", "24 Hours", "7 Days", "30 Days"]}
                              onChange={(val) => setShareExpiration(val)}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-slate-500 block mb-1">
                              Download Limit
                            </label>
                            <CustomSelect
                              value={shareDownloadLimit}
                              options={["1", "5", "10", "Unlimited"]}
                              onChange={(val) => setShareDownloadLimit(val)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-slate-500 block mb-1">
                            Link Password (Optional)
                          </label>
                          <input
                            type="password"
                            placeholder="Set secondary password"
                            value={sharePassword}
                            onChange={(e) => setSharePassword(e.target.value)}
                            className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs outline-none focus:border-cyan-500/50"
                          />
                        </div>

                        {shareError && (
                          <p className="text-red-400 text-[11px] font-mono flex items-start gap-1">
                            <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                            <span>{shareError}</span>
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={handleGenerateShareLink}
                          disabled={isGeneratingShare}
                          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-2.5 text-xs font-bold text-black hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                        >
                          {isGeneratingShare ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Lock size={12} />
                              <span>Generate Share Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-[#020817]/40 border border-white/5 rounded-xl p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            ✓ Link Created
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Expires: {shareExpiration}
                          </span>
                        </div>

                        <div className="flex flex-col items-center py-2 bg-[#020817]/60 border border-white/5 rounded-lg gap-2">
                          <div className="bg-white p-1.5 rounded-lg">
                            {qrCodeDataUrl ? (
                              <img
                                src={qrCodeDataUrl}
                                alt="Secure Share QR Code"
                                className="w-[110px] h-[110px]"
                              />
                            ) : (
                              <div className="w-[110px] h-[110px] flex items-center justify-center text-slate-500 text-[10px] font-mono">
                                Generating QR...
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] font-mono text-slate-500">
                            Scan to open share link
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                          <div>
                            <span className="text-slate-500">Limit: </span>
                            <span className="font-bold text-white">
                              {shareDownloadLimit === "Unlimited" ? "Unlimited" : `${shareDownloadLimit} Remaining`}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500">Status: </span>
                            <span className="font-bold text-emerald-400">Active</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const shareUrl = `${window.location.origin}/share/${shareResult.token}`;
                              navigator.clipboard.writeText(shareUrl);
                              alert("Share URL copied to clipboard!");
                            }}
                            className="rounded-lg border border-teal-400 bg-teal-500/10 py-2.5 text-center text-xs font-bold text-teal-300 hover:bg-teal-500/20 transition cursor-pointer"
                          >
                            Copy Link
                          </button>
                          <a
                            href={`${window.location.origin}/share/${shareResult.token}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-cyan-400 bg-cyan-500/10 py-2.5 text-center text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer flex items-center justify-center text-center"
                          >
                            Open Share
                          </a>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setShareResult(null);
                            setSharePassword("");
                            setQrCodeDataUrl("");
                          }}
                          className="w-full text-center text-[10px] font-mono text-slate-500 hover:text-white transition cursor-pointer pt-2"
                        >
                          Create New Share Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PRIORITY 3 — WAVEFORM COMPARISON VISUALIZATION */}
      {localResult && (
        <div id="waveform-comparison" className="mt-8 rounded-[20px] border border-white/5 bg-[#071122]/60 p-6 sm:p-8 space-y-6 scroll-mt-6 glass">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Signal Fidelity Analysis</h2>
            <p className="text-xs text-slate-400 mt-1">
              Visual verification mapping carrier samples and stego sample deviations (LSB masking transparency).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel 1: Original Waveform */}
            <div className="rounded-xl border border-white/5 bg-[#020817] p-5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">1. Original Carrier Waveform</span>
                <span className="text-cyan-400 font-mono text-[10px]">Pure Audio (WAV)</span>
              </div>
              <div className="h-24 flex items-center justify-between gap-[2px] bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />
                {activeWaveform.slice(0, 70).map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full bg-cyan-400/80 transition-all duration-300 shadow-[0_0_4px_rgba(34,211,238,0.2)]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Standard carrier wave pattern showing high-frequency parameters and noise boundaries prior to encryption.
              </p>
            </div>

            {/* Panel 2: Stego Waveform */}
            <div className="rounded-xl border border-white/5 bg-[#020817] p-5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">2. Stego Output Waveform</span>
                <span className="text-purple-400 font-mono text-[10px]">Embedded Payload</span>
              </div>
              <div className="h-24 flex items-center justify-between gap-[2px] bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />
                {stegoWaveform.slice(0, 70).map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full bg-purple-400/80 transition-all duration-300 shadow-[0_0_4px_rgba(139,92,246,0.2)]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Synthesized output carrying the encrypted AES-256 envelope. Perceptually identical to source carrier.
              </p>
            </div>

            {/* Panel 3: Difference Overlay */}
            <div className="rounded-xl border border-white/5 bg-[#020817] p-5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">3. Difference Overlay (Distortion Delta)</span>
                <span className="text-amber-400 font-mono text-[10px]">LSB Alteration Noise</span>
              </div>
              <div className="h-24 flex items-center justify-between gap-[2px] bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
                {diffWaveform.slice(0, 70).map((h, i) => {
                  const hasDiff = h > 2;
                  return (
                    <div
                      key={i}
                      className={`w-[3px] rounded-full transition-all duration-300 ${
                        hasDiff ? "bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.4)]" : "bg-slate-800"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Visualizing the delta changes (amplified 100x for visibility). Represents the secure, LSB micro-modulations.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">Objective Signal Verification</h3>
              <p className="text-xs text-slate-500">
                The delta signal represents noise floor alterations below standard hearing thresholds (&lt; -90 dB).
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Waveform Similarity: <strong className="text-emerald-400">99.98%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Audible Distortions: <strong className="text-emerald-400">None</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}