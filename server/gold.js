export const GOLD_SOURCE = 'https://api.chnwt.dev/thai-gold-api/latest';
export function normalizeGold(data) {
  const result = data?.response;
  if (data?.status !== 'success' || !result?.update_date || !result?.update_time) throw new Error('รูปแบบข้อมูลราคาทองไม่ถูกต้อง');
  const parse = value => {
    if (value === null || value === undefined || String(value).trim() === '') throw new Error('ไม่พบราคาทอง');
    const price = Number(String(value).replaceAll(',', ''));
    if (!Number.isFinite(price) || price <= 0) throw new Error('ราคาทองไม่ถูกต้อง');
    return price;
  };
  return {
    updatedDate: result.update_date, updatedTime: result.update_time,
    goldBar: { buy: parse(result.price?.gold_bar?.buy), sell: parse(result.price?.gold_bar?.sell) },
    jewelry: { buy: parse(result.price?.gold?.buy), sell: parse(result.price?.gold?.sell) },
    source: GOLD_SOURCE,
  };
}
