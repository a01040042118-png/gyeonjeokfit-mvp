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

const PROPOSAL_SECTION_TITLES = [
  "1. 프로젝트 개요",
  "2. 제작 목표",
  "3. 작업 범위",
  "4. 제외 범위",
  "5. 진행 일정",
  "6. 기대 효과",
  "7. 확인이 필요한 사항",
];

const REQUIRED_CHECKLIST_ITEMS = [
  "견적 금액이 입력 예산과 일치하는가?",
  "일정이 입력 일정과 일치하는가?",
  "포함 범위와 제외 범위가 명확한가?",
  "VAT 포함 여부가 임의로 단정되지 않았는가?",
  "이메일에 첨부 표현이 없는가?",
  "제안서가 섹션 구조로 정리되어 있는가?",
  "계약 조항이 법률 자문이 아닌 초안으로 표현되었는가?",
];

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
- 입력값이 부족한 부분은 임의로 만들지 말고 "확인 필요"라고 표시한다.
- 사용자가 직접 입력한 서비스 유형, 기능, 문서 톤은 선택지보다 우선 반영한다.
- 예산, 일정, 포함 범위, 제외 범위, 수정 횟수, 지급 조건은 입력값을 우선 사용하고 임의로 바꾸지 않는다.
- 문서 톤은 문체에만 반영하고 사실 정보는 바꾸지 않는다.

견적서 작성 규칙:
- 사용자가 예산을 입력한 경우 총 견적 금액은 입력 예산을 기준으로 한다.
- 세부 항목 금액을 나눌 경우 합계가 총액과 반드시 일치해야 한다.
- 합계를 맞추기 어렵다면 세부 금액을 쓰지 말고 항목명과 설명만 나열한다.
- VAT 포함 여부가 입력값에 없으면 반드시 "VAT 포함 여부: 확인 필요"라고 표시한다.
- 입력값에 없는 VAT 포함, VAT 별도, 부가세 별도 표현을 임의로 쓰지 않는다.

제안서 작성 규칙:
- proposal 필드는 실제 제안서처럼 섹션 구조로 작성한다.
- proposal 필드는 반드시 다음 7개 섹션 제목을 이 순서 그대로 포함한다.
${PROPOSAL_SECTION_TITLES.map((title) => `  - ${title}`).join("\n")}
- 각 섹션 제목은 줄을 나누어 표시하고, 한 문단으로 이어 쓰지 않는다.
- 각 섹션은 2~4문장 또는 bullet 형태로 작성한다.
- serviceType, clientIndustry, requestText, requiredFeatures, budget, timeline, includedScope, excludedScope, revisionCount, paymentTerms, tone을 반드시 반영한다.

계약 핵심 조항 작성 규칙:
- 계약 관련 문구는 반드시 "계약 핵심 조항 초안" 또는 "초안"이라고 명시한다.
- 법률 자문처럼 단정하지 않는다.
- 고액 계약, 장기 유지보수, 분쟁 가능성이 있는 계약은 전문가 검토를 권장한다.
- 저작권/사용권 조항은 다음 방향으로 작성한다:
  "잔금 지급 완료 후 최종 산출물의 사용 권한은 고객에게 제공됩니다. 단, 작업 과정에서 사용된 템플릿, 공통 코드, 라이브러리, 미확정 시안은 제작자에게 귀속될 수 있습니다."

고객 이메일 작성 규칙:
- emailDraft는 실제 프리랜서가 고객에게 보내는 정중한 견적 안내 메일처럼 작성한다.
- emailDraft는 6~10문장 정도로 작성한다.
- 인사, 의뢰 내용 검토 문장, 프로젝트 범위 요약, 견적 금액, 예상 일정, VAT 포함 여부 확인 필요 안내, 수정/추가 요청 안내, 마무리 인사를 포함한다.
- "첨부드립니다", "첨부파일", "첨부"처럼 실제 첨부가 있는 것처럼 보이는 표현을 쓰지 않는다.
- 대신 "아래에 정리한 견적 및 제안 내용을 확인해 주세요"라는 흐름을 사용한다.
- 과장된 영업 문구를 피하고 짧고 정중하게 작성한다.

반환 전 품질 체크:
- 총액과 세부 항목 합계가 일치하는가?
- VAT 표현을 임의로 쓰지 않았는가?
- VAT 정보가 입력값에 없으면 "VAT 포함 여부: 확인 필요"라고 썼는가?
- 포함 범위와 제외 범위가 명확한가?
- 수정 횟수와 지급 조건이 입력값과 일치하는가?
- 일정이 입력값과 일치하는가?
- 제안서가 7개 섹션 구조로 정리되어 있는가?
- 이메일이 6~10문장 정도의 정중한 견적 안내 메일인가?
- 이메일에 첨부 표현을 잘못 쓰지 않았는가?
- 계약 조항이 법률 자문처럼 단정적이지 않은가?`;

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
    return value
      .filter((item): item is string => typeof item === "string" && item.trim() !== "")
      .map((item) => item.trim())
      .filter((item) => item !== "기타");
  }

  const singleValue = asString(value);

  if (!singleValue || singleValue === "기타") {
    return [];
  }

  return [singleValue];
}

function normalizeFeatureInput(body: Record<string, unknown>) {
  const selectedFeatures = normalizeFeatures(body.requiredFeatures);
  const customFeatures = asString(body.customFeatures);

  return customFeatures ? [...selectedFeatures, customFeatures] : selectedFeatures;
}

function normalizeBody(body: Record<string, unknown>): GenerateDocumentsRequest {
  const serviceType = asString(body.serviceType);
  const customServiceType = asString(body.customServiceType);

  return {
    serviceType: customServiceType || serviceType,
    customServiceType,
    clientIndustry: asString(body.clientIndustry),
    requestText: asString(body.requestText),
    pageCount: asString(body.pageCount),
    requiredFeatures: normalizeFeatureInput(body),
    customFeatures: asString(body.customFeatures),
    budget: asString(body.budget),
    timeline: asString(body.timeline),
    includedScope: asString(body.includedScope),
    excludedScope: asString(body.excludedScope),
    revisionCount: asString(body.revisionCount),
    paymentTerms: asString(body.paymentTerms),
    tone: asString(body.tone) || "전문적이고 신뢰감 있게",
  };
}

function validateRequired(input: GenerateDocumentsRequest) {
  const missingFields = [
    ["serviceType", input.serviceType],
    ["requestText", input.requestText],
  ].filter(([, value]) => !value);

  return missingFields.map(([field]) => field);
}

function valueOrNeedsCheck(value: string) {
  return value || "확인 필요";
}

function featuresOrNeedsCheck(features: string[]) {
  return features.length ? features.join(", ") : "확인 필요";
}

function buildUserPrompt(input: GenerateDocumentsRequest) {
  const requiredFeatures = featuresOrNeedsCheck(input.requiredFeatures);

  return `아래 입력값을 바탕으로 결과 JSON을 생성해줘.

입력값:
- 서비스 유형: ${valueOrNeedsCheck(input.serviceType)}
- 고객 업종: ${valueOrNeedsCheck(input.clientIndustry)}
- 고객 요청 원문: ${valueOrNeedsCheck(input.requestText)}
- 페이지 수: ${valueOrNeedsCheck(input.pageCount)}
- 필요한 기능: ${requiredFeatures}
- 예산: ${valueOrNeedsCheck(input.budget)}
- 희망 일정: ${valueOrNeedsCheck(input.timeline)}
- 포함 범위: ${valueOrNeedsCheck(input.includedScope)}
- 제외 범위: ${valueOrNeedsCheck(input.excludedScope)}
- 수정 횟수: ${valueOrNeedsCheck(input.revisionCount)}
- 지급 조건: ${valueOrNeedsCheck(input.paymentTerms)}
- 문서 톤: ${valueOrNeedsCheck(input.tone)}

각 JSON 필드는 다음 의미로 채워줘.
- summary: 의뢰 요약
- estimate: 견적서 초안
- proposal: 제안서 초안
- contractTerms: 계약 핵심 조항 초안
- emailDraft: 고객에게 보낼 이메일 초안
- checklist: 보내기 전 체크리스트

estimate 필드 필수 항목:
- 프로젝트명
- 총 견적 금액: ${valueOrNeedsCheck(input.budget)}
- VAT 포함 여부: 확인 필요
- 포함 범위: ${valueOrNeedsCheck(input.includedScope)}
- 제외 범위: ${valueOrNeedsCheck(input.excludedScope)}
- 예상 일정: ${valueOrNeedsCheck(input.timeline)}
- 수정 횟수: ${valueOrNeedsCheck(input.revisionCount)}
- 지급 조건: ${valueOrNeedsCheck(input.paymentTerms)}

proposal 필드 필수 구조:
${PROPOSAL_SECTION_TITLES.map((title) => `${title}\n- ${title.replace(/^[0-9]+\\.\\s*/, "")}에 맞는 내용을 2~4문장 또는 bullet로 작성`).join("\n\n")}

proposal 작성 시 반드시 반영할 입력값:
- 서비스 유형: ${valueOrNeedsCheck(input.serviceType)}
- 고객 업종: ${valueOrNeedsCheck(input.clientIndustry)}
- 고객 요청 원문: ${valueOrNeedsCheck(input.requestText)}
- 필요한 기능: ${requiredFeatures}
- 예산: ${valueOrNeedsCheck(input.budget)}
- 일정: ${valueOrNeedsCheck(input.timeline)}
- 포함 범위: ${valueOrNeedsCheck(input.includedScope)}
- 제외 범위: ${valueOrNeedsCheck(input.excludedScope)}
- 수정 횟수: ${valueOrNeedsCheck(input.revisionCount)}
- 지급 조건: ${valueOrNeedsCheck(input.paymentTerms)}
- 문서 톤: ${valueOrNeedsCheck(input.tone)}

emailDraft 작성 시 반드시 포함할 내용:
- 인사
- 의뢰 내용을 검토했다는 문장
- 프로젝트 범위 요약
- 견적 금액: ${valueOrNeedsCheck(input.budget)}
- 예상 일정: ${valueOrNeedsCheck(input.timeline)}
- VAT 포함 여부가 확인 필요하다는 안내
- 검토 후 수정하거나 추가하고 싶은 범위를 알려달라는 문장
- 마무리 인사

정확도 유지:
- 총 견적 금액은 입력 예산 "${valueOrNeedsCheck(input.budget)}"을 기준으로 써라.
- 예상 일정은 입력 일정 "${valueOrNeedsCheck(input.timeline)}"을 기준으로 써라.
- VAT 정보가 입력값에 없으면 "VAT 포함 여부: 확인 필요"라고 써라.
- 포함 범위와 제외 범위는 입력값을 임의로 바꾸지 마라.
- 수정 횟수 "${valueOrNeedsCheck(input.revisionCount)}"와 지급 조건 "${valueOrNeedsCheck(input.paymentTerms)}"을 그대로 반영해라.
- 문서 톤 "${valueOrNeedsCheck(input.tone)}"은 문체에만 반영하고 사실 정보를 바꾸지 마라.
- 계약 조항은 반드시 초안으로 표현해라.
- 이메일에는 "첨부"라는 단어를 쓰지 마라.

checklist 필드에는 아래 항목을 그대로 포함해라.
${REQUIRED_CHECKLIST_ITEMS.map((item) => `- ${item}`).join("\n")}`;
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

function buildInputAnchor(input: GenerateDocumentsRequest) {
  const lines = [
    ["서비스 유형", input.serviceType],
    ["고객 업종", input.clientIndustry],
    ["필요한 기능", featuresOrNeedsCheck(input.requiredFeatures)],
    ["예산", input.budget],
    ["희망 일정", input.timeline],
    ["포함 범위", input.includedScope],
    ["제외 범위", input.excludedScope],
    ["수정 횟수", input.revisionCount],
    ["지급 조건", input.paymentTerms],
    ["문서 톤", input.tone],
  ].filter(([, value]) => value && value !== "확인 필요");

  if (!lines.length) {
    return "";
  }

  return `입력 기준\n${lines.map(([label, value]) => `- ${label}: ${value}`).join("\n")}\n\n`;
}

function ensureInputAnchors(documents: GeneratedDocuments, input: GenerateDocumentsRequest) {
  const anchor = buildInputAnchor(input);

  if (!anchor || documents.summary.includes("입력 기준")) {
    return documents;
  }

  return {
    ...documents,
    summary: `${anchor}${documents.summary}`,
  };
}

function ensureChecklistItems(documents: GeneratedDocuments) {
  const missingItems = REQUIRED_CHECKLIST_ITEMS.filter((item) => !documents.checklist.includes(item));

  if (missingItems.length === 0) {
    return documents;
  }

  return {
    ...documents,
    checklist: `${documents.checklist.trim()}\n${missingItems.map((item) => `- ${item}`).join("\n")}`.trim(),
  };
}

function removeAttachmentWording(documents: GeneratedDocuments) {
  if (!documents.emailDraft.includes("첨부")) {
    return documents;
  }

  return {
    ...documents,
    emailDraft: documents.emailDraft
      .replaceAll("첨부드립니다", "아래에 정리해 드립니다")
      .replaceAll("첨부 드립니다", "아래에 정리해 드립니다")
      .replaceAll("첨부파일", "아래 내용")
      .replaceAll("첨부 파일", "아래 내용")
      .replaceAll("첨부", "아래 내용"),
  };
}

function ensureEstimateFacts(documents: GeneratedDocuments, input: GenerateDocumentsRequest) {
  const appendedFacts: string[] = [];

  if (input.timeline && !documents.estimate.includes(input.timeline)) {
    appendedFacts.push(`예상 일정: ${input.timeline}`);
  }

  if (input.includedScope && !documents.estimate.includes("포함 범위")) {
    appendedFacts.push(`포함 범위: ${input.includedScope}`);
  }

  if (input.excludedScope && !documents.estimate.includes("제외 범위")) {
    appendedFacts.push(`제외 범위: ${input.excludedScope}`);
  }

  if (!documents.estimate.includes("VAT") || !documents.estimate.includes("확인 필요")) {
    appendedFacts.push("VAT 포함 여부: 확인 필요");
  }

  if (input.revisionCount && !documents.estimate.includes(input.revisionCount)) {
    appendedFacts.push(`수정 횟수: ${input.revisionCount}`);
  }

  if (input.paymentTerms && !documents.estimate.includes(input.paymentTerms)) {
    appendedFacts.push(`지급 조건: ${input.paymentTerms}`);
  }

  if (appendedFacts.length === 0) {
    return documents;
  }

  return {
    ...documents,
    estimate: `${documents.estimate.trim()}\n${appendedFacts.join("\n")}`.trim(),
  };
}

function finalizeDocuments(documents: GeneratedDocuments, input: GenerateDocumentsRequest) {
  return removeAttachmentWording(
    ensureEstimateFacts(ensureChecklistItems(ensureInputAnchors(documents, input)), input),
  );
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
      { message: "필수 입력값을 모두 입력해 주세요.", missingFields },
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
    return NextResponse.json(finalizeDocuments(documents, input));
  } catch (error) {
    console.error("[generate-documents] openai_failed", safeOpenAIError(error));
    return NextResponse.json(
      { message: "문서 생성에 실패했습니다. 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
