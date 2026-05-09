import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DISABLED_MESSAGE =
  "현재는 수동 결제/베타 신청 방식입니다. PG 주문 생성 API는 비활성화되어 있습니다.";

export async function POST() {
  // TODO: 정식 PG 결제를 재개할 때 orderId별 서버 저장 금액 검증과 주문 생성 로직을 다시 연결합니다.
  return NextResponse.json({ disabled: true, message: DISABLED_MESSAGE }, { status: 410 });
}
