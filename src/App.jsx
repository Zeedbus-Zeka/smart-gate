import React, { useState, useEffect } from 'react';
import { MapPin, Unlock, User, AlertCircle, LogOut, ShieldCheck, Power, Home, Dumbbell, ClipboardList, Check, Circle, Building2, Sparkles, Coffee, RotateCcw, Trophy, Calendar, Weight, Youtube, Image } from 'lucide-react';

// ==========================================
// 📍 ตั้งค่าพิกัดบ้าน (Latitude, Longitude)
// ==========================================
const HOME_COORDS = { lat: 13.8473095, lng: 100.4979925 };
const MAX_DISTANCE_METERS = 100; 

// ==========================================
// 👨‍👩‍👧‍👦 ฐานข้อมูลสมาชิก
// ==========================================
const FAMILY_MEMBERS = {
  '1111': { name: 'ปะป๋าเอส (Admin)', role: 'dad' },
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
const TRAINING_PROGRAM_A = [
  { id: 'a0', nameGym: 'Warm-up: ปั่นจักรยาน/เดินชัน 10 นาที', nameHome: 'ย่ำเท้าอยู่กับที่ / แกว่งแขน 5 นาที', sets: 1, reps: '-', unit: '', searchKey: 'treadmill incline walk warm up' },
  { id: 'a1', nameGym: 'Goblet Squat (8-10 kg)', nameHome: 'Bodyweight Squat ลุกนั่งมือเปล่า 15-20 ครั้ง', sets: 3, reps: '12', unit: 'ครั้ง', searchKey: 'Goblet Squat how to' },
  { id: 'a2', nameGym: 'Chest Press Machine (15-20 kg)', nameHome: 'Board Push-up 🔵 สีน้ำเงิน (อก)', sets: 3, reps: '10-15', unit: 'ครั้ง', searchKey: 'Chest Press Machine gym' },
  { id: 'a3', nameGym: 'Lat Pulldown (20-25 kg)', nameHome: 'Board Push-up 🟡 สีเหลือง (หลัง) จังหวะยุบตัวบีบสะบัก', sets: 3, reps: '10-15', unit: 'ครั้ง', searchKey: 'Lat Pulldown how to' },
  { id: 'a4', nameGym: 'Dumbbell Shoulder Press (4-6 kg/ข้าง)', nameHome: 'Board Push-up 🔴 สีแดง (ไหล่)', sets: 3, reps: '8-12', unit: 'ครั้ง', searchKey: 'Dumbbell Shoulder Press' },
  { id: 'a5', nameGym: 'Plank แกนกลาง', nameHome: 'Plank (ทำเหมือนเดิม)', sets: 3, reps: '45', unit: 'วินาที', searchKey: 'Plank exercise form' },
];

const TRAINING_PROGRAM_B = [
  { id: 'b0', nameGym: 'Warm-up: เดินชัน (Incline Walk) 10 นาที', nameHome: 'Jumping Jacks กระโดดตบเบาๆ 5 นาที', sets: 1, reps: '-', unit: '', searchKey: 'incline walk treadmill' },
  { id: 'b1', nameGym: 'Leg Press Machine (30-40 kg)', nameHome: 'Lunges ก้าวเท้าย่อตัวสลับซ้าย-ขวา ข้างละ 10 ครั้ง', sets: 3, reps: '12', unit: 'ครั้ง', searchKey: 'Leg Press Machine gym' },
  { id: 'b2', nameGym: 'Seated Cable Row (20-25 kg)', nameHome: 'Board Push-up 🟡 สีเหลือง (หลัง) เกร็งค้างตอนตัวลงต่ำสุด', sets: 3, reps: '10-15', unit: 'ครั้ง', searchKey: 'Seated Cable Row' },
  { id: 'b3', nameGym: 'Dumbbell Incline Press (อกบน)', nameHome: 'Decline Board Push-up 🔵 เอาเท้าพาดบนเตียง/เก้าอี้ แล้ววิดพื้น', sets: 3, reps: '10-12', unit: 'ครั้ง', searchKey: 'Dumbbell Incline Press' },
  { id: 'b4', nameGym: 'Dumbbell Biceps Curl (5-7 kg/ข้าง)', nameHome: 'ยกกระเป๋าเป้ใส่หนังสือ/ขวดน้ำ (พับศอกยก)', sets: 2, reps: '12-15', unit: 'ครั้ง', searchKey: 'Dumbbell Biceps Curl' },
  { id: 'b5', nameGym: 'Triceps Rope Pushdown (10-15 kg)', nameHome: 'Board Push-up 🟢 สีเขียว (หลังแขน) ศอกหนีบลำตัว', sets: 2, reps: '10-15', unit: 'ครั้ง', searchKey: 'Triceps Rope Pushdown' },
];

// พิเศษ: โฟกัสหัวไหล่ให้กว้าง (เพิ่มทุกวันที่ฝึก)
const SHOULDER_EXTRA = [
  { id: 's1', nameGym: 'Lateral Raise (4-6 kg/ข้าง)', nameHome: 'ยกขวดน้ำด้านข้าง แขนตรง', sets: 3, reps: '12-15', unit: 'ครั้ง', badge: 'หัวไหล่กว้าง', searchKey: 'Lateral Raise dumbbell' },
  { id: 's2', nameGym: 'Cable/Band Lateral Raise หรือ Reverse Fly', nameHome: 'ยางยืดยกด้านข้าง / ดึงยางด้านหลัง', sets: 2, reps: '15', unit: 'ครั้ง', badge: 'หัวไหล่กว้าง', searchKey: 'Cable Lateral Raise Reverse Fly' },
];

const TRAINING_STORAGE_KEY = 'smartgate_training';
const getCurrentDayExerciseIds = (day) => {
  if (day === 4) return [];
  const program = day === 2 ? TRAINING_PROGRAM_B : TRAINING_PROGRAM_A;
  return [...program.map((e) => e.id), ...SHOULDER_EXTRA.map((e) => e.id)];
};

const toDateKey = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
const todayKey = () => toDateKey(new Date());

const THAI_MONTH_ABBR = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const formatDateThai = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  return `${d} ${THAI_MONTH_ABBR[m - 1]}`;
};

const getExerciseSearchKey = (ex) => ex.searchKey || ex.nameGym.replace(/\s*\([^)]*\)\s*$/, '').trim() || 'exercise';
const openYouTubeSearch = (query) => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' how to form')}`, '_blank', 'noopener,noreferrer');
const openGoogleImageSearch = (query) => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query + ' exercise')}`, '_blank', 'noopener,noreferrer');

// สมาชิกในบ้าน (ปะป๋าเอส + ลูก 4 คน: พู พี พลอส พัตเตอร์)
const HOUSEHOLD_MEMBERS = [
  { id: 'dad', name: 'ปะป๋าเอส' },
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
  const [trainingDay, setTrainingDay] = useState(() => {
    try {
      const s = localStorage.getItem(TRAINING_STORAGE_KEY);
      if (s) {
        const data = JSON.parse(s);
        if (data.day >= 1 && data.day <= 4) return data.day;
      }
    } catch (_) {}
    return 1;
  });
  const [trainingPlace, setTrainingPlace] = useState(() => {
    try {
      const s = localStorage.getItem(TRAINING_STORAGE_KEY);
      if (s) {
        const data = JSON.parse(s);
        if (data.place === 'gym' || data.place === 'home') return data.place;
      }
    } catch (_) {}
    return 'gym';
  });
  const [trainingCompletedIds, setTrainingCompletedIds] = useState(() => {
    try {
      const s = localStorage.getItem(TRAINING_STORAGE_KEY);
      if (s) {
        const data = JSON.parse(s);
        if (data.completedIds && typeof data.completedIds === 'object') return data.completedIds;
      }
    } catch (_) {}
    return {};
  });
  const [trainingSessionDate, setTrainingSessionDate] = useState(() => {
    try {
      const s = localStorage.getItem(TRAINING_STORAGE_KEY);
      if (s) {
        const data = JSON.parse(s);
        if (data.sessionDate && /^\d{4}-\d{2}-\d{2}$/.test(data.sessionDate)) return data.sessionDate;
      }
    } catch (_) {}
    return todayKey();
  });
  const [weightHistory, setWeightHistory] = useState(() => {
    try {
      const s = localStorage.getItem(TRAINING_STORAGE_KEY);
      if (s) {
        const data = JSON.parse(s);
        if (data.weightHistory && typeof data.weightHistory === 'object') return data.weightHistory;
      }
    } catch (_) {}
    return {};
  });

  const currentProgram = trainingDay === 2 ? TRAINING_PROGRAM_B : TRAINING_PROGRAM_A;
  const currentProgramLabel = trainingDay === 2 ? 'Program B' : 'Program A';
  const currentDayIds = getCurrentDayExerciseIds(trainingDay);
  const trainingDoneCount = currentDayIds.filter((id) => trainingCompletedIds[id]).length;
  const trainingTotalCount = currentDayIds.length;
  const trainingAllDone = trainingTotalCount > 0 && trainingDoneCount === trainingTotalCount;

  const currentSessionWeights = weightHistory[trainingSessionDate] || {};
  const getLastWeightForExercise = (exerciseId) => {
    const dates = Object.keys(weightHistory).filter((d) => d < trainingSessionDate && weightHistory[d][exerciseId] != null).sort();
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
  /** คำแนะนำสำหรับครั้งนี้: น้ำหนักล่าสุด แนวโน้ม และข้อความแนะนำ */
  const getWeightSuggestion = (exerciseId) => {
    const history = getWeightHistoryForExercise(exerciseId);
    const beforeToday = history.filter((h) => h.date < trainingSessionDate);
    const last = beforeToday[0];
    const prev = beforeToday[1];
    if (!last) return { lastWeight: null, trend: null, suggestText: null };
    const lastWeight = last.weight;
    if (!prev) return { lastWeight, trend: null, suggestText: `ใช้ ${lastWeight} kg เท่าเดิม หรือลองเพิ่ม 2.5 kg` };
    const prevWeight = prev.weight;
    const trend = lastWeight > prevWeight ? 'up' : lastWeight < prevWeight ? 'down' : 'same';
    const trendText = trend === 'up' ? 'แนวโน้มเพิ่ม' : trend === 'down' ? 'ลดลง' : 'เท่าเดิม';
    const suggestText = trend === 'same'
      ? `ใช้ ${lastWeight} kg เท่าเดิม หรือลองเพิ่ม 2.5 kg`
      : `ใช้ ${lastWeight} kg (${trendText})`;
    return { lastWeight, prevWeight, trend, suggestText };
  };
  const setExerciseWeight = (exerciseId, value) => {
    const trimmed = value === null ? '' : String(value).trim();
    if (trimmed === '') {
      setWeightHistory((prev) => {
        const session = { ...(prev[trainingSessionDate] || {}) };
        delete session[exerciseId];
        return { ...prev, [trainingSessionDate]: session };
      });
      return;
    }
    const num = Number(trimmed);
    if (Number.isNaN(num) || num < 0) return;
    setWeightHistory((prev) => ({
      ...prev,
      [trainingSessionDate]: { ...(prev[trainingSessionDate] || {}), [exerciseId]: num },
    }));
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        TRAINING_STORAGE_KEY,
        JSON.stringify({
          day: trainingDay,
          place: trainingPlace,
          completedIds: trainingCompletedIds,
          sessionDate: trainingSessionDate,
          weightHistory,
        })
      );
    } catch (_) {}
  }, [trainingDay, trainingPlace, trainingCompletedIds, trainingSessionDate, weightHistory]);

  const toggleTrainingDone = (id) => {
    setTrainingCompletedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearTodayTraining = () => {
    if (!window.confirm('ล้างการติ๊กทั้งหมดของวันนี้?')) return;
    setTrainingCompletedIds((prev) => {
      const next = { ...prev };
      currentDayIds.forEach((id) => delete next[id]);
      return next;
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
      setUser(foundUser);
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
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="text-slate-400 w-5 h-5" />
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">ตำแหน่ง</h2>
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
            {/* หัวข้อตาม PDF: แผนสร้างกล้ามเนื้อ 3 เดือน */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-cyan-400" />
                แผนสร้างกล้ามเนื้อ 3 เดือน (Phase 1)
              </h2>
              <p className="text-cyan-400/90 text-xs font-medium mt-1">รุ่น Hybrid · WEEK 1: วีคแห่งการปรับตัว (Anatomical Adaptation)</p>
              <p className="text-slate-400 text-sm mt-1">แตะแต่ละท่าเพื่อบันทึกว่าทำแล้ว · ข้อมูลบันทึกในเครื่องอัตโนมัติ</p>
            </div>

            {/* Day selector: 1 2 3 4(พัก) */}
            <div className="flex gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setTrainingDay(d)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    trainingDay === d
                      ? 'bg-cyan-500/25 text-cyan-400 border border-cyan-400/40'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  วัน {d}
                  <span className="block text-xs opacity-80">{d === 2 ? 'B' : 'A'}</span>
                </button>
              ))}
              <button
                onClick={() => setTrainingDay(4)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex flex-col items-center justify-center ${
                  trainingDay === 4 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span>พัก</span>
              </button>
            </div>

            {/* วันพักผ่อน (Rest Day) */}
            {trainingDay === 4 && (
              <div className="bg-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20 text-center">
                <Coffee className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-100">วันพักผ่อน (Rest Day)</h3>
                <p className="text-slate-300 text-sm mt-2">ดื่มน้ำ 2.5–3 ลิตร</p>
                <p className="text-slate-300 text-sm">กินโปรตีนให้ถึงเป้า</p>
                <p className="text-slate-400 text-xs mt-4">วันต่อไป: กลับไปวัน 1 (Program A)</p>
              </div>
            )}

            {/* Gym / Home + Progress (เมื่อไม่ใช่วันพัก) */}
            {trainingDay !== 4 && (
              <>
                {/* วันที่ฟิตเนต */}
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                  <Calendar className="w-5 h-5 text-cyan-400 shrink-0" />
                  <label className="text-slate-300 text-sm font-medium shrink-0">วันที่ฝึก:</label>
                  <input
                    type="date"
                    value={trainingSessionDate}
                    onChange={(e) => setTrainingSessionDate(e.target.value)}
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
              const done = trainingCompletedIds[ex.id];
              const repDisplay = ex.unit ? `${ex.reps} ${ex.unit}` : ex.reps;
              const isWarmup = ex.id === 'a0' || ex.id === 'b0';
              const currentWeight = currentSessionWeights[ex.id];
              const lastWeight = getLastWeightForExercise(ex.id);
              const searchKey = getExerciseSearchKey(ex);
              return (
                <div
                  key={ex.id}
                  className="w-full flex items-center gap-2 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-cyan-400/20 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleTrainingDone(ex.id)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left active:scale-[0.99]"
                  >
                    {done ? (
                      <Check className="w-6 h-6 text-emerald-400 shrink-0 rounded-full bg-emerald-400/20 p-1" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${done ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {ex.sets} เซต {repDisplay !== '-' ? `· ${repDisplay}` : ''}
                      </p>
                      {!isWarmup && (() => {
                        const suggestion = getWeightSuggestion(ex.id);
                        const history = getWeightHistoryForExercise(ex.id);
                        return (
                          <div className="mt-2 space-y-1.5">
                            {suggestion.lastWeight != null && (
                              <p className="text-cyan-400/90 text-xs font-medium">
                                ครั้งก่อน: {suggestion.lastWeight} kg
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
                                    {formatDateThai(date)} {weight} kg
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
                  {!isWarmup && (
                    <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center gap-1">
                      <Weight className="w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.5"
                        placeholder="kg"
                        value={currentWeight != null ? String(currentWeight) : ''}
                        onChange={(e) => setExerciseWeight(ex.id, e.target.value)}
                        className="w-14 text-right bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-slate-100 text-sm focus:border-cyan-400/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-slate-500 text-xs">kg</span>
                    </div>
                  )}
                </div>
              );
            })}

                {/* โฟกัสหัวไหล่กว้าง (พิเศษ) */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-amber-400/90 text-sm font-semibold flex items-center gap-2 mb-3 px-1">
                    <Sparkles className="w-4 h-4" />
                    พิเศษ: โฟกัสหัวไหล่ให้กว้าง
                  </p>
                  {SHOULDER_EXTRA.map((ex) => {
                    const name = trainingPlace === 'gym' ? ex.nameGym : ex.nameHome;
                    const done = trainingCompletedIds[ex.id];
                    const currentWeight = currentSessionWeights[ex.id];
                    const lastWeight = getLastWeightForExercise(ex.id);
                    const searchKey = getExerciseSearchKey(ex);
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
                              const suggestion = getWeightSuggestion(ex.id);
                              const history = getWeightHistoryForExercise(ex.id);
                              return (
                                <div className="mt-2 space-y-1.5">
                                  {suggestion.lastWeight != null && (
                                    <p className="text-cyan-400/90 text-xs font-medium">
                                      ครั้งก่อน: {suggestion.lastWeight} kg
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
                                          {formatDateThai(date)} {weight} kg
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
                            inputMode="decimal"
                            min="0"
                            step="0.5"
                            placeholder="kg"
                            value={currentWeight != null ? String(currentWeight) : ''}
                            onChange={(e) => setExerciseWeight(ex.id, e.target.value)}
                            className="w-14 text-right bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-slate-100 text-sm focus:border-cyan-400/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-slate-500 text-xs">kg</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
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

            {/* สมาชิกในบ้าน: ปะป๋าเอส + พู พี พลอส พัตเตอร์ */}
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
              <p className="text-slate-500 text-xs mt-3">ปะป๋าเอส + พู · พี · พลอส · พัตเตอร์ (ใส่ตัวอย่างหน้าที่ไว้แล้ว)</p>
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