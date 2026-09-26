import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const HQ: [number, number] = [90.4125, 23.8103];

const markers = [
  { name: 'China', flag: '🇨🇳', coordinates: [104.1954, 35.8617] as [number, number] },
  { name: 'India', flag: '🇮🇳', coordinates: [78.9629, 20.5937] as [number, number] },
  { name: 'Germany', flag: '🇩🇪', coordinates: [10.4515, 51.1657] as [number, number] },
  { name: 'South Korea', flag: '🇰🇷', coordinates: [127.7669, 35.9078] as [number, number] },
  { name: 'Singapore', flag: '🇸🇬', coordinates: [103.8198, 1.3521] as [number, number] },
  { name: 'Malaysia', flag: '🇲🇾', coordinates: [101.9758, 4.2105] as [number, number] },
  { name: 'Japan', flag: '🇯🇵', coordinates: [138.2529, 36.2048] as [number, number] },
  { name: 'Turkey', flag: '🇹🇷', coordinates: [35.2433, 38.9637] as [number, number] },
  { name: 'Taiwan', flag: '🇹🇼', coordinates: [120.9605, 23.6978] as [number, number] },
];

const AUTO_CYCLE_MS = 3800;

export default function WorldMap() {
  const [autoIdx, setAutoIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (hoveredIdx !== null) return;
    const timer = setInterval(() => setAutoIdx((i) => (i + 1) % markers.length), AUTO_CYCLE_MS);
    return () => clearInterval(timer);
  }, [hoveredIdx]);

  const activeIdx = hoveredIdx ?? autoIdx;

  return (
    <div className="relative w-full h-full">
      {/* Legend */}
      <div className="absolute top-0 left-0 z-10 flex items-center gap-4 text-[11px] font-medium text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Zexora HQ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" /> Sourcing Partner
        </span>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1E293B"
                stroke="#334155"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#3b82f6', outline: 'none', transition: 'all 250ms' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* Connection lines - the active one flows brighter, the rest stay dim */}
        {markers.map(({ name, coordinates }, idx) => {
          const isActive = idx === activeIdx;
          return (
            <Line
              key={`line-${name}`}
              from={HQ}
              to={coordinates}
              stroke={isActive ? '#60A5FA' : '#475569'}
              strokeWidth={isActive ? 2 : 1}
              strokeLinecap="round"
              style={{
                strokeDasharray: '4 4',
                opacity: isActive ? 0.95 : 0.35,
                transition: 'opacity 400ms, stroke 400ms',
                animation: isActive ? 'dash-flow 2s linear infinite' : undefined,
              }}
            />
          );
        })}

        {/* Sourcing country markers */}
        {markers.map(({ name, flag, coordinates }, idx) => {
          const isActive = idx === activeIdx;
          return (
            <Marker
              key={name}
              coordinates={coordinates}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ default: { cursor: 'pointer' } }}
            >
              {isActive && (
                <circle r={5} fill="none" stroke="#60A5FA" strokeWidth={1.5} style={{ transformOrigin: 'center', animation: 'marker-ping 2.2s cubic-bezier(0,0,0.2,1) infinite' }} />
              )}
              <circle r={isActive ? 6 : 4} fill={isActive ? '#60A5FA' : '#3b5578'} stroke="#0A0D14" strokeWidth={2} style={{ transition: 'r 300ms, fill 300ms' }} />
              <text
                textAnchor="middle"
                y={-12}
                style={{
                  fontFamily: 'Poppins, system-ui',
                  fill: '#E2E8F0',
                  fontSize: '12px',
                  fontWeight: 600,
                  filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.9))',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 300ms',
                  pointerEvents: 'none',
                }}
              >
                {flag} {name}
              </text>
            </Marker>
          );
        })}

        {/* Bangladesh HQ marker */}
        <Marker coordinates={HQ}>
          <circle r={5} fill="none" stroke="#ef4444" strokeWidth={1.5} style={{ transformOrigin: 'center', animation: 'marker-ping 2.2s cubic-bezier(0,0,0.2,1) infinite' }} />
          <circle r={7} fill="#ef4444" stroke="#fff" strokeWidth={2.5} />
          <text
            textAnchor="middle"
            y={-14}
            style={{
              fontFamily: 'Poppins, system-ui',
              fill: '#fff',
              fontSize: '13px',
              fontWeight: 'bold',
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.9))',
            }}
          >
            🇧🇩 Zexora HQ
          </text>
        </Marker>
      </ComposableMap>
    </div>
  );
}
