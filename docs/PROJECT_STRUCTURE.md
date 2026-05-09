# 견적핏 MVP 프로젝트 정리

이 파일은 현재 Next.js App Router 기반 견적핏 MVP의 폴더와 파일 역할을 한눈에 보기 위한 정리 문서입니다.

## 루트 파일

```txt
package.json          의존성, 실행 스크립트 정의
pnpm-lock.yaml        pnpm 의존성 잠금 파일
tsconfig.json         TypeScript 설정
next.config.ts        Next.js 설정
next-env.d.ts         Next.js 타입 선언
README.md            실행 방법과 환경변수 안내
.env.example         환경변수 placeholder 예시
.gitignore           Git 제외 파일 설정
docs/PROJECT_STRUCTURE.md 현재 프로젝트 구조 정리 문서
```

## 주요 폴더 구조

```txt
app/
  page.tsx
  layout.tsx
  globals.css

  form/
    page.tsx
    FormClient.tsx

  result/
    page.tsx
    ResultClient.tsx

  sample/
    page.tsx

  checkout/
    page.tsx

  payment/
    success/
      page.tsx
      PaymentSuccessClient.tsx
    fail/
      page.tsx

  api/
    generate-documents/
      route.ts
    generate/
      route.ts
    orders/
      create/
        route.ts
      verify/
        route.ts
    payments/
      confirm/
        route.ts

lib/
  constants.ts
  documents.ts
  payment.ts
  generation.ts
  supabase/
    server.ts

docs/
  PROJECT_STRUCTURE.md
  supabase-schema.sql

reports/
  WORK_SUMMARY.md

archive/
  README.md
```

## 페이지 역할

```txt
/                      랜딩페이지
/form                  웹 제작 의뢰 입력폼
/result                생성된 문서 결과 표시 페이지
/sample                무료 샘플 안내 페이지
/checkout              베타 신청/수동 결제 안내 페이지
/payment/success       향후 PG 결제 성공 안내용 보류 페이지
/payment/fail          향후 PG 결제 실패 안내용 보류 페이지
```

## API 라우트 역할

```txt
POST /api/generate-documents
  /form 입력값을 받아 OpenAI API로 문서를 생성한다.
  응답은 summary, estimate, proposal, contractTerms, emailDraft, checklist JSON이다.

POST /api/generate
  현재 비활성화되어 있다.
  수동 결제 단계의 기본 /form 흐름은 /api/generate-documents를 사용한다.

POST /api/orders/create
  현재 비활성화되어 있다.
  정식 PG 결제 재활성화 시 주문번호 생성과 orders 저장 로직을 다시 연결한다.

GET /api/orders/verify
  현재 자동 결제 검증을 사용하지 않아 paid false를 반환한다.

POST /api/payments/confirm
  현재 비활성화되어 있다.
  정식 PG 결제 재활성화 전까지 Toss 승인 API를 호출하지 않는다.
```

## 핵심 라이브러리 파일

```txt
lib/constants.ts
  상품명, 가격, 통화, 기본 URL 같은 공통 상수

lib/documents.ts
  /api/generate-documents와 /result가 공유하는 문서 타입과 섹션 정의

lib/payment.ts
  결제 페이지에서 쓰는 상품 포함 내용, 가격 포맷 등 결제 관련 유틸

lib/generation.ts
  Supabase 저장형 AI 생성 흐름에서 쓰는 프롬프트와 결과 파싱 유틸

lib/supabase/server.ts
  서버 전용 Supabase service role 클라이언트 생성 파일
```

## 환경변수

`.env.local`은 직접 만들어야 하며 Git에 커밋하면 안 됩니다.

```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_or_secret_key_here
```

토스 결제는 현재 보류 상태입니다. 정식 출시 후 PG 결제를 다시 켤 경우 아래 값도 필요합니다.

```env
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key_here
TOSS_SECRET_KEY=your_toss_secret_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 현재 주요 흐름

```txt
1. 사용자가 /form에서 의뢰 정보를 입력한다.
2. 클라이언트가 POST /api/generate-documents를 호출한다.
3. 서버가 OpenAI API로 문서 JSON을 생성한다.
4. 클라이언트가 응답을 localStorage.generatedDocuments에 저장한다.
5. /result에서 저장된 문서를 카드 형태로 보여준다.
6. 각 문서 섹션은 복사하기 버튼으로 복사할 수 있다.
```

## 보안 메모

```txt
OPENAI_API_KEY               서버 API route에서만 사용
SUPABASE_SERVICE_ROLE_KEY    서버 전용 Supabase 클라이언트에서만 사용
TOSS_SECRET_KEY              현재 기능에서는 사용하지 않음. 정식 PG 재개 시 서버에서만 사용
NEXT_PUBLIC_*                브라우저 노출 가능한 값만 사용
```

실제 키 값은 코드, README, 주석, 예시 파일에 넣지 않습니다.
