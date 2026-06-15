export async function getComplianceGuide(topic: string): Promise<object> {
  return {
    topic,
    steps: [
      '1. 위험성평가 실시 (산업안전보건법 제36조)',
      '2. 안전보건관리체계 구축 (중대재해처벌법 제4조)',
      '3. 안전보건교육 실시 (산업안전보건법 제29조)',
      '4. 정기 자체감사 시행',
    ],
    legalBasis: ['산업안전보건법', '중대재해처벌법'],
    source: '고용노동부 가이드라인',
  };
}
