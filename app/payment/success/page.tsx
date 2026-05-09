export default function PaymentSuccessPage() {
  return (
    <main className="payment-page">
      <section className="payment-shell">
        <p className="eyebrow">Manual Application</p>
        <h1>베타 신청 안내</h1>
        <p>
          현재 베타 기간에는 자동 PG 결제를 사용하지 않고, 계좌이체 또는 카카오페이
          송금으로 신청을 받습니다. 송금 안내를 확인한 뒤 입력폼을 작성해주세요.
        </p>

        <div className="payment-result-card">
          <div className="payment-warning">
            견적핏이 생성한 문서는 법률 자문이 아닌 실무 문서 초안입니다. 고객에게
            보내기 전 금액, 일정, 사업자 정보, 계좌 정보, 계약 조건을 반드시 확인하세요.
          </div>

          <div className="result-actions">
            <a className="primary-button" href="/form">
              입력폼 작성하기
            </a>
            <a className="secondary-button" href="/checkout">
              신청 안내 다시 보기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
