"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  DOCUMENT_STORAGE_KEY,
  GeneratedDocuments,
  GenerateDocumentsRequest,
} from "@/lib/documents";

const serviceTypes = [
  "브랜드 웹사이트",
  "랜딩페이지",
  "쇼핑몰",
  "예약 사이트",
  "포트폴리오 사이트",
  "블로그/CMS",
  "기타",
];

const featureOptions = [
  "반응형 디자인",
  "문의 폼",
  "예약 신청",
  "결제 연동",
  "회원가입/로그인",
  "관리자 페이지",
  "CMS/블로그",
  "SEO 기본 세팅",
  "다국어",
  "외부 API 연동",
  "기타",
];

const documentTones = [
  {
    label: "전문적",
    value: "professional",
  },
  {
    label: "친근한",
    value: "friendly",
  },
  {
    label: "간결한",
    value: "concise",
  },
  {
    label: "프리미엄",
    value: "premium",
  },
];

type FormClientProps = {
  orderId: string;
};

function formValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function selectedFeatures(formData: FormData) {
  const customFeatures = formValue(formData, "customFeatures");
  const checkedFeatures = formData
    .getAll("requiredFeatures")
    .filter((value): value is string => typeof value === "string" && value.trim() !== "")
    .filter((feature) => feature !== "기타");

  if (customFeatures) {
    checkedFeatures.push(customFeatures);
  }

  return checkedFeatures;
}

function buildPayload(formData: FormData): GenerateDocumentsRequest {
  const serviceType = formValue(formData, "serviceType");
  const customServiceType = formValue(formData, "customServiceType");
  const customFeatures = formValue(formData, "customFeatures");

  return {
    serviceType: customServiceType || serviceType,
    customServiceType,
    clientIndustry: formValue(formData, "clientIndustry"),
    requestText: formValue(formData, "requestText"),
    pageCount: formValue(formData, "pageCount"),
    requiredFeatures: selectedFeatures(formData),
    customFeatures,
    budget: formValue(formData, "budget"),
    timeline: formValue(formData, "timeline"),
    includedScope: formValue(formData, "includedScope"),
    excludedScope: formValue(formData, "excludedScope"),
    revisionCount: formValue(formData, "revisionCount"),
    paymentTerms: formValue(formData, "paymentTerms"),
    tone: formValue(formData, "tone"),
  };
}

function findMissingFields(payload: GenerateDocumentsRequest) {
  const missing = [
    ["서비스 유형", payload.serviceType],
    ["고객 요청 원문", payload.requestText],
  ]
    .filter(([, value]) => !value)
    .map(([label]) => label);

  return missing;
}

export default function FormClient({ orderId }: FormClientProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [isCustomFeatureChecked, setIsCustomFeatureChecked] = useState(false);

  const orderNotice = useMemo(() => {
    if (!orderId) {
      return {
        title: "문서 생성 준비",
        body: "입력값을 바탕으로 의뢰 요약, 견적서, 제안서, 계약 핵심 조항 초안, 이메일 초안을 생성합니다.",
      };
    }

    return {
      title: "결제 주문으로 입력 중",
      body: orderId,
    };
  }, [orderId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const payload = buildPayload(new FormData(event.currentTarget));
    const missingFields = findMissingFields(payload);

    if (missingFields.length > 0) {
      setErrorMessage(`필수값을 입력해주세요: ${missingFields.join(", ")}`);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as GeneratedDocuments | null;

      if (!response.ok || !data) {
        throw new Error("문서 생성에 실패했습니다.");
      }

      window.localStorage.setItem(DOCUMENT_STORAGE_KEY, JSON.stringify(data));
      router.push("/result");
    } catch {
      setErrorMessage("문서 생성에 실패했습니다. 다시 시도해 주세요.");
      setIsGenerating(false);
    }
  }

  return (
    <main className="form-page">
      <section className="form-shell">
        <a className="back-link" href="/">
          홈으로 돌아가기
        </a>
        <p className="eyebrow">Request Form</p>
        <h1>웹 제작 의뢰 정보를 입력하세요.</h1>
        <p>
          입력한 내용은 견적서, 제안서, 계약 핵심 조항 초안, 후속메일을 만드는
          기준값으로 사용됩니다.
        </p>

        <div className="payment-order-notice">
          <span>{orderNotice.title}</span>
          <strong>{orderNotice.body}</strong>
        </div>

        <form className="request-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field">
              서비스 유형
              <select
                name="serviceType"
                required
                value={selectedServiceType}
                onChange={(event) => setSelectedServiceType(event.target.value)}
              >
                <option value="" disabled>
                  선택하세요
                </option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            {selectedServiceType === "기타" ? (
              <label className="field">
                서비스 유형 직접 입력
                <input
                  name="customServiceType"
                  placeholder="예: 회사 홈페이지 제작"
                />
              </label>
            ) : null}

            <label className="field">
              고객 업종
              <input
                name="clientIndustry"
                placeholder="예: 로컬 스튜디오, 병원, SaaS"
              />
            </label>

            <label className="field">
              페이지 수
              <input
                name="pageCount"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="예: 5"
              />
            </label>

            <label className="field">
              예산
              <input name="budget" placeholder="예: 200만원, 100~300만원, 예산 미정" />
            </label>

            <label className="field">
              희망 일정
              <input name="timeline" placeholder="예: 4주, 3월 말까지, 일정 협의" />
            </label>

            <label className="field">
              수정 횟수
              <input name="revisionCount" placeholder="예: 2회, 3회, 협의 필요" />
            </label>
          </div>

          <label className="field field-full">
            고객 요청 원문
            <span className="field-hint">
              고객이 실제로 보낸 문의 내용을 그대로 붙여넣으면 더 정확한 문서가 생성됩니다.
            </span>
            <textarea
              name="requestText"
              placeholder="고객이 보낸 메시지나 의뢰 내용을 그대로 붙여넣으세요."
              required
            />
          </label>

          <fieldset className="field-group">
            <legend>필요한 기능</legend>
            <div className="checkbox-grid">
              {featureOptions.map((feature) => (
                <label key={feature} className="check-option">
                  <input
                    name="requiredFeatures"
                    type="checkbox"
                    value={feature}
                    onChange={
                      feature === "기타"
                        ? (event) => setIsCustomFeatureChecked(event.target.checked)
                        : undefined
                    }
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
            {isCustomFeatureChecked ? (
              <label className="field custom-feature-field">
                필요한 기능 직접 입력
                <textarea
                  name="customFeatures"
                  placeholder="예: 제품 카탈로그, 다운로드 자료실, 시공 사례 페이지, 관리자 공지 등록 기능"
                />
              </label>
            ) : null}
          </fieldset>

          <div className="form-grid">
            <label className="field field-tall">
              포함 범위
              <textarea
                name="includedScope"
                placeholder="예: 기획, 디자인, 퍼블리싱, 반응형, 기본 SEO"
              />
            </label>

            <label className="field field-tall">
              제외 범위
              <textarea
                name="excludedScope"
                placeholder="예: 로고 제작, 촬영, 서버 유지보수, 유료 플러그인 비용"
              />
            </label>
          </div>

          <div className="form-grid">
            <label className="field">
              지급 조건
              <input
                name="paymentTerms"
                placeholder="예: 착수금 50%, 완료 후 잔금 50%"
              />
            </label>

            <fieldset className="field-group tone-group">
              <legend>문서 톤</legend>
              <div className="tone-options">
                {documentTones.map((tone) => (
                  <label key={tone.value} className="radio-option">
                    <input
                      name="tone"
                      type="radio"
                      value={tone.label}
                      defaultChecked={tone.value === "professional"}
                    />
                    <span>{tone.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {errorMessage ? <p className="checkout-error">{errorMessage}</p> : null}

          <div className="form-actions">
            <a className="secondary-button" href="/">
              취소
            </a>
            <button className="primary-button" type="submit" disabled={isGenerating}>
              {isGenerating ? "문서 생성 중..." : "문서 생성하기"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
