import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId")?.trim() || null;

  // TODO: PG/Supabase 결제 검증을 재개할 때 orders.status === "DONE" 확인 로직을 다시 연결합니다.
  return NextResponse.json({
    paid: false,
    orderId,
    status: "MANUAL_PAYMENT",
    disabled: true,
    message: "현재는 수동 결제/베타 신청 방식이라 자동 결제 완료 검증을 사용하지 않습니다.",
  });
}
