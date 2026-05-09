# 작업 요약

## 현재 구현된 주요 기능

```txt
랜딩페이지                 /
의뢰 입력폼                 /form
AI 생성 결과 페이지          /result
무료 샘플 페이지             /sample
베타 신청/수동 결제 안내      /checkout
결제 성공 페이지             /payment/success
결제 실패 페이지             /payment/fail
OpenAI 문서 생성 API         /api/generate-documents
레거시 주문 생성 API          /api/orders/create (현재 비활성화)
레거시 결제 승인 API          /api/payments/confirm (현재 비활성화)
레거시 주문 상태 확인 API      /api/orders/verify (현재 자동 검증 미사용)
```

## 현재 문서 생성 흐름

```txt
1. 사용자가 /form에서 의뢰 정보를 입력한다.
2. /api/generate-documents가 OpenAI API를 서버에서 호출한다.
3. 응답 JSON을 localStorage.generatedDocuments에 저장한다.
4. /result에서 결과를 카드 형태로 표시한다.
5. 각 카드의 복사하기 버튼으로 문서를 복사할 수 있다.
```

## 확인 완료

```txt
TypeScript 체크 성공
Next.js 빌드 성공
OPENAI_API_KEY 누락 시 서버 일반 오류 반환 확인
필수 입력값 누락 시 400 반환 확인
/form 화면 표시 확인
/result 빈 상태 안내 확인
```

## 다음 작업 후보

```txt
.env.local 직접 생성
OpenAI API 키 입력 후 실제 문서 생성 테스트
수동 입금 안내 문구와 실제 계좌 정보 입력
PG 결제 재도입 시 Toss 테스트 결제 전체 흐름 테스트
Supabase 스키마 적용
결제 완료 사용자만 전체 생성 가능하도록 정책 최종 결정
```

## 2026-05-09 최종 점검 메모

```txt
/checkout은 수동 신청/송금 안내 화면으로 유지
Toss 결제위젯 및 checkout SDK 호출 없음
/api/payments/confirm은 Toss confirm API를 호출하지 않도록 비활성화
/api/orders/create, /api/orders/verify, /api/generate는 레거시 확장용으로만 남기고 안전 응답 처리
.vercelignore 추가로 .env.local과 로그 파일 배포 제외
TypeScript 체크와 Next build 통과
Vercel 배포는 프로젝트 연결/CLI 단계가 필요해 로컬에서 완료되지 않음
```
