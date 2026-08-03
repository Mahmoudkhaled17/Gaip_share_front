import React, { useState } from 'react';
import ViewerMap from './ViewerMap.jsx';
import { Wheat, Sprout, Building2, Activity, Percent, User, CalendarDays, Layers } from 'lucide-react';

export default function Viewer({ record }) {
  const [activeLayer, setActiveLayer] = useState('crop_type');
  const [opacitySlider, setOpacitySlider] = useState(0.25);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const opacity = 1 - opacitySlider;

  const cropAreas = record.crop_areas_feddans || {};
  const healthAreas = record.crop_health_feddans || {};

  const wheat = cropAreas.Wheat_1 || cropAreas.wheat || 0;
  const corn = cropAreas.Corn_0 || cropAreas.corn || 0;
  const nonAgri = cropAreas.Non_agricultural_2 || cropAreas.non_agricultural || 0;
  const total = wheat + corn + nonAgri || 1;
  const wheatPct = ((wheat / total) * 100).toFixed(1);
  const cornPct = ((corn / total) * 100).toFixed(1);
  const nonAgriPct = ((nonAgri / total) * 100).toFixed(1);

  const highH = healthAreas.High_Quality_Green || 0;
  const medH = healthAreas.Medium_Quality_Yellow || 0;
  const lowH = healthAreas.Low_Quality_Red || 0;
  const totalH = highH + medH + lowH || 1;
  const healthIndex = Math.round(((highH * 100) + (medH * 60) + (lowH * 20)) / totalH);
  const dominantCrop = wheat >= corn ? 'Wheat' : 'Corn';

  const startResize = (e) => {
    e.preventDefault();
    const startWidth = sidebarWidth;
    const startX = e.clientX;
    const doDrag = (move) => {
      const deltaX = startX - move.clientX;
      const newWidth = startWidth + deltaX;
      if (newWidth > 320 && newWidth < 700) setSidebarWidth(newWidth);
    };
    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  return (
    <div className="h-full flex bg-slate-950 font-sans text-slate-200 overflow-hidden">
      <div className="flex-1 h-full relative">
        <ViewerMap
          cropTypeTilesUrl={record.crop_type_tiles_url}
          cropHealthTilesUrl={record.crop_health_tiles_url}
          activeLayer={activeLayer}
          opacity={opacity}
          bounds={record.bounds}
        />

        <div className="absolute top-4 right-4 z-40 bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 text-white rounded-2xl px-5 py-3 shadow-2xl pointer-events-none">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            Shared Layer Preview
          </p>
          <p className="text-xs font-bold text-slate-100 mt-1">{record.Layer_Name}</p>
        </div>
      </div>

      <div
        style={{ width: `${sidebarWidth}px` }}
        className="border-r border-slate-900 bg-slate-950/90 backdrop-blur-lg h-full flex flex-col shrink-0 text-right overflow-y-auto relative"
        dir="rtl"
      >
        <div
          onMouseDown={startResize}
          className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize hover:bg-red-500/50 bg-slate-800 transition-colors z-50"
        />

        <div className="p-6 border-b border-slate-900 bg-slate-950/60">
          <h2 className="text-lg font-black text-slate-100 uppercase tracking-wide mb-1 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            GeoAI Shared Layer
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            Agricultural Telemetry Viewer
          </p>

          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-bold">{record.creator_name || 'مستخدم مجهول'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <CalendarDays className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-mono">
                {record.Classifcation_Start_Date} ← {record.Classifcation_End_Date}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 border-b border-slate-900 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            اختيار الطبقة (Layer)
          </h3>

          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            activeLayer === 'crop_type'
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}>
            <input
              type="radio"
              name="raster-layer"
              value="crop_type"
              checked={activeLayer === 'crop_type'}
              onChange={(e) => e.target.checked && setActiveLayer('crop_type')}
              className="accent-emerald-500 w-4 h-4 shrink-0"
            />
            <div className="flex-1">
              <p className="text-xs font-black text-slate-100">تصنيف المحاصيل</p>
              <p className="text-[10px] text-slate-500 font-sans">Crop Type Classification</p>
            </div>
          </label>

          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            activeLayer === 'crop_health'
              ? 'bg-cyan-950/40 border-cyan-500/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}>
            <input
              type="radio"
              name="raster-layer"
              value="crop_health"
              checked={activeLayer === 'crop_health'}
              onChange={(e) => e.target.checked && setActiveLayer('crop_health')}
              className="accent-cyan-500 w-4 h-4 shrink-0"
            />
            <div className="flex-1">
              <p className="text-xs font-black text-slate-100">صحة المحاصيل</p>
              <p className="text-[10px] text-slate-500 font-sans">Crop Health (NDVI)</p>
            </div>
          </label>

          <div className="border-t border-slate-800/60 pt-3 mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">الشفافية (Opacity)</span>
              <span className="text-xs font-black font-mono text-emerald-400">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={opacitySlider}
              onChange={(e) => setOpacitySlider(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <p className="text-[9px] text-slate-600 mt-1 text-left font-mono">
              left = visible · right = faded
            </p>
          </div>

          <div className="border-t border-slate-800/60 pt-3 mt-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">مفتاح الألوان (Legend)</p>
            {activeLayer === 'crop_type' ? (
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                  <span className="text-slate-300">قمح (Wheat)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                  <span className="text-slate-300">ذرة (Corn)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-slate-600 inline-block" />
                  <span className="text-slate-300">غير زراعي (Buildings)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
                  <span className="text-slate-300">جودة ممتازة (High)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-yellow-500 inline-block" />
                  <span className="text-slate-300">جودة متوسطة (Medium)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
                  <span className="text-slate-300">جودة ضعيفة (Low)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-5 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-2">
              📊 مؤشرات الإنتاج للموسم
            </h3>

            <div className="bg-slate-900 border border-slate-800/60 p-4 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TOTAL AREA</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-slate-100 tracking-tight font-mono">
                  {Math.round(total)}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">feddan</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800/60 p-4 rounded-2xl relative overflow-hidden">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CROP TYPE</span>
                <div className="mt-2 flex items-center gap-2">
                  {dominantCrop === 'Wheat' ? (
                    <Wheat className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="text-lg font-black text-slate-100">{dominantCrop}</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800/60 p-4 rounded-2xl relative overflow-hidden">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HEALTH INDEX</span>
                <div className="mt-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className={`text-lg font-black font-mono ${
                    healthIndex > 75 ? 'text-emerald-400' : healthIndex > 45 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {healthIndex}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex">
                <div style={{ width: `${wheatPct}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${cornPct}%` }} className="bg-amber-500 h-full" />
                <div style={{ width: `${nonAgriPct}%` }} className="bg-slate-700 h-full" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="space-y-1 text-center">
                  <span className="text-emerald-400 font-black block">{wheatPct}%</span>
                  <span className="text-slate-500 font-sans flex items-center justify-center gap-1"><Wheat className="w-3 h-3" /> قمح</span>
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-amber-400 font-black block">{cornPct}%</span>
                  <span className="text-slate-500 font-sans flex items-center justify-center gap-1"><Sprout className="w-3 h-3" /> ذرة</span>
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-slate-400 font-black block">{nonAgriPct}%</span>
                  <span className="text-slate-500 font-sans flex items-center justify-center gap-1"><Building2 className="w-3 h-3" /> مباني</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-indigo-400" />
              مؤشر جودة صحة النبات (NDVI)
            </h3>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2.5">
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    healthIndex > 75 ? 'bg-gradient-to-l from-emerald-500 to-teal-400' :
                    healthIndex > 45 ? 'bg-gradient-to-l from-yellow-500 to-amber-400' :
                    'bg-gradient-to-l from-red-500 to-orange-400'
                  }`}
                  style={{ width: `${healthIndex}%` }}
                />
              </div>
              <div className="space-y-2 text-xs font-mono border-t border-slate-800/60 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">🟢 جودة ممتازة:</span>
                  <span className="text-slate-200 font-bold">{highH.toFixed(1)} ف ({((highH / totalH) * 100).toFixed(0)}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">🟡 جودة متوسطة:</span>
                  <span className="text-slate-200 font-bold">{medH.toFixed(1)} ف ({((medH / totalH) * 100).toFixed(0)}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">🔴 جودة ضعيفة:</span>
                  <span className="text-slate-200 font-bold">{lowH.toFixed(1)} ف ({((lowH / totalH) * 100).toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
