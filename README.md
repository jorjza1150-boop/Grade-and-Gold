# Grade & Gold

เว็บหน้าเดียว Vue 3 สำหรับตัดเกรดและดึงราคาทองคำไทย

ผู้จัดทำ: **Chatree Puangpachung 69702075**

## เริ่มใช้งาน

ใช้ Node.js 22.12 ขึ้นไป

```sh
npm install
npm run dev
```

เปิด URL ที่ Vite แสดง (ปกติ http://127.0.0.1:5173) โดยคำสั่งนี้เปิดทั้ง Vue และ API

## เวอร์ชันสำหรับใช้งาน

```sh
npm run build
npm start
```

เปิด http://127.0.0.1:3001

## API ราคาทอง

`GET /api/gold` ดึงราคาจาก https://api.chnwt.dev/thai-gold-api/latest ผ่านเซิร์ฟเวอร์ เพื่อไม่ติดข้อจำกัด CORS บนหน้าเว็บ มีแคช 60 วินาทีและ timeout 10 วินาที

ผลลัพธ์มี `updatedDate`, `updatedTime`, `goldBar` และ `jewelry` (แต่ละชนิดมี `buy` และ `sell` เป็นตัวเลข) และ `source` หากต้นทางไม่พร้อมจะตอบ HTTP 502 พร้อม `error` และหน้าเว็บแสดงข้อผิดพลาด ไม่สร้างราคาจำลอง

เอกสารต้นทาง: https://github.com/max180643/thai-gold-api

## เกณฑ์ตัดเกรด

A ≥80, B+ ≥75, B ≥70, C+ ≥65, C ≥60, D+ ≥55, D ≥50 และ F <50 รับคะแนนทศนิยมตั้งแต่ 0 ถึง 100

```sh
npm test
```
