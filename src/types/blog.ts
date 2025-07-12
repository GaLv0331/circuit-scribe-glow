export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  theory: {
    title: string;
    content: string;
  };
  code: {
    title: string;
    language: string;
    content: string;
    tabs?: Array<{
      name: string;
      language: string;
      content: string;
    }>;
  };
  simulation: {
    title: string;
    circuitData: {
      components: Array<{
        id: string;
        type: 'resistor' | 'capacitor' | 'inductor' | 'voltage_source' | 'ground' | 'wire';
        position: { x: number; y: number };
        value?: string;
        rotation?: number;
      }>;
      connections: Array<{
        from: string;
        to: string;
      }>;
    };
    description: string;
  };
}