export function incidentTypeColor(type: string) {
  switch (type) {
    case 'Fire': return 'from-red-500 to-rose-600';
    case 'Flood': return 'from-blue-500 to-indigo-600';
    case 'Medical': return 'from-emerald-500 to-teal-600';
    default: return 'from-amber-500 to-orange-600';
  }
}
