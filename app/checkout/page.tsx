import { PRODUCT_INCLUDES, formatPrice } from "@/lib/payment";
import { PRODUCT_NAME, PRODUCT_PRICE } from "@/lib/constants";

const REGULAR_PRICE = 69000;

export default function CheckoutPage() {
  return (
    <main className="checkout-page">
      <section className="checkout-shell">
        <a className="back-link" href="/">
          랜딩페이지로 돌아가기
        </a>

        <div className="checkout-header">
          <p className="eyebrow">Beta Application</p>
          <h1>견적핏 베타 키트 신청</h1>
          <p>
            PG 결제 연동 전까지는 계좌이체 또는 카카오페이 송금으로 베타 신청을
            받습니다. 송금 후 입력폼에서 의뢰 내용을 작성해 문서 생성 흐름을
            테스트할 수 있습니다.
          </p>
        </div>

        <div className="checkout-layout">
          <aside className="checkout-summary">
            <span className="checkout-label">상품명</span>
            <h2>{PRODUCT_NAME}</h2>
            <div className="manual-price-box">
              <span>베타가</span>
              <strong>{formatPrice(PRODUCT_PRICE)}원</strong>
              <del>정상가 {formatPrice(REGULAR_PRICE)}원</del>
            </div>

            <div className="checkout-includes">
              <span>포함 내용</span>
              <ul>
                {PRODUCT_INCLUDES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="checkout-note">
              <p>
                견적핏은 법률 자문 서비스가 아니라 웹 제작 실무 문서 작성을 돕는
                자동화 도구입니다.
              </p>
              <p>
                생성된 계약 관련 문구는 “계약 핵심 조항 초안”이며, 고객에게 보내기 전
                금액, 일정, 사업자 정보, 계좌 정보, 계약 조건을 반드시 확인하세요.
              </p>
              <p>베타 구매자는 1회 맞춤 수정이 포함됩니다.</p>
            </div>
          </aside>

          <section className="checkout-widget-card" id="manual-apply">
            <div className="manual-payment-panel">
              <p className="eyebrow">Manual Payment</p>
              <h2>계좌이체 또는 카카오페이 송금 안내</h2>
              <p className="manual-payment-lead">
                현재 베타 기간에는 계좌이체 또는 카카오페이 송금으로 신청을 받습니다.
              </p>
              <p>
                아래 정보를 확인한 뒤 송금해주세요. 실제 계좌번호와 카카오페이 송금
                정보는 운영자가 직접 입력하면 됩니다.
              </p>

              <dl className="manual-payment-list">
                <div>
                  <dt>입금 금액</dt>
                  <dd>{formatPrice(PRODUCT_PRICE)}원</dd>
                </div>
                <div>
                  <dt>입금 계좌</dt>
                  <dd>은행명 / 계좌번호 / 예금주를 여기에 입력하세요</dd>
                </div>
                <div>
                  <dt>카카오페이 송금</dt>
                  <dd>카카오페이 송금 링크 또는 안내 문구를 여기에 입력하세요</dd>
                </div>
                <div>
                  <dt>입금자명</dt>
                  <dd>신청자 이름 또는 이메일과 동일하게 입력해주세요</dd>
                </div>
              </dl>

              <div className="checkout-alert">
                송금 후 입력폼을 작성하면 운영자가 신청 내역과 입금 내역을 확인합니다.
                자동 PG 결제는 정식 출시 이후 지원 예정입니다.
              </div>

              <div className="manual-apply-actions">
                <a className="primary-button manual-apply-button" href="/form">
                  베타 신청하기
                </a>
                <a className="secondary-button" href="/sample">
                  무료 샘플 보기
                </a>
              </div>

              <p className="pg-note">PG 결제는 정식 출시 이후 지원 예정입니다.</p>
            </div>

            <div className="checkout-refund">
              <span>환불 안내</span>
              <p>
                입력폼 링크 제공 전에는 환불이 가능하지만, 입력폼 작성 및 결과물 생성
                후에는 단순 변심 환불이 어려울 수 있습니다.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
