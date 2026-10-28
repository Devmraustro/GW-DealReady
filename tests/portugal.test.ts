import { describe, expect, it } from 'vitest';
import { marketProperties, seedDeals } from '@/lib/portugal/data';
import { defaultDocuments, filterMarketProperties, readiness, readinessRules, toCSV, validateDemoFile, validateInquiry, validISODate } from '@/lib/portugal/logic';
import { messages } from '@/lib/portugal/messages';

describe('Portugal sample inventory', () => {
  it('is uniquely identified and contains separate transaction types', () => {
    expect(new Set(marketProperties.map((p) => p.id)).size).toBe(marketProperties.length);
    expect(new Set(marketProperties.map((p) => p.slug)).size).toBe(marketProperties.length);
    expect(new Set(marketProperties.map((p) => p.transaction))).toEqual(new Set(['mid','long','sale']));
  });
  it('filters mid-term homes by location, price, type and dimensions', () => {
    const result = filterMarketProperties(marketProperties, {q:'lisboa',transaction:'mid',type:'apartment',min:'1000',max:'2000',bedrooms:'2',bathrooms:'2',minArea:'100',maxArea:'110'});
    expect(result.map((p) => p.id)).toEqual(['pt-1']);
  });
  it('filters district and title keywords without case sensitivity', () => expect(filterMarketProperties(marketProperties,{q:'RIBEIRA'}).map((p)=>p.id)).toEqual(['pt-3']));
  it('sorts a copy by price and does not mutate the source', () => {
    const original = marketProperties.map((p)=>p.id);
    const result = filterMarketProperties(marketProperties,{sort:'price_asc'});
    expect(result[0].price).toBe(1450);
    expect(marketProperties.map((p)=>p.id)).toEqual(original);
  });
  it('returns an empty list for unmatched filters', () => expect(filterMarketProperties(marketProperties,{q:'no-match'})).toEqual([]));
});

describe('explainable readiness', () => {
  it('uses equal visible rules and only accepted documents count', () => {
    const deal = structuredClone(seedDeals[0]);
    expect(readinessRules(deal)).toHaveLength(6);
    expect(readiness(deal)).toBe(50);
    deal.documents[1].status = 'accepted';
    expect(readiness(deal)).toBe(67);
    deal.discrepancy!.resolved = true;
    expect(readiness(deal)).toBe(83);
    deal.documents[2].status = 'accepted';
    expect(readiness(deal)).toBe(100);
  });
  it('does not count uploaded, requested, or rejected documents as accepted', () => {
    for (const status of ['requested','needs_review','rejected'] as const) {
      const deal = structuredClone(seedDeals[0]); deal.documents[0].status = status;
      expect(readiness(deal)).toBe(33);
    }
  });
  it('responds to missing profile and property fields', () => {
    const deal = structuredClone(seedDeals[1]); deal.email=''; deal.propertyId='';
    expect(readiness(deal)).toBe(67);
  });
  it('defaults to requested synthetic checklist items', () => expect(defaultDocuments().every((d)=>d.required && d.status==='requested')).toBe(true));
});

describe('demo boundaries and validation', () => {
  it('accepts only PDF/JPEG/PNG files up to 5 MB', () => {
    expect(validateDemoFile({name:'sample.pdf',type:'application/pdf',size:100})).toBeNull();
    expect(validateDemoFile({name:'sample.jpg',type:'image/jpeg',size:5*1024*1024})).toBeNull();
    expect(validateDemoFile({name:'sample.png',type:'image/png',size:5*1024*1024+1})).toBe('invalidFileSize');
    expect(validateDemoFile({name:'empty.pdf',type:'application/pdf',size:0})).toBe('invalidFileSize');
    expect(validateDemoFile({name:'sample.exe',type:'application/octet-stream',size:100})).toBe('invalidFileType');
  });
  it('rejects invalid dates and inquiry fields', () => {
    expect(validISODate('2026-02-30')).toBe(false);
    expect(validISODate('2028-02-29')).toBe(true);
    const data = {name:'Alex Demo',email:'alex@example.test',origin:'France',arrival:'2026-11-15',propertyId:'pt-1'};
    expect(validateInquiry(data)).toBe(true);
    expect(validateInquiry({...data,email:'bad'})).toBe(false);
    expect(validateInquiry({...data,arrival:'2026-99-99'})).toBe(false);
    expect(validateInquiry({...data,propertyId:''})).toBe(false);
  });
  it('escapes CSV quotes and spreadsheet formula prefixes', () => {
    expect(toCSV([['a"b','=1+2','  @cmd','normal']])).toBe('"a""b","\'=1+2","\'  @cmd","normal"');
  });
  it('supplies non-empty PT/EN/FR/AR text for every UI key', () => {
    for (const values of Object.values(messages)) { expect(values).toHaveLength(4); values.forEach((value)=>expect(value.trim().length).toBeGreaterThan(0)); }
  });
});
