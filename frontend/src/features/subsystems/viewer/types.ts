// From CubeSat_Anatomy v1.0.1 (src/types.ts), the standalone 1U explorer.
export type SubsystemId =
  | 'structure'
  | 'eps'
  | 'adcs'
  | 'obc'
  | 'comms'
  | 'payload';
export type Selection = SubsystemId | 'all';
export type Vec3 = [number, number, number];
export type Axis = 'x' | 'y' | 'z';

export type PartShape =
  | { kind: 'box'; size: Vec3; bevel?: number }
  | { kind: 'cylinder'; radius: number; height: number; axis: Axis }
  | {
      kind: 'ring';
      outerRadius: number;
      innerRadius: number;
      height: number;
      axis: Axis;
    };

export interface PartSpec {
  id: string;
  name: string;
  assembly: string;
  subsystem: SubsystemId;
  position: Vec3;
  rotation?: Vec3;
  shape: PartShape;
  material:
    | 'aluminium'
    | 'darkMetal'
    | 'board'
    | 'panel'
    | 'chip'
    | 'gold'
    | 'copper'
    | 'solar'
    | 'glass'
    | 'battery'
    | 'white';
}

export interface AssemblySpec {
  id: string;
  name: string;
  subsystem: SubsystemId;
  explode: Vec3;
}

export interface SubsystemContent {
  id: SubsystemId;
  code: string;
  title: string;
  summary: string;
  objective: string;
  tasks: string[];
  skills: string;
  learningOutcome: string;
  parts: string[];
  connects: string;
  colour: string;
  sources: { id: number; title: string; url: string }[];
}
