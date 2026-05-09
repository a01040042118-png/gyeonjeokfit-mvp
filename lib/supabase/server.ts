import "server-only";

import { createClient } from "@supabase/supabase-js";

export type OrderStatus = "READY" | "IN_PROGRESS" | "DONE" | "FAILED" | "CANCELED";
export type PaymentStatus = "DONE" | "FAILED" | "CANCELED" | "WAITING_FOR_DEPOSIT";

export type OrderRecord = {
  id: string;
  order_id: string;
  order_name: string;
  amount: number;
  currency: string;
  customer_name: string | null;
  customer_email: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type PaymentRecord = {
  id: string;
  order_id: string;
  payment_key: string | null;
  amount: number;
  currency: string;
  method: string | null;
  status: PaymentStatus;
  approved_at: string | null;
  receipt_url: string | null;
  raw_response: unknown;
  created_at: string;
  updated_at: string;
};

export type GenerationRecord = {
  id: string;
  order_id: string | null;
  form_submission_id: string | null;
  status: string;
  model: string | null;
  output_markdown: string;
  output_json: unknown;
  created_at: string;
};

function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase 서버 환경변수가 설정되어 있지 않습니다. NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 확인해주세요.",
    );
  }

  return { supabaseUrl, serviceRoleKey };
}

export function createServerSupabaseClient() {
  const { supabaseUrl, serviceRoleKey } = getSupabaseEnv();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
