import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { createLogger } from '../../shared/logger.js';
import { getAdmruleDir } from '../git-sync.js';

const log = createLogger('legalize_kr');

interface AdmruleResult {
  name: string;
  agency: string;
  ruleType: string;
  path: string;
  excerpt?: string;
}

/**
 * 행정규칙 저장소에서 키워드로 검색한다.
 * @param keyword  검색어 (규칙명 또는 본문 내용)
 * @param agency   기관명 (기본값: '고용노동부')
 * @param ruleType '고시'|'예규'|'훈령'|'공고' 등 — 미지정 시 전체
 */
export async function searchAdmrule(
  keyword: string,
  agency = '고용노동부',
  ruleType?: string,
): Promise<AdmruleResult[]> {
  const baseDir = getAdmruleDir();

  if (!existsSync(baseDir)) {
    log.warn('admrule-kr repository not available');
    return [];
  }

  const agencyDir = join(baseDir, agency);
  if (!existsSync(agencyDir)) {
    log.warn(`Agency directory not found: ${agencyDir}`);
    return [];
  }

  const results: AdmruleResult[] = [];
  const keywordLower = keyword.toLowerCase();

  // Walk: agency/_본부/<ruleType>/<ruleName>/본문.md
  for (const dept of readdirSync(agencyDir)) {
    const deptDir = join(agencyDir, dept);
    const ruleTypes = ruleType ? [ruleType] : safeReaddir(deptDir);

    for (const rt of ruleTypes) {
      const rtDir = join(deptDir, rt);
      if (!existsSync(rtDir)) continue;

      for (const ruleName of safeReaddir(rtDir)) {
        // 1차: 규칙명 매칭 (경로 검색)
        if (!ruleName.toLowerCase().includes(keywordLower)) {
          // 2차: 본문.md 내용 검색 (최대 2KB)
          const bodyFile = join(rtDir, ruleName, '본문.md');
          if (!existsSync(bodyFile)) continue;
          const excerpt = readFileSync(bodyFile, 'utf-8').slice(0, 2000);
          if (!excerpt.toLowerCase().includes(keywordLower)) continue;

          results.push({
            name: ruleName,
            agency,
            ruleType: rt,
            path: `${agency}/${dept}/${rt}/${ruleName}`,
            excerpt: excerpt.slice(0, 300).replace(/\n+/g, ' ').trim(),
          });
        } else {
          results.push({
            name: ruleName,
            agency,
            ruleType: rt,
            path: `${agency}/${dept}/${rt}/${ruleName}`,
          });
        }

        if (results.length >= 20) return results;
      }
    }
  }

  return results;
}

function safeReaddir(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
