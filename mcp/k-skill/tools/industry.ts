import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { createLogger } from '../../shared/logger.js';

const log = createLogger('k_skill');
const cache = new MCPCache();

const INDUSTRY_CONTROLS: Record<string, string[]> = {
  manufacturing: ['안전보건관리체계 구축', '위험성평가 실시', '안전교육 실시', 'PSM 적용 (유해위험물질 취급 시)'],
  construction:  ['추락방지 조치', '굴착작업 안전기준', '전기작업 안전조치', '중장비 운행 안전기준'],
  chemical:      ['MSDS 비치', '화학물질 취급기준', '누출 방지설비', '방호복 착용기준'],
  default:       ['안전보건관리규정 작성', '안전보건위원회 구성', '위험성평가 실시'],
};

export async function listIndustryControls(industry: string): Promise<object> {
  const key = `industry:controls:${industry}`;
  const cached = await cache.get(key);
  if (cached) return cached;

  const controls = INDUSTRY_CONTROLS[industry] ?? INDUSTRY_CONTROLS['default'];
  const result = { industry, controls, source: '산업안전보건법 (OSHA-KR)' };
  await cache.set(key, result, 86_400);
  return result;
}
