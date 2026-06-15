export async function getPenalties(articleId: string): Promise<object> {
  const penaltyMap: Record<string, object> = {
    '중대재해처벌법 제9조': { imprisonment: '1년 이상', fine: '10억원 이하', type: '형사처벌' },
    '산업안전보건법 제38조': { fine: '5천만원 이하', type: '행정처벌' },
  };
  return penaltyMap[articleId] ?? { articleId, penalties: '해당 조문의 처벌 규정을 직접 확인하십시오.' };
}
