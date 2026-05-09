import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  GeneratedDocuments,
  GenerateDocumentsRequest,
  emptyGeneratedDocuments,
} from "@/lib/documents";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_MODEL = "gpt-4.1-mini";

const SYSTEM_PROMPT = `너는 한국의 웹 제작 프리랜서와 1인 에이전시를 돕는 실무 문서 작성 전문가다.

목표:
고객 의뢰 내용을 바탕으로 다음 문서를 생성한다.
- 의뢰 요약
- 견적서 초안
- 제안서 초안
- 계약 핵심 조항 초안
- 고객에게 보낼 이메일 초안
- 보내기 전 체크리스트

공통 작성 규칙:
- 한국어로 작성한다.
- 실제 프리랜서가 고객에게 보낼 수 있을 정도로 자연스럽고 전문적으로 작성한다.
- 과장된 마케팅 문구보다 실무적으로 명확한 문장을 사용한다.
- 포함 범위와 제외 범위를 반드시 구분한다.
- 입력값이 부족한 부분은 임의로 단정하지 말고 "확인 필요"라고 표시한다.
- 금액, 일정, 수정 횟수, 지급 조건은 사용자가 입력한 값을 우선 사용한다.

견적서 작성 규칙:
- 사용자가 예산을 입력한 경우, 총 견적 금액은 반드시 입력 예산을 기준으로 한다.
- 세부 항목별 금액을 나눌 경우, 세부 항목 합계는 총 견적 금액과 반드시 일치해야 한다.
- 세부 항목 합계를 정확히 맞추기 어렵다면 세부 금액을 쓰지 말고 항목명과 설명만 나열한다.
- VAT 포함 여부가 입력값에 없으면 반드시 "VAT 포함 여부: 확인 필요"라고 표시한다.
- 입력값에 없는 VAT 포함/별도 여부를 임의로 만들지 않는다.
- 특히 "VAT 별도", "부가세 별도", "VAT 포함" 같은 표현은 입력값에 있을 때만 사용한다.

일정 작성 규칙:
- 사용자가 입력한 희망 일정을 우선 사용한다.
- 입력값이 "4주"이면 결과에도 "약 4주" 또는 "4주 내외"처럼 동일한 기간을 유지한다.
- "4주"를 "3~4주", "한 달 이상"처럼 임의로 바꾸지 않는다.
- 일정이 불명확하면 "확인 필요"라고 표시한다.

계약 핵심 조항 작성 규칙:
- 계약 관련 문구는 반드시 "계약 핵심 조항 초안" 또는 "초안"이라고 명시한다.
- 법률 자문처럼 단정하지 않는다.
- 고액 계약, 장기 유지보수, 분쟁 가능성이 있는 계약은 전문가 검토를 권장한다.
- 저작권/사용권 조항은 다음 방향을 유지한다:
  "잔금 지급 완료 후 최종 산출물의 사용 권한은 고객에게 제공됩니다. 단, 작업 과정에서 사용된 템플릿, 공통 코드, 라이브러리, 미확정 시안은 제작자에게 귀속될 수 있습니다."
- 고객에게 일방적으로 불리하거나 제작자에게 과도하게 유리한 표현을 피한다.

이메일 작성 규칙:
- 실제 첨부파일이 없으므로 "첨부 드립니다", "첨부한 문서", "첨부파일을 확인해 주세요" 같은 표현을 쓰지 않는다.
- 대신 "아래에 정리한 견적 및 제안 내용을 확인해 주세요"라고 작성한다.
- 이메일은 짧고 정중하게 작성한다.

반환 전 품질 체크:
- 총액과 세부 항목 합계가 일치하는가?
- VAT 표현을 임의로 쓰지 않았는가?
- VAT 정보가 입력에 없으면 "VAT 포함 여부: 확인 필요"라고 썼는가?
- 포함 범위와 제외 범위가 명확한가?
- 수정 횟수와 지급 조건이 입력값과 일치하는가?
- 일정이 입력값과 일치하는가?
- 계약 조항이 법률 자문처럼 단정적이지 않은가?
- 이메일에 첨부 표현을 잘못 쓰지 않았는가?

위 기준을 만족하지 못하면 내용을 다시 고쳐서 반환한다.`;

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    estimate: { type: "string" },
    proposal: { type: "string" },
    contractTerms: { type: "string" },
    emailDraft: { type: "string" },
    checklist: { type: "string" },
  },
  required: ["summary", "estimate", "proposal", "contractTerms", "emailDraft", "checklist"],
} as const;

type SafeOpenAIError = {
  status?: number;
  code?: string;
  type?: string;
  param?: string | null;
  requestID?: string;
  name?: string;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeFeatures(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  }

  const singleValue = asString(value);
  return singleValue ? [singleValue] : [];
}

function normalizeBody(body: Record<string, unknown>): GenerateDocumentsRequest {
  return {
    serviceType: asString(body.serviceType),
    clientIndustry: asString(body.clientIndustry),
    requestText: asString(body.requestText),
    pageCount: asString(body.pageCount),
    requiredFeatures: normalizeFeatures(body.requiredFeatures),
    budget: asString(body.budget),
    timeline: asString(body.timeline),
    includedScope: asString(body.includedScope),
    excludedScope: asString(body.excludedScope),
    revisionCount: asString(body.revisionCount),
    paymentTerms: asString(body.paymentTerms),
    tone: asString(body.tone),
  };
}

function validateRequired(input: GenerateDocumentsRequest) {
  const missingFields = [
    ["serviceType", input.serviceType],
    ["clientIndustry", input.clientIndustry],
    ["requestText", input.requestText],
    ["pageCount", input.pageCount],
    ["budget", input.budget],
    ["timeline", input.timeline],
    ["includedScope", input.includedScope],
    ["excludedScope", input.excludedScope],
    ["revisionCount", input.revisionCount],
    ["paymentTerms", input.paymentTerms],
    ["tone", input.tone],
  ].filter(([, value]) => !value);

  if (input.requiredFeatures.length === 0) {
    missingFields.push(["requiredFeatures", ""]);
  }

  return missingFields.map(([field]) => field);
}

function buildUserPrompt(input: GenerateDocumentsRequest) {
  return `아래 입력값을 바탕으로 결과 JSON을 생성해줘.

입력값:
- 서비스 유형: ${input.serviceType}
- 고객 업종: ${input.clientIndustry}
- 고객 요청 원문: ${input.requestText}
- 페이지 수: ${input.pageCount}
- 필요한 기능: ${input.requiredFeatures.join(", ")}
- 예산: ${input.budget}
- 희망 일정: ${input.timeline}
- 포함 범위: ${input.includedScope}
- 제외 범위: ${input.excludedScope}
- 수정 횟수: ${input.revisionCount}
- 지급 조건: ${input.paymentTerms}
- 문서 톤: ${input.tone}

각 JSON 필드는 다음 의미로 채워줘.
- summary: 의뢰 요약
- estimate: 견적서 초안
- proposal: 제안서 초안
- contractTerms: 계약 핵심 조항 초안
- emailDraft: 고객에게 보낼 이메일 초안
- checklist: 보내기 전 체크리스트

estimate 필수 포함 내용:
- 프로젝트명
- 총 견적 금액: 입력 예산 "${input.budget}" 기준
- 세부 항목: 합계를 정확히 맞출 수 있을 때만 금액 표시, 아니면 항목명과 설명만 표시
- VAT 포함 여부: 입력값에 없으면 "확인 필요"
- 포함 범위
- 제외 범위
- 예상 일정: 입력 일정 "${input.timeline}" 기준
- 수정 횟수: 입력 수정 횟수 "${input.revisionCount}" 기준
- 지급 조건: 입력 지급 조건 "${input.paymentTerms}" 기준

contractTerms 필수 포함 내용:
- "계약 핵심 조항 초안"이라는 표현
- 작업 범위
- 수정 횟수
- 일정 지연 조건
- 지급 조건
- 추가 비용 발생 조건
- 자료 제공 책임
- 저작권 및 사용권 조항
- 전문가 검토 권장 문구

emailDraft 작성 주의:
- "첨부"라는 표현을 쓰지 말 것
- "아래에 정리한 견적 및 제안 내용을 확인해 주세요"라는 흐름으로 작성할 것
- 짧고 정중하게 작성할 것`;
}

function coerceGeneratedDocuments(value: unknown): GeneratedDocuments | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<Record<keyof GeneratedDocuments, unknown>>;
  const result = emptyGeneratedDocuments();

  for (const key of Object.keys(result) as Array<keyof GeneratedDocuments>) {
    if (typeof candidate[key] !== "string") {
      return null;
    }

    result[key] = candidate[key] ?? "";
  }

  return result;
}

function parseGeneratedDocuments(text: string): GeneratedDocuments | null {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return coerceGeneratedDocuments(JSON.parse(trimmed));
  } catch {
    return null;
  }
}

function safeOpenAIError(error: unknown): SafeOpenAIError {
  const record = error && typeof error === "object" ? (error as Record<string, unknown>) : {};
  const nestedError =
    record.error && typeof record.error === "object" ? (record.error as Record<string, unknown>) : {};

  return {
    status: typeof record.status === "number" ? record.status : undefined,
    code:
      typeof record.code === "string"
        ? record.code
        : typeof nestedError.code === "string"
          ? nestedError.code
          : undefined,
    type:
      typeof record.type === "string"
        ? record.type
        : typeof nestedError.type === "string"
          ? nestedError.type
          : undefined,
    param:
      typeof record.param === "string" || record.param === null
        ? record.param
        : typeof nestedError.param === "string" || nestedError.param === null
          ? nestedError.param
          : undefined,
    requestID: typeof record.requestID === "string" ? record.requestID : undefined,
    name: error instanceof Error ? error.name : undefined,
  };
}

function logRequestSummary(input: GenerateDocumentsRequest, model: string, hasApiKey: boolean) {
  console.info("[generate-documents] request", {
    hasApiKey,
    model,
    requestTextLength: input.requestText.length,
    featureCount: input.requiredFeatures.length,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    console.warn("[generate-documents] invalid_json_body");
    return NextResponse.json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const input = normalizeBody(body);
  const missingFields = validateRequired(input);
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const apiKey = process.env.OPENAI_API_KEY;

  logRequestSummary(input, model, Boolean(apiKey));

  if (missingFields.length > 0) {
    console.warn("[generate-documents] validation_failed", { missingFields });
    return NextResponse.json(
      { message: "필수 입력값을 모두 입력해주세요.", missingFields },
      { status: 400 },
    );
  }

  if (!apiKey) {
    console.error("[generate-documents] missing_openai_api_key");
    return NextResponse.json(
      { message: "문서 생성에 필요한 서버 설정이 완료되지 않았습니다." },
      { status: 500 },
    );
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.responses.create({
      model,
      instructions: SYSTEM_PROMPT,
      input: buildUserPrompt(input),
      text: {
        format: {
          type: "json_schema",
          name: "generated_documents",
          schema: responseSchema,
          strict: true,
        },
      },
    });

    const outputText = response.output_text ?? "";
    const documents = parseGeneratedDocuments(outputText);

    if (!documents) {
      console.error("[generate-documents] parse_failed", {
        responseId: response.id,
        outputTextLength: outputText.length,
      });
      return NextResponse.json(
        { message: "문서 생성 결과를 처리하지 못했습니다." },
        { status: 502 },
      );
    }

    console.info("[generate-documents] success", { responseId: response.id });
    return NextResponse.json(documents);
  } catch (error) {
    console.error("[generate-documents] openai_failed", safeOpenAIError(error));
    return NextResponse.json(
      { message: "문서 생성에 실패했습니다. 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
