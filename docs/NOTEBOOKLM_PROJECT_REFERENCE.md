# Smart Gate — เอกสารอ้างอิงโปรเจกต์ (สำหรับ NotebookLM / Gemini)

เอกสารนี้สรุปโครงสร้าง ข้อมูล และแนวทางโค้ดของโปรเจกต์ **smart-gate** เพื่อใช้เป็นแหล่งความรู้ใน NotebookLM หรือถามต่อ AI อื่น (เช่น Gemini) โดยไม่ต้องเปิด repo ทั้งก้อน

---

## 1. ภาพรวมผลิตภัณฑ์

แอปเว็บ (SPA) สำหรับครอบครัว มี 3 แท็บหลัก:

| แท็บ | รหัส `activeTab` | หน้าที่ |
|------|------------------|---------|
| SmartHome | `smarthome` | ล็อกอินด้วย PIN, อ่าน GPS, คำนวณระยะจาก “บ้าน”, ปุ่มเปิดประตู (จำลอง — สถานะ `gateOpen` 10 วินาที) |
| ออกกำลังกาย | `exercise` | แผน Hybrid 12 สัปดาห์ หรือแผน Split 4 วัน/สัปดาห์, ติ๊กท่า, กรอกน้ำหนัก/เวลา, YouTube/Google รูป, จับเวลา Plank, บันทึกเซสชัน, โน๊ต |
| กิจกรรมบ้าน | `activities` | รายการงานบ้าน + มอบหมายให้สมาชิก (สถานะ `done` สลับได้) |

**สแต็ก:** React 19 + Vite 7 + Tailwind CSS 3 + lucide-react (ไอคอน)  
**Backend / Database:** ไม่มี — ข้อมูลฝึกหนักถูกเก็บใน `localStorage` ของเบราว์เซอร์ (เมื่อล็อกอินแล้ว)

---

## 2. โครงสร้างไฟล์ใน repo

```
smart-gate/
├── index.html              # entry HTML, title: smart-gate
├── package.json            # dependencies: react, react-dom, lucide-react, vite, tailwind, eslint...
├── vite.config.js          # @vitejs/plugin-react
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── README.md               # เทมเพลต Vite (ยังไม่ได้อธิบายฟีเจอร์แอป)
├── src/
│   ├── main.jsx            # createRoot → <App />
│   ├── App.jsx             # ไฟล์หลักเกือบทั้งแอป (state, UI, ตารางฝึก, geo, auth)
│   ├── App.css             # (ถ้ามีสไตล์เพิ่ม)
│   ├── index.css           # Tailwind directives + global
│   └── SplitPoseThumb.jsx  # ไอคอนท่าฝึกแบบย่อสำหรับ Split (แมป exercise id → lucide icon)
└── docs/
    └── NOTEBOOKLM_PROJECT_REFERENCE.md   # ไฟล์นี้
```

**หมายเหตุ:** ตรรกะส่วนใหญ่อยู่ใน `App.jsx` ไฟล์เดียว (monolith) — ไม่แยกโฟลเดอร์ `components/` หรือ `hooks/`

---

## 3. การล็อกอินและผู้ใช้

- อ็อบเจ็กต์ `FAMILY_MEMBERS`: คีย์เป็น PIN 4 หลัก → `{ name, role }`
  - `role: 'dad'` = Admin (เปิดประตูได้ทุกที่)
  - `role: 'kid'` = ต้องอยู่ใกล้บ้านไม่เกิน `MAX_DISTANCE_METERS` (เมตร)
- หลังล็อกอินสำเร็จ: `setUser({ ...foundUser, id: pin })` — **`user.id` คือ PIN เอง** (ใช้เป็นส่วนหนึ่งของคีย์ localStorage)
- **ความปลอดภัย:** PIN และพิกัดบ้านฝังในโค้ดฝั่ง client — ไม่เหมาะกับ production จริงหากต้องการความลับ; ควรย้ายไป backend + auth จริงถ้าขยาย

---

## 4. SmartHome: พิกัดและประตู

ค่าคงที่ (ด้านบน `App.jsx`):

- `HOME_COORDS`: `{ lat, lng }` — จุดอ้างอิง “บ้าน”
- `MAX_DISTANCE_METERS`: ระยะสูงสุดที่อนุญาตให้ kid กดเปิดประตู
- `openGoogleMapsToHome()`: เปิด Google Maps นำทางกลับบ้าน

`calculateDistance`: สูตร haversine (เมตร)  
`getLocation`: เรียก `navigator.geolocation.getCurrentPosition` ทุก ~10 วินาทีเมื่อมี `user`  
`isSimulatingNearHome`: เมื่อเปิด จะตั้ง `distance` เป็น 10 เมตร (สำหรับ dev)

`handleToggleGate`:

- `dad` → เปิดได้ทันที
- `kid` → ต้อง `distance <= MAX_DISTANCE_METERS`

`openGateAction`: `setGateOpen(true)` แล้วปิดอัตโนมัติหลัง 10 วินาที

---

## 5. แท็บออกกำลังกาย — โหมดและตาราง

### 5.1 ค่าคงที่โหมด

- `TRAINING_MODE_HYBRID = 'hybrid'`
- `TRAINING_MODE_SPLIT = 'split'`

### 5.2 Hybrid (Program A/B)

- `TRAINING_PROGRAM_A`, `TRAINING_PROGRAM_B`: อาร์เรย์ของท่า แต่ละท่ามีอย่างน้อย  
  `id, nameGym, nameHome, sets, reps, unit, searchKey, searchKeyHome`  
  บางท่ามี `inputUnit: 's'` (วินาที — Plank / Side plank ใน split)
- `SHOULDER_EXTRA`: ท่าเสริมหัวไหล่ (`s1`, `s2`) แสดงเฉพาะ UI Hybrid หลังรายการหลัก
- `getPlanForDay(week, day)`: วัน 1–3 สลับ A/B ตามสัปดาห์คี่/คู่; วัน 4 = พัก (`null` plan)
- `getProgramForWeekDay`, `getCurrentDayExerciseIds`: รวม id โปรแกรมหลัก + `SHOULDER_EXTRA`

### 5.3 Split (เฉพาะจุด)

- `SPLIT_DAY_CHEST`, `SPLIT_DAY_SHOULDERS`, `SPLIT_DAY_BACK`, `SPLIT_DAY_ARMS`
- `SPLIT_PROGRAM_BY_DAY[day-1]` เมื่อ `day` 1–4
- `TARGET_SPLIT_DAY_LABELS`: อก, ไหล่, หลัง, แขน
- Warm-up แต่ละวันมัก `reps: '-'` (ไม่มีช่องน้ำหนัก)

### 5.4 สคีมาท่าฝึก (Exercise object)

ฟิลด์ที่ใช้บ่อย:

| ฟิลด์ | ความหมาย |
|--------|-----------|
| `id` | คีย์สถานะติ๊ก / น้ำหนัก |
| `nameGym` / `nameHome` | ชื่อตามสถานที่ฝึก |
| `sets`, `reps`, `unit` | แสดงในบรรทัดรอง |
| `reps: '-'` | มักเป็น warm-up — UI ไม่แสดงช่องน้ำหนัก |
| `searchKey` / `searchKeyHome` | คำค้น YouTube / Google รูป |
| `inputUnit` | `'kg'` (ค่าเริ่มต้น) หรือ `'s'` วินาที |
| `badge` | ป้ายกลุ่ม (เช่น ท้ายวัน · ท้อง) |

---

## 6. State สำคัญใน `App.jsx`

| State | รูปแบบ | หมายเหตุ |
|--------|---------|----------|
| `user` | `null` หรือ `{ name, role, id }` | `id` = PIN |
| `activeTab` | `'smarthome' \| 'exercise' \| 'activities'` | |
| `trainingMode` | `'hybrid' \| 'split'` | |
| `trainingDay` | 1–4 (Hybrid ใช้ 1–4; วัน 4 = พัก) | สลับ Split จากวัน 4 → reset เป็น 1 |
| `trainingWeek` | 1–12 | เลือกช่วง 3 สัปดาห์ + ปุ่มเลื่อนสัปดาห์ |
| `trainingPlace` | `'gym' \| 'home'` | สลับชื่อท่า + search key |
| `trainingCompletedIds` | `{ hybrid: Record<id, boolean>, split: Record<id, boolean> }` | แยก bucket ตามโหมด |
| `sessionDateByDay` | `{ hybrid: {1,2,3}, split: {1,2,3,4} }` | คีย์วันที่ฝึก `YYYY-MM-DD` ต่อวันในแผน |
| `weightHistory` | `Record<dateKey, Record<exerciseId, number>>` | น้ำหนักหรือวินาทีต่อวัน |
| `trainingNotes` | `string` | textarea ล่างแท็บ exercise |
| `sessionRecords` | `array` | บันทึกแต่ละครั้งที่กด “บันทึก” (ดูโครงด้านล่าง) |
| `plankTimer` | object | modal จับเวลา Plank + พักระหว่างเซต |
| `activities` | อาร์เรย์จาก `HOUSE_ACTIVITIES` | **ไม่** sync ลง localStorage ในโค้ดปัจจุบัน |

---

## 7. การบันทึกลง localStorage

**คีย์:** `smartgate_training_${userId}`  
**เมื่อ:** `useEffect` ที่ depend on `user` + state ชุดฝึก (เมื่อ `user` มีค่าเท่านั้น — ไม่มี user จะไม่เขียน)

**Payload (JSON stringify):**

```json
{
  "trainingMode": "hybrid | split",
  "day": 1,
  "place": "gym | home",
  "completedIds": { "hybrid": { "a1": true }, "split": {} },
  "sessionDateByDay": {
    "hybrid": { "1": "2026-05-10", "2": "...", "3": "..." },
    "split": { "1": "...", "2": "...", "3": "...", "4": "..." }
  },
  "weightHistory": {
    "2026-05-10": { "a1": 20, "a2": 15 }
  },
  "week": 3,
  "notes": "ข้อความโน๊ต",
  "sessionRecords": [ /* ดูด้านล่าง */ ]
}
```

**โหลดกลับ:** `useEffect([user])` อ่าน `localStorage`, `JSON.parse`, merge เข้า state (รองรับรูปแบบเก่าของ `completedIds` / `sessionDateByDay`)

**รายการ `sessionRecords` (หนึ่ง element):**

```json
{
  "sessionDate": "2026-05-10",
  "savedAt": "2026-05-10T12:34:56.789Z",
  "week": 3,
  "day": 2,
  "mode": "hybrid | split",
  "plan": "A | B | Split · อก",
  "weights": { "a1": 20, "s1": 6 }
}
```

ฟังก์ชัน `saveSessionRecord`:

- ไม่ทำงานถ้าไม่มี `currentSessionDate`
- Hybrid วัน 4: return (วันพัก)
- Split นอก 1–4: return
- รวม `weightsToSave` จากค่าปัจจุบัน + เติมจาก `getLastWeightForExercise` ถ้าว่าง
- `concat` เข้า `sessionRecords` และ merge เข้า `weightHistory[currentSessionDate]`

### ความครบของวัน (ปุ่มบันทึก)

- `currentDayIds`: id ทั้งหมดของวันนั้น
- `completionDayIds`: กรองออกท่าที่ `reps === '-'` ใน `currentProgram` (warm-up) — ใช้นับแถบความคืบหน้าและ `trainingAllDone`
- ท่า Hybrid ที่ id อยู่แต่ใน `SHOULDER_EXTRA` ยังถูกนับเพราะ `currentProgram.find` ไม่เจอ → ไม่ถูกกรองทิ้ง

---

## 8. ฟังก์ชันและ UX สำคัญ (Exercise)

- `currentSessionDate`: จาก `sessionDateByDay[mode][trainingDay]`
- `setExerciseWeight`: อัปเดต `weightHistory[date][exerciseId]`
- `getWeightHistoryForExercise`, `getWeightSuggestion`: คำแนะนำจากประวัติ
- `toggleTrainingDone(id)`: สลับใน `trainingCompletedIds[trainingMode]`
- `clearTodayTraining`: ล้างติ๊กเฉพาะ id ของวันปัจจุบัน
- ลิงก์ YouTube / Google Image: `openYouTubeSearch`, `openGoogleImageSearch`
- **Plank timer:** `PLANK_EXERCISE_ID = 'a5'` และใน Split ท่าที่ `inputUnit === 's'` — เสียง `Web Audio API` + `navigator.vibrate`

---

## 9. `SplitPoseThumb.jsx`

- Export `SPLIT_POSE_BY_EX_ID`: แมป `sp_*` id → คีย์ท่า (เช่น `bench`, `plank`)
- คอมโพเนนต์แสดงกรอบไอคอนเล็กข้างรายการ Split (Lucide icons)

---

## 10. Styling และ UX

- พื้นหลัง gradient มืด + glassmorphism (`backdrop-blur`, `border-white/10`)
- สีเน้น: cyan (ทั่วไป), violet (โหมด Split), emerald (สำเร็จ), amber (ท่าเสริมหัวไหล่)
- Bottom nav 固定, `safe-area-inset-bottom` สำหรับมือถือ

---

## 11. ข้อจำกัดปัจจุบัน (สำหรับวางแผน Supabase)

1. **ไม่มี server** — ไม่มี API, ไม่มี Row Level Security จริง
2. **ข้อมูลอยู่เครื่อง** — ล้างเบราว์เซอร์ / เปลี่ยนเครื่อง = สูญหาย (ถ้าไม่ export)
3. **`user.id` = PIN** — ไม่ใช่ UUID จากระบบ auth
4. **กิจกรรมบ้าน** — ไม่ persist
5. **ประตู** — จำลองใน state เท่านั้น ไม่ได้สั่งฮาร์ดแวร์

---

## 12. แนวเริ่มต้นผสาน Supabase (แนวคิดสูง — ไม่ใช่โค้ดใน repo)

เป้าหมาย: แทนที่หรือซ้อน `localStorage` ด้วย Postgres ผ่าน Supabase

**ขั้นตอนทั่วไป:**

1. สร้างโปรเจกต์ Supabase → ได้ `SUPABASE_URL`, `SUPABASE_ANON_KEY`
2. ติดตั้ง `@supabase/supabase-js` ในโปรเจกต์ Vite
3. สร้าง client ฝั่ง frontend (anon key ใช้ได้ถ้ามี RLS ป้องกันข้อมูลคนอื่น)
4. ออกแบบตารางเช่น (ตัวอย่าง):
   - `profiles` หรือ `users` — เชื่อม `auth.users` ถ้าใช้ Supabase Auth
   - `training_snapshots` — เก็บ blob เดียวเหมือน localStorage (ง่ายสำหรับ migrate)
   - หรือแยกเป็นตารางจริง: `session_records`, `weight_entries`, `completed_sets` ฯลฯ
5. **RLS:** นโยบาย `auth.uid() = user_id` (หรือเทียบเท่า) ทุกตารางที่มีข้อมูลส่วนตัว
6. **Migration path:** อ่าน `localStorage` ครั้งแรกหลังล็อกอิน → `upsert` ขึ้น Supabase → แล้วค่อยอ่านจาก cloud เป็นหลัก

**หมายเหตุ:** ถ้ายังใช้ PIN ในแอปอยู่ ควรออกแบบให้ PIN แมปไปยัง `auth` หรือ token ที่ปลอดภัย — ไม่เก็บ PIN เป็น primary key ในฐานข้อมูลแบบ plain text หากไม่จำเป็น

---

## 13. คำสั่งพัฒนา

```bash
npm install
npm run dev      # Vite dev server
npm run build    # production build → dist/
npm run lint
```

---

## 14. สรุปหนึ่งย่อหน้า (paste สั้นๆ ให้ AI)

> **smart-gate** เป็น React+Vite SPA แท็บ SmartHome (PIN + GPS + ปุ่มประตูจำลอง), ออกกำลังกาย (Hybrid A/B 12 สัปดาห์ + Split 4 วัน, ติ๊กท่า, น้ำหนัก, Plank timer, บันทึกเซสชัน), และกิจกรรมบ้าน ข้อมูลฝึกถูกเก็บใน `localStorage` คีย์ `smartgate_training_<pin>` เมื่อล็อกอิน ไม่มี backend; โค้ดหลักอยู่ที่ `src/App.jsx` และไอคอนท่า Split ที่ `src/SplitPoseThumb.jsx`

---

*สร้างเพื่ออัปโหลด NotebookLM — อัปเดตตาม repo ล่าสุดเมื่อมีการ refactor โครงสร้างไฟล์หรือ schema ข้อมูล*
