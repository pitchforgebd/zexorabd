import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const markers = [
  { name: "China", flag: "🇨🇳", coordinates: [104.1954, 35.8617] as [number, number] },
  { name: "India", flag: "🇮🇳", coordinates: [78.9629, 20.5937] as [number, number] },
  { name: "Germany", flag: "🇩🇪", coordinates: [10.4515, 51.1657] as [number, number] },
  { name: "South Korea", flag: "🇰🇷", coordinates: [127.7669, 35.9078] as [number, number] },
  { name: "Singapore", flag: "🇸🇬", coordinates: [103.8198, 1.3521] as [number, number] },
  { name: "Malaysia", flag: "🇲🇾", coordinates: [101.9758, 4.2105] as [number, number] },
  { name: "Japan", flag: "🇯🇵", coordinates: [138.2529, 36.2048] as [number, number] },
  { name: "Turkey", flag: "🇹🇷", coordinates: [35.2433, 38.9637] as [number, number] },
  { name: "Taiwan", flag: "🇹🇼", coordinates: [120.9605, 23.6978] as [number, number] },
];

export default function WorldMap() {
  return (
    <div className="w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
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
                  default: { outline: "none" },
                  hover: { fill: "#3b82f6", outline: "none", transition: "all 250ms" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        
        {/* Connection Lines from Bangladesh */}
        {markers.map(({ name, coordinates }) => (
          <Line
            key={`line-${name}`}
            from={[90.4125, 23.8103]}
            to={coordinates}
            stroke="#60A5FA"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ strokeDasharray: "4 4", opacity: 0.6 }}
          />
        ))}

        {/* Global Markers */}
        {markers.map(({ name, flag, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={5} fill="#60A5FA" stroke="#0A0D14" strokeWidth={2} />
            <text
              textAnchor="middle"
              y={-10}
              style={{ fontFamily: "Inter, system-ui", fill: "#E2E8F0", fontSize: "12px", fontWeight: "600", filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.8))" }}
            >
              {flag} {name}
            </text>
          </Marker>
        ))}

        {/* Bangladesh HQ Marker */}
        <Marker coordinates={[90.4125, 23.8103]}>
           <circle r={8} fill="#ef4444" stroke="#fff" strokeWidth={3} className="animate-pulse" />
           <text
            textAnchor="middle"
            y={-14}
            style={{ fontFamily: "Inter, system-ui", fill: "#fff", fontSize: "14px", fontWeight: "bold", filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.9))" }}
          >
            🇧🇩 Zexora HQ
          </text>
        </Marker>
      </ComposableMap>
    </div>
  );
}
