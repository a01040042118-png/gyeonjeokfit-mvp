import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DISABLED_MESSAGE =
  "현재는 수동 결제/베타 신청 방식입니다. Toss Payments 승인 API는 비활성화되어 있습니다.";

export async function POST() {
  // TODO: 정식 PG 결제를 재개할 때 서버 기준 금액 검증 후 Toss confirm API를 다시 연결합니다.
  return NextResponse.json({ disabled: true, message: DISABLED_MESSAGE }, { status: 410 });
}
