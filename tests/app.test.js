import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateGrade } from '../src/grade.js';
import { normalizeGold } from '../server/gold.js';
test('grade boundaries and decimal scores', () => {
  for (const [score, grade] of [[0,'F'],[49.99,'F'],[50,'D'],[55,'D+'],[60,'C'],[65,'C+'],[70,'B'],[75,'B+'],[79.99,'B+'],[80,'A'],[100,'A']]) assert.equal(calculateGrade(score).grade,grade);
});
test('reject empty and invalid scores', () => {
  for (const score of ['', ' ', null, undefined, -1, 101, NaN, Infinity, 'abc']) assert.throws(() => calculateGrade(score));
});
test('parse upstream prices and reject incomplete data', () => {
  const data = { status:'success', response:{update_date:'02/02/2569',update_time:'17:23',price:{gold_bar:{buy:'70,950.00',sell:'71,150.00'},gold:{buy:'69,523.76',sell:'71,950.00'}}} };
  assert.equal(normalizeGold(data).goldBar.buy,70950);
  assert.equal(normalizeGold(data).jewelry.buy,69523.76);
  assert.throws(() => normalizeGold({}));
  data.response.price.gold.buy = '';
  assert.throws(() => normalizeGold(data));
});
