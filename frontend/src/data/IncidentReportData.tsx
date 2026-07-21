export type HazardType = 'flood' | 'fire' | 'landslide' | 'earthquake' | 'other';
export type Severity = 'low' | 'moderate' | 'high' | 'critical';

export interface LocationInfo {
    lat?: number;
    lng?: number;
    address: string;
}

export const hazardTypes: { value: HazardType; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
    {
        value: 'flood',
        label: 'Baha',
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.08)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M4 20C6 18 8 18 10 20C12 22 14 22 16 20C18 18 20 18 22 20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 24C6 22 8 22 10 24C12 26 14 26 16 24C18 22 20 22 22 24" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                <path d="M14 4V16" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 8L14 4L18 8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        value: 'fire',
        label: 'Sunog',
        color: '#ef4444',
        bg: 'rgba(239,68,68,0.08)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 3C14 3 8 10 8 16C8 19.3 10.7 22 14 22C17.3 22 20 19.3 20 16C20 10 14 3 14 3Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 14C14 14 11.5 17 11.5 19C11.5 20.4 12.6 21.5 14 21.5C15.4 21.5 16.5 20.4 16.5 19C16.5 17 14 14 14 14Z" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        value: 'other',
        label: 'Iba Pa',
        color: '#64748b',
        bg: 'rgba(100,116,139,0.08)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="10" stroke="#64748b" strokeWidth="2" />
                <path d="M12 11C12 9.9 12.9 9 14 9C15.1 9 16 9.9 16 11C16 12.1 14 13 14 14" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="18" r="1" fill="#64748b" />
            </svg>
        ),
    },
];

export const severityLevels: { value: Severity; label: string; color: string; bg: string; description: string }[] = [
    { value: 'low', label: 'Mababa', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', description: 'Maliit na panganib, walang agarang banta' },
    { value: 'moderate', label: 'Katamtaman', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', description: 'May posibleng panganib sa ilang tao' },
    { value: 'high', label: 'Mataas', color: '#f97316', bg: 'rgba(249,115,22,0.1)', description: 'Malaking panganib, kailangan ng aksyon' },
    { value: 'critical', label: 'Kritikal', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', description: 'Napakadelikadong sitwasyon' },
];

export const recentReports = [
    {
        id: 1,
        type: 'flood' as HazardType,
        title: 'Baha sa Brgy. San Jose',
        description: 'Tumaas ang tubig sa kalsada, halos tuhod na ang baha.',
        severity: 'high' as Severity,
        time: '15 min ago',
        status: 'UNDER REVIEW',
    },
];

export const statusStyles: Record<string, { color: string; bg: string }> = {
    'UNDER REVIEW': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    RESPONDED: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    RESOLVED: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
};