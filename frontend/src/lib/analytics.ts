import axios from "axios";
import { supabase } from "./supabase";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

export async function getAnalytics() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const response = await axios.get(
    `${API_BASE}/analytics`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  return response.data;
}