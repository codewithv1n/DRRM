import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Flame, CloudRain, Activity, HeartPulse, ChevronDown, ChevronUp } from 'lucide-react';

const guides = [
  {
    id: 'typhoon',
    title: 'Typhoon & Floods',
    icon: CloudRain,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    bulletColor: 'bg-blue-400',
    content: [
      'Prepare an emergency go-bag with clothes, food, water, and first aid kits.',
      'Stay updated with the latest weather advisories and warnings.',
      'Evacuate immediately if your area is prone to flooding or storm surges.',
      'Turn off the main electrical switch before water enters your home.',
      'Avoid wading or driving through floodwaters.'
    ]
  },
  {
    id: 'earthquake',
    title: 'Earthquakes',
    icon: Activity,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    bulletColor: 'bg-amber-400',
    content: [
      'Perform Drop, Cover, and Hold On during the shaking.',
      'Stay away from glass, windows, outside doors and walls, and anything that could fall.',
      'Do not use elevators during an earthquake.',
      'If outdoors, move away from buildings, streetlights, and utility wires.',
      'Expect aftershocks and be prepared to take cover again.'
    ]
  },
  {
    id: 'fire',
    title: 'Fire Emergencies',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    bulletColor: 'bg-red-400',
    content: [
      'Install and regularly check smoke detectors in your home.',
      'Know at least two ways out of every room.',
      'If there is smoke, crawl low under it where the air is cleaner.',
      'If your clothes catch fire: Stop, Drop, and Roll.',
      'Never go back inside a burning building for any reason.'
    ]
  },
  {
    id: 'first-aid',
    title: 'Basic First Aid',
    icon: HeartPulse,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    bulletColor: 'bg-emerald-400',
    content: [
      'Keep a well-stocked first aid kit at home and in your car.',
      'Learn CPR and how to treat minor burns, cuts, and sprains.',
      'Do not move a seriously injured person unless they are in immediate danger.',
      'Apply direct pressure to stop bleeding.',
      'Call emergency hotlines immediately for severe medical emergencies.'
    ]
  }
];

export default function SurvivalGuide() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 md:p-8">
      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Survival Guide
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Essential knowledge and instructions for different emergency situations.
            </p>
          </div>
        </div>

        {/* Guides List */}
        <div className="space-y-4">
          {guides.map((guide) => {
            const Icon = guide.icon;
            const isExpanded = expandedId === guide.id;

            return (
              <div 
                key={guide.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 
                  ${isExpanded ? 'border-primary/30 shadow-md ring-1 ring-primary/10' : 'border-slate-100 hover:border-slate-200 hover:shadow-md'}`}
              >
                <button
                  onClick={() => toggleExpand(guide.id)}
                  className="w-full flex items-center justify-between p-5 md:p-6 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${guide.bgColor}`}>
                      <Icon className={`w-6 h-6 ${guide.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 text-left">
                      {guide.title}
                    </h3>
                  </div>
                  <div className={`shrink-0 ml-4 p-2 rounded-full transition-colors
                    ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6 md:px-6 md:pb-7">
                      <div className="pl-18">
                        <ul className="space-y-3">
                          {guide.content.map((point, index) => (
                            <li key={index} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                              <span className={`shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${guide.bulletColor}`} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
