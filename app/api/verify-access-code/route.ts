import { NextResponse } from "next/server";

function normalizeCode(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const submittedCode = normalizeCode(body?.code);
  const betaAccessCode = process.env.BETA_ACCESS_CODE;

  if (!submittedCode) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!betaAccessCode) {
    console.error("[verify-access-code] missing_beta_access_code");
    return NextResponse.json(
      { ok: false, message: "베타 이용 코드 확인을 위한 서버 설정이 필요합니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: submittedCode === betaAccessCode });
}
