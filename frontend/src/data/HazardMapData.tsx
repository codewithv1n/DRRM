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
    title: 'Before a Disaster',
    content:
      'Prepare an emergency Go-Bag containing non-perishable food, drinking water, first aid supplies, and a flashlight. Identify your nearest evacuation center. Monitor official advisories from your barangay and DRRM office.',
  },
  {
    id: 2,
    title: 'During a Disaster',
    content:
      'Stay calm and follow directives from local emergency personnel. Evacuate to the nearest designated safe area immediately if advised. Avoid low-lying areas, floodwaters, and riverbanks. Turn off main power switches and gas valves before leaving.',
  },
  {
    id: 3,
    title: 'After a Disaster',
    content:
      'Do not return home until emergency officials declare it safe. Report any structural hazards or damaged utility lines to your barangay office. Exercise caution around damaged buildings and assist neighbors in need.',
  },
];

export const statusConfig = {
  OPEN: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: 'OPEN' },
  FULL: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', label: 'FULL' },
  CLOSED: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'CLOSED' },
};
