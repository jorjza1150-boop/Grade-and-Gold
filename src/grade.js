export const criteria = [
  { grade: 'A', min: 80, label: 'ดีเยี่ยม' },
  { grade: 'B+', min: 75, label: 'ดีมาก' },
  { grade: 'B', min: 70, label: 'ดี' },
  { grade: 'C+', min: 65, label: 'ค่อนข้างดี' },
  { grade: 'C', min: 60, label: 'พอใช้' },
  { grade: 'D+', min: 55, label: 'อ่อน' },
  { grade: 'D', min: 50, label: 'อ่อนมาก' },
  { grade: 'F', min: 0, label: 'ไม่ผ่าน' },
];
export function calculateGrade(input) {
  if (input === null || input === undefined || String(input).trim() === '') throw new Error('กรุณากรอกคะแนน');
  const score = Number(input);
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error('กรุณากรอกคะแนนตั้งแต่ 0 ถึง 100');
  return { score, ...criteria.find(item => score >= item.min) };
}
