export async function interpretRegulation(articleId: string): Promise<object> {
  return {
    articleId,
    interpretation: `${articleId} 조문 해석: 사업주는 해당 조문에 따라 안전보건 조치를 이행할 의무가 있습니다.`,
    applicableScope: '5인 이상 사업장',
    source: '고용노동부 행정해석',
  };
}
