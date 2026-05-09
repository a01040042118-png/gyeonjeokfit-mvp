export {
  DEFAULT_BASE_URL,
  ORDER_NAME,
  PRODUCT_CURRENCY,
  PRODUCT_NAME,
  PRODUCT_PRICE,
} from "./constants";

export const PRODUCT_INCLUDES = [
  "견적서 초안 생성",
  "제안서 초안 생성",
  "작업 범위/제외 범위 정리",
  "계약 핵심 조항 초안 생성",
  "후속메일 초안 생성",
  "보내기 전 체크리스트",
  "베타 구매자 1회 맞춤 수정",
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}
