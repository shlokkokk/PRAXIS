import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Trail, Float, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

// Colors representing asset classes
const COLORS = {
  core: '#8b5cf6', // Violet - Core Health
  cash: '#10b981', // Emerald - Stability
  investment: '#06b6d4', // Cyan - Growth
  debt: '#f43f5e', // Rose - Gravity/Pull
}

export default function GalaxyScene() {
  const { financialTwin, simulation } = useStore()
  
  if (!financialTwin) return null

  const healthScore = financialTwin.financialHealth.overallScore
  const netWorth = financialTwin.netWorth
  
  // See the Future Mode (Parallel Timelines) - activates during council deliberation or when predicting
  const isPredicting = simulation.isPaused === false // Simple hook for now, or true if in simulation
  
  // Calculate relative sizes and orbit speeds based on twin's state
  const coreScale = Math.max(1, healthScore / 25)
  
  // Mocking asset breakdown for visuals if netWorth is 0
  const assets = {
    cash: financialTwin.financialHealth.emergencyFundMonths * 1000 || 5000,
    investment: netWorth > 0 ? netWorth * 0.5 : 1000,
    debt: financialTwin.financialHealth.debtToIncomeRatio > 0 ? 10000 : 0
  }
  
  const maxAsset = Math.max(assets.cash, assets.investment, assets.debt, 1)

  return (
    <group>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color={COLORS.core} />

      {/* Background Starfield */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* The Financial Twin Core */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[coreScale, 64, 64]} />
          <meshStandardMaterial 
            color={COLORS.core}
            emissive={COLORS.core}
            emissiveIntensity={2}
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>
        
        {/* Core Aura */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[coreScale * 1.2, 32, 32]} />
          <meshBasicMaterial 
            color={COLORS.core} 
            transparent 
            opacity={0.15} 
            wireframe 
          />
        </mesh>
      </Float>

      {/* Cash / Liquidity Orbit (Stable, close) */}
      <OrbitalNode 
        radius={coreScale + 2.5} 
        speed={0.4} 
        size={Math.max(0.4, (assets.cash / maxAsset) * 1.8)} 
        color={COLORS.cash} 
        label="Liquidity"
        yOffset={0}
        showParallel={isPredicting}
      />

      {/* Investments Orbit (Dynamic, wider) */}
      <OrbitalNode 
        radius={coreScale + 5.5} 
        speed={0.6} 
        size={Math.max(0.4, (assets.investment / maxAsset) * 2.2)} 
        color={COLORS.investment} 
        label="Growth"
        yOffset={0.5}
        showParallel={isPredicting}
      />

      {/* Debt Orbit (Erratic, dark, pulls in) */}
      {assets.debt > 0 && (
        <OrbitalNode 
          radius={coreScale + 3.5} 
          speed={1.2} 
          size={Math.max(0.6, (assets.debt / maxAsset) * 2)} 
          color={COLORS.debt} 
          label="Debt Gravity"
          yOffset={-0.5}
          erratic
          showParallel={isPredicting}
        />
      )}
      
      {/* Simulation Rings to show time progression boundaries */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[coreScale + 4.9, coreScale + 5.0, 64]} />
        <meshBasicMaterial color={COLORS.investment} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

interface OrbitalNodeProps {
  radius: number
  speed: number
  size: number
  color: string
  label: string
  yOffset: number
  erratic?: boolean
  showParallel?: boolean
}

function OrbitalNode({ radius, speed, size, color, label, yOffset, erratic = false, showParallel = false }: OrbitalNodeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const nodeRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the entire group around the center
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed
      
      if (erratic) {
        // Add erratic wobble for debt
        groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2) * 0.2
        groupRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 3) * 0.2
      }
    }
    
    if (nodeRef.current) {
      // Spin the node itself
      nodeRef.current.rotation.x += 0.01
      nodeRef.current.rotation.y += 0.02
    }
  })

  // Pre-calculate orbit path points for the faint ring
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius))
    }
    return pts
  }, [radius, yOffset])

  return (
    <group>
      {/* Primary Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, yOffset, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Parallel Timeline Rings (Ghost trails) */}
      {showParallel && [1, 2, 3].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, (i * Math.PI) / 6, 0]} position={[0, yOffset, 0]}>
          <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
          <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      ))}
      
      {/* The Orbiting Object */}
      <group ref={groupRef}>
        <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={[radius, yOffset, 0]}>
            <Trail width={size * 2} color={color} length={erratic ? 5 : 20} decay={1} attenuation={(t) => t * t}>
              <mesh ref={nodeRef}>
                {erratic ? (
                  <octahedronGeometry args={[size]} />
                ) : (
                  <icosahedronGeometry args={[size, 1]} />
                )}
                <meshStandardMaterial 
                  color={color} 
                  emissive={color} 
                  emissiveIntensity={1.5} 
                  roughness={0.1}
                  metalness={0.9}
                />
              </mesh>
            </Trail>
            
            {/* Holographic Label */}
            <Text
              position={[0, size + 0.5, 0]}
              fontSize={0.4}
              color={color}
              anchorX="center"
              anchorY="middle"
              material-toneMapped={false}
              renderOrder={10}
            >
              {label}
            </Text>
          </group>
        </Float>
      </group>
    </group>
  )
}
