import { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface LiveHazardChartProps {
  title: string;
  color: string;
  baseline: number;
  variance: number;
  unit: string;
  icon: any;
}

export default function LiveHazardChart({ title, color, baseline, variance, unit, icon: Icon }: LiveHazardChartProps) {
  const [data, setData] = useState<{ value: number }[]>([]);
  const [currentValue, setCurrentValue] = useState(baseline);

  useEffect(() => {
    // Initialize data
    const initialData = Array.from({ length: 20 }, () => ({
      value: +(baseline + (Math.random() - 0.5) * variance).toFixed(2),
    }));
    setData(initialData);
    setCurrentValue(initialData[initialData.length - 1].value);

    // Update data every 1.5 seconds to simulate real-time sensor
    const interval = setInterval(() => {
      setData((prev) => {
        const newValue = +(baseline + (Math.random() - 0.5) * variance).toFixed(2);
        setCurrentValue(newValue);
        return [...prev.slice(1), { value: newValue }];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [baseline, variance]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15`, color }}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-slate-800">{currentValue}</span>
          <span className="text-xs font-bold text-slate-400">{unit}</span>
        </div>
      </div>
      
      <div className="h-16 w-[calc(100%+2rem)] -ml-4 -mr-4 -mb-4 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#color-${title})`} 
              isAnimationActive={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Blinking Live Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Live</span>
      </div>
    </div>
  );
}
