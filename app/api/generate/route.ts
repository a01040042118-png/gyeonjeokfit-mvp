import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DISABLED_MESSAGE =
  "결제 검증 기반 유료 생성 API는 현재 비활성화되어 있습니다. 현재 MVP 문서 생성은 /api/generate-documents를 사용합니다.";

export async function POST() {
  // TODO: Supabase 결제 상태 검증을 다시 켤 때 이 라우트를 유료 전체 생성 전용 API로 복구합니다.
  return NextResponse.json({ disabled: true, message: DISABLED_MESSAGE }, { status: 410 });
}
