import axios from "axios";
import { supabase } from "./supabase";

const API_BASE =
  "http://127.0.0.1:8000/api";

export async function getJobs() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const response =
    await axios.get(
      `${API_BASE}/jobs/`,
      {
        params: {
          email: user.email,
        },
      }
    );

  return response.data;
}