import React, { useState, useEffect } from 'react';
import { MapPin, Unlock, Lock, User, AlertCircle, LogOut, ShieldCheck, Power } from 'lucide-react';

// ==========================================
// 📍 ตั้งค่าพิกัดบ้าน (Latitude, Longitude)
// ==========================================
const HOME_COORDS = { lat: 13.7563, lng: 100.5018 };
const MAX_DISTANCE_METERS = 100; 

// ==========================================
// 👨‍👩‍👧‍👦 ฐานข้อมูลสมาชิก
// ==========================================
const FAMILY_MEMBERS = {
  '1111': { name: 'คุณพ่อ (Admin)', role: 'dad' },
  '2222': { name: 'ลูกคนที่ 1', role: 'kid' },
  '3333': { name: 'ลูกคนที่ 2', role: 'kid' },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [gateOpen, setGateOpen] = useState(false);
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isSimulatingNearHome, setIsSimulatingNearHome] = useState(false);

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
      setCurrentLocation({ lat: 13.7564, lng: 100.5018 });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-4 flex flex-col items-center text-white font-sans">
      
      {/* Top Bar */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10 flex justify-between items-center mb-6 mt-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 p-3 rounded-full border border-slate-700 shadow-inner">
            <User className="text-cyan-400 w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Current User</p>
            <p className="font-bold text-slate-100">{user.name}</p>
          </div>
        </div>
        <button onClick={() => setUser(null)} className="p-3 text-red-400 hover:bg-red-400/10 rounded-full transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* GPS Status Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-slate-400 w-5 h-5" />
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Location Status</h2>
        </div>
        
        {locationError ? (
          <p className="text-red-400 text-sm flex items-center gap-2 bg-red-400/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4"/> {locationError}
          </p>
        ) : distance !== null ? (
          <div className="flex justify-between items-end bg-black/20 p-4 rounded-xl border border-white/5">
            <p className="text-slate-400 text-sm">Distance from home</p>
            <div className="text-right">
              <p className={`text-2xl font-black tracking-tighter ${distance <= MAX_DISTANCE_METERS ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}>
                {distance} <span className="text-sm font-normal text-slate-500">m</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <p className="text-slate-400 text-sm">Acquiring GPS signal...</p>
          </div>
        )}

        {/* Permission Badge */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
           <ShieldCheck className={`w-4 h-4 ${user.role === 'dad' ? 'text-cyan-400' : 'text-emerald-400'}`} />
           <span className="text-xs text-slate-400">
             {user.role === 'dad' ? "ADMIN OVERRIDE: Global Access" : `GEOFENCE: < ${MAX_DISTANCE_METERS}m Required`}
           </span>
        </div>
      </div>

      {/* MAIN BUTTON */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <div className="relative group">
          {/* Outer glow effect */}
          <div className={`absolute -inset-1 rounded-full blur-xl opacity-50 transition duration-1000 ${gateOpen ? 'bg-emerald-500' : 'bg-cyan-500 group-hover:opacity-75'}`}></div>
          
          <button
            onClick={handleToggleGate}
            disabled={gateOpen}
            className={`relative flex flex-col items-center justify-center w-64 h-64 rounded-full border-4 shadow-2xl transition-all duration-300 ${
              gateOpen 
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-400 scale-95 shadow-inner' 
                : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-cyan-500/50 active:scale-95'
            }`}
          >
            {gateOpen ? (
              <>
                <Unlock className="w-16 h-16 text-white mb-3 drop-shadow-md animate-bounce" />
                <span className="text-white text-xl font-bold tracking-widest drop-shadow-md">GATE OPEN</span>
                <span className="text-emerald-200 text-xs mt-2 font-mono">CLOSING IN 10s</span>
              </>
            ) : (
              <>
                <Power className="w-20 h-20 text-cyan-400 mb-4 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all" />
                <span className="text-slate-300 text-sm font-bold tracking-[0.2em] uppercase">Tap to Open</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* DEV TOOLS (Bottom) */}
      <div className="w-full max-w-md mt-auto mb-6 bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
        <label className="flex items-center gap-3 cursor-pointer text-sm">
          <div className="relative">
            <input 
              type="checkbox" 
              checked={isSimulatingNearHome}
              onChange={(e) => setIsSimulatingNearHome(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
          </div>
          <span className="text-slate-400 text-xs uppercase tracking-wider">Simulate Location (Dev Mode)</span>
        </label>
      </div>

    </div>
  );
}