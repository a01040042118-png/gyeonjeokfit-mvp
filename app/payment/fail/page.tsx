type PaymentFailPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function one(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function PaymentFailPage({ searchParams }: PaymentFailPageProps) {
  const params = await searchParams;
  const code = one(params.code) ?? "MANUAL_APPLICATION";
  const message =
    one(params.message) ??
    "현재 베타 신청은 자동 PG 결제가 아니라 계좌이체 또는 카카오페이 송금으로 진행됩니다.";
  const orderId = one(params.orderId);

  return (
    <main className="payment-page">
      <section className="payment-shell">
        <p className="eyebrow">Manual Application</p>
        <h1>신청이 완료되지 않았습니다</h1>
        <p>아래 내용을 확인한 뒤 베타 신청 안내 페이지에서 다시 진행해주세요.</p>

        <div className="payment-result-card">
          <dl className="summary-list">
            <div>
              <dt>상태 코드</dt>
              <dd>{code}</dd>
            </div>
            <div>
              <dt>안내 메시지</dt>
              <dd>{message}</dd>
            </div>
            {orderId ? (
              <div>
                <dt>주문번호</dt>
                <dd>{orderId}</dd>
              </div>
            ) : null}
          </dl>

          <div className="result-actions">
            <a className="primary-button" href="/checkout">
              신청 안내로 돌아가기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
