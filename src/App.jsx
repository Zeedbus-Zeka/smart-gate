import React, { useState, useEffect } from 'react';
import { MapPin, Unlock, User, AlertCircle, LogOut, ShieldCheck, Power, Home, Dumbbell, ClipboardList, Check, Circle, Building2, Sparkles, Coffee, RotateCcw, Trophy, Calendar, Weight, Youtube, Image, Navigation, ChevronRight, Save, Timer, Play, Pause, Square, Info } from 'lucide-react';
import SplitPoseThumb from './SplitPoseThumb';

// ==========================================
// 📍 ตั้งค่าพิกัดบ้าน (Latitude, Longitude)
// ==========================================
const HOME_COORDS = { lat: 13.8473095, lng: 100.4979925 };
const openGoogleMapsToHome = () => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${HOME_COORDS.lat},${HOME_COORDS.lng}&travelmode=driving`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
const MAX_DISTANCE_METERS = 100; 

// ==========================================
// 👨‍👩‍👧‍👦 ฐานข้อมูลสมาชิก
// ==========================================
const FAMILY_MEMBERS = {
  '1111': { name: 'ป๋าเอส (Admin)', role: 'dad' },
  '2222': { name: 'ลูกคนที่ 1', role: 'kid' },
  '3333': { name: 'ลูกคนที่ 2', role: 'kid' },
};

const TABS = [
  { id: 'smarthome', label: 'SmartHome', icon: Home },
  { id: 'exercise', label: 'ออกกำลังกาย', icon: Dumbbell },
  { id: 'activities', label: 'กิจกรรมบ้าน', icon: ClipboardList },
];

// ==========================================
// 🏋️ ตารางฝึก 3 เดือน (จากแผน Hybrid) + โฟกัสหัวไหล่
// ==========================================
// searchKey = ค้นวีดีโอตอนอยู่ยิม, searchKeyHome = ค้นวีดีโอตอนอยู่บ้าน/โรงแรม (Board Push-up ตามสี: 🔵อก 🟡หลัง 🔴ไหล่ 🟢หลังแขน)
const TRAINING_PROGRAM_A = [
  { id: 'a0', nameGym: 'Warm-up: ปั่นจักรยาน/เดินชัน 10 นาที', nameHome: 'ย่ำเท้าอยู่กับที่ / แกว่งแขน 5 นาที', sets: 1, reps: '-', unit: '', searchKey: 'treadmill incline walk warm up', searchKeyHome: 'marching in place arm swing warm up' },
  { id: 'a1', nameGym: 'Goblet Squat (8-10 kg)', nameHome: 'Bodyweight Squat ลุกนั่งมือเปล่า 15-20 ครั้ง', sets: 3, reps: '12', unit: 'ครั้ง', searchKey: 'Goblet Squat how to', searchKeyHome: 'bodyweight squat at home' },
  { id: 'a2', nameGym: 'Chest Press Machine (15-20 kg)', nameHome: 'Board Push-up 🔵 สีน้ำเงิน (อก)', sets: 3, reps: '10-15', unit: 'ครั้ง', searchKey: 'Chest Press Machine gym', searchKeyHome: 'push up board chest poitrine' },
  { id: 'a3', nameGym: 'Lat Pulldown (20-25 kg)', nameHome: 'Board Push-up 🟡 สีเหลือง (หลัง) จังหวะยุบตัวบีบสะบัก', sets: 3, reps: '10-15', unit: 'ครั้ง', searchKey: 'Lat Pulldown how to', searchKeyHome: 'push up board back dos' },
  { id: 'a4', nameGym: 'Dumbbell Shoulder Press (4-6 kg/ข้าง)', nameHome: 'Board Push-up 🔴 สีแดง (ไหล่)', sets: 3, reps: '8-12', unit: 'ครั้ง', searchKey: 'Dumbbell Shoulder Press', searchKeyHome: 'push up board shoulders epaules' },
  { id: 'a5', nameGym: 'Plank แกนกลาง', nameHome: 'Plank (ทำเหมือนเดิม)', sets: 3, reps: '45', unit: 'วินาที', searchKey: 'Plank exercise form', searchKeyHome: 'plank exercise at home', inputUnit: 's' },
];

const TRAINING_PROGRAM_B = [
  { id: 'b0', nameGym: 'Warm-up: เดินชัน (Incline Walk) 10 นาที', nameHome: 'Jumping Jacks กระโดดตบเบาๆ 5 นาที', sets: 1, reps: '-', unit: '', searchKey: 'incline walk treadmill', searchKeyHome: 'jumping jacks warm up' },
  { id: 'b1', nameGym: 'Leg Press Machine (30-40 kg)', nameHome: 'Lunges ก้าวเท้าย่อตัวสลับซ้าย-ขวา ข้างละ 10 ครั้ง', sets: 3, reps: '12', unit: 'ครั้ง', searchKey: 'Leg Press Machine gym', searchKeyHome: 'lunges at home' },
  { id: 'b2', nameGym: 'Seated Cable Row (20-25 kg)', nameHome: 'Board Push-up 🟡 สีเหลือง (หลัง) เกร็งค้างตอนตัวลงต่ำสุด', sets: 3, reps: '10-15', unit: 'ครั้ง', searchKey: 'Seated Cable Row', searchKeyHome: 'push up board back dos' },
  { id: 'b3', nameGym: 'Dumbbell Incline Press (อกบน)', nameHome: 'Decline Board Push-up 🔵 เอาเท้าพาดบนเตียง/เก้าอี้ แล้ววิดพื้น', sets: 3, reps: '10-12', unit: 'ครั้ง', searchKey: 'Dumbbell Incline Press', searchKeyHome: 'decline push up chest' },
  { id: 'b4', nameGym: 'Dumbbell Biceps Curl (5-7 kg/ข้าง)', nameHome: 'ยกกระเป๋าเป้ใส่หนังสือ/ขวดน้ำ (พับศอกยก)', sets: 2, reps: '12-15', unit: 'ครั้ง', searchKey: 'Dumbbell Biceps Curl', searchKeyHome: 'bicep curl at home no equipment' },
  { id: 'b5', nameGym: 'Triceps Rope Pushdown (10-15 kg)', nameHome: 'Board Push-up 🟢 สีเขียว (หลังแขน) ศอกหนีบลำตัว', sets: 2, reps: '10-15', unit: 'ครั้ง', searchKey: 'Triceps Rope Pushdown', searchKeyHome: 'push up board triceps' },
];

// พิเศษ: โฟกัสหัวไหล่ให้กว้าง (เพิ่มทุกวันที่ฝึก)
const SHOULDER_EXTRA = [
  { id: 's1', nameGym: 'Lateral Raise (4-6 kg/ข้าง)', nameHome: 'ยกขวดน้ำด้านข้าง แขนตรง', sets: 3, reps: '12-15', unit: 'ครั้ง', badge: 'หัวไหล่กว้าง', searchKey: 'Lateral Raise dumbbell', searchKeyHome: 'lateral raise at home bottle' },
  { id: 's2', nameGym: 'Cable/Band Lateral Raise หรือ Reverse Fly', nameHome: 'ยางยืดยกด้านข้าง / ดึงยางด้านหลัง', sets: 2, reps: '15', unit: 'ครั้ง', badge: 'หัวไหล่กว้าง', searchKey: 'Cable Lateral Raise Reverse Fly', searchKeyHome: 'resistance band lateral raise' },
];

// ==========================================
// 🎯 แผนเฉพาะจุด: สัปดาห์ละ 4 วัน (อก · ไหล่ · หลัง · แขน) · 12 สัปดาห์เช่นเดียวกับ Hybrid
// ==========================================
const TRAINING_MODE_HYBRID = 'hybrid';
const TRAINING_MODE_SPLIT = 'split';

const TARGET_SPLIT_DAY_LABELS = ['อก', 'ไหล่', 'หลัง', 'แขน'];

const SPLIT_DAY_CHEST = [
  { id: 'sp_ch_0', nameGym: 'Warm-up: ปั่นจักรยาน / แกว่งแขน 5–10 นาที', nameHome: 'แกว่งแขน · ดันผนังเบาๆ 5–8 นาที', sets: 1, reps: '-', unit: '', searchKey: 'chest workout warm up gym', searchKeyHome: 'chest activation warm up home' },
  { id: 'sp_ch_1', nameGym: 'Barbell / Smith Bench Press', nameHome: 'Board Push-up 🔵 (อก) / Push-up มาตรฐาน', sets: 4, reps: '8-12', unit: 'ครั้ง', searchKey: 'bench press form gym', searchKeyHome: 'push up board chest home' },
  { id: 'sp_ch_2', nameGym: 'Incline Dumbbell Press', nameHome: 'Decline Push-up (เท้าสูง) / ดันกระเป๋าเอียง', sets: 3, reps: '10-12', unit: 'ครั้ง', searchKey: 'incline dumbbell press', searchKeyHome: 'decline push up chest' },
  { id: 'sp_ch_3', nameGym: 'Cable / Dumbbell Fly', nameHome: 'เปิดอกยางยืด / ขวดน้ำ fly', sets: 3, reps: '12-15', unit: 'ครั้ง', searchKey: 'cable chest fly', searchKeyHome: 'resistance band chest fly home' },
  { id: 'sp_ch_4', nameGym: 'Chest Dip / Assisted Dip', nameHome: 'Dip เก้าอี้ / Push-up แคบ', sets: 3, reps: '10-15', unit: 'ครั้ง', searchKey: 'chest dip machine', searchKeyHome: 'chair dips chest home' },
  { id: 'sp_ch_ab1', nameGym: 'Cable Crunch / Crunch Machine', nameHome: 'Bicycle crunch · ลุกท้อง', sets: 3, reps: '15-20', unit: 'ครั้ง', badge: 'ท้ายวัน · ท้อง', searchKey: 'cable crunch abs', searchKeyHome: 'bicycle crunch abs home' },
  { id: 'sp_ch_ab2', nameGym: 'Plank ค้าง (แกนกลาง)', nameHome: 'Plank (ค้างท้องแน่น)', sets: 3, reps: '30-45', unit: 'วินาที', inputUnit: 's', badge: 'ท้ายวัน · ท้อง', searchKey: 'plank abs form', searchKeyHome: 'plank hold home' },
  { id: 'sp_ch_lg1', nameGym: 'Goblet Squat', nameHome: 'สควอตถือดัมเบล / ขวดหน้าอก', sets: 3, reps: '12-15', unit: 'ครั้ง', badge: 'ท้ายวัน · ขา', searchKey: 'goblet squat how to', searchKeyHome: 'goblet squat at home' },
  { id: 'sp_ch_lg2', nameGym: 'Walking Lunge (ถือดัมเบล)', nameHome: 'ย่อตัวเดินก้าว (ถือขวด)', sets: 3, reps: '10', unit: 'ครั้ง/ข้าง', badge: 'ท้ายวัน · ขา', searchKey: 'dumbbell walking lunge', searchKeyHome: 'walking lunge at home' },
];

const SPLIT_DAY_SHOULDERS = [
  { id: 'sp_sh_0', nameGym: 'Warm-up: แกว่งแขน · ยางดึงเบาๆ 5–8 นาที', nameHome: 'หมุนข้อไหล่ · แกว่งแขนด้านข้าง', sets: 1, reps: '-', unit: '', searchKey: 'shoulder warm up gym', searchKeyHome: 'shoulder warm up resistance band' },
  { id: 'sp_sh_1', nameGym: 'Dumbbell Shoulder Press', nameHome: 'Board Push-up 🔴 (ไหล่) / Pike Push-up', sets: 4, reps: '8-12', unit: 'ครั้ง', searchKey: 'dumbbell shoulder press form', searchKeyHome: 'push up board shoulders pike push up' },
  { id: 'sp_sh_2', nameGym: 'Lateral Raise', nameHome: 'ยกขวดน้ำด้านข้าง แขนตรง', sets: 4, reps: '12-15', unit: 'ครั้ง', searchKey: 'dumbbell lateral raise', searchKeyHome: 'lateral raise water bottles' },
  { id: 'sp_sh_3', nameGym: 'Rear Delt Fly / Reverse Pec Deck', nameHome: 'งอตัวดึงยางแยกสะบัก', sets: 3, reps: '12-15', unit: 'ครั้ง', searchKey: 'rear delt fly dumbbell', searchKeyHome: 'band rear delt fly home' },
  { id: 'sp_sh_4', nameGym: 'Face Pull (rope)', nameHome: 'ดึงยางระดับหน้าผาก (แยกสะบัก)', sets: 3, reps: '15-20', unit: 'ครั้ง', searchKey: 'face pull cable', searchKeyHome: 'resistance band face pull' },
  { id: 'sp_sh_ab1', nameGym: 'Pallof Press (แกนกลาง)', nameHome: 'ดันยางด้านข้างลำตัว (ต้านหมุน)', sets: 3, reps: '12-15', unit: 'ครั้ง/ข้าง', badge: 'ท้ายวัน · ท้อง', searchKey: 'pallof press cable', searchKeyHome: 'pallof press resistance band' },
  { id: 'sp_sh_ab2', nameGym: 'Side Plank (ด้านละข้าง)', nameHome: 'Side plank ด้านละข้าง', sets: 2, reps: '20-40', unit: 'วินาที', inputUnit: 's', badge: 'ท้ายวัน · ท้อง', searchKey: 'side plank form', searchKeyHome: 'side plank home' },
  { id: 'sp_sh_lg1', nameGym: 'Leg Press / Hack Squat (เบา–ปานกลาง)', nameHome: 'สควอตพนักพิงผนัง / ลุกนั่งถือขวด', sets: 3, reps: '12-15', unit: 'ครั้ง', badge: 'ท้ายวัน · ขา', searchKey: 'leg press form feet placement', searchKeyHome: 'wall sit squat hold legs' },
  { id: 'sp_sh_lg2', nameGym: 'Standing Calf Raise', nameHome: 'ยืนยกส้นเท้า (พื้น/ขั้น)', sets: 4, reps: '15-20', unit: 'ครั้ง', badge: 'ท้ายวัน · ขา', searchKey: 'standing calf raise smith', searchKeyHome: 'calf raises stairs home' },
];

const SPLIT_DAY_BACK = [
  { id: 'sp_bk_0', nameGym: 'Warm-up: ดึงสายแถบบน · แกว่งหลัง 5–8 นาที', nameHome: 'Cat-cow · Superman เบาๆ', sets: 1, reps: '-', unit: '', searchKey: 'back workout warm up', searchKeyHome: 'back warm up home cat cow' },
  { id: 'sp_bk_1', nameGym: 'Lat Pulldown', nameHome: 'Board Push-up 🟡 (หลัง) จังหวะบีบสะบัก', sets: 4, reps: '10-12', unit: 'ครั้ง', searchKey: 'lat pulldown form', searchKeyHome: 'push up board back' },
  { id: 'sp_bk_2', nameGym: 'Seated Cable Row', nameHome: 'ดึงกระเป๋า / แถวท่อนแขนงอเข่า', sets: 4, reps: '10-12', unit: 'ครั้ง', searchKey: 'seated cable row', searchKeyHome: 'bent over row backpack home' },
  { id: 'sp_bk_3', nameGym: 'One-Arm Dumbbell Row', nameHome: 'ดึงขวดข้างละมือ (ยื่นขา)', sets: 3, reps: '10-12', unit: 'ครั้ง', searchKey: 'one arm dumbbell row', searchKeyHome: 'single arm row home dumbbell' },
  { id: 'sp_bk_4', nameGym: 'Hyperextension / Back Extension', nameHome: 'Superman hold · สะพานก้น', sets: 3, reps: '12-15', unit: 'ครั้ง', searchKey: 'hyperextension back extension', searchKeyHome: 'superman exercise lower back' },
  { id: 'sp_bk_ab1', nameGym: "Hanging Knee Raise / Captain's Chair", nameHome: 'ยกเข่าแขวน / ยกเข่านอนบนโซฟา', sets: 3, reps: '10-15', unit: 'ครั้ง', badge: 'ท้ายวัน · ท้อง', searchKey: 'hanging knee raise form', searchKeyHome: 'lying knee raise abs home' },
  { id: 'sp_bk_ab2', nameGym: 'Dead Bug', nameHome: 'Dead bug ท้องแน่น', sets: 3, reps: '10', unit: 'ครั้ง/ข้าง', badge: 'ท้ายวัน · ท้อง', searchKey: 'dead bug exercise', searchKeyHome: 'dead bug abs home' },
  { id: 'sp_bk_lg1', nameGym: 'Romanian Deadlift (RDL)', nameHome: 'โยนสะโพกถือดัมเบล / ขวด', sets: 3, reps: '10-12', unit: 'ครั้ง', badge: 'ท้ายวัน · ขา', searchKey: 'romanian deadlift form dumbbell', searchKeyHome: 'romanian deadlift dumbbell home' },
  { id: 'sp_bk_lg2', nameGym: 'Lying Leg Curl', nameHome: 'Glute bridge · ขาสไลด์บนพื้น', sets: 3, reps: '12-15', unit: 'ครั้ง', badge: 'ท้ายวัน · ขา', searchKey: 'lying leg curl machine', searchKeyHome: 'glute bridge hamstring slide home' },
];

const SPLIT_DAY_ARMS = [
  { id: 'sp_ar_0', nameGym: 'Warm-up: หมุนข้อศอก · แกว่งแขนเบาๆ', nameHome: 'หมุนข้อมือ · Curl ขวดเปล่า', sets: 1, reps: '-', unit: '', searchKey: 'arm workout warm up', searchKeyHome: 'arm warm up home' },
  { id: 'sp_ar_1', nameGym: 'Barbell / EZ Curl', nameHome: 'ดัมเบล / ขวดน้ำ Curl ท่ามาตรฐาน', sets: 3, reps: '10-15', unit: 'ครั้ง', searchKey: 'barbell bicep curl', searchKeyHome: 'bicep curl dumbbell home' },
  { id: 'sp_ar_2', nameGym: 'Hammer Curl', nameHome: 'Hammer curl ขวดคู่', sets: 3, reps: '12-15', unit: 'ครั้ง', searchKey: 'hammer curl dumbbell', searchKeyHome: 'hammer curl water bottles' },
  { id: 'sp_ar_3', nameGym: 'Triceps Rope Pushdown', nameHome: 'Board Push-up 🟢 (หลังแขน) ศอกหนีบ', sets: 3, reps: '12-15', unit: 'ครั้ง', searchKey: 'triceps rope pushdown', searchKeyHome: 'push up board triceps' },
  { id: 'sp_ar_4', nameGym: 'Overhead Triceps Extension', nameHome: 'เหยียดศอกหลังศีรษะ (ขวด/ดัมเบล)', sets: 3, reps: '12-15', unit: 'ครั้ง', searchKey: 'overhead tricep extension cable', searchKeyHome: 'overhead tricep extension home' },
  { id: 'sp_ar_ab1', nameGym: 'Russian Twist (ถือแผ่น/ดัมเบล)', nameHome: 'หมุนลำตัวนั่ง (ถือขวด)', sets: 3, reps: '20-30', unit: 'ครั้ง', badge: 'ท้ายวัน · ท้อง', searchKey: 'russian twist weighted', searchKeyHome: 'russian twist abs home' },
  { id: 'sp_ar_ab2', nameGym: 'Mountain Climber (ช้าๆ ควบคุม)', nameHome: 'Mountain climber ช้า', sets: 3, reps: '20-30', unit: 'ครั้ง', badge: 'ท้ายวัน · ท้อง', searchKey: 'mountain climber slow abs', searchKeyHome: 'mountain climber exercise home' },
  { id: 'sp_ar_lg1', nameGym: 'Front Squat / Goblet Squat (เบา)', nameHome: 'สควอตถือหน้า · ลึกพอสบาย', sets: 3, reps: '10-12', unit: 'ครั้ง', badge: 'ท้ายวัน · ขา', searchKey: 'front squat form light', searchKeyHome: 'goblet squat deep home' },
  { id: 'sp_ar_lg2', nameGym: 'Seated Calf Raise', nameHome: 'ยกส้นเท้านั่งถือดัมเบลบนตัก', sets: 4, reps: '15-20', unit: 'ครั้ง', badge: 'ท้ายวัน · ขา', searchKey: 'seated calf raise machine', searchKeyHome: 'seated calf raise dumbbell home' },
];

const SPLIT_PROGRAM_BY_DAY = [SPLIT_DAY_CHEST, SPLIT_DAY_SHOULDERS, SPLIT_DAY_BACK, SPLIT_DAY_ARMS];

const getSplitProgramForDay = (day) => {
  if (day < 1 || day > 4) return [];
  return SPLIT_PROGRAM_BY_DAY[day - 1];
};
const getSplitDayExerciseIds = (day) => getSplitProgramForDay(day).map((e) => e.id);

const getSplitDayLabel = (day) => (day >= 1 && day <= 4 ? TARGET_SPLIT_DAY_LABELS[day - 1] : '');

const TRAINING_STORAGE_KEY_PREFIX = 'smartgate_training';
const getTrainingStorageKey = (userId) => (userId ? `${TRAINING_STORAGE_KEY_PREFIX}_${userId}` : null);

/** สัปดาห์คี่ (1,3,5...): วัน1=A, วัน2=B, วัน3=A. สัปดาห์คู่ (2,4,6...): วัน1=B, วัน2=A, วัน3=B */
const getPlanForDay = (week, day) => {
  if (day === 4) return null;
  const isOddWeek = week % 2 === 1;
  if (day === 1) return isOddWeek ? 'A' : 'B';
  if (day === 2) return isOddWeek ? 'B' : 'A';
  if (day === 3) return isOddWeek ? 'A' : 'B';
  return 'A';
};
const getProgramForWeekDay = (week, day) =>
  getPlanForDay(week, day) === 'B' ? TRAINING_PROGRAM_B : TRAINING_PROGRAM_A;
const getCurrentDayExerciseIds = (week, day) => {
  if (day === 4) return [];
  const program = getProgramForWeekDay(week, day);
  return [...program.map((e) => e.id), ...SHOULDER_EXTRA.map((e) => e.id)];
};

const toDateKey = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
const todayKey = () => toDateKey(new Date());

const THAI_MONTH_ABBR = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const formatDateThai = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  return `${d} ${THAI_MONTH_ABBR[m - 1]}`;
};
const formatSavedAt = (isoString) => {
  try {
    const d = new Date(isoString);
    const day = d.getDate();
    const month = THAI_MONTH_ABBR[d.getMonth()];
    const year = d.getFullYear();
    const h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${h}:${min}`;
  } catch (_) {
    return isoString;
  }
};

const getExerciseSearchKey = (ex, place) => {
  if (place === 'home' && ex.searchKeyHome) return ex.searchKeyHome;
  return ex.searchKey || ex.nameGym.replace(/\s*\([^)]*\)\s*$/, '').trim() || 'exercise';
};
const openYouTubeSearch = (query) => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' how to form')}`, '_blank', 'noopener,noreferrer');
const openGoogleImageSearch = (query) => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query + ' exercise')}`, '_blank', 'noopener,noreferrer');

const PLANK_EXERCISE_ID = 'a5';
const PLANK_REST_SECONDS = 60;

/** ค่าเริ่มต้นวินาทีถือ Plank จากช่องกรอกหรือ reps ในตาราง */
const parsePlankDefaultSeconds = (displayValue, ex) => {
  const fromField = Number(displayValue);
  if (Number.isFinite(fromField) && fromField > 0) return Math.round(Math.min(600, Math.max(10, fromField)));
  const fromReps = parseInt(String(ex.reps).replace(/\D/g, ''), 10);
  if (Number.isFinite(fromReps) && fromReps > 0) return Math.round(Math.min(600, Math.max(10, fromReps)));
  return 45;
};

const formatPlankCountdown = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}:${String(r).padStart(2, '0')}` : String(r);
};

let plankAudioCtx = null;
const ensurePlankAudio = () => {
  try {
    if (!plankAudioCtx) plankAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (plankAudioCtx.state === 'suspended') void plankAudioCtx.resume();
    return plankAudioCtx;
  } catch (_) {
    return null;
  }
};
const playPlankTone = (freq, duration = 0.22) => {
  const ctx = ensurePlankAudio();
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g);
  g.connect(ctx.destination);
  o.frequency.value = freq;
  o.type = 'sine';
  g.gain.setValueAtTime(0.12, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  o.start(ctx.currentTime);
  o.stop(ctx.currentTime + duration);
};

/** เสียง + สั่น ตามช่วงจับเวลา Plank */
const playPlankSignal = (kind) => {
  try {
    if (kind === 'workDone') {
      playPlankTone(880, 0.28);
      setTimeout(() => playPlankTone(660, 0.22), 160);
      navigator.vibrate?.(180);
    } else if (kind === 'restStart') {
      playPlankTone(392, 0.18);
      navigator.vibrate?.(80);
    } else if (kind === 'restDone') {
      playPlankTone(523, 0.2);
      setTimeout(() => playPlankTone(880, 0.28), 130);
      navigator.vibrate?.([100, 60, 100]);
    } else if (kind === 'sessionDone') {
      playPlankTone(784, 0.25);
      setTimeout(() => playPlankTone(988, 0.28), 200);
      setTimeout(() => playPlankTone(1175, 0.35), 420);
      navigator.vibrate?.([250, 120, 250, 120, 400]);
    }
  } catch (_) {}
};

const createInitialPlankTimer = () => ({
  open: false,
  running: false,
  paused: false,
  phase: 'idle',
  workSec: 45,
  totalSets: 3,
  currentSet: 1,
  remaining: 0,
});

// สมาชิกในบ้าน (ป๋าเอส + ลูก 4 คน: พู พี พลอส พัตเตอร์)
const HOUSEHOLD_MEMBERS = [
  { id: 'dad', name: 'ป๋าเอส' },
  { id: 'poo', name: 'พู' },
  { id: 'pee', name: 'พี' },
  { id: 'plus', name: 'พลอส' },
  { id: 'potter', name: 'พัตเตอร์' },
];

const HOUSE_ACTIVITIES = [
  { id: 1, title: 'กวาดบ้าน', done: false, assigneeId: 'poo' },
  { id: 2, title: 'ล้างจาน', done: true, assigneeId: 'pee' },
  { id: 3, title: 'รดน้ำต้นไม้', done: false, assigneeId: 'plus' },
  { id: 4, title: 'ซักผ้า', done: false, assigneeId: 'potter' },
  { id: 5, title: 'จัดห้องนอน', done: false, assigneeId: 'poo' },
  { id: 6, title: 'ถูบ้าน', done: false, assigneeId: 'poo' },
  { id: 7, title: 'เก็บของเข้าที่', done: false, assigneeId: 'pee' },
  { id: 8, title: 'ล้างห้องน้ำ', done: false, assigneeId: 'plus' },
  { id: 9, title: 'ตากผ้า / พับผ้า', done: false, assigneeId: 'potter' },
  { id: 10, title: 'จัดโต๊ะอาหาร', done: false, assigneeId: 'pee' },
  { id: 11, title: 'ดูและสัตว์เลี้ยง', done: false, assigneeId: 'poo' },
  { id: 12, title: 'แยกขยะ / นำขยะออก', done: false, assigneeId: 'pee' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [gateOpen, setGateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('smarthome');

  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isSimulatingNearHome, setIsSimulatingNearHome] = useState(false);

  const [activities, setActivities] = useState(HOUSE_ACTIVITIES);
  const [trainingMode, setTrainingMode] = useState(TRAINING_MODE_HYBRID);
  const [trainingDay, setTrainingDay] = useState(1);
  const [trainingPlace, setTrainingPlace] = useState('gym');
  const [trainingCompletedIds, setTrainingCompletedIds] = useState(() => ({
    hybrid: {},
    split: {},
  }));
  const [sessionDateByDay, setSessionDateByDay] = useState(() => {
    const t = todayKey();
    return {
      hybrid: { 1: t, 2: t, 3: t },
      split: { 1: t, 2: t, 3: t, 4: t },
    };
  });
  const [weightHistory, setWeightHistory] = useState({});
  const [trainingWeek, setTrainingWeek] = useState(1);
  const [trainingNotes, setTrainingNotes] = useState('');
  const [sessionRecords, setSessionRecords] = useState([]);
  const [plankTimer, setPlankTimer] = useState(createInitialPlankTimer);

  const completedIdsCurrent = trainingCompletedIds[trainingMode] || {};
  const currentSessionDate =
    trainingMode === TRAINING_MODE_HYBRID
      ? trainingDay >= 1 && trainingDay <= 3
        ? sessionDateByDay.hybrid[trainingDay] || todayKey()
        : null
      : trainingDay >= 1 && trainingDay <= 4
        ? sessionDateByDay.split[trainingDay] || todayKey()
        : null;

  useEffect(() => {
    if (!plankTimer.open || !plankTimer.running || plankTimer.paused) return undefined;
    const id = window.setInterval(() => {
      setPlankTimer((p) => {
        if (!p.running || p.paused || p.phase === 'idle' || p.phase === 'done') return p;
        if (p.remaining > 1) return { ...p, remaining: p.remaining - 1 };
        if (p.remaining === 1) {
          if (p.phase === 'work') {
            if (p.currentSet >= p.totalSets) {
              playPlankSignal('sessionDone');
              return { ...p, phase: 'done', remaining: 0, running: false };
            }
            playPlankSignal('workDone');
            playPlankSignal('restStart');
            return { ...p, phase: 'rest', remaining: PLANK_REST_SECONDS };
          }
          playPlankSignal('restDone');
          return {
            ...p,
            phase: 'work',
            remaining: p.workSec,
            currentSet: p.currentSet + 1,
          };
        }
        return p;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [plankTimer.open, plankTimer.running, plankTimer.paused]);

  useEffect(() => {
    const key = user ? getTrainingStorageKey(user.id) : null;
    if (!key) return;
    try {
      const s = localStorage.getItem(key);
      if (s) {
        const data = JSON.parse(s);
        const today = todayKey();
        if (data.day >= 1 && data.day <= 4) setTrainingDay(data.day);
        if (data.place === 'gym' || data.place === 'home') setTrainingPlace(data.place);
        if (data.trainingMode === TRAINING_MODE_HYBRID || data.trainingMode === TRAINING_MODE_SPLIT) {
          setTrainingMode(data.trainingMode);
        }
        if (data.completedIds && typeof data.completedIds === 'object') {
          if (data.completedIds.hybrid !== undefined || data.completedIds.split !== undefined) {
            setTrainingCompletedIds({
              hybrid: typeof data.completedIds.hybrid === 'object' ? data.completedIds.hybrid : {},
              split: typeof data.completedIds.split === 'object' ? data.completedIds.split : {},
            });
          } else {
            const keys = Object.keys(data.completedIds);
            const hasSplitIds = keys.some((k) => k.startsWith('sp_'));
            setTrainingCompletedIds(
              hasSplitIds ? { hybrid: {}, split: data.completedIds } : { hybrid: data.completedIds, split: {} }
            );
          }
        }
        if (data.sessionDateByDay && typeof data.sessionDateByDay === 'object') {
          if (data.sessionDateByDay.hybrid && data.sessionDateByDay.split) {
            setSessionDateByDay({
              hybrid: {
                1: /^\d{4}-\d{2}-\d{2}$/.test(data.sessionDateByDay.hybrid[1]) ? data.sessionDateByDay.hybrid[1] : today,
                2: /^\d{4}-\d{2}-\d{2}$/.test(data.sessionDateByDay.hybrid[2]) ? data.sessionDateByDay.hybrid[2] : today,
                3: /^\d{4}-\d{2}-\d{2}$/.test(data.sessionDateByDay.hybrid[3]) ? data.sessionDateByDay.hybrid[3] : today,
              },
              split: {
                1: /^\d{4}-\d{2}-\d{2}$/.test(data.sessionDateByDay.split[1]) ? data.sessionDateByDay.split[1] : today,
                2: /^\d{4}-\d{2}-\d{2}$/.test(data.sessionDateByDay.split[2]) ? data.sessionDateByDay.split[2] : today,
                3: /^\d{4}-\d{2}-\d{2}$/.test(data.sessionDateByDay.split[3]) ? data.sessionDateByDay.split[3] : today,
                4: /^\d{4}-\d{2}-\d{2}$/.test(data.sessionDateByDay.split[4]) ? data.sessionDateByDay.split[4] : today,
              },
            });
          } else {
            const o = data.sessionDateByDay;
            setSessionDateByDay({
              hybrid: {
                1: /^\d{4}-\d{2}-\d{2}$/.test(o[1]) ? o[1] : today,
                2: /^\d{4}-\d{2}-\d{2}$/.test(o[2]) ? o[2] : today,
                3: /^\d{4}-\d{2}-\d{2}$/.test(o[3]) ? o[3] : today,
              },
              split: { 1: today, 2: today, 3: today, 4: today },
            });
          }
        } else if (data.sessionDate && /^\d{4}-\d{2}-\d{2}$/.test(data.sessionDate)) {
          setSessionDateByDay({
            hybrid: { 1: data.sessionDate, 2: data.sessionDate, 3: data.sessionDate },
            split: { 1: today, 2: today, 3: today, 4: today },
          });
        }
        if (data.weightHistory && typeof data.weightHistory === 'object') setWeightHistory(data.weightHistory);
        if (typeof data.week === 'number' && data.week >= 1 && data.week <= 12) setTrainingWeek(data.week);
        if (typeof data.notes === 'string') setTrainingNotes(data.notes);
        if (Array.isArray(data.sessionRecords)) setSessionRecords(data.sessionRecords);
      }
    } catch (_) {}
  }, [user]);

  const currentProgram =
    trainingMode === TRAINING_MODE_HYBRID
      ? getProgramForWeekDay(trainingWeek, trainingDay)
      : getSplitProgramForDay(trainingDay);
  const currentProgramLabel =
    trainingMode === TRAINING_MODE_HYBRID
      ? getPlanForDay(trainingWeek, trainingDay)
        ? `Program ${getPlanForDay(trainingWeek, trainingDay)}`
        : ''
      : trainingDay >= 1 && trainingDay <= 4
        ? `เฉพาะจุด · ${getSplitDayLabel(trainingDay)}`
        : '';
  const currentDayIds =
    trainingMode === TRAINING_MODE_HYBRID
      ? getCurrentDayExerciseIds(trainingWeek, trainingDay)
      : trainingDay >= 1 && trainingDay <= 4
        ? getSplitDayExerciseIds(trainingDay)
        : [];
  const trainingDoneCount = currentDayIds.filter((id) => completedIdsCurrent[id]).length;
  const trainingTotalCount = currentDayIds.length;
  const trainingAllDone = trainingTotalCount > 0 && trainingDoneCount === trainingTotalCount;

  const currentSessionWeights = currentSessionDate ? weightHistory[currentSessionDate] || {} : {};
  const getLastWeightForExercise = (exerciseId) => {
    if (!currentSessionDate) return null;
    const dates = Object.keys(weightHistory).filter((d) => d < currentSessionDate && weightHistory[d][exerciseId] != null).sort();
    if (dates.length === 0) return null;
    return weightHistory[dates[dates.length - 1]][exerciseId];
  };
  /** ประวัติน้ำหนักท่านี้ (ทุกวันที่บันทึก) เรียงจากใหม่ไปเก่า สูงสุด 6 ครั้ง */
  const getWeightHistoryForExercise = (exerciseId) => {
    const entries = Object.entries(weightHistory)
      .filter(([, session]) => session[exerciseId] != null)
      .map(([date, session]) => ({ date, weight: session[exerciseId] }))
      .sort((a, b) => (a.date > b.date ? -1 : 1))
      .slice(0, 6);
    return entries;
  };
  /** คำแนะนำสำหรับครั้งนี้: น้ำหนัก/เวลาล่าสุด แนวโน้ม และข้อความแนะนำ (unit = 'kg' หรือ 's') */
  const getWeightSuggestion = (exerciseId, unit = 'kg') => {
    const history = getWeightHistoryForExercise(exerciseId);
    const beforeToday = currentSessionDate ? history.filter((h) => h.date < currentSessionDate) : [];
    const last = beforeToday[0];
    const prev = beforeToday[1];
    if (!last) return { lastWeight: null, trend: null, suggestText: null };
    const lastWeight = last.weight;
    const step = unit === 's' ? '5 s' : '2.5 kg';
    if (!prev) return { lastWeight, trend: null, suggestText: `ใช้ ${lastWeight} ${unit} เท่าเดิม หรือลองเพิ่ม ${step}` };
    const prevWeight = prev.weight;
    const trend = lastWeight > prevWeight ? 'up' : lastWeight < prevWeight ? 'down' : 'same';
    const trendText = trend === 'up' ? 'แนวโน้มเพิ่ม' : trend === 'down' ? 'ลดลง' : 'เท่าเดิม';
    const suggestText = trend === 'same'
      ? `ใช้ ${lastWeight} ${unit} เท่าเดิม หรือลองเพิ่ม ${step}`
      : `ใช้ ${lastWeight} ${unit} (${trendText})`;
    return { lastWeight, prevWeight, trend, suggestText };
  };
  const setExerciseWeight = (exerciseId, value) => {
    if (!currentSessionDate) return;
    const trimmed = value === null ? '' : String(value).trim();
    if (trimmed === '') {
      setWeightHistory((prev) => {
        const session = { ...(prev[currentSessionDate] || {}) };
        delete session[exerciseId];
        return { ...prev, [currentSessionDate]: session };
      });
      return;
    }
    const num = Number(trimmed);
    if (Number.isNaN(num) || num < 0) return;
    setWeightHistory((prev) => ({
      ...prev,
      [currentSessionDate]: { ...(prev[currentSessionDate] || {}), [exerciseId]: num },
    }));
  };

  useEffect(() => {
    const key = user ? getTrainingStorageKey(user.id) : null;
    if (!key) return;
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          trainingMode,
          day: trainingDay,
          place: trainingPlace,
          completedIds: trainingCompletedIds,
          sessionDateByDay,
          weightHistory,
          week: trainingWeek,
          notes: trainingNotes,
          sessionRecords,
        })
      );
    } catch (_) {}
  }, [user, trainingMode, trainingDay, trainingPlace, trainingCompletedIds, sessionDateByDay, weightHistory, trainingWeek, trainingNotes, sessionRecords]);

  const lastSavedForCurrentSession = sessionRecords
    .filter((r) => {
      const modeMatch = r.mode === trainingMode || (!r.mode && trainingMode === TRAINING_MODE_HYBRID);
      return (
        modeMatch &&
        r.sessionDate === currentSessionDate &&
        r.week === trainingWeek &&
        r.day === trainingDay
      );
    })
    .sort((a, b) => (b.savedAt > a.savedAt ? 1 : -1))[0];
  const saveSessionRecord = () => {
    if (!currentSessionDate) return;
    if (trainingMode === TRAINING_MODE_HYBRID && trainingDay === 4) return;
    if (trainingMode === TRAINING_MODE_SPLIT && (trainingDay < 1 || trainingDay > 4)) return;
    const weightsToSave = { ...currentSessionWeights };
    currentDayIds.forEach((id) => {
      if (weightsToSave[id] == null) {
        const last = getLastWeightForExercise(id);
        if (last != null) weightsToSave[id] = last;
      }
    });
    const planLabel =
      trainingMode === TRAINING_MODE_HYBRID
        ? getPlanForDay(trainingWeek, trainingDay)
        : `Split · ${getSplitDayLabel(trainingDay)}`;
    setSessionRecords((prev) =>
      prev.concat({
        sessionDate: currentSessionDate,
        savedAt: new Date().toISOString(),
        week: trainingWeek,
        day: trainingDay,
        mode: trainingMode,
        plan: planLabel,
        weights: weightsToSave,
      })
    );
    setWeightHistory((prev) => ({
      ...prev,
      [currentSessionDate]: { ...(prev[currentSessionDate] || {}), ...weightsToSave },
    }));
  };

  const toggleTrainingDone = (id) => {
    setTrainingCompletedIds((prev) => {
      const modeMap = { ...(prev[trainingMode] || {}) };
      modeMap[id] = !modeMap[id];
      return { ...prev, [trainingMode]: modeMap };
    });
  };

  const clearTodayTraining = () => {
    if (!window.confirm('ล้างการติ๊กทั้งหมดของวันนี้?')) return;
    setTrainingCompletedIds((prev) => {
      const modeMap = { ...(prev[trainingMode] || {}) };
      currentDayIds.forEach((id) => {
        delete modeMap[id];
      });
      return { ...prev, [trainingMode]: modeMap };
    });
  };
  const toggleActivity = (id) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)));
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getLocation = () => {
    if (isSimulatingNearHome) {
      setCurrentLocation({ lat: 13.8474, lng: 100.498 });
      setDistance(10);
      setLocationError('');
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('บราวเซอร์ไม่รองรับ GPS');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        const dist = calculateDistance(HOME_COORDS.lat, HOME_COORDS.lng, latitude, longitude);
        setDistance(Math.round(dist));
        setLocationError('');
      },
      (error) => {
        setLocationError('กรุณาเปิด GPS ในมือถือครับ');
      }
    );
  };

  useEffect(() => {
    if (user) {
      getLocation();
      const interval = setInterval(getLocation, 10000);
      return () => clearInterval(interval);
    }
  }, [user, isSimulatingNearHome]);

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = FAMILY_MEMBERS[pin];
    if (foundUser) {
      setUser({ ...foundUser, id: pin });
      setPin('');
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
      setPin('');
    }
  };

  const handleToggleGate = () => {
    if (user.role === 'dad') {
      openGateAction();
    } else {
      if (distance === null) {
        alert('กำลังหาพิกัด GPS...');
        return;
      }
      if (distance <= MAX_DISTANCE_METERS) {
        openGateAction();
      } else {
        alert(`อยู่ห่างจากบ้าน ${distance} เมตร (ต้องใกล้กว่า ${MAX_DISTANCE_METERS} ม.)`);
      }
    }
  };

  const openGateAction = () => {
    setGateOpen(true);
    setTimeout(() => {
      setGateOpen(false);
    }, 10000);
  };

  // ==========================================
  // 🎨 UI: สไตล์ Dark Mode สุดเท่ แบบพรีเมียม
  // ==========================================

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4 font-sans text-white">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 w-full max-w-sm text-center transform transition-all hover:scale-[1.02]">
          
          <div className="bg-gradient-to-tr from-cyan-500 to-blue-500 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
            ประตูรั้วบ้านนนท์
          </h1>
          <p className="text-slate-400 mb-8 text-sm">ควบคุมผ่านมือถือ</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength="4"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN CODE"
              className="w-full text-center text-3xl tracking-[1em] p-4 bg-black/30 border border-slate-600 rounded-2xl mb-6 text-cyan-300 placeholder-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none transition-all"
            />
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-cyan-500/30 hover:from-cyan-500 hover:to-blue-500 transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              Authenticate
            </button>
          </form>
          
          <div className="mt-8 text-xs text-slate-500 text-left bg-black/20 p-4 rounded-xl border border-white/5">
            <p className="text-cyan-400 mb-1">🛠 TEST ACCOUNTS:</p>
            <p>Admin (Dad): 1111</p>
            <p>User (Kid): 2222</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white font-sans pb-28">
      <div className="w-full max-w-md mx-auto px-4 pt-4">
        {/* Top Bar - Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/10 flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-white/10">
              <User className="text-cyan-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">ผู้ใช้</p>
              <p className="font-semibold text-slate-100">{user.name}</p>
            </div>
          </div>
          <button onClick={() => setUser(null)} className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'smarthome' && (
          <div className="space-y-4">
            {/* GPS Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="text-slate-400 w-5 h-5" />
                  <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">ตำแหน่ง</h2>
                </div>
                <button
                  type="button"
                  onClick={openGoogleMapsToHome}
                  className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                  title="นำทางกลับบ้านด้วย Google Maps"
                >
                  <Navigation className="w-5 h-5" />
                </button>
              </div>
              {locationError ? (
                <p className="text-red-400 text-sm flex items-center gap-2 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {locationError}
                </p>
              ) : distance !== null ? (
                <div className="flex justify-between items-end bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-slate-400 text-sm">ระยะจากบ้าน</p>
                  <p className={`text-2xl font-black ${distance <= MAX_DISTANCE_METERS ? 'text-emerald-400' : 'text-amber-500'}`}>
                    {distance} <span className="text-sm font-normal text-slate-500">ม.</span>
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                  <p className="text-slate-400 text-sm">กำลังหาสัญญาณ GPS...</p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 shrink-0 ${user.role === 'dad' ? 'text-cyan-400' : 'text-emerald-400'}`} />
                <span className="text-xs text-slate-400">
                  {user.role === 'dad' ? 'Admin: เปิดได้ทุกที่' : `ต้องอยู่ใกล้บ้าน &lt; ${MAX_DISTANCE_METERS} ม.`}
                </span>
              </div>
            </div>

            {/* Gate Button */}
            <div className="flex flex-col items-center py-6">
              <div className="relative group">
                <div className={`absolute -inset-1 rounded-full blur-xl opacity-50 transition duration-1000 ${gateOpen ? 'bg-emerald-500' : 'bg-cyan-500/60 group-hover:opacity-75'}`} />
                <button
                  onClick={handleToggleGate}
                  disabled={gateOpen}
                  className={`relative flex flex-col items-center justify-center w-56 h-56 rounded-full border-2 shadow-2xl transition-all duration-300 ${
                    gateOpen
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-400/50'
                      : 'bg-white/5 backdrop-blur-xl border-white/20 hover:border-cyan-400/50 active:scale-95'
                  }`}
                >
                  {gateOpen ? (
                    <>
                      <Unlock className="w-14 h-14 text-white mb-2 drop-shadow-md animate-bounce" />
                      <span className="text-white text-lg font-bold tracking-widest">ประตูเปิด</span>
                      <span className="text-emerald-200 text-xs mt-1 font-mono">ปิดอัตโนมัติ 10 วินาที</span>
                    </>
                  ) : (
                    <>
                      <Power className="w-16 h-16 text-cyan-400 mb-3 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                      <span className="text-slate-300 text-sm font-bold tracking-widest">แตะเพื่อเปิดประตู</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dev Tools */}
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isSimulatingNearHome}
                    onChange={(e) => setIsSimulatingNearHome(e.target.checked)}
                    className="sr-only peer"
                  />
                    <div className="relative w-10 h-6 bg-slate-700 rounded-full peer-checked:bg-cyan-500/80 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                </div>
                <span className="text-slate-400 text-xs">จำลองอยู่ใกล้บ้าน (Dev)</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'exercise' && (
          <div className="space-y-4 pb-2">
            {/* หัวข้อ + เลือกโหมด: Hybrid 12 สัปดาห์ / เฉพาะจุด 4 วัน */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-cyan-400" />
                {trainingMode === TRAINING_MODE_HYBRID
                  ? 'แผนสร้างกล้ามเนื้อ 12 สัปดาห์ (3 เดือน)'
                  : 'แผนเฉพาะจุด · สัปดาห์ละ 4 วัน'}
              </h2>
              <p className="text-cyan-400/90 text-xs font-medium mt-1">บัญชี: {user?.name ?? '—'}</p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setTrainingMode(TRAINING_MODE_HYBRID);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    trainingMode === TRAINING_MODE_HYBRID
                      ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400/40'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  Hybrid A/B
                  <span className="block font-normal opacity-80 mt-0.5">3 วัน + พัก</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrainingMode(TRAINING_MODE_SPLIT);
                    setTrainingDay((d) => (d === 4 ? 1 : d));
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    trainingMode === TRAINING_MODE_SPLIT
                      ? 'bg-violet-500/25 text-violet-300 border-violet-400/40'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  เฉพาะจุด
                  <span className="block font-normal opacity-80 mt-0.5">อก · ไหล่ · หลัง · แขน</span>
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-3">
                {trainingMode === TRAINING_MODE_HYBRID
                  ? 'แผนเดิม Program A/B · แตะแต่ละท่าเพื่อบันทึก'
                  : 'เน้นทีละส่วน 4 วันต่อสัปดาห์ · YouTube + น้ำหนักเหมือนเดิม'}
              </p>
            </div>

            {/* ช่วงสัปดาห์: แสดงทีละ 3 สัปดาห์ */}
            <div className="space-y-2">
              <p className="text-slate-400 text-xs uppercase tracking-wider px-1">ช่วงสัปดาห์ (แสดงทีละ 3 สัปดาห์)</p>
              <div className="flex gap-2 flex-wrap">
                {[1, 4, 7, 10].map((start) => {
                  const end = start + 2;
                  const isActive = trainingWeek >= start && trainingWeek <= end;
                  return (
                    <button
                      key={start}
                      type="button"
                      onClick={() => setTrainingWeek(start)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'bg-cyan-500/25 text-cyan-400 border border-cyan-400/40' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      สัปดาห์ที่ {start}–{end}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 flex-wrap">
                {[0, 1, 2].map((i) => {
                  const w = Math.floor((trainingWeek - 1) / 3) * 3 + i + 1;
                  if (w > 12) return null;
                  const isActive = trainingWeek === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setTrainingWeek(w)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      สัปดาห์ที่ {w}
                    </button>
                  );
                })}
              </div>
              <p className="text-slate-500 text-xs px-1">
                {trainingMode === TRAINING_MODE_HYBRID ? (
                  <>
                    กำลังดู: สัปดาห์ที่ {trainingWeek} · วัน 1 ({getPlanForDay(trainingWeek, 1)}) / 2 ({getPlanForDay(trainingWeek, 2)}) / 3 (
                    {getPlanForDay(trainingWeek, 3)}) / พัก
                  </>
                ) : (
                  <>
                    กำลังดู: สัปดาห์ที่ {trainingWeek} · วัน 1 อก / วัน 2 ไหล่ / วัน 3 หลัง / วัน 4 แขน
                  </>
                )}
              </p>
              {trainingWeek < 12 && (
                <button
                  type="button"
                  onClick={() => setTrainingWeek((w) => Math.min(12, w + 1))}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-500/30 transition-colors text-sm font-medium"
                >
                  เลื่อนไปสัปดาห์ต่อไป
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* คำแนะนำการจัดตาราง & ขา/ท้อง — เฉพาะโหมดเฉพาะจุด */}
            {trainingMode === TRAINING_MODE_SPLIT && (
              <div className="rounded-2xl border border-violet-400/25 bg-violet-500/10 backdrop-blur-xl p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-violet-200">การจัดวัน & พัก</p>
                    <ul className="mt-2 space-y-2 text-slate-300 text-xs leading-relaxed list-disc list-inside marker:text-violet-400/80">
                      <li>
                        <strong className="text-slate-200 font-medium">กระจาย 4 วันในปฏิทิน</strong> ให้มีวันว่างระหว่างวันฝึกบ้าง (เช่น จันทร์–พุธว่าง แล้วพฤ–อาทิตย์ฝึก) เพื่อให้ส่วนบนฟื้นตัว
                      </li>
                      <li>
                        <strong className="text-slate-200 font-medium">หลังครบรอบ 4 วัน</strong> แนะนำพักเต็ม <strong className="text-violet-300">1–2 วัน</strong> ก่อนเริ่มรอบใหม่ หรือถ้าฝึกทับถี่ให้ดูตามความเหนื่อยของร่างกาย
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="pt-2 border-t border-violet-400/20">
                  <p className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400/90" />
                    ขาและกล้ามท้อง
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    ท่า<strong className="text-slate-300">กล้ามท้อง</strong>และ<strong className="text-slate-300">ขา</strong>ใส่ในตารางแล้ว (ป้าย «ท้ายวัน») — ทำหลังจบท่าหลักของวันนั้น โดยไม่แทรกระหว่างเซตหลัก
                  </p>
                </div>
              </div>
            )}

            {/* เลือกวัน: Hybrid = 1–3 + พัก · Split = 1–4 (อก ไหล่ หลัง แขน) */}
            {trainingMode === TRAINING_MODE_HYBRID ? (
              <div className="flex gap-2">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTrainingDay(d)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      trainingDay === d
                        ? 'bg-cyan-500/25 text-cyan-400 border border-cyan-400/40'
                        : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    วัน {d}
                    <span className="block text-xs opacity-80">{getPlanForDay(trainingWeek, d) ?? '-'}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setTrainingDay(4)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex flex-col items-center justify-center ${
                    trainingDay === 4 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  <span>พัก</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTrainingDay(d)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                      trainingDay === d
                        ? 'bg-violet-500/25 text-violet-300 border-violet-400/45'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    วัน {d}
                    <span className="block text-xs opacity-90 mt-0.5">{TARGET_SPLIT_DAY_LABELS[d - 1]}</span>
                  </button>
                ))}
              </div>
            )}

            {/* วันพักผ่อน (Rest Day) — เฉพาะโหมด Hybrid */}
            {trainingMode === TRAINING_MODE_HYBRID && trainingDay === 4 && (
              <div className="bg-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20 text-center">
                <Coffee className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-100">วันพักผ่อน (Rest Day)</h3>
                <p className="text-slate-300 text-sm mt-2">ดื่มน้ำ 2.5–3 ลิตร</p>
                <p className="text-slate-300 text-sm">กินโปรตีนให้ถึงเป้า</p>
                <p className="text-slate-400 text-xs mt-4">วันต่อไป: กลับไปวัน 1 (Program {getPlanForDay(trainingWeek, 1) ?? 'A'})</p>
              </div>
            )}

            {/* Gym / Home + Progress */}
            {((trainingMode === TRAINING_MODE_HYBRID && trainingDay !== 4) ||
              (trainingMode === TRAINING_MODE_SPLIT && trainingDay >= 1 && trainingDay <= 4)) && (
              <>
                {/* วันที่ฝึก (แยกตามโหมด + วัน) */}
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                  <Calendar className="w-5 h-5 text-cyan-400 shrink-0" />
                  <label className="text-slate-300 text-sm font-medium shrink-0">
                    วันที่ฝึก
                    {trainingMode === TRAINING_MODE_SPLIT && (
                      <span className="text-violet-400/90"> ({getSplitDayLabel(trainingDay)})</span>
                    )}
                    :
                  </label>
                  <input
                    type="date"
                    value={currentSessionDate ?? ''}
                    onChange={(e) =>
                      setSessionDateByDay((prev) => ({
                        ...prev,
                        [trainingMode]: {
                          ...(prev[trainingMode] || {}),
                          [trainingDay]: e.target.value,
                        },
                      }))
                    }
                    className="flex-1 min-w-0 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setTrainingPlace('gym')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      trainingPlace === 'gym' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    ยิม
                  </button>
                  <button
                    onClick={() => setTrainingPlace('home')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      trainingPlace === 'home' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    บ้าน/โรงแรม
                  </button>
                </div>

                {/* Progress + ล้างการติ๊ก */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>ทำแล้ว {trainingDoneCount} / {trainingTotalCount} ท่า</span>
                      {trainingAllDone && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" /> ทำครบแล้ว
                        </span>
                      )}
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${trainingTotalCount ? (100 * trainingDoneCount) / trainingTotalCount : 0}%` }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearTodayTraining}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 text-xs font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    ล้างวันนี้
                  </button>
                </div>

                <p className="text-slate-400 text-xs uppercase tracking-wider px-1">
                  วันนี้: {currentProgramLabel} · {trainingPlace === 'gym' ? 'ท่าที่ยิม' : 'ท่าทดแทนที่บ้าน'}
                </p>

                {currentProgram.map((ex) => {
              const name = trainingPlace === 'gym' ? ex.nameGym : ex.nameHome;
              const done = completedIdsCurrent[ex.id];
              const repDisplay = ex.unit ? `${ex.reps} ${ex.unit}` : ex.reps;
              const isWarmup = ex.reps === '-' || ex.id === 'a0' || ex.id === 'b0';
              const inputUnit = ex.inputUnit || 'kg';
              const currentWeight = currentSessionWeights[ex.id];
              const lastWeight = getLastWeightForExercise(ex.id);
              const displayValue = currentWeight != null ? currentWeight : lastWeight;
              const searchKey = getExerciseSearchKey(ex, trainingPlace);
              return (
                <div
                  key={ex.id}
                  className="w-full flex items-center gap-2 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-cyan-400/20 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleTrainingDone(ex.id)}
                    className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 text-left active:scale-[0.99]"
                  >
                    {done ? (
                      <Check className="w-6 h-6 text-emerald-400 shrink-0 rounded-full bg-emerald-400/20 p-1" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 shrink-0" />
                    )}
                    {trainingMode === TRAINING_MODE_SPLIT && /^sp_/.test(ex.id) && (
                      <SplitPoseThumb exerciseId={ex.id} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${done ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {ex.sets} เซต {repDisplay !== '-' ? `· ${repDisplay}` : ''}
                        {ex.badge && (
                          <span className={`ml-2 text-xs ${trainingMode === TRAINING_MODE_SPLIT ? 'text-violet-400/90' : 'text-amber-400/80'}`}>
                            · {ex.badge}
                          </span>
                        )}
                      </p>
                      {!isWarmup && (() => {
                        const suggestion = getWeightSuggestion(ex.id, inputUnit);
                        const history = getWeightHistoryForExercise(ex.id);
                        return (
                          <div className="mt-2 space-y-1.5">
                            {suggestion.lastWeight != null && (
                              <p className="text-cyan-400/90 text-xs font-medium">
                                ครั้งก่อน: <span className="text-emerald-400/95">{suggestion.lastWeight} {inputUnit}</span>
                                {suggestion.suggestText != null && (
                                  <span className="block text-emerald-400/90 font-normal mt-0.5">แนะนำ: {suggestion.suggestText}</span>
                                )}
                              </p>
                            )}
                            {history.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                <span className="text-slate-500 text-[10px] uppercase tracking-wider self-center">สถิติ:</span>
                                {history.map(({ date, weight }) => (
                                  <span
                                    key={date}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[11px] border border-white/10"
                                  >
                                    {formatDateThai(date)} {weight} {inputUnit}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </button>
                  <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openYouTubeSearch(searchKey)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="ดูตัวอย่างใน YouTube"
                    >
                      <Youtube className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openGoogleImageSearch(searchKey)}
                      className="p-2 rounded-lg bg-slate-500/20 text-slate-300 hover:bg-slate-500/30 transition-colors"
                      title="ดูภาพใน Google"
                    >
                      <Image className="w-5 h-5" />
                    </button>
                    {(ex.id === PLANK_EXERCISE_ID ||
                      (trainingMode === TRAINING_MODE_SPLIT && ex.inputUnit === 's')) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          ensurePlankAudio();
                          const workSec = parsePlankDefaultSeconds(displayValue, ex);
                          const totalSets = Math.min(10, Math.max(1, Number(ex.sets) || 3));
                          setPlankTimer({
                            open: true,
                            running: false,
                            paused: false,
                            phase: 'idle',
                            workSec,
                            totalSets,
                            currentSet: 1,
                            remaining: 0,
                          });
                        }}
                        className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors border border-cyan-400/25"
                        title="จับเวลา Plank · พัก 1 นาทีระหว่างเซต"
                      >
                        <Timer className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {!isWarmup && (
                    <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center gap-1">
                      <Weight className="w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        inputMode={inputUnit === 's' ? 'numeric' : 'decimal'}
                        min="0"
                        step={inputUnit === 's' ? 1 : 0.5}
                        placeholder={inputUnit}
                        value={displayValue != null ? String(displayValue) : ''}
                        onChange={(e) => setExerciseWeight(ex.id, e.target.value)}
                        className="w-14 text-right bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-slate-100 text-sm focus:border-cyan-400/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-slate-500 text-xs">{inputUnit}</span>
                    </div>
                  )}
                </div>
              );
            })}

                {/* โฟกัสหัวไหล่กว้าง (พิเศษ) — เฉพาะโหมด Hybrid */}
                {trainingMode === TRAINING_MODE_HYBRID && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-amber-400/90 text-sm font-semibold flex items-center gap-2 mb-3 px-1">
                    <Sparkles className="w-4 h-4" />
                    พิเศษ: โฟกัสหัวไหล่ให้กว้าง
                  </p>
                  {SHOULDER_EXTRA.map((ex) => {
                    const name = trainingPlace === 'gym' ? ex.nameGym : ex.nameHome;
                    const done = completedIdsCurrent[ex.id];
                    const inputUnit = ex.inputUnit || 'kg';
                    const currentWeight = currentSessionWeights[ex.id];
                    const lastWeight = getLastWeightForExercise(ex.id);
                    const displayValue = currentWeight != null ? currentWeight : lastWeight;
                    const searchKey = getExerciseSearchKey(ex, trainingPlace);
                    return (
                      <div
                        key={ex.id}
                        className="w-full flex items-center gap-2 p-4 bg-amber-500/5 backdrop-blur-xl rounded-2xl border border-amber-400/20 hover:border-amber-400/30 transition-all mb-2"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTrainingDone(ex.id)}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left active:scale-[0.99]"
                        >
                          {done ? (
                            <Check className="w-6 h-6 text-emerald-400 shrink-0 rounded-full bg-emerald-400/20 p-1" />
                          ) : (
                            <Circle className="w-6 h-6 text-amber-400/60 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${done ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{name}</p>
                            <p className="text-slate-400 text-xs mt-0.5">
                              {ex.sets} เซต · {ex.reps} {ex.unit}
                              {ex.badge && (
                                <span className="ml-2 text-amber-400/80 text-xs">· {ex.badge}</span>
                              )}
                            </p>
                            {(() => {
                              const suggestion = getWeightSuggestion(ex.id, inputUnit);
                              const history = getWeightHistoryForExercise(ex.id);
                              return (
                                <div className="mt-2 space-y-1.5">
                                  {suggestion.lastWeight != null && (
                                    <p className="text-cyan-400/90 text-xs font-medium">
                                      ครั้งก่อน: <span className="text-emerald-400/95">{suggestion.lastWeight} {inputUnit}</span>
                                      {suggestion.suggestText != null && (
                                        <span className="block text-emerald-400/90 font-normal mt-0.5">แนะนำ: {suggestion.suggestText}</span>
                                      )}
                                    </p>
                                  )}
                                  {history.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                      <span className="text-slate-500 text-[10px] uppercase tracking-wider self-center">สถิติ:</span>
                                      {history.map(({ date, weight }) => (
                                        <span
                                          key={date}
                                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[11px] border border-white/10"
                                        >
                                          {formatDateThai(date)} {weight} {inputUnit}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </button>
                        <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openYouTubeSearch(searchKey)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="ดูตัวอย่างใน YouTube"
                          >
                            <Youtube className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openGoogleImageSearch(searchKey)}
                            className="p-2 rounded-lg bg-slate-500/20 text-slate-300 hover:bg-slate-500/30 transition-colors"
                            title="ดูภาพใน Google"
                          >
                            <Image className="w-5 h-5" />
                          </button>
                        </div>
                        <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center gap-1">
                          <Weight className="w-4 h-4 text-slate-500" />
                          <input
                            type="number"
                            inputMode={inputUnit === 's' ? 'numeric' : 'decimal'}
                            min="0"
                            step={inputUnit === 's' ? 1 : 0.5}
                            placeholder={inputUnit}
                            value={displayValue != null ? String(displayValue) : ''}
                            onChange={(e) => setExerciseWeight(ex.id, e.target.value)}
                            className="w-14 text-right bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-slate-100 text-sm focus:border-cyan-400/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-slate-500 text-xs">{inputUnit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}

                {/* เมื่อทำครบทั้งวัน: ปุ่มบันทึก น้ำหนัก + วันเวลา */}
                {trainingAllDone && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    {lastSavedForCurrentSession ? (
                      <p className="text-slate-400 text-xs">
                        บันทึกแล้วเมื่อ {formatSavedAt(lastSavedForCurrentSession.savedAt)}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={saveSessionRecord}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-500/30 transition-colors text-sm font-medium"
                    >
                      <Save className="w-5 h-5" />
                      บันทึก น้ำหนักที่ทำได้ + วันเวลาที่บันทึก
                    </button>
                    <p className="text-slate-500 text-[10px] text-center">
                      เก็บไว้เป็นข้อมูลอ้างอิง (สัปดาห์ที่ {trainingWeek} · วันที่ {trainingDay} ·{' '}
                      {trainingMode === TRAINING_MODE_HYBRID
                        ? `Plan ${getPlanForDay(trainingWeek, trainingDay)}`
                        : `เฉพาะจุด · ${getSplitDayLabel(trainingDay)}`}
                    </p>
                  </div>
                )}
              </>
            )}

            {plankTimer.open && (
              <div
                className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="plank-timer-title"
                onClick={() => {
                  if (!plankTimer.running && plankTimer.phase !== 'rest' && plankTimer.phase !== 'work') {
                    setPlankTimer(createInitialPlankTimer());
                  }
                }}
              >
                <div
                  className="w-full max-w-sm rounded-2xl border border-cyan-400/20 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-5 space-y-4 max-h-[88vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 id="plank-timer-title" className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <Timer className="w-5 h-5 text-cyan-400 shrink-0" />
                      จับเวลา Plank
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setPlankTimer(createInitialPlankTimer());
                      }}
                      className="text-slate-400 hover:text-slate-200 text-xs font-medium px-2 py-1 rounded-lg bg-white/5 border border-white/10"
                    >
                      ปิด
                    </button>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed">
                    ถือท่าตามวินาทีที่ตั้ง → เสียงเตือน → พัก {PLANK_REST_SECONDS / 60} นาที → เริ่มเซตถัดไป ครบ {plankTimer.totalSets} เซต
                  </p>

                  {plankTimer.phase === 'idle' && (
                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">เวลาถือท่า (วินาที)</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={10}
                        max={600}
                        step={1}
                        value={plankTimer.workSec}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (Number.isFinite(v)) {
                            setPlankTimer((p) => ({ ...p, workSec: Math.min(600, Math.max(10, v)) }));
                          }
                        }}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-lg font-mono text-center focus:border-cyan-400/50 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          ensurePlankAudio();
                          setPlankTimer((p) => ({
                            ...p,
                            running: true,
                            paused: false,
                            phase: 'work',
                            currentSet: 1,
                            remaining: p.workSec,
                          }));
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-500/25 text-cyan-300 border border-cyan-400/35 hover:bg-cyan-500/35 font-semibold text-sm"
                      >
                        <Play className="w-5 h-5" />
                        เริ่มจับเวลา
                      </button>
                    </div>
                  )}

                  {(plankTimer.phase === 'work' || plankTimer.phase === 'rest') && (
                    <div className="space-y-4 text-center">
                      <p className="text-cyan-400/90 text-sm font-medium">
                        {plankTimer.phase === 'work' ? 'ถือท่า Plank' : 'พัก (เตรียมเซตถัดไป)'}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {plankTimer.phase === 'work'
                          ? `กำลังเซต ${plankTimer.currentSet} / ${plankTimer.totalSets}`
                          : `พักก่อนเซต ${plankTimer.currentSet + 1} / ${plankTimer.totalSets} · ถัดไปถือ ${plankTimer.workSec} s`}
                      </p>
                      <div
                        className={`text-5xl sm:text-6xl font-mono font-bold tabular-nums tracking-tight ${
                          plankTimer.phase === 'work' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {plankTimer.remaining >= 60 ? (
                          formatPlankCountdown(plankTimer.remaining)
                        ) : (
                          <>
                            {plankTimer.remaining}
                            <span className="text-lg font-normal text-slate-500 ml-1">s</span>
                          </>
                        )}
                      </div>
                      {plankTimer.paused && (
                        <p className="text-amber-400/80 text-xs font-medium">หยุดชั่วคราว</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            ensurePlankAudio();
                            setPlankTimer((p) => ({ ...p, paused: !p.paused }));
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-slate-200 border border-white/15 text-sm font-medium"
                        >
                          {plankTimer.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          {plankTimer.paused ? 'ทำต่อ' : 'หยุดชั่วคราว'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPlankTimer((p) => ({
                              ...createInitialPlankTimer(),
                              open: true,
                              workSec: p.workSec,
                              totalSets: p.totalSets,
                            }));
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/15 text-red-300 border border-red-400/25 text-sm font-medium"
                        >
                          <Square className="w-4 h-4" />
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  )}

                  {plankTimer.phase === 'done' && (
                    <div className="space-y-4 text-center py-2">
                      <p className="text-emerald-400 font-semibold text-lg">ครบ {plankTimer.totalSets} เซตแล้ว</p>
                      <p className="text-slate-500 text-xs">ดีมาก — พักยืดตัวเบาๆ ได้เลย</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPlankTimer(createInitialPlankTimer());
                        }}
                        className="w-full py-3 rounded-xl bg-white/10 text-slate-200 border border-white/15 text-sm font-medium"
                      >
                        ปิด
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* โน๊ต: บันทึกสิ่งที่จำเป็น (แยกตามบัญชีสมาชิก) */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <label className="block text-sm font-semibold text-slate-300 mb-2">โน๊ต · บันทึกสิ่งที่จำเป็น</label>
              <textarea
                value={trainingNotes}
                onChange={(e) => setTrainingNotes(e.target.value)}
                placeholder="เช่น น้ำหนักเป้า สัปดาห์นี้, อาการบาดเจ็บ, วันที่หยุดยิม..."
                rows={3}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none resize-y min-h-[80px]"
              />
              <p className="text-slate-500 text-[10px] mt-1">บันทึกอัตโนมัติตามบัญชีที่ล็อกอิน</p>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-3">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mb-2">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-cyan-400" />
                กิจกรรมของบ้าน
              </h2>
              <p className="text-slate-400 text-sm mt-1">สิ่งที่ต้องทำในบ้าน · แตะเพื่อทำเครื่องหมายว่าทำแล้ว</p>
            </div>

            {/* สมาชิกในบ้าน: ป๋าเอส + พู พี พลอส พัตเตอร์ */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">สมาชิกในบ้าน</h3>
              <div className="flex flex-wrap gap-2">
                {HOUSEHOLD_MEMBERS.map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm"
                  >
                    {m.name}
                  </span>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-3">ป๋าเอส + พู · พี · พลอส · พัตเตอร์ (ใส่ตัวอย่างหน้าที่ไว้แล้ว)</p>
              <p className="text-slate-600 text-[10px] mt-1">ข้อมูลเดียวกันทุกอุปกรณ์ · ถ้ามือถือไม่ตรง ให้ล้างแคชหรือรีเฟรช</p>
            </div>

            <h3 className="text-sm font-semibold text-slate-400 px-1">รายการหน้าที่ · ใครทำอะไร</h3>
            {activities.map((a) => {
              const assignee = a.assigneeId ? HOUSEHOLD_MEMBERS.find((m) => m.id === a.assigneeId) : null;
              return (
                <button
                  key={a.id}
                  onClick={() => toggleActivity(a.id)}
                  className="w-full flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all text-left active:scale-[0.99]"
                >
                  {a.done ? (
                    <Check className="w-6 h-6 text-emerald-400 shrink-0 rounded-full bg-emerald-400/20 p-1" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${a.done ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{a.title}</p>
                    {assignee && (
                      <p className="text-cyan-400/90 text-xs mt-0.5">หน้าที่: {assignee.name}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar - Glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-2 bg-slate-900/80 backdrop-blur-xl border-t border-white/10" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <div className="flex justify-around items-center rounded-2xl bg-white/5 border border-white/10 p-2 shadow-xl">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all min-w-[80px] ${
                  isActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-cyan-400' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}