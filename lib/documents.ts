export type GenerateDocumentsRequest = {
  serviceType: string;
  clientIndustry: string;
  requestText: string;
  pageCount: string;
  requiredFeatures: string[];
  budget: string;
  timeline: string;
  includedScope: string;
  excludedScope: string;
  revisionCount: string;
  paymentTerms: string;
  tone: string;
};

export type GeneratedDocuments = {
  summary: string;
  estimate: string;
  proposal: string;
  contractTerms: string;
  emailDraft: string;
  checklist: string;
};

export const DOCUMENT_STORAGE_KEY = "generatedDocuments";

export const DOCUMENT_SECTIONS: Array<{
  key: keyof GeneratedDocuments;
  title: string;
}> = [
  { key: "summary", title: "의뢰 요약" },
  { key: "estimate", title: "견적서 초안" },
  { key: "proposal", title: "제안서 초안" },
  { key: "contractTerms", title: "계약 핵심 조항 초안" },
  { key: "emailDraft", title: "고객에게 보낼 이메일 초안" },
  { key: "checklist", title: "보내기 전 체크리스트" },
];

export function emptyGeneratedDocuments(): GeneratedDocuments {
  return {
    summary: "",
    estimate: "",
    proposal: "",
    contractTerms: "",
    emailDraft: "",
    checklist: "",
  };
}
