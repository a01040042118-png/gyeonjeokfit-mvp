export type GenerationSections = {
  requestSummary: string;
  estimateDraft: string;
  proposalDraft: string;
  contractTermsDraft: string;
  customerEmail: string;
  checklist: string;
};

export type GenerateInput = {
  orderId: string;
  serviceType?: string;
  clientIndustry?: string;
  requestText?: string;
  pageCount?: string;
  features?: string[];
  budget?: string;
  timeline?: string;
  includedScope?: string;
  excludedScope?: string;
  revisionCount?: string;
  paymentTerms?: string;
  tone?: string;
};

export const GENERATION_SECTION_LABELS: Array<[keyof GenerationSections, string]> = [
  ["requestSummary", "의뢰 요약"],
  ["estimateDraft", "견적서 초안"],
  ["proposalDraft", "제안서 초안"],
  ["contractTermsDraft", "계약 핵심 조항 초안"],
  ["customerEmail", "고객에게 보낼 이메일"],
  ["checklist", "보내기 전 체크리스트"],
];

export function buildGenerationPrompt(input: GenerateInput) {
  const features = input.features?.length ? input.features.join(", ") : "확인 필요";

  return `아래 웹 제작 의뢰 정보를 바탕으로 실무 문서 초안을 작성해줘.

- 서비스 유형: ${input.serviceType || "확인 필요"}
- 고객 업종: ${input.clientIndustry || "확인 필요"}
- 요청 원문: ${input.requestText || "확인 필요"}
- 페이지 수: ${input.pageCount || "확인 필요"}
- 필요한 기능: ${features}
- 예산: ${input.budget || "확인 필요"}
- 희망 일정: ${input.timeline || "확인 필요"}
- 포함 범위: ${input.includedScope || "확인 필요"}
- 제외 범위: ${input.excludedScope || "확인 필요"}
- 수정 횟수: ${input.revisionCount || "확인 필요"}
- 지급 조건: ${input.paymentTerms || "확인 필요"}
- 문서 톤: ${input.tone || "전문적"}

아래 출력 형식을 반드시 지켜줘.

# 1. 의뢰 요약
- 고객 업종:
- 요청 내용:
- 핵심 목표:
- 확인이 필요한 사항:

# 2. 견적서 초안
- 프로젝트명:
- 견적 금액:
- 포함 범위:
- 제외 범위:
- 예상 일정:
- 수정 횟수:
- 지급 조건:
- 견적 유효 기간:

# 3. 제안서 초안
## 제안 배경
## 제작 목표
## 작업 범위
## 진행 일정
## 기대 효과
## 추가 옵션

# 4. 계약 핵심 조항 초안
- 작업 범위
- 수정 횟수
- 일정 지연 조건
- 지급 조건
- 추가 비용 발생 조건
- 자료 제공 책임
- 저작권 및 소스 제공 범위
- 유지보수 범위

# 5. 고객에게 보낼 이메일
- 제목:
- 본문:

# 6. 보내기 전 체크리스트
- 금액 확인
- 일정 확인
- 수정 횟수 확인
- 제외 범위 확인
- 추가 비용 조건 확인
- 계좌/사업자 정보 확인
- 고객 제공 자료 확인`;
}

export const GENERATION_SYSTEM_PROMPT = `너는 한국의 웹 제작 프리랜서와 1인 에이전시를 돕는 실무 문서 작성 전문가다.

목표는 고객 의뢰 내용을 바탕으로 다음 문서를 생성하는 것이다.

1. 의뢰 요약
2. 견적서 초안
3. 제안서 초안
4. 작업 범위와 제외 범위
5. 계약 핵심 조항 초안
6. 고객에게 보낼 이메일
7. 보내기 전 체크리스트

작성 원칙:
- 과장된 마케팅 문구보다 실무적으로 명확한 문장을 사용한다.
- 포함 범위와 제외 범위를 반드시 구분한다.
- 금액, 일정, 수정 횟수, 지급 조건이 서로 모순되지 않게 작성한다.
- 입력값이 부족한 부분은 임의로 단정하지 말고 “확인 필요”라고 표시한다.
- 계약 조항은 반드시 “초안”으로 표현한다.
- 법률 자문처럼 단정하지 않는다.
- 한국의 웹 제작 프리랜서 실무에서 자연스럽게 쓰는 문체로 작성한다.
- 고객에게 보낼 이메일은 너무 장황하지 않게 작성한다.
- 추가 비용이 발생할 수 있는 조건을 명확히 적는다.
- 결과물은 고객에게 바로 복사해서 보낼 수 있을 정도로 정돈된 형태여야 한다.`;

export function extractResponseText(response: unknown) {
  if (
    response &&
    typeof response === "object" &&
    "output_text" in response &&
    typeof response.output_text === "string"
  ) {
    return response.output_text;
  }

  const output = response && typeof response === "object" && "output" in response ? response.output : null;

  if (!Array.isArray(output)) {
    return "";
  }

  return output
    .flatMap((item) => {
      if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) {
        return [];
      }

      return (item.content as unknown[])
        .map((content: unknown) => {
          if (!content || typeof content !== "object") {
            return "";
          }

          if ("text" in content && typeof content.text === "string") {
            return content.text;
          }

          return "";
        })
        .filter(Boolean);
    })
    .join("\n\n");
}

export function parseGenerationSections(markdown: string): GenerationSections {
  const defaults: GenerationSections = {
    requestSummary: "",
    estimateDraft: "",
    proposalDraft: "",
    contractTermsDraft: "",
    customerEmail: "",
    checklist: "",
  };

  const headingPattern = /^#\s*(\d+)\.\s*(.+)$/gm;
  const matches = [...markdown.matchAll(headingPattern)];

  if (!matches.length) {
    return {
      ...defaults,
      requestSummary: markdown,
    };
  }

  matches.forEach((match, index) => {
    const title = match[2]?.trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    const content = markdown.slice(start, end).trim();
    const section = GENERATION_SECTION_LABELS.find(([, label]) => title === label);

    if (section) {
      defaults[section[0]] = content;
    }
  });

  return defaults;
}
