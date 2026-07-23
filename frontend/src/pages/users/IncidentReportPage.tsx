import { useState, useRef, useCallback } from 'react';
import {
  hazardTypes,
  severityLevels,
  statusStyles,
  recentReports
} from '../../data/IncidentReportData';
import type {
  HazardType,
  Severity,
  LocationInfo
} from '../../data/IncidentReportData';



export default function IncidentReportPage() {
    const [hazardType, setHazardType] = useState<HazardType | null>(null);
    const [severity, setSeverity] = useState<Severity>('moderate');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState<LocationInfo | null>(null);
    const [locating, setLocating] = useState(false);
    const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    address: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
                });
                setLocating(false);
            },
            () => {
                setLocating(false);
                alert('Hindi ma-access ang iyong lokasyon. Pakisiguradong naka-enable ang location services.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newPhotos = Array.from(files).slice(0, 3 - photos.length).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...newPhotos].slice(0, 3));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = () => {
        if (!hazardType || !location?.address.trim() || !description.trim()) return;
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const isFormValid = Boolean(hazardType && location?.address?.trim().length > 0 && description.trim().length > 0);

    const selectedHazard = hazardTypes.find((h) => h.value === hazardType);
    const selectedSeverity = severityLevels.find((s) => s.value === severity)!;

    return (
        <div className="w-full px-6 p-4 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap max-md:flex-col max-md:gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 m-0 tracking-tight">
                        Incident Reporting & Response Log
                    </h1>
                    <p className="text-[13px] text-slate-400 mt-1">
                        Mag-report ng hazard o insidente sa inyong lokasyon
                    </p>
                </div>
            </div>

            {/* Success Toast */}
            {submitted && (
                <div
                    className="flex items-center gap-3 py-3.5 px-5 bg-green-50 border border-green-200 rounded-xl shadow-sm animate-[fadeIn_0.3s_ease]"
                    role="alert"
                >
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M6 10L9 13L14 7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-green-800 m-0">Matagumpay na nai-submit!</p>
                        <p className="text-xs text-green-600 mt-0.5">Susuriin ng DRRM team ang iyong report.</p>
                    </div>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Section: Hazard Type */}
                <div className="py-5 px-6 border-b border-slate-100">
                    <h2 className="text-[15px] font-bold text-slate-800 m-0 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                        Anong uri ng hazard?
                    </h2>
                    <p className="text-xs text-slate-400 ml-8 mb-4">Piliin ang kategorya ng insidenteng ire-report mo.</p>
                    <div className="grid grid-cols-3 gap-2.5 max-md:grid-cols-2">
                        {hazardTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setHazardType(type.value)}
                                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${hazardType === type.value
                                        ? 'shadow-md scale-[1.02]'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm hover:-translate-y-px'
                                    }`}
                                style={
                                    hazardType === type.value
                                        ? { borderColor: type.color, background: type.bg }
                                        : undefined
                                }
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
                                    style={{ background: hazardType === type.value ? `${type.color}18` : 'rgba(100,116,139,0.06)' }}
                                >
                                    {type.icon}
                                </div>
                                <span
                                    className="text-xs font-semibold transition-colors duration-200"
                                    style={{ color: hazardType === type.value ? type.color : '#64748b' }}
                                >
                                    {type.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section: Location */}
                <div className="py-5 px-6 border-b border-slate-100">
                    <h2 className="text-[15px] font-bold text-slate-800 m-0 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                        Nasaan ang insidente?
                    </h2>
                    <p className="text-xs text-slate-400 ml-8 mb-4">I-type ang address o i-detect ang iyong lokasyon.</p>

                    <div className="ml-8 flex gap-3 max-md:flex-col">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Halimbawa: 123 Quezon St., Brgy. San Jose"
                                className="w-full py-3 pl-4 pr-10 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white placeholder:text-slate-400 transition-all duration-200"
                                value={location?.address || ''}
                                onChange={(e) => setLocation(e.target.value ? { ...location, address: e.target.value } : null)}
                            />
                            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 20 20" fill="none">
                                <path d="M10 2C6.68629 2 4 4.68629 4 8C4 13.5 10 19 10 19C10 19 16 13.5 16 8C16 4.68629 13.3137 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="10" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                        </div>
                        
                        <button
                            onClick={getLocation}
                            disabled={locating}
                            className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl border-2 transition-all duration-200 shrink-0 ${locating
                                    ? 'border-blue-300 bg-blue-50/50 cursor-wait'
                                    : location?.lat && location?.lng 
                                        ? 'border-green-300 bg-green-50 text-green-700'
                                        : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer text-slate-700'
                                }`}
                        >
                            {locating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm font-medium text-blue-600">Hinahanap...</span>
                                </>
                            ) : location?.lat && location?.lng ? (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M9 2C6.24 2 4 4.24 4 7C4 11.07 9 16 9 16C9 16 14 11.07 14 7C14 4.24 11.76 2 9 2Z" stroke="#15803d" strokeWidth="1.5" fill="rgba(34,197,94,0.1)" />
                                        <circle cx="9" cy="7" r="2" stroke="#15803d" strokeWidth="1.5" fill="white" />
                                    </svg>
                                    <span className="text-sm font-medium text-green-700">Nakuha na!</span>
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
                                        <path d="M10 2V5M10 15V18M2 10H5M15 10H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-sm font-medium">I-detect</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Section: Severity */}
                <div className="py-5 px-6 border-b border-slate-100">
                    <h2 className="text-[15px] font-bold text-slate-800 m-0 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                        Gaano ito kaseryoso?
                    </h2>
                    <p className="text-xs text-slate-400 ml-8 mb-4">Piliin ang antas ng panganib.</p>

                    <div className="ml-8 grid grid-cols-4 gap-2 max-md:grid-cols-2">
                        {severityLevels.map((level) => (
                            <button
                                key={level.value}
                                onClick={() => setSeverity(level.value)}
                                className={`flex flex-col items-center gap-1.5 py-3.5 px-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${severity === level.value
                                        ? 'shadow-md scale-[1.02]'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                    }`}
                                style={
                                    severity === level.value
                                        ? { borderColor: level.color, background: level.bg }
                                        : undefined
                                }
                            >
                                <div
                                    className="w-3 h-3 rounded-full transition-all duration-200"
                                    style={{ background: level.color, boxShadow: severity === level.value ? `0 0 8px ${level.color}60` : 'none' }}
                                />
                                <span
                                    className="text-xs font-bold transition-colors duration-200"
                                    style={{ color: severity === level.value ? level.color : '#94a3b8' }}
                                >
                                    {level.label}
                                </span>
                                <span className="text-[10px] text-slate-400 text-center leading-tight hidden max-md:hidden md:block">
                                    {level.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section: Description */}
                <div className="py-5 px-6 border-b border-slate-100">
                    <h2 className="text-[15px] font-bold text-slate-800 m-0 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                        Ilarawan ang sitwasyon
                    </h2>
                    <p className="text-xs text-slate-400 ml-8 mb-4">Isulat ang mga detalye ng insidente.</p>

                    <div className="ml-8">
                        <textarea
                            className="w-full min-h-120px py-3 px-4 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl resize-y transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white placeholder:text-slate-400"
                            placeholder="Halimbawa: Malakas ang baha sa kalsada, tumaas na ng halos tuhod ang tubig. May ilang sasakyan na nastranded..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-1.5">
                            <span className="text-[11px] text-slate-400">Minimum 10 characters</span>
                            <span className={`text-[11px] font-medium ${description.length > 450 ? 'text-amber-500' : 'text-slate-400'}`}>
                                {description.length}/500
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section: Photo */}
                <div className="py-5 px-6 border-b border-slate-100">
                    <h2 className="text-[15px] font-bold text-slate-800 m-0 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">5</span>
                        Mag-upload ng larawan
                        <span className="text-[11px] font-normal text-slate-400">optional</span>
                    </h2>
                    <p className="text-xs text-slate-400 ml-8 mb-4">Mag-attach ng litrato ng insidente.</p>

                    <div className="ml-8 flex gap-2.5 flex-wrap">
                        {photos.map((photo, idx) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={photo.preview}
                                    alt={`Upload ${idx + 1}`}
                                    className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                                />
                                <button
                                    onClick={() => removePhoto(idx)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow cursor-pointer"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {photos.length < 3 && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 5V15M5 10H15" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                                <span className="text-[10px] text-slate-400 font-medium">Dagdag</span>
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePhotoUpload}
                        />
                    </div>
                </div>


                

                {/* Summary & Submit */}
                <div className="py-5 px-6 bg-slate-50/50">
                    {/* Summary Preview */}
                    {(hazardType || location) && (
                        <div className="mb-4 p-4 bg-white border border-slate-200 rounded-xl">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide m-0 mb-3">Buod ng Report</h3>
                            <div className="flex flex-wrap gap-3">
                                {selectedHazard && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded-lg" style={{ color: selectedHazard.color, background: selectedHazard.bg }}>
                                        <span className="w-2 h-2 rounded-full" style={{ background: selectedHazard.color }} />
                                        {selectedHazard.label}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded-lg" style={{ color: selectedSeverity.color, background: selectedSeverity.bg }}>
                                    <span className="w-2 h-2 rounded-full" style={{ background: selectedSeverity.color }} />
                                    {selectedSeverity.label}
                                </div>
                                {location?.address && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 py-1 px-2.5 rounded-lg bg-slate-100 max-w-200px">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                                            <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5C2.5 7.28 6 10.5 6 10.5C6 10.5 9.5 7.28 9.5 4.5C9.5 2.57 7.93 1 6 1Z" stroke="#64748b" strokeWidth="1.2" />
                                            <circle cx="6" cy="4.5" r="1.2" stroke="#64748b" strokeWidth="1" />
                                        </svg>
                                        <span className="truncate">{location.address}</span>
                                    </div>
                                )}
                                {photos.length > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 py-1 px-2.5 rounded-lg bg-slate-100">
                                        📷 {photos.length} larawan
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className={`w-full py-3.5 px-6 rounded-xl text-sm font-bold border-none transition-all duration-300 ${isFormValid
                                ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700 hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] active:scale-[0.98]'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isFormValid ? 'I-submit ang Report' : 'Kumpletuhin ang form para makapag-submit'}
                    </button>
                </div>
            </div>  

            {/* Recent Reports */}
            <section className="flex flex-col gap-3">
                <h2 className="text-base font-bold text-slate-800 m-0">Mga Kamakailang Report</h2>
                <div className="flex flex-col gap-2">
                    {recentReports.map((report) => {
                        const typeInfo = hazardTypes.find((t) => t.value === report.type);
                        const sevInfo = severityLevels.find((s) => s.value === report.severity);
                        const statStyle = statusStyles[report.status] || { color: '#64748b', bg: 'rgba(100,116,139,0.1)' };
                        return (
                            <div
                                key={report.id}
                                className="flex items-start gap-3.5 py-4 px-5 bg-white border border-slate-200 rounded-xl transition-all duration-200 shadow-sm hover:border-slate-300 hover:shadow hover:-translate-y-px"
                            >
                                <div
                                    className="shrink-0 w-42px h-42px rounded-xl flex items-center justify-center mt-0.5"
                                    style={{ background: typeInfo?.bg || 'rgba(100,116,139,0.06)' }}
                                >
                                    {typeInfo?.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-sm font-semibold text-slate-800 m-0">{report.title}</h3>
                                        <span
                                            className="text-[10px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wide"
                                            style={{ color: sevInfo?.color, background: sevInfo?.bg }}
                                        >
                                            {sevInfo?.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{report.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[11px] text-slate-400">{report.time}</span>
                                        <span
                                            className="text-[10px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wide"
                                            style={{ color: statStyle.color, background: statStyle.bg }}
                                        >
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl py-3.5 px-5 text-center">
                <p className="text-[13px] font-medium text-amber-800 leading-normal">
                    Ang lahat ng report ay susuriin ng inyong barangay DRRM team. Huwag mag-submit ng maling impormasyon. Dahil ito'y may kaukulang parusa.
                </p>
            </div>
        </div>
    );
}