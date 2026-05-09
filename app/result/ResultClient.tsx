"use client";

import { useEffect, useState } from "react";
import {
  DOCUMENT_SECTIONS,
  DOCUMENT_STORAGE_KEY,
  GeneratedDocuments,
  emptyGeneratedDocuments,
} from "@/lib/documents";

function parseStoredDocuments(value: string | null): GeneratedDocuments | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<GeneratedDocuments>;
    const fallback = emptyGeneratedDocuments();

    for (const key of Object.keys(fallback) as Array<keyof GeneratedDocuments>) {
      if (typeof parsed[key] !== "string") {
        return null;
      }
    }

    return parsed as GeneratedDocuments;
  } catch {
    return null;
  }
}

export default function ResultClient() {
  const [documents, setDocuments] = useState<GeneratedDocuments | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copiedKey, setCopiedKey] = useState<keyof GeneratedDocuments | null>(null);

  useEffect(() => {
    setDocuments(parseStoredDocuments(window.localStorage.getItem(DOCUMENT_STORAGE_KEY)));
    setIsLoaded(true);
  }, []);

  async function copyText(key: keyof GeneratedDocuments, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1400);
  }

  if (!isLoaded) {
    return (
      <main className="result-page">
        <section className="result-shell">
          <p className="eyebrow">Generated Draft</p>
          <h1>생성 결과를 불러오는 중입니다.</h1>
        </section>
      </main>
    );
  }

  if (!documents) {
    return (
      <main className="result-page">
        <section className="result-shell">
          <p className="eyebrow">Generated Draft</p>
          <h1>생성 결과가 없습니다.</h1>
          <p>입력폼에서 문서를 생성하면 이곳에 결과가 표시됩니다.</p>
          <div className="result-actions">
            <a className="primary-button" href="/form">
              입력폼으로 돌아가기
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="result-page">
      <section className="result-shell">
        <p className="eyebrow">Generated Draft</p>
        <h1>문서 초안이 생성되었습니다.</h1>
        <p>
          아래 결과물은 견적핏이 생성한 실무 문서 초안입니다. 고객에게 보내기 전
          금액, 일정, 사업자 정보, 계좌 정보, 계약 조건을 반드시 확인하세요.
        </p>

        <div className="result-sections">
          {DOCUMENT_SECTIONS.map((section, index) => (
            <article className="generated-section" key={section.key}>
              <div className="generated-section-header">
                <h2>
                  {index + 1}. {section.title}
                </h2>
                <button
                  className="copy-button"
                  type="button"
                  onClick={() => copyText(section.key, documents[section.key])}
                >
                  {copiedKey === section.key ? "복사되었습니다" : "복사하기"}
                </button>
              </div>
              <pre>{documents[section.key]}</pre>
            </article>
          ))}
        </div>

        <div className="payment-warning result-warning">
          이 문서를 반복해서 생성하고, PDF 저장과 문서 이력 관리까지 사용하려면 베타
          키트를 구매하세요.
        </div>

        <div className="result-actions">
          <a className="secondary-button" href="/form">
            다른 의뢰로 다시 생성하기
          </a>
          <a className="primary-button" href="/checkout">
            베타 신청하기
          </a>
          <a className="secondary-button" href="/sample">
            무료 샘플 보기
          </a>
        </div>
      </section>
    </main>
  );
}
