<script setup>
import { ref, onMounted } from 'vue';
import { criteria, calculateGrade } from './grade.js';
const score = ref('');
const result = ref(null);
const gradeError = ref('');
const gold = ref(null);
const loading = ref(false);
const goldError = ref('');
function calculate() {
  result.value = null;
  gradeError.value = '';
  try { result.value = calculateGrade(score.value); } catch (error) { gradeError.value = error.message; }
}
function clearResult() { result.value = null; gradeError.value = ''; }
async function loadGold() {
  if (loading.value) return;
  loading.value = true;
  goldError.value = '';
  try {
    const response = await fetch('/api/gold', { signal: AbortSignal.timeout(15_000) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'ดึงข้อมูลไม่สำเร็จ');
    gold.value = data;
  } catch { goldError.value = 'ดึงราคาทองคำไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'; }
  finally { loading.value = false; }
}
const money = value => new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
onMounted(loadGold);
</script>

<template>
  <div class="page">
    <header><a class="brand" href="#"><span class="brand-icon">G.</span> Grade & Gold</a><span class="header-note">Vue.js · Mini Project</span></header>
    <main>
      <div class="intro"><span class="eyebrow">เครื่องมือเล็ก ๆ สำหรับทุกวัน</span><h1>คำนวณเกรด เช็กราคาทอง</h1><p>สองเครื่องมือที่ใช้ง่าย ครบจบในหน้าเดียว</p></div>
      <div class="grid">
        <section class="card grade-card" aria-labelledby="grade-title">
          <div class="section-top"><span class="icon mint">Aa</span><span class="tag">01 / การศึกษา</span></div>
          <h2 id="grade-title">โปรแกรมตัดเกรด</h2><p class="description">กรอกคะแนน แล้วดูผลการเรียนของคุณได้ทันที</p>
          <form @submit.prevent="calculate" novalidate>
            <label for="score">คะแนนรวม <span>เต็ม 100 คะแนน</span></label>
            <div class="input-wrap"><input id="score" v-model="score" type="number" min="0" max="100" step="any" placeholder="เช่น 85" @input="clearResult" :aria-invalid="!!gradeError" aria-describedby="grade-message"><span>/ 100</span></div>
            <button class="primary" type="submit">คำนวณเกรด <span aria-hidden="true">→</span></button>
          </form>
          <div id="grade-message" aria-live="polite">
            <p v-if="gradeError" class="error">{{ gradeError }}</p>
            <div v-else-if="result" class="result"><div><small>ผลการเรียนของคุณ</small><p>{{ result.score }} คะแนน · {{ result.label }}</p></div><strong>{{ result.grade }}</strong></div>
            <div v-else class="empty-result">ผลการคำนวณจะแสดงที่นี่</div>
          </div>
          <div class="criteria"><h3>เกณฑ์การตัดเกรด</h3><div class="grade-list"><div v-for="(item, index) in criteria" :key="item.grade" :class="{ selected: result?.grade === item.grade }"><strong>{{ item.grade }}</strong><span>{{ item.min }}{{ index === 0 ? '–100' : '–<' + criteria[index - 1].min }}</span></div></div></div>
        </section>
        <section class="card gold-card" aria-labelledby="gold-title" :aria-busy="loading">
          <div class="section-top"><span class="icon amber">◇</span><span class="tag">02 / ราคาทองคำ</span></div>
          <div class="title-row"><h2 id="gold-title">ราคาทองคำไทย</h2><span class="purity">96.5%</span></div><p class="description">ราคาต่อ 1 บาททองคำ · หน่วยเงินบาท</p>
          <div class="gold-status" role="status"><span class="dot" :class="{ offline: goldError }"></span><span>{{ loading ? 'กำลังดึงข้อมูล…' : goldError ? 'เชื่อมต่อไม่สำเร็จ' : gold ? 'ข้อมูลจาก API' : 'รอข้อมูล' }}</span><button class="refresh" type="button" @click="loadGold" :disabled="loading">↻ {{ loading ? 'กำลังโหลด' : 'อัปเดตราคา' }}</button></div>
          <p v-if="goldError" class="error" role="alert">{{ goldError }}<span v-if="gold"> · แสดงข้อมูลจากการดึงครั้งก่อน</span></p>
          <div class="price-block" v-for="item in [{ key: 'goldBar', name: 'ทองคำแท่ง', sub: 'GOLD BAR' }, { key: 'jewelry', name: 'ทองรูปพรรณ', sub: 'GOLD JEWELRY' }]" :key="item.key"><div class="price-heading"><h3>{{ item.name }}</h3><span>{{ item.sub }}</span></div><div class="prices"><div><small>รับซื้อ</small><strong>{{ gold ? money(gold[item.key].buy) : '—' }}</strong><span>บาท</span></div><div><small>ขายออก</small><strong>{{ gold ? money(gold[item.key].sell) : '—' }}</strong><span>บาท</span></div></div></div>
          <div class="source"><p>ประกาศล่าสุด: {{ gold ? `${gold.updatedDate} ${gold.updatedTime}` : 'ยังไม่มีข้อมูล' }}</p><a href="https://github.com/max180643/thai-gold-api" target="_blank" rel="noopener noreferrer">แหล่งข้อมูล: Thai Gold API ↗</a><p>ราคาตามประกาศที่ API ส่งกลับมา อาจมีความล่าช้า</p></div>
        </section>
      </div>
    </main>
    <footer><div><span class="footer-label">ผู้จัดทำ</span><strong>Chatree Puangpachung</strong><span class="student-id">69702075</span></div><span>Grade & Gold · Vue.js</span></footer>
  </div>
</template>
