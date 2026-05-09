# 견적핏 MVP

웹 제작 프리랜서가 고객 의뢰 내용을 입력하면 의뢰 요약, 견적서 초안, 제안서 초안, 계약 핵심 조항 초안, 이메일 초안, 보내기 전 체크리스트를 생성하는 Next.js App Router MVP입니다.

## 주요 기능

- 랜딩페이지: `/`
- 의뢰 입력폼: `/form`
- 생성 결과 페이지: `/result`
- 무료 샘플 페이지: `/sample`
- 베타 신청/수동 결제 안내 페이지: `/checkout`
- OpenAI 문서 생성 API: `/api/generate-documents`

현재 `/checkout`은 Toss Payments PG 결제가 아니라 계좌이체 또는 카카오페이 송금 안내 페이지입니다. PG 결제는 정식 출시 이후 다시 연결합니다.

## 환경변수

`.env.local`은 직접 만들고 실제 키 값은 코드나 문서에 넣지 않습니다.

```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_or_secret_key_here

NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key_here
TOSS_SECRET_KEY=your_toss_secret_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

현재 MVP 필수 값은 `OPENAI_API_KEY`입니다. 배포 후에는 `NEXT_PUBLIC_BASE_URL`도 배포 URL로 설정하세요.

## 로컬 실행

```bash
npm install
npm run dev
```

현재 PC에서 `npm`이 PATH에 없다면 아래 명령으로 실행할 수 있습니다.

```powershell
node .\node_modules\next\dist\bin\next dev --port 3000
```

접속 주소:

```txt
http://localhost:3000
```

## 문서 생성 흐름

1. `/form`에서 웹 제작 의뢰 정보를 입력합니다.
2. 제출 시 `/api/generate-documents`로 POST 요청을 보냅니다.
3. 서버 API route에서만 `OPENAI_API_KEY`를 사용해 OpenAI API를 호출합니다.
4. 응답 JSON을 브라우저 `localStorage`의 `generatedDocuments` 키에 저장합니다.
5. `/result`에서 저장된 결과를 카드 형태로 보여주고 섹션별 복사를 제공합니다.

응답 구조:

```json
{
  "summary": "...",
  "estimate": "...",
  "proposal": "...",
  "contractTerms": "...",
  "emailDraft": "...",
  "checklist": "..."
}
```

## 보안 메모

- `OPENAI_API_KEY`는 서버 API route에서만 사용합니다.
- `NEXT_PUBLIC_OPENAI_API_KEY` 같은 환경변수는 만들지 않습니다.
- `.env.local`은 Git에 커밋하지 않습니다.
- 실제 API 키 값은 README, 주석, 코드에 넣지 않습니다.
- 현재 수동 결제 단계에서는 Toss 키를 기능에서 사용하지 않습니다.

## Vercel 배포 체크리스트

현재 MVP에서 필요한 환경변수:

| 환경 | 필수 값 |
| --- | --- |
| Production | `OPENAI_API_KEY`, `NEXT_PUBLIC_BASE_URL` |
| Preview | `OPENAI_API_KEY`, `NEXT_PUBLIC_BASE_URL` |
| Development | `OPENAI_API_KEY`, `NEXT_PUBLIC_BASE_URL` |

추후 Supabase 결제 검증이나 Toss Payments PG를 다시 연결할 때만 아래 값을 추가합니다.

| 용도 | 환경변수 |
| --- | --- |
| Supabase 공개 설정 | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Supabase 서버 전용 | `SUPABASE_SERVICE_ROLE_KEY` |
| Toss 클라이언트 | `NEXT_PUBLIC_TOSS_CLIENT_KEY` |
| Toss 서버 전용 | `TOSS_SECRET_KEY` |

주의:

- `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TOSS_SECRET_KEY`는 서버 전용입니다.
- `NEXT_PUBLIC_` 접두사가 붙은 값만 브라우저에 노출될 수 있습니다.
- `NEXT_PUBLIC_BASE_URL`은 배포 후 실제 Vercel URL로 바꿔야 합니다.
- Vercel 환경변수를 바꾼 뒤에는 재배포해야 합니다.
