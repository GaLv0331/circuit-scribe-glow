import { BlogPost } from "@/types/blog";

interface CircuitDiagramProps {
  circuitData: BlogPost['simulation']['circuitData'];
  className?: string;
}

export function CircuitDiagram({ circuitData, className = "" }: CircuitDiagramProps) {
  const componentSymbols = {
    resistor: (x: number, y: number, rotation = 0) => (
      <g key={`resistor_${x}_${y}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
        <rect x="-20" y="-5" width="40" height="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M-20,0 L-30,0 M20,0 L30,0" stroke="currentColor" strokeWidth="2" />
        <text x="0" y="-15" textAnchor="middle" className="text-xs fill-current">R</text>
      </g>
    ),
    capacitor: (x: number, y: number, rotation = 0) => (
      <g key={`capacitor_${x}_${y}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
        <path d="M-30,0 L-10,0 M10,0 L30,0" stroke="currentColor" strokeWidth="2" />
        <path d="M-10,-15 L-10,15 M10,-15 L10,15" stroke="currentColor" strokeWidth="3" />
        <text x="0" y="-25" textAnchor="middle" className="text-xs fill-current">C</text>
      </g>
    ),
    inductor: (x: number, y: number, rotation = 0) => (
      <g key={`inductor_${x}_${y}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
        <path d="M-30,0 L-20,0" stroke="currentColor" strokeWidth="2" />
        <path d="M-20,0 Q-15,-10 -10,0 Q-5,10 0,0 Q5,-10 10,0 Q15,10 20,0" 
              stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M20,0 L30,0" stroke="currentColor" strokeWidth="2" />
        <text x="0" y="-20" textAnchor="middle" className="text-xs fill-current">L</text>
      </g>
    ),
    voltage_source: (x: number, y: number, rotation = 0) => (
      <g key={`voltage_source_${x}_${y}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
        <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M-30,0 L-20,0 M20,0 L30,0" stroke="currentColor" strokeWidth="2" />
        <path d="M-5,-10 L-5,10 M5,-5 L5,5" stroke="currentColor" strokeWidth="2" />
        <text x="0" y="-35" textAnchor="middle" className="text-xs fill-current">V</text>
      </g>
    ),
    ground: (x: number, y: number) => (
      <g key={`ground_${x}_${y}`} transform={`translate(${x}, ${y})`}>
        <path d="M0,-10 L0,0 M-15,0 L15,0 M-10,5 L10,5 M-5,10 L5,10" 
              stroke="currentColor" strokeWidth="2" />
      </g>
    ),
    wire: (x: number, y: number) => (
      <circle key={`wire_${x}_${y}`} cx={x} cy={y} r="3" fill="currentColor" />
    )
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="circuit-grid bg-background rounded border border-border overflow-hidden">
        <svg
          width="600"
          height="400"
          viewBox="0 0 600 400"
          className="w-full h-auto text-foreground"
        >
          {/* Grid pattern is handled by CSS */}
          
          {/* Render components */}
          {circuitData.components.map((component) => {
            const renderComponent = componentSymbols[component.type];
            if (renderComponent) {
              return renderComponent(
                component.position.x,
                component.position.y,
                component.rotation
              );
            }
            return null;
          })}

          {/* Render connections */}
          {circuitData.connections.map((connection, index) => {
            const fromComponent = circuitData.components.find(c => c.id === connection.from);
            const toComponent = circuitData.components.find(c => c.id === connection.to);
            
            if (fromComponent && toComponent) {
              return (
                <line
                  key={`connection_${index}`}
                  x1={fromComponent.position.x}
                  y1={fromComponent.position.y}
                  x2={toComponent.position.x}
                  y2={toComponent.position.y}
                  stroke="currentColor"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })}
        </svg>
      </div>
    </div>
  );
}