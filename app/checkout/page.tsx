import { formatPrice } from "@/lib/payment";
import { PRODUCT_PRICE } from "@/lib/constants";

const REGULAR_PRICE = 69000;

const INCLUDED_ITEMS = [
  "견적서 초안 생성",
  "제안서 초안 생성",
  "계약 핵심 조항 초안",
  "고객 이메일 초안",
  "보내기 전 체크리스트",
  "베타 기간 1회 맞춤 수정",
];

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
            현재 베타 기간에는 자동 결제 대신 수동 입금 방식으로 신청을 받습니다.
            입금 후 입력폼을 작성해 주시면, 입력 내용을 기준으로 견적서·제안서·계약
            핵심 조항 초안을 생성할 수 있습니다.
          </p>
        </div>

        <div className="checkout-layout">
          <aside className="checkout-summary">
            <span className="checkout-label">상품명</span>
            <h2>견적핏 베타 키트</h2>
            <div className="manual-price-box">
              <span>베타 이용 금액</span>
              <strong>{formatPrice(PRODUCT_PRICE)}원</strong>
              <del>정상가 {formatPrice(REGULAR_PRICE)}원</del>
            </div>

            <div className="checkout-includes">
              <span>제공 내용</span>
              <ul>
                {INCLUDED_ITEMS.map((item) => (
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
            </div>
          </aside>

          <section className="checkout-widget-card" id="manual-apply">
            <div className="manual-payment-panel">
              <p className="eyebrow">Manual Payment</p>
              <h2>수동 입금 안내</h2>
              <p className="manual-payment-lead">
                현재 베타 기간에는 계좌이체 방식으로 신청을 받습니다.
              </p>
              <p>
                아래 입금 정보를 확인한 뒤 송금해 주세요. 카카오페이 송금은 아직 링크가
                없어 필요한 경우 개별 안내로 진행합니다.
              </p>

              <dl className="manual-payment-list">
                <div>
                  <dt>입금 금액</dt>
                  <dd>{formatPrice(PRODUCT_PRICE)}원</dd>
                </div>
                <div>
                  <dt>은행명</dt>
                  <dd>카카오뱅크</dd>
                </div>
                <div>
                  <dt>계좌번호</dt>
                  <dd>3333 29 9421125</dd>
                </div>
                <div>
                  <dt>예금주</dt>
                  <dd>입력 예정</dd>
                </div>
                <div>
                  <dt>카카오페이 송금</dt>
                  <dd>카카오페이 송금은 개별 안내</dd>
                </div>
                <div>
                  <dt>입금자명</dt>
                  <dd>입금자명은 신청자 이름 또는 이메일과 동일하게 입력해 주세요.</dd>
                </div>
              </dl>

              <div className="checkout-alert">
                입금 후 입력폼을 작성하면 운영자가 신청 내역과 입금 내역을 확인합니다.
                현재는 PG 자동 결제가 아닌 수동 입금 방식입니다. 정식 카드 결제는 추후
                지원 예정입니다.
              </div>

              <div className="manual-apply-actions">
                <a className="primary-button manual-apply-button" href="/form">
                  입금 후 입력폼 작성하기
                </a>
                <a className="secondary-button" href="/sample">
                  무료 샘플 보기
                </a>
              </div>

              <p className="pg-note">
                현재는 PG 자동 결제가 아닌 수동 입금 방식입니다. 정식 카드 결제는 추후
                지원 예정입니다.
              </p>
            </div>

            <div className="checkout-refund">
              <span>환불 안내</span>
              <p>
                입력폼 작성 및 결과물 생성 후에는 단순 변심 환불이 어려울 수 있습니다.
                입금 전 상품 구성과 제공 내용을 꼭 확인해 주세요.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
