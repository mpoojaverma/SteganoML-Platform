import axios from "axios";
import { supabase } from "./supabase";

const isLocalhost = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_BASE = isLocalhost 
  ? "http://127.0.0.1:8000/api" 
  : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api");

export const api = axios.create({
  baseURL: API_BASE,
});

async function getAuthHeaders() {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (e) {
    console.error("Error fetching auth headers:", e);
    return {};
  }
}

export async function encodeAudio(
  formData: FormData
) {
  const authHeaders = await getAuthHeaders();
  const response =
    await api.post(
      "/encode/",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
          ...authHeaders,
        },
      }
    );

  return response.data;
}

export async function decodeAudio(
  formData: FormData
) {
  const authHeaders = await getAuthHeaders();
  const response =
    await api.post(
      "/decode/",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
          ...authHeaders,
        },
      }
    );

  return response.data;
}

export function getDownloadUrl(
  storageUrl?: string,
  outputFile?: string
) {
  const fileStr = outputFile || storageUrl;
  if (fileStr && fileStr.length > 0) {
    const filename = fileStr
      .split("\\")
      .pop()?.split("/")
      .pop() ?? "";
    return `${API_BASE}/encode/download/${filename}`;
  }

  return "#";
}