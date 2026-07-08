export const evacuationCenters = [
  {
    id: 1,
    name: 'Barangay Hall Covered Court',
    distance: '1.2 km',
    walkTime: '~15 min walk',
    status: 'OPEN' as const,
  },
  {
    id: 2,
    name: 'Elementary School Gymnasium',
    distance: '2.5 km',
    walkTime: '~30 min walk',
    status: 'FULL' as const,
  },
  {
    id: 3,
    name: 'Municipal Evacuation Center',
    distance: '4.0 km',
    walkTime: '~50 min walk',
    status: 'CLOSED' as const,
  },
];

export const faqItems = [
  {
    id: 1,
    title: 'Bago ang sakuna',
    content:
      'Maghanda ng emergency kit na may pagkain, tubig, gamot, at flashlight. Alamin ang pinakamalapit na evacuation center. Makinig sa mga advisory mula sa barangay at DRRM office. Siguraduhing alam ng buong pamilya ang evacuation plan.',
  },
  {
    id: 2,
    title: 'Habang may sakuna',
    content:
      'Manatiling kalmado at sundin ang mga utos ng mga awtoridad. Pumunta agad sa pinakamalapit na evacuation center kung kinakailangan. Iwasan ang mga lugar na mababa at malapit sa ilog. Huwag tumawid sa baha. I-off ang kuryente at gas sa bahay bago umalis.',
  },
  {
    id: 3,
    title: 'Pagkatapos ng sakuna',
    content:
      'Huwag bumalik sa bahay hangga\'t hindi pa pinapayagan ng mga awtoridad. I-report ang anumang pinsala sa barangay. Mag-ingat sa mga nasirang linya ng kuryente at mga posibleng mapanganib na lugar. Tumulong sa mga kapitbahay na nangangailangan.',
  },
];

export const statusConfig = {
  OPEN: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: 'OPEN' },
  FULL: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', label: 'FULL' },
  CLOSED: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'CLOSED' },
};

