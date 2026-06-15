export async function getPenalties(articleId: string): Promise<object> {
  const penaltyMap: Record<string, object> = {
    // 중대재해처벌법
    '중대재해처벌법 제6조': {
      type: '형사처벌', target: '사업주·경영책임자',
      imprisonment: '1년 이상', fine: '10억원 이하',
      note: '사망 시 징역 1년 이상 또는 10억원 이하 벌금; 부상·질병 시 7년 이하 또는 1억원 이하',
    },
    '중대재해처벌법 제7조': {
      type: '형사처벌', target: '사업주·경영책임자 (반복)',
      note: '동일 장소 5년 내 재발 시 형의 2배 가중',
    },
    '중대재해처벌법 제9조': {
      type: '양벌규정', target: '법인·기관',
      fine: '사망 50억원 이하 / 부상·질병 10억원 이하',
    },
    // 산업안전보건법 형사처벌
    '산업안전보건법 제167조': {
      type: '형사처벌',
      imprisonment: '7년 이하', fine: '1억원 이하',
      note: '제38·39조(안전·보건조치) 위반으로 사망 산업재해 발생; 반복 시 2배 가중',
    },
    '산업안전보건법 제168조': {
      type: '형사처벌',
      imprisonment: '5년 이하', fine: '5천만원 이하',
      note: '제38·39조(안전·보건조치) 의무 위반 (사망 미발생)',
    },
    '산업안전보건법 제169조': {
      type: '형사처벌',
      imprisonment: '3년 이하', fine: '3천만원 이하',
      note: '제80조(도급 시 산업재해 예방) 등 위반',
    },
    '산업안전보건법 제170조': {
      type: '형사처벌',
      imprisonment: '1년 이하', fine: '1천만원 이하',
    },
    // 산업안전보건법 행정처벌(과태료)
    '산업안전보건법 제38조': {
      type: '행정처벌(과태료)', fine: '5천만원 이하',
      note: '안전조치 미이행 — 제175조 별표 35 기준 부과',
    },
    '산업안전보건법 제29조': {
      type: '행정처벌(과태료)', fine: '500만원 이하',
      note: '근로자 안전보건교육 미실시',
    },
    '산업안전보건법 제36조': {
      type: '행정처벌(과태료)', fine: '500만원 이하',
      note: '위험성평가 미실시',
    },
  };

  const result = penaltyMap[articleId];
  if (result) return { articleId, ...result };
  return {
    articleId,
    type: '미등록',
    note: `'${articleId}'은(는) 내장 처벌 테이블에 없습니다. 산안법 제175조(과태료) 또는 법령 원문을 직접 확인하세요.`,
  };
}
