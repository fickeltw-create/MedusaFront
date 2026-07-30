'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, softShadows } from '@react-three/drei';

export type ExteriorColor = 'white' | 'black' | 'wood' | 'concrete';
export type RoofType = 'flat' | 'pitched' | 'metal';
export type ModelKey = 'student' | 'tiny' | 'apartment' | 'family' | 'foldable' | 'capsule';

export interface HouseConfig {
  model: ModelKey;
  exterior: ExteriorColor;
  roof: RoofType;
  energies?: string[];
}

interface Colors {
  wall: string; wallDark: string; wallLight: string;
  wood: string; woodDark: string;
  trim: string; glass: string; glassDark: string;
  door: string; roof: string; roofDark: string;
}

const EXT_COLORS: Record<ExteriorColor, Colors> = {
  white: {
    wall: '#F0EDE6', wallDark: '#D4D0C8', wallLight: '#FAF8F5',
    wood: '#C8925A', woodDark: '#A0703C',
    trim: '#E0DDD6', glass: '#8BB8D0', glassDark: '#5A90AA',
    door: '#6A5040', roof: '#2C3340', roofDark: '#1A2030',
  },
  black: {
    wall: '#2A2A2A', wallDark: '#1A1A1A', wallLight: '#3A3A3A',
    wood: '#C8925A', woodDark: '#A0703C',
    trim: '#404040', glass: '#4A7090', glassDark: '#2A4A60',
    door: '#1A1A1A', roof: '#141414', roofDark: '#0A0A0A',
  },
  wood: {
    wall: '#C0845A', wallDark: '#9A6440', wallLight: '#D09870',
    wood: '#8A5A30', woodDark: '#6A4020',
    trim: '#B07848', glass: '#6A9AB0', glassDark: '#4A7A90',
    door: '#5A3820', roof: '#3A2818', roofDark: '#281A0E',
  },
  concrete: {
    wall: '#9E9FA2', wallDark: '#7E8084', wallLight: '#B4B6B9',
    wood: '#A87850', woodDark: '#886030',
    trim: '#8A8C90', glass: '#7090A8', glassDark: '#506878',
    door: '#5A5C60', roof: '#484A4E', roofDark: '#343638',
  },
};

const GROUND = '#6A8C48';
const GROUND_DARK = '#527038';
const PATH_COLOR = '#B0A898';
const GRASS_LIGHT = '#7AA052';
const TREE_DARK = '#2A5428';
const TREE_MID = '#3A7038';
const TREE_LIGHT = '#4A9050';
const TREE_TRUNK = '#6A4828';

function Tree({ x, y, scale = 1, round = false }: { x: number; y: number; scale?: number; round?: boolean }) {
  if (round) {
    const r = 22 * scale;
    return (
      <g>
        <rect x={x - 3 * scale} y={y - 8 * scale} width={6 * scale} height={20 * scale} fill={TREE_TRUNK} />
        <circle cx={x} cy={y - r - 4 * scale} r={r} fill={TREE_MID} />
        <circle cx={x - r * 0.4} cy={y - r - 4 * scale - r * 0.2} r={r * 0.65} fill={TREE_LIGHT} opacity="0.7" />
      </g>
    );
  }
  const h = 55 * scale;
  const w = 26 * scale;
  return (
    <g>
      <rect x={x - 3 * scale} y={y} width={6 * scale} height={14 * scale} fill={TREE_TRUNK} />
      <polygon points={`${x},${y - h} ${x - w},${y} ${x + w},${y}`} fill={TREE_DARK} />
      <polygon points={`${x},${y - h * 0.75} ${x - w * 0.88},${y - h * 0.05} ${x + w * 0.88},${y - h * 0.05}`} fill={TREE_MID} />
      <polygon points={`${x},${y - h * 0.5} ${x - w * 0.75},${y - h * 0.12} ${x + w * 0.75},${y - h * 0.12}`} fill={TREE_LIGHT} />
    </g>
  );
}

function Person({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g opacity="0.8">
      <circle cx={x} cy={y - 14 * s} r={4 * s} fill="#E8C8A0" />
      <rect x={x - 3 * s} y={y - 10 * s} width={6 * s} height={10 * s} rx={1} fill="#4A6080" />
      <rect x={x - 2 * s} y={y} width={2.5 * s} height={8 * s} rx={1} fill="#3A4A60" />
      <rect x={x + 0.5 * s} y={y} width={2.5 * s} height={8 * s} rx={1} fill="#3A4A60" />
    </g>
  );
}

function SolarPanel({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#1A2535" rx="1" />
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill="#1E2D42" rx="1" />
      {[0.33, 0.66].map((f, i) => (
        <line key={i} x1={x + w * f} y1={y + 2} x2={x + w * f} y2={y + h - 2} stroke="#2563EB" strokeWidth="0.7" opacity="0.7" />
      ))}
      <line x1={x + 2} y1={y + h * 0.5} x2={x + w - 2} y2={y + h * 0.5} stroke="#2563EB" strokeWidth="0.7" opacity="0.7" />
    </g>
  );
}

function RoofFlat({ x1, x2, rx2, y, thickness, c }: { x1: number; x2: number; rx2: number; y: number; thickness: number; c: Colors }) {
  return (
    <>
      <polygon points={`${x1},${y} ${x2},${y} ${rx2},${y + thickness * 0.6} ${x1 + (rx2 - x2)},${y + thickness * 0.6}`} fill={c.roofDark} />
      <rect x={x1} y={y - thickness} width={x2 - x1} height={thickness} fill={c.roof} />
      <polygon points={`${x1},${y - thickness} ${x1 + (rx2 - x2)},${y - thickness + thickness * 0.6} ${x1 + (rx2 - x2)},${y + thickness * 0.6} ${x1},${y}`} fill={c.roof} opacity="0.65" />
    </>
  );
}

function RoofPitched({ x1, x2, rx2, y, peakY, c }: { x1: number; x2: number; rx2: number; y: number; peakY: number; c: Colors }) {
  const midX = (x1 + x2) / 2;
  const rMidX = (x1 + (rx2 - x2) + rx2) / 2;
  return (
    <>
      <polygon points={`${x1},${y} ${x2},${y} ${midX},${peakY}`} fill={c.roofDark} />
      <polygon points={`${x2},${y} ${rx2},${y + 10} ${rMidX},${peakY + 5} ${midX},${peakY}`} fill={c.roof} opacity="0.7" />
      <line x1={midX} y1={peakY} x2={rMidX} y2={peakY + 5} stroke={c.trim} strokeWidth="1.5" opacity="0.5" />
    </>
  );
}

function RoofMetal({ x1, x2, rx2, y, thickness, c }: { x1: number; x2: number; rx2: number; y: number; thickness: number; c: Colors }) {
  const ovh = 5;
  return (
    <>
      <polygon points={`${x1 - ovh},${y} ${x2 + ovh},${y} ${rx2 + ovh},${y + thickness * 0.6} ${x1 - ovh + (rx2 - x2)},${y + thickness * 0.6}`} fill="#7A9CB5" />
      <rect x={x1 - ovh} y={y - thickness} width={x2 - x1 + ovh * 2} height={thickness} fill="#8AAEC5" />
      <polygon points={`${x1 - ovh},${y - thickness} ${x1 - ovh + (rx2 - x2)},${y - thickness + thickness * 0.6} ${x1 - ovh + (rx2 - x2)},${y + thickness * 0.6} ${x1 - ovh},${y}`} fill="#6A90AA" opacity="0.8" />
      {/* Shine stripe */}
      <rect x={x1 + (x2 - x1) * 0.25} y={y - thickness + 2} width={(x2 - x1) * 0.3} height={thickness * 0.3} fill="white" opacity="0.18" rx="1" />
    </>
  );
}

type SharedProps = { c: Colors; roof: RoofType; hasSolar: boolean };

function StudentHouse({ c, roof, hasSolar }: SharedProps) {
  return (
    <g>
      <ellipse cx="240" cy="308" rx="195" ry="20" fill={GROUND_DARK} opacity="0.4" />
      <rect x="105" y="293" width="270" height="28" rx="4" fill={GROUND} opacity="0.6" />
      <polygon points="196,325 244,325 232,293 208,293" fill={PATH_COLOR} opacity="0.7" />
      <Tree x={128} y={283} scale={0.7} />
      <Tree x={114} y={277} scale={0.55} round />
      <Tree x={352} y={280} scale={0.65} round />
      <Tree x={368} y={276} scale={0.5} />
      <ellipse cx="232" cy="298" rx="88" ry="9" fill="rgba(0,0,0,0.18)" />
      <polygon points="308,168 338,181 338,293 308,293" fill={c.wallDark} />
      <rect x="152" y="168" width="156" height="125" fill={c.wall} />
      {/* Wood slat right section */}
      <rect x="246" y="168" width="62" height="125" fill={c.wood} opacity="0.82" />
      {[0, 8, 16, 24, 32, 40, 48, 56].map((o, i) => (
        <rect key={i} x={246 + o} y="168" width="7" height="125" fill={c.woodDark} opacity="0.22" rx="0.5" />
      ))}
      {roof === 'flat'    && <RoofFlat    x1={150} x2={310} rx2={340} y={168} thickness={10} c={c} />}
      {roof === 'pitched' && <RoofPitched x1={150} x2={310} rx2={340} y={168} peakY={140} c={c} />}
      {roof === 'metal'   && <RoofMetal   x1={150} x2={310} rx2={340} y={168} thickness={10} c={c} />}
      {(hasSolar || roof === 'flat') && (
        <>
          <SolarPanel x={160} y={160} w={28} h={13} />
          <SolarPanel x={192} y={160} w={28} h={13} />
          <SolarPanel x={224} y={160} w={28} h={13} />
        </>
      )}
      {/* Mid trim */}
      <rect x="152" y="220" width="156" height="3" fill={c.trim} opacity="0.5" />
      <polygon points="308,220 338,230 338,233 308,223" fill={c.trim} opacity="0.4" />
      {/* Large upper-left window */}
      <rect x="158" y="176" width="52" height="40" rx="1" fill={c.glassDark} />
      <rect x="160" y="178" width="48" height="36" rx="1" fill={c.glass} opacity="0.82" />
      <line x1="184" y1="178" x2="184" y2="214" stroke={c.wallDark} strokeWidth="1.5" opacity="0.5" />
      <line x1="158" y1="196" x2="210" y2="196" stroke={c.wallDark} strokeWidth="1.5" opacity="0.5" />
      <rect x="161" y="179" width="12" height="8" fill="white" opacity="0.22" rx="0.5" />
      {/* Small upper window */}
      <rect x="158" y="224" width="26" height="24" rx="1" fill={c.glassDark} />
      <rect x="160" y="226" width="22" height="20" rx="1" fill={c.glass} opacity="0.78" />
      {/* Door */}
      <rect x="218" y="238" width="30" height="55" rx="1" fill={c.door} />
      <rect x="220" y="240" width="26" height="51" rx="1" fill={c.door} opacity="0.75" />
      <circle cx="245" cy="264" r="2.5" fill={c.trim} />
      <rect x="222" y="242" width="10" height="17" fill={c.glass} opacity="0.38" />
      <rect x="234" y="242" width="10" height="17" fill={c.glass} opacity="0.38" />
      {/* Right window */}
      <rect x="258" y="238" width="24" height="34" rx="1" fill={c.glassDark} />
      <rect x="260" y="240" width="20" height="30" rx="1" fill={c.glass} opacity="0.78" />
      <rect x="261" y="241" width="7" height="6" fill="white" opacity="0.22" rx="0.5" />
      <Person x={370} y={282} s={0.75} />
      <Person x={126} y={280} s={0.65} />
    </g>
  );
}

function Box({ position, size, color, opacity = 1, ...props }: { position: number[]; size: [number, number, number]; color: string; opacity?: number } & JSX.IntrinsicElements['mesh']) {
  return (
    <mesh position={position} receiveShadow castShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

softShadows();

type StudentView = 'overview' | 'entry' | 'bath' | 'kitchen' | 'living' | 'sleep';

const STUDENT_CAMERA_PRESETS: Record<StudentView, { position: [number, number, number]; target: [number, number, number] }> = {
  overview: { position: [6.2, 4.2, 4.8], target: [0.9, 0.55, 0] },
  entry: { position: [3.7, 1.15, 2.65], target: [0.9, 0.55, 0.2] },
  bath: { position: [-3.05, 1.0, 2.25], target: [-3.05, 0.55, 0.65] },
  kitchen: { position: [0.35, 1.05, 1.55], target: [0.15, 0.62, -1.35] },
  living: { position: [3.65, 1.05, 1.75], target: [1.9, 0.52, 0.55] },
  sleep: { position: [3.95, 1.08, -0.65], target: [2.65, 0.52, -1.25] },
};

const DXF_ROOM = {
  bath: { x: -3.05, z: 0, w: 1.82, d: 3.88 },
  main: { x: 1.75, z: 0, w: 7.55, d: 3.91 },
  height: 1.55,
  wall: 0.12,
};

function StudentHouse3D({ c, roof, hasSolar }: SharedProps) {
  const [view, setView] = useState<StudentView>('overview');
  const wallColor = c.wall;
  const trimColor = c.trim;
  const glassColor = '#A4D6F1';
  const roofColor = roof === 'metal' ? '#7D8FA8' : roof === 'pitched' ? '#4B5563' : '#607D8B';
  const floorColor = '#D9DDE0';
  const bathFloorColor = '#C9C1B6';
  const accentColor = '#B38C5D';
  const doorColor = '#5A4234';
  const views = [
    { key: 'overview' as const, label: 'Plan 3D' },
    { key: 'entry' as const, label: 'Entrée' },
    { key: 'bath' as const, label: 'SDB' },
    { key: 'kitchen' as const, label: 'Cuisine' },
    { key: 'living' as const, label: 'Salon' },
    { key: 'sleep' as const, label: 'Lit' },
  ];

  return (
    <div className="relative w-full h-full">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [5.6, 3.4, 4.4], fov: 36 }}>
        <color attach="background" args={[ '#E5F0FB' ]} />
        <ambientLight intensity={0.55} />
        <directionalLight
          castShadow
          position={[6, 8, 5]}
          intensity={1.2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
          shadow-camera-near={1}
          shadow-camera-far={20}
        />
        <hemisphereLight color="#EAF4FF" groundColor="#BDC8C1" intensity={0.35} />

        <StudentCameraRig view={view} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[18, 16]} />
          <meshStandardMaterial color="#7FA75E" />
        </mesh>

        <Box position={[DXF_ROOM.bath.x, 0.04, DXF_ROOM.bath.z]} size={[DXF_ROOM.bath.w + 0.18, 0.08, DXF_ROOM.bath.d + 0.16]} color="#4F5963" />
        <Box position={[DXF_ROOM.main.x, 0.04, DXF_ROOM.main.z]} size={[DXF_ROOM.main.w + 0.18, 0.08, DXF_ROOM.main.d + 0.16]} color="#4F5963" />
        <Box position={[DXF_ROOM.bath.x, 0.09, DXF_ROOM.bath.z]} size={[DXF_ROOM.bath.w - 0.22, 0.045, DXF_ROOM.bath.d - 0.38]} color={bathFloorColor} />
        <Box position={[DXF_ROOM.main.x, 0.09, DXF_ROOM.main.z]} size={[DXF_ROOM.main.w - 0.22, 0.045, DXF_ROOM.main.d - 0.35]} color={floorColor} />

        <Box position={[DXF_ROOM.main.x, 0.78, -1.95]} size={[DXF_ROOM.main.w + 0.14, DXF_ROOM.height, DXF_ROOM.wall]} color={wallColor} />
        <Box position={[DXF_ROOM.main.x - 1.45, 0.78, 1.95]} size={[DXF_ROOM.main.w - 2.4, DXF_ROOM.height, DXF_ROOM.wall]} color={wallColor} opacity={0.42} />
        <Box position={[DXF_ROOM.main.x + 3.35, 0.78, 1.95]} size={[0.75, DXF_ROOM.height, DXF_ROOM.wall]} color={wallColor} opacity={0.42} />
        <Box position={[DXF_ROOM.main.x - DXF_ROOM.main.w / 2, 0.78, 0]} size={[DXF_ROOM.wall, DXF_ROOM.height, DXF_ROOM.main.d]} color={wallColor} />
        <Box position={[DXF_ROOM.main.x + DXF_ROOM.main.w / 2, 0.78, 0]} size={[DXF_ROOM.wall, DXF_ROOM.height, DXF_ROOM.main.d]} color={wallColor} />

        <Box position={[DXF_ROOM.bath.x, 0.78, -1.94]} size={[DXF_ROOM.bath.w + 0.14, DXF_ROOM.height, DXF_ROOM.wall]} color={wallColor} />
        <Box position={[DXF_ROOM.bath.x, 0.78, 1.94]} size={[DXF_ROOM.bath.w + 0.14, DXF_ROOM.height, DXF_ROOM.wall]} color={wallColor} opacity={0.7} />
        <Box position={[DXF_ROOM.bath.x - DXF_ROOM.bath.w / 2, 0.78, 0]} size={[DXF_ROOM.wall, DXF_ROOM.height, DXF_ROOM.bath.d]} color={wallColor} />
        <Box position={[DXF_ROOM.bath.x + DXF_ROOM.bath.w / 2, 0.78, 0.65]} size={[DXF_ROOM.wall, 1.35, 2.55]} color={wallColor} />

        <Box position={[0.6, 1.62, 0]} size={[10.1, 0.08, 4.05]} color={roofColor} opacity={0.2} />
        {roof === 'pitched' ? (
          <>
            <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, Math.PI / 5]} castShadow>
              <boxGeometry args={[6, 0.06, 4.2]} />
              <meshStandardMaterial color={roofColor} transparent opacity={0.34} />
            </mesh>
            <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 5]} castShadow>
              <boxGeometry args={[6, 0.06, 4.2]} />
              <meshStandardMaterial color={roofColor} transparent opacity={0.34} />
            </mesh>
          </>
        ) : roof === 'metal' ? (
          <Box position={[0.6, 1.76, 0]} size={[10.1, 0.08, 4.05]} color={roofColor} opacity={0.3} />
        ) : null}

        <Box position={[2.55, 0.86, -1.97]} size={[0.95, 0.72, 0.05]} color={glassColor} opacity={0.58} />
        <Box position={[0.45, 0.78, 1.98]} size={[1.35, 0.92, 0.05]} color={glassColor} opacity={0.42} />

        <Box position={[3.35, 0.58, 1.91]} size={[0.76, 1.02, 0.1]} color={doorColor} />
        <mesh position={[3.08, 0.66, 1.84]} castShadow>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#DAB87B" />
        </mesh>

        <Box position={[-3.35, 0.18, 0.55]} size={[0.72, 0.22, 0.58]} color="#F8F7F4" />
        <Box position={[-3.35, 0.47, 0.55]} size={[0.56, 0.08, 0.44]} color="#E4EEF7" />
        <Box position={[-3.35, 0.25, 1.42]} size={[0.72, 0.3, 0.56]} color="#EDE8DF" />
        <Box position={[-3.35, 0.56, -0.03]} size={[0.55, 0.82, 0.34]} color="#F7F4ED" />
        <Box position={[-2.49, 0.48, 1.55]} size={[0.3, 0.72, 0.56]} color="#7C8790" opacity={0.55} />

        <Box position={[0.05, 0.43, -1.58]} size={[1.25, 0.7, 0.46]} color="#ECECEC" />
        <Box position={[1.18, 0.43, -1.58]} size={[0.78, 0.7, 0.46]} color="#E8E8E8" />
        <Box position={[-0.45, 0.9, -1.58]} size={[0.32, 0.1, 0.3]} color="#101215" />
        <Box position={[0.48, 0.9, -1.58]} size={[0.28, 0.1, 0.3]} color={glassColor} opacity={0.75} />
        <Box position={[1.45, 0.9, -1.58]} size={[0.3, 0.1, 0.3]} color="#101215" />
        <Box position={[-0.2, 0.22, -1.08]} size={[0.5, 0.12, 0.44]} color="#111827" />

        <Box position={[2.85, 0.27, -1.18]} size={[1.08, 0.3, 1.08]} color="#8A705A" />
        <Box position={[2.85, 0.48, -1.18]} size={[0.92, 0.08, 0.86]} color="#BFC3C7" />
        <Box position={[3.24, 0.72, -1.1]} size={[0.34, 0.22, 0.48]} color="#F3F3F0" />
        <Box position={[1.98, 0.42, -1.18]} size={[0.2, 0.6, 0.98]} color="#6F5A48" />

        <Box position={[4.92, 0.4, -0.25]} size={[0.22, 0.58, 1.42]} color="#8A5D3B" />
        <Box position={[4.35, 0.42, 0.45]} size={[0.62, 0.12, 0.44]} color="#F8F8F5" />
        <Box position={[4.35, 0.72, 0.45]} size={[0.5, 0.5, 0.06]} color="#111827" />
        <mesh position={[4.34, 0.28, 0.94]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.18, 0.025, 10, 24]} />
          <meshStandardMaterial color="#4B5563" />
        </mesh>

        <Box position={[2.75, 0.2, 1.02]} size={[1.3, 0.24, 0.54]} color="#858585" />
        <Box position={[3.29, 0.53, 1.02]} size={[0.18, 0.56, 0.54]} color="#777777" />
        <Box position={[2.2, 0.36, 0.82]} size={[0.22, 0.16, 0.25]} color="#C9C0B7" />
        <Box position={[2.2, 0.36, 1.2]} size={[0.22, 0.16, 0.25]} color="#C9C0B7" />
        <Box position={[1.2, 0.2, 0.38]} size={[0.82, 0.14, 0.44]} color={accentColor} />

        {hasSolar && (
          <>
            <Box position={[0, 1.88, -1.1]} size={[1.1, 0.04, 0.45]} color="#1A2535" />
            <Box position={[0, 1.88, -0.55]} size={[1.1, 0.04, 0.45]} color="#1A2535" />
          </>
        )}

        <Box position={[-1.25, 0.05, 2.65]} size={[1.8, 0.1, 0.75]} color="#BBA27A" />
        <Box position={[1.4, 0.05, 2.65]} size={[0.5, 0.1, 0.75]} color="#BBA27A" />

        <mesh position={[-3.6, 0.4, 0.8]} rotation={[0, Math.PI / 8, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.64, 12]} />
          <meshStandardMaterial color="#5A3E28" />
        </mesh>
      </Canvas>
      <div className="absolute left-3 right-3 bottom-3 flex flex-wrap gap-1.5 rounded-xl bg-white/86 p-1.5 shadow-lg backdrop-blur">
        {views.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setView(item.key)}
            className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${view === item.key ? 'bg-[#0F172A] text-white' : 'text-[#334155] hover:bg-slate-100'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StudentCameraRig({ view }: { view: StudentView }) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const preset = STUDENT_CAMERA_PRESETS[view];
    controls.object.position.set(...preset.position);
    controls.target.set(...preset.target);
    controls.update();
  }, [view]);

  return <OrbitControls ref={controlsRef} target={[0.25, 0.55, 0]} minDistance={0.8} maxDistance={8} maxPolarAngle={Math.PI / 2.05} enablePan={false} />;
}

function TinyHouse({ c, roof, hasSolar }: SharedProps) {
  return (
    <g>
      <ellipse cx="240" cy="307" rx="205" ry="19" fill={GROUND_DARK} opacity="0.35" />
      <rect x="85" y="292" width="305" height="27" rx="4" fill={GROUND} opacity="0.55" />
      <Tree x={93} y={273} scale={0.82} />
      <Tree x={80} y={266} scale={0.68} />
      <Tree x={108} y={280} scale={0.58} round />
      <Tree x={373} y={270} scale={0.78} round />
      <Tree x={388} y={278} scale={0.62} />
      {/* Wood deck */}
      <polygon points="142,292 368,292 383,307 127,307" fill="#A07848" />
      {[162, 202, 242, 282, 322, 362].map((x, i) => (
        <line key={i} x1={x} y1="292" x2={x - 15} y2="307" stroke="#8A6030" strokeWidth="1" opacity="0.38" />
      ))}
      <ellipse cx="252" cy="293" rx="112" ry="8" fill="rgba(0,0,0,0.2)" />
      <polygon points="353,148 390,164 390,293 353,293" fill={c.wallDark} />
      <rect x="147" y="148" width="206" height="145" fill={c.wall} />
      {/* Horizontal wood bands */}
      {[0, 20, 40, 60, 80, 100, 120, 140].map((o, i) => (
        <rect key={i} x="147" y={148 + o} width="206" height="18" fill={c.wood} opacity={0.18 + (i % 2) * 0.08} />
      ))}
      {[20, 40, 60, 80, 100, 120, 140].map((o, i) => (
        <line key={i} x1="147" y1={148 + o} x2="353" y2={148 + o} stroke={c.woodDark} strokeWidth="0.7" opacity="0.32" />
      ))}
      {roof === 'flat'    && <RoofFlat    x1={145} x2={355} rx2={392} y={148} thickness={10} c={c} />}
      {roof === 'pitched' && <RoofPitched x1={145} x2={355} rx2={392} y={148} peakY={118} c={c} />}
      {roof === 'metal'   && <RoofMetal   x1={145} x2={355} rx2={392} y={148} thickness={10} c={c} />}
      {hasSolar && (
        <>
          <SolarPanel x={165} y={140} w={36} h={14} />
          <SolarPanel x={205} y={140} w={36} h={14} />
          <SolarPanel x={245} y={140} w={36} h={14} />
        </>
      )}
      {/* Large glass wall left 55% */}
      <rect x="150" y="155" width="136" height="138" rx="1" fill={c.glassDark} />
      <rect x="152" y="157" width="132" height="134" rx="1" fill={c.glass} opacity="0.83" />
      {[195, 240].map((x, i) => (
        <line key={i} x1={x} y1="157" x2={x} y2="291" stroke={c.wallDark} strokeWidth="2.5" opacity="0.45" />
      ))}
      <line x1="152" y1="224" x2="286" y2="224" stroke={c.wallDark} strokeWidth="2" opacity="0.38" />
      <rect x="154" y="159" width="24" height="32" fill="white" opacity="0.13" rx="0.5" />
      <polygon points="154,159 200,159 172,198" fill="white" opacity="0.06" />
      {/* Right section */}
      <rect x="290" y="200" width="62" height="93" fill={c.wall} opacity="0.9" />
      <rect x="302" y="234" width="32" height="59" rx="1" fill={c.door} />
      <circle cx="331" cy="262" r="2.5" fill={c.trim} />
      <rect x="304" y="236" width="13" height="21" fill={c.glass} opacity="0.38" />
      <rect x="319" y="236" width="13" height="21" fill={c.glass} opacity="0.38" />
      <rect x="296" y="208" width="44" height="36" rx="1" fill={c.glassDark} />
      <rect x="298" y="210" width="40" height="32" rx="1" fill={c.glass} opacity="0.78" />
      <rect x="299" y="211" width="13" height="7" fill="white" opacity="0.2" />
      {/* Outdoor furniture */}
      <rect x="188" y="286" width="38" height="5" rx="1" fill="#786048" opacity="0.58" />
      <rect x="184" y="279" width="11" height="8" rx="1" fill="#786048" opacity="0.45" />
      <rect x="215" y="279" width="11" height="8" rx="1" fill="#786048" opacity="0.45" />
      <Person x={368} y={282} s={0.72} />
    </g>
  );
}

function ApartmentHouse({ c, roof, hasSolar }: SharedProps) {
  return (
    <g>
      <ellipse cx="240" cy="307" rx="210" ry="20" fill={GROUND_DARK} opacity="0.35" />
      <rect x="75" y="292" width="325" height="27" rx="4" fill={GROUND} opacity="0.6" />
      <polygon points="157,292 228,292 208,319 137,319" fill={PATH_COLOR} opacity="0.65" />
      <Tree x={88} y={275} scale={0.76} round />
      <Tree x={76} y={269} scale={0.6} />
      <Tree x={368} y={272} scale={0.7} />
      <Tree x={382} y={278} scale={0.56} round />
      {/* Car */}
      <ellipse cx="162" cy="294" rx="44" ry="6" fill="rgba(0,0,0,0.2)" />
      <rect x="130" y="265" width="66" height="27" rx="6" fill="#4A6080" />
      <rect x="136" y="255" width="54" height="19" rx="5" fill="#5A7090" />
      <rect x="140" y="258" width="46" height="15" rx="2" fill="#8AB8CE" opacity="0.68" />
      <rect x="131" y="282" width="15" height="8" rx="4" fill="#303030" />
      <rect x="180" y="282" width="15" height="8" rx="4" fill="#303030" />
      {/* Carport */}
      <rect x="121" y="196" width="66" height="7" fill={c.roofDark} opacity="0.65" />
      <line x1="123" y1="203" x2="123" y2="293" stroke={c.wallDark} strokeWidth="4" opacity="0.48" />
      <line x1="185" y1="203" x2="185" y2="293" stroke={c.wallDark} strokeWidth="4" opacity="0.48" />
      <rect x="123" y="203" width="62" height="90" fill={c.wallDark} opacity="0.1" />
      <ellipse cx="250" cy="295" rx="122" ry="9" fill="rgba(0,0,0,0.18)" />
      <polygon points="353,160 389,174 389,294 353,294" fill={c.wallDark} />
      <rect x="152" y="160" width="201" height="134" fill={c.wall} />
      {/* Wood right strip */}
      <rect x="298" y="160" width="55" height="134" fill={c.wood} opacity="0.72" />
      {[0, 10, 20, 30, 40, 50].map((o, i) => (
        <rect key={i} x={298 + o} y="160" width="9" height="134" fill={c.woodDark} opacity="0.22" rx="0.5" />
      ))}
      {roof === 'flat'    && <RoofFlat    x1={150} x2={355} rx2={391} y={160} thickness={10} c={c} />}
      {roof === 'pitched' && <RoofPitched x1={150} x2={355} rx2={391} y={160} peakY={128} c={c} />}
      {roof === 'metal'   && <RoofMetal   x1={150} x2={355} rx2={391} y={160} thickness={10} c={c} />}
      {(hasSolar || true) && (
        <>
          <SolarPanel x={168} y={152} w={34} h={14} />
          <SolarPanel x={206} y={152} w={34} h={14} />
          <SolarPanel x={244} y={152} w={34} h={14} />
        </>
      )}
      {/* Floor line */}
      <rect x="152" y="226" width="201" height="3" fill={c.trim} opacity="0.5" />
      <polygon points="353,226 389,236 389,239 353,229" fill={c.trim} opacity="0.4" />
      {/* GF windows */}
      {[158, 210].map((x, i) => (
        <g key={i}>
          <rect x={x} y="234" width="40" height="46" rx="1" fill={c.glassDark} />
          <rect x={x + 2} y="236" width="36" height="42" rx="1" fill={c.glass} opacity="0.83" />
          <line x1={x + 20} y1="236" x2={x + 20} y2="278" stroke={c.trim} strokeWidth="1.5" opacity="0.48" />
          <rect x={x + 3} y="237" width="11" height="8" fill="white" opacity="0.2" />
        </g>
      ))}
      {/* GF door */}
      <rect x="260" y="238" width="28" height="54" rx="1" fill={c.door} />
      <circle cx="285" cy="266" r="2" fill={c.trim} />
      <rect x="262" y="240" width="11" height="19" fill={c.glass} opacity="0.38" />
      <rect x="275" y="240" width="11" height="19" fill={c.glass} opacity="0.38" />
      {/* FF windows */}
      {[158, 210, 260].map((x, i) => (
        <g key={i}>
          <rect x={x} y="170" width={i === 2 ? 28 : 40} height="36" rx="1" fill={c.glassDark} />
          <rect x={x + 2} y="172" width={i === 2 ? 24 : 36} height="32" rx="1" fill={c.glass} opacity="0.8" />
          {i < 2 && <line x1={x + 20} y1="172" x2={x + 20} y2="204" stroke={c.trim} strokeWidth="1.5" opacity="0.45" />}
          <rect x={x + 3} y="173" width="11" height="7" fill="white" opacity="0.2" />
        </g>
      ))}
      <Person x={368} y={282} s={0.72} />
      <Person x={100} y={277} s={0.65} />
    </g>
  );
}

function FamilyHouse({ c, roof, hasSolar }: SharedProps) {
  return (
    <g>
      <ellipse cx="240" cy="307" rx="218" ry="20" fill={GROUND_DARK} opacity="0.35" />
      <rect x="72" y="292" width="336" height="27" rx="4" fill={GROUND} opacity="0.6" />
      <polygon points="196,292 258,292 238,319 176,319" fill={PATH_COLOR} opacity="0.65" />
      <Tree x={86} y={264} scale={0.88} />
      <Tree x={73} y={257} scale={0.7} round />
      <Tree x={383} y={266} scale={0.8} round />
      <Tree x={398} y={260} scale={0.66} />
      <ellipse cx="246" cy="294" rx="138" ry="10" fill="rgba(0,0,0,0.18)" />
      <polygon points="363,118 402,136 402,294 363,294" fill={c.wallDark} />
      <rect x="140" y="118" width="223" height="176" fill={c.wall} />
      {/* Floor separator */}
      <rect x="140" y="206" width="223" height="4" fill={c.trim} opacity="0.6" />
      <polygon points="363,206 402,220 402,224 363,210" fill={c.trim} opacity="0.5" />
      {/* Wood accent strip upper right */}
      <rect x="314" y="118" width="49" height="88" fill={c.wood} opacity="0.74" />
      {[0, 9, 18, 27, 36, 45].map((o, i) => (
        <rect key={i} x={314 + o} y="118" width="8" height="88" fill={c.woodDark} opacity="0.24" />
      ))}
      {roof === 'flat'    && <RoofFlat    x1={138} x2={365} rx2={404} y={118} thickness={10} c={c} />}
      {roof === 'pitched' && <RoofPitched x1={138} x2={365} rx2={404} y={118} peakY={86} c={c} />}
      {roof === 'metal'   && <RoofMetal   x1={138} x2={365} rx2={404} y={118} thickness={10} c={c} />}
      {hasSolar && (
        <>
          <SolarPanel x={158} y={110} w={38} h={16} />
          <SolarPanel x={200} y={110} w={38} h={16} />
          <SolarPanel x={242} y={110} w={38} h={16} />
        </>
      )}
      {/* Upper floor windows */}
      {[148, 208, 268].map((x, i) => (
        <g key={i}>
          <rect x={x} y="130" width={i === 2 ? 38 : 50} height="40" rx="1" fill={c.glassDark} />
          <rect x={x + 2} y="132" width={i === 2 ? 34 : 46} height="36" rx="1" fill={c.glass} opacity="0.8" />
          {i < 2 && <line x1={x + 25} y1="132" x2={x + 25} y2="168" stroke={c.trim} strokeWidth="1.5" opacity="0.48" />}
          <rect x={x + 3} y="133" width="14" height="8" fill="white" opacity="0.2" />
        </g>
      ))}
      {/* Balcony railing */}
      <rect x="148" y="172" width="212" height="5" fill={c.roofDark} opacity="0.58" />
      {[172, 210, 248, 286, 324].map((x, i) => (
        <line key={i} x1={x} y1="177" x2={x} y2="208" stroke={c.trim} strokeWidth="1.5" opacity="0.4" />
      ))}
      <rect x="148" y="206" width="212" height="3" fill={c.roofDark} opacity="0.45" />
      {/* GF windows */}
      {[148, 208].map((x, i) => (
        <g key={i}>
          <rect x={x} y="214" width="50" height="46" rx="1" fill={c.glassDark} />
          <rect x={x + 2} y="216" width="46" height="42" rx="1" fill={c.glass} opacity="0.84" />
          <line x1={x + 25} y1="216" x2={x + 25} y2="258" stroke={c.trim} strokeWidth="1.5" opacity="0.48" />
          <rect x={x + 3} y="217" width="14" height="8" fill="white" opacity="0.2" />
        </g>
      ))}
      {/* GF door */}
      <rect x="272" y="224" width="34" height="68" rx="1" fill={c.door} />
      <circle cx="303" cy="258" r="2.5" fill={c.trim} />
      <rect x="274" y="226" width="13" height="24" fill={c.glass} opacity="0.38" />
      <rect x="290" y="226" width="13" height="24" fill={c.glass} opacity="0.38" />
      <rect x="316" y="214" width="40" height="46" rx="1" fill={c.glassDark} />
      <rect x="318" y="216" width="36" height="42" rx="1" fill={c.glass} opacity="0.8" />
      <Person x={104} y={276} s={0.72} />
      <Person x={388} y={275} s={0.68} />
    </g>
  );
}

function FoldableHouse({ c }: SharedProps) {
  const base = '#1E1E1E';
  const baseDark = '#141414';
  const baseLight = '#2E2E2E';
  const stripe = '#282828';
  return (
    <g>
      <ellipse cx="240" cy="303" rx="195" ry="17" fill="rgba(0,0,0,0.28)" />
      <rect x="98" y="289" width="284" height="24" rx="3" fill="#888" opacity="0.38" />
      <polygon points="362,156 400,170 400,292 362,292" fill={baseDark} />
      {[176, 196, 216, 236, 256, 276].map((y, i) => (
        <line key={i} x1="364" y1={y} x2="398" y2={y + 6} stroke={stripe} strokeWidth="1.5" opacity="0.55" />
      ))}
      <rect x="142" y="156" width="220" height="136" fill={base} />
      {/* Horizontal grooves */}
      {[176, 196, 216, 236, 256, 276].map((y, i) => (
        <rect key={i} x="142" y={y} width="220" height="2" fill={stripe} opacity="0.75" />
      ))}
      {/* Color accent strip from exterior */}
      <rect x="142" y="156" width="220" height="20" fill={c.wall} opacity="0.12" />
      {/* Roof */}
      <polygon points="140,156 364,156 402,168 178,168" fill={baseDark} />
      <rect x="140" y="148" width="224" height="8" fill={baseLight} />
      <polygon points="140,148 178,160 178,168 140,156" fill={baseLight} opacity="0.65" />
      {/* Ventilation on roof */}
      {[150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((x, i) => (
        <rect key={i} x={x} y="148" width="10" height="8" fill={baseDark} opacity="0.55" rx="0.5" />
      ))}
      {/* Left door */}
      <rect x="150" y="178" width="50" height="114" rx="1" fill={baseDark} />
      <rect x="152" y="180" width="46" height="110" rx="1" fill={baseLight} opacity="0.45" />
      <line x1="175" y1="180" x2="175" y2="292" stroke={stripe} strokeWidth="2" opacity="0.75" />
      <circle cx="192" cy="236" r="3" fill="#888" />
      <rect x="154" y="188" width="19" height="38" fill={c.glass} opacity="0.28" rx="1" />
      <rect x="177" y="188" width="19" height="38" fill={c.glass} opacity="0.28" rx="1" />
      {/* Middle window */}
      <rect x="222" y="186" width="58" height="54" rx="1" fill={baseDark} />
      <rect x="224" y="188" width="54" height="50" rx="1" fill={c.glass} opacity="0.48" />
      <line x1="251" y1="188" x2="251" y2="238" stroke={baseLight} strokeWidth="1.5" opacity="0.55" />
      <rect x="225" y="189" width="17" height="11" fill="white" opacity="0.1" />
      {/* Right window */}
      <rect x="302" y="186" width="48" height="54" rx="1" fill={baseDark} />
      <rect x="304" y="188" width="44" height="50" rx="1" fill={c.glass} opacity="0.48" />
      <line x1="326" y1="188" x2="326" y2="238" stroke={baseLight} strokeWidth="1.5" opacity="0.55" />
      {/* Corner marks */}
      <line x1="142" y1="156" x2="142" y2="292" stroke={baseLight} strokeWidth="2" opacity="0.45" />
      <line x1="362" y1="156" x2="362" y2="292" stroke={baseLight} strokeWidth="2" opacity="0.45" />
      {/* Label */}
      <rect x="248" y="258" width="50" height="18" rx="3" fill={baseLight} opacity="0.55" />
      <text x="273" y="271" textAnchor="middle" fill="#888" fontSize="8" fontFamily="monospace">MODURA</text>
    </g>
  );
}

function CapsuleHouse({ c, hasSolar }: SharedProps) {
  return (
    <g>
      <ellipse cx="240" cy="307" rx="208" ry="18" fill={GROUND_DARK} opacity="0.25" />
      <rect x="87" y="293" width="296" height="23" rx="3" fill={GROUND} opacity="0.45" />
      <Tree x={93} y={277} scale={0.63} round />
      <Tree x={380} y={274} scale={0.58} round />
      {/* Feet */}
      <rect x="164" y="282" width="22" height="12" rx="2" fill="#606878" />
      <rect x="294" y="282" width="22" height="12" rx="2" fill="#606878" />
      <rect x="164" y="278" width="22" height="6" rx="2" fill="#485060" />
      <rect x="294" y="278" width="22" height="6" rx="2" fill="#485060" />
      <ellipse cx="240" cy="296" rx="128" ry="9" fill="rgba(0,0,0,0.22)" />
      {/* Side of capsule */}
      <ellipse cx="344" cy="213" rx="11" ry="66" fill="#485060" />
      {/* Main body */}
      <path d="M 132,213 Q 130,147 176,143 L 328,143 Q 350,145 350,213 Q 350,278 328,281 L 176,281 Q 130,278 132,213 Z" fill="#6A7888" />
      {/* Top highlight */}
      <path d="M 150,173 Q 150,147 176,145 L 328,145 Q 346,148 346,173" fill="none" stroke="#8A9BAB" strokeWidth="2" opacity="0.55" />
      {/* Left cap shading */}
      <path d="M 132,213 Q 130,147 176,143 L 176,281 Q 130,278 132,213 Z" fill="#5A6878" opacity="0.65" />
      {/* Horizontal lines */}
      {[163, 183, 203, 223, 243, 263].map((y, i) => (
        <path key={i} d={`M 134,${y} Q 240,${y + (i % 2 === 0 ? -1 : 1)} 348,${y}`} fill="none" stroke="#8A9BAB" strokeWidth="0.75" opacity="0.32" />
      ))}
      {/* Color accent stripe from exterior */}
      <path d="M 178,143 L 328,143 L 326,137 L 180,137 Z" fill={c.wall} opacity="0.3" />
      {/* Panoramic window */}
      <path d="M 186,156 L 322,156 Q 336,158 336,172 L 336,238 Q 336,250 322,252 L 186,252 Q 174,250 174,238 L 174,172 Q 174,158 186,156 Z" fill="#2A3D50" />
      <path d="M 188,158 L 320,158 Q 334,160 334,173 L 334,236 Q 334,248 320,250 L 188,250 Q 176,248 176,236 L 176,173 Q 176,160 188,158 Z" fill="#3A6080" opacity="0.73" />
      <path d="M 188,158 L 268,158 L 248,183 L 176,183 Q 176,160 188,158 Z" fill="white" opacity="0.09" />
      <line x1="255" y1="158" x2="255" y2="250" stroke="#4A7090" strokeWidth="2" opacity="0.48" />
      <line x1="176" y1="204" x2="334" y2="204" stroke="#4A7090" strokeWidth="1.5" opacity="0.38" />
      <rect x="177" y="205" width="77" height="43" fill="#2A4555" opacity="0.38" rx="1" />
      <rect x="257" y="205" width="76" height="43" fill="#252E3A" opacity="0.48" rx="1" />
      <rect x="178" y="205" width="76" height="42" fill="#C8A878" opacity="0.06" />
      {/* Door */}
      <path d="M 300,252 L 322,252 Q 328,254 328,260 L 328,281 L 300,281 Z" fill="#485060" />
      <path d="M 302,254 L 320,254 Q 326,256 326,261 L 326,279 L 302,279 Z" fill="#5A6878" opacity="0.75" />
      <circle cx="323" cy="267" r="2" fill="#9AAAB8" />
      {/* Model badge */}
      <rect x="138" y="254" width="34" height="14" rx="3" fill="#3A4A58" />
      <text x="155" y="265" textAnchor="middle" fill="#9AAAB8" fontSize="7" fontFamily="monospace" fontWeight="bold">S70</text>
      {/* LED strip */}
      <rect x="174" y="278" width="154" height="3" fill="#2563EB" opacity="0.38" rx="1" />
      {hasSolar && (
        <g>
          <path d="M 202,143 L 298,143 L 296,136 L 204,136 Z" fill="#1A2535" opacity="0.88" />
          <path d="M 202,143 L 298,143 L 296,136 L 204,136 Z" fill="none" stroke="#2563EB" strokeWidth="0.7" />
          <line x1="250" y1="136" x2="250" y2="143" stroke="#2563EB" strokeWidth="0.7" opacity="0.7" />
          <line x1="226" y1="136" x2="226" y2="143" stroke="#2563EB" strokeWidth="0.6" opacity="0.55" />
          <line x1="274" y1="136" x2="274" y2="143" stroke="#2563EB" strokeWidth="0.6" opacity="0.55" />
        </g>
      )}
      <Person x={390} y={282} s={0.7} />
    </g>
  );
}

interface Props {
  config: HouseConfig;
  className?: string;
  showDecorations?: boolean;
}

export default function HouseViewer({ config, className = '', showDecorations = true }: Props) {
  const { model, exterior, roof, energies = [] } = config;
  const c = EXT_COLORS[exterior];
  const hasSolar = energies.includes('solar5') || energies.includes('solar10');
  const shared: SharedProps = { c, roof, hasSolar };

  if (model === 'student') {
    return (
      <div className={`relative w-full ${className}`}>
        <StudentHouse3D {...shared} />
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox="0 0 480 340"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.1))' }}
      >
        <defs>
          <linearGradient id={`sky_${model}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8D4EE" />
            <stop offset="100%" stopColor="#E4F2FC" />
          </linearGradient>
          <linearGradient id={`gr_${model}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GRASS_LIGHT} />
            <stop offset="100%" stopColor={GROUND} />
          </linearGradient>
          <clipPath id={`cp_${model}`}>
            <rect width="480" height="340" />
          </clipPath>
        </defs>
        <g clipPath={`url(#cp_${model})`}>
          <rect width="480" height="340" fill={`url(#sky_${model})`} />
          {model !== 'foldable' && (
            <>
              <rect x="0" y="294" width="480" height="46" fill={`url(#gr_${model})`} />
              <line x1="0" y1="294" x2="480" y2="294" stroke="#5A8035" strokeWidth="1" opacity="0.38" />
            </>
          )}
          {model === 'foldable' && (
            <rect x="0" y="289" width="480" height="51" fill="#707070" opacity="0.35" />
          )}
          {model === 'tiny'      && <TinyHouse      {...shared} />}
          {model === 'apartment' && <ApartmentHouse {...shared} />}
          {model === 'family'    && <FamilyHouse    {...shared} />}
          {model === 'foldable'  && <FoldableHouse  {...shared} />}
          {model === 'capsule'   && <CapsuleHouse   {...shared} />}
        </g>
      </svg>
    </div>
  );
}
