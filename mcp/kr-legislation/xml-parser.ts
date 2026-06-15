import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  parseTagValue: true,
  trimValues: true,
});

export function parseXML(xmlText: string): unknown {
  try {
    return parser.parse(xmlText);
  } catch {
    return null;
  }
}

export function decodeKoreanText(text: string): string {
  try {
    return Buffer.from(text, 'utf-8').toString('utf-8');
  } catch {
    try {
      return Buffer.from(text, 'latin1').toString('utf-8');
    } catch {
      return text;
    }
  }
}
