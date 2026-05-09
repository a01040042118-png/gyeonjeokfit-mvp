export default function SamplePage() {
  return (
    <main className="sample-page">
      <section className="sample-free-shell">
        <a className="back-link" href="/">
          랜딩페이지로 돌아가기
        </a>
        <p className="eyebrow">Free Sample</p>
        <h1>무료 샘플 페이지</h1>
        <p>
          구매 전 견적핏이 만드는 문서 흐름을 가볍게 확인하는 페이지입니다. 다음 단계에서
          제한된 입력값으로 샘플 견적서와 제안서 일부를 생성하도록 확장할 수 있습니다.
        </p>

        <div className="sample-document">
          <div className="document-meta">
            <span>샘플</span>
            <span>무료 미리보기</span>
          </div>
          <h2>브랜드 웹사이트 제작 제안 샘플</h2>
          <p>
            의뢰 업종, 페이지 수, 기능 범위를 기준으로 예상 견적과 제안 방향, 작업 범위,
            제외 범위, 계약 핵심 조항 초안을 정리합니다.
          </p>
          <div className="result-actions">
            <a className="secondary-button" href="/checkout">
              베타 키트 구매하기
            </a>
            <a className="primary-button" href="/form">
              입력폼 작성하기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
