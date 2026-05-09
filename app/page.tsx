const painPoints = [
  "문의가 들어올 때마다 견적 기준을 다시 정리해야 합니다.",
  "제안서와 계약서 초안이 매번 달라져 신뢰감이 흔들립니다.",
  "작업 범위가 흐릿하면 수정 요청과 추가 비용 협의가 늦어집니다.",
];

const steps = [
  {
    title: "의뢰 정보 입력",
    description: "업종, 페이지 수, 필요한 기능, 예산, 일정을 한 번에 수집합니다.",
  },
  {
    title: "견적 자동 계산",
    description: "페이지 규모와 기능 범위에 따라 기본 견적과 옵션 금액을 정리합니다.",
  },
  {
    title: "문서 초안 생성",
    description: "견적서, 제안서, 계약 초안, 작업 범위 정의서를 바로 검토합니다.",
  },
];

const faqs = [
  {
    question: "베타 버전에는 무엇이 포함되나요?",
    answer:
      "랜딩페이지, 의뢰 입력폼, 결과물 생성 화면, 관리자 기록 화면 설계에 맞춘 MVP 키트가 포함됩니다.",
  },
  {
    question: "계약서는 바로 사용해도 되나요?",
    answer:
      "실무 초안으로 사용할 수 있지만 법률 자문은 아닙니다. 실제 계약 전 프로젝트 상황에 맞게 검토하는 것을 권장합니다.",
  },
  {
    question: "가격 기준은 수정할 수 있나요?",
    answer:
      "네. 페이지 수, 기능 옵션, 디자인 수준, 긴급 일정 가중치 같은 기준을 프리랜서의 단가에 맞게 바꿀 수 있게 설계합니다.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <nav className="top-nav" aria-label="주요 메뉴">
          <a className="brand" href="/">
            WebDoc Kit
          </a>
          <a className="nav-cta" href="/checkout">
            베타 키트 구매하기
          </a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">웹 제작 프리랜서용 자동화 키트</p>
            <h1>의뢰 내용을 입력하면 견적서, 제안서, 계약 초안까지 한 번에.</h1>
            <p className="hero-description">
              반복되는 문서 작성 시간을 줄이고, 웹 제작 문의에 더 빠르고
              전문적으로 응답할 수 있는 베타 MVP입니다.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="/checkout">
                39,000원에 베타 구매하기
              </a>
              <a className="secondary-button" href="/sample">
                무료 샘플 받아보기
              </a>
            </div>
          </div>

          <div className="product-preview" aria-label="자동 생성 결과물 미리보기">
            <div className="preview-toolbar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-content">
              <div className="preview-header">
                <p>견적서 #WD-024</p>
                <strong>브랜드 웹사이트 제작</strong>
              </div>
              <div className="quote-row">
                <span>기본 페이지 5P</span>
                <strong>1,500,000원</strong>
              </div>
              <div className="quote-row">
                <span>예약 폼 + 관리자 알림</span>
                <strong>420,000원</strong>
              </div>
              <div className="quote-row">
                <span>SEO 기본 세팅</span>
                <strong>180,000원</strong>
              </div>
              <div className="total-box">
                <span>예상 총액</span>
                <strong>2,100,000원</strong>
              </div>
              <div className="document-tabs">
                <span>견적서</span>
                <span>제안서</span>
                <span>계약 초안</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section problem-section">
        <div className="section-heading">
          <p className="eyebrow">Problem</p>
          <h2>좋은 문의가 와도 문서 작업에서 속도가 떨어집니다.</h2>
        </div>
        <div className="problem-list">
          {painPoints.map((point) => (
            <article className="problem-item" key={point}>
              <span className="problem-marker" />
              <p>{point}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">How It Works</p>
          <h2>입력, 계산, 생성 흐름으로 견적 대응을 정리합니다.</h2>
        </div>
        <div className="step-grid">
          {steps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section sample-section" id="sample">
        <div className="section-heading">
          <p className="eyebrow">Sample Preview</p>
          <h2>결과물은 바로 복사하고 다듬을 수 있는 문서 형태로 제공합니다.</h2>
        </div>
        <div className="sample-layout">
          <article className="sample-document">
            <div className="document-meta">
              <span>제안서 초안</span>
              <span>자동 생성됨</span>
            </div>
            <h3>로컬 스튜디오 브랜드 사이트 제작 제안</h3>
            <p>
              이번 프로젝트는 브랜드 신뢰도를 높이는 소개 페이지와 문의 전환을
              위한 구조를 중심으로 설계합니다. 초기 제작 범위는 메인, 서비스,
              포트폴리오, 소개, 문의 페이지로 정의합니다.
            </p>
            <ul>
              <li>제작 기간: 영업일 기준 15일</li>
              <li>포함 항목: 반응형 UI, 기본 SEO, 문의 폼</li>
              <li>검수 방식: 1차 시안, 2차 수정, 최종 반영</li>
            </ul>
          </article>
          <aside className="sample-side">
            <div>
              <span>계약 초안</span>
              <strong>작업 범위와 수정 횟수 자동 정리</strong>
            </div>
            <div>
              <span>범위 정의서</span>
              <strong>포함/미포함 업무를 명확하게 분리</strong>
            </div>
            <div>
              <span>관리자 기록</span>
              <strong>고객명, 상태, 총액, 생성일을 한 화면에서 확인</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="section pricing-section">
        <div className="pricing-panel">
          <div>
            <p className="eyebrow">Beta Price</p>
            <h2>베타 판매가 39,000원</h2>
            <p>
              웹 제작 문의 대응에 필요한 문서 흐름을 먼저 검증할 수 있는 MVP
              키트입니다.
            </p>
          </div>
          <a className="primary-button" href="/checkout">
            베타 키트 구매하기
          </a>
        </div>
      </section>

      <section className="section faq-section">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>구매 전에 자주 묻는 질문입니다.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <p className="eyebrow">Start Faster</p>
        <h2>다음 웹 제작 문의부터 문서 작성 시간을 줄여보세요.</h2>
        <div className="hero-actions final-actions">
          <a className="primary-button" href="/checkout">
            견적핏 시작하기
          </a>
          <a className="secondary-button" href="/sample">
            내 의뢰 내용으로 샘플 만들기
          </a>
        </div>
      </section>
    </main>
  );
}
