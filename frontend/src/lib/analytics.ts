// lib/analytics.ts

import axios from "axios";
import { supabase } from "./supabase";

const API_BASE =
  "http://127.0.0.1:8000/api";

export async function getAnalytics() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const response =
    await axios.get(
      `${API_BASE}/analytics`,
      {
        params: {
          email: user.email,
        },
      }
    );

  return response.data;
}