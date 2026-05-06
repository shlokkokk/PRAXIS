import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Float, Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import FinancialSoul from './FinancialSoul'
import AssetCluster from './AssetCluster'

// Colors representing asset classes and mastery
const COLORS = {
  core: '#8b5cf6', // Violet - Core Health
  cash: '#10b981', // Emerald - Stability
  stocks: '#06b6d4', // Cyan - Growth
  crypto: '#f59e0b', // Gold - High Risk
  realEstate: '#ec4899', // Pink - Tangible
  retirement: '#6366f1', // Indigo - Long term
  debt: '#f43f5e', // Rose - Gravity/Pull
  mastery: '#c4b5fd', // Light Violet
}

export default function GalaxyScene() {
  const { financialTwin, mastery, userProfile, hoveredElement } = useStore()
  const sceneRef = useRef<THREE.Group>(null)
  const rotationTimeRef = useRef(0)
  
  if (!financialTwin) return null

  const healthScore = financialTwin.financialHealth.overallScore
  const riskTolerance = userProfile?.moneyPersonality.riskTolerance || 3
  
  // Calculate system-wide chaos based on risk tolerance
  const turbulence = riskTolerance * 0.1
  const coreScale = 1.5 + (healthScore / 100)

  // Map portfolio allocation to clusters
  const allocation = financialTwin.portfolioAllocation
  const assetClusters = [
    { label: 'Cash', value: allocation.cash, color: COLORS.cash, radius: 6 },
    { label: 'Stocks', value: allocation.stocks, color: COLORS.stocks, radius: 9 },
    { label: 'Crypto', value: allocation.crypto, color: COLORS.crypto, radius: 12 },
    { label: 'Real Estate', value: allocation.realEstate, color: COLORS.realEstate, radius: 15 },
    { label: 'Retirement', value: allocation.retirement, color: COLORS.retirement, radius: 18 },
  ].filter(a => a.value > 0)

  // Map mastery categories to moons
  const masteryMoons = Object.entries(mastery.categories).map(([key, value], i) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    score: value,
    angle: (i / 6) * Math.PI * 2,
    radius: 3.5 + (i * 0.2),
  }))
  
  useFrame((_, delta) => {
    if (!hoveredElement) {
      rotationTimeRef.current += delta * 0.1 // Adjust rotation speed here
    }
    if (sceneRef.current) {
      sceneRef.current.rotation.y = rotationTimeRef.current
    }
  })

  return (
    <group ref={sceneRef}>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color={COLORS.core} />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />

      {/* Background Universe - Natural density */}
      <Stars radius={200} depth={50} count={6000} factor={4} saturation={0} fade speed={hoveredElement ? 0 : 0.5} />
      
      {/* Nebulae Dust (Atmospheric layers) */}
      <group rotation={[turbulence, turbulence, 0]}>
        <mesh scale={[100, 100, 100]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={COLORS.core} transparent opacity={0.015} side={THREE.BackSide} />
        </mesh>
      </group>

      {/* The Financial Twin Core */}
      <Float speed={2 + turbulence} rotationIntensity={0.5} floatIntensity={1}>
        <group scale={[coreScale, coreScale, coreScale]}>
          <FinancialSoul score={healthScore} color={COLORS.core} />
        </group>
      </Float>

      {/* Mastery Moons - Orbiting the core closely */}
      {masteryMoons.map((moon) => (
        <MasteryMoon 
          key={moon.label} 
          {...moon} 
          turbulence={turbulence} 
        />
      ))}

      {/* Portfolio Asset Clusters */}
      {assetClusters.map((cluster) => (
        <AssetCluster 
          key={cluster.label}
          radius={cluster.radius}
          count={Math.max(3, Math.floor(cluster.value * 20))}
          color={cluster.color}
          size={0.2 + (cluster.value * 0.5)}
          speed={0.1 / (cluster.radius * 0.2) * (1 + turbulence)}
          spread={1 + (cluster.value * 2)}
          label={cluster.label}
        />
      ))}

      {/* Debt Gravity - If exists, it creates a dark pull */}
      {financialTwin.financialHealth.debtToIncomeRatio > 0 && (
        <DebtGravity 
          coreScale={coreScale}
        />
      )}
    </group>
  )
}

function MasteryMoon({ label, score, angle, radius, turbulence }: any) {
  const meshRef = useRef<THREE.Group>(null)
  const { setHoveredElement, hoveredElement } = useStore()
  
  const timeRef = useRef(0)
  
  useFrame((_state, delta) => {
    if (meshRef.current) {
      if (!hoveredElement) {
        timeRef.current += delta * (0.2 + turbulence)
      }
      
      const t = timeRef.current
      const currentAngle = angle + t
      meshRef.current.position.x = Math.cos(currentAngle) * radius
      meshRef.current.position.z = Math.sin(currentAngle) * radius
      meshRef.current.position.y = Math.sin(t * 2) * 0.2
      
      meshRef.current.rotation.y += 0.02
    }
  })

  return (
    <group ref={meshRef}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredElement({
            title: label.toUpperCase(),
            subtitle: 'MASTERY_VECTOR_READOUT',
            value: `${score}%`
          })
        }}
        onPointerOut={() => setHoveredElement(null)}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={COLORS.mastery} 
          emissive={COLORS.mastery} 
          emissiveIntensity={score / 50} 
        />
      </mesh>
      <Billboard position={[0, 0.3, 0]}>
        <Text
          fontSize={0.12}
          color="white"
          fillOpacity={0.6}
        >
          {label}
        </Text>
      </Billboard>
    </group>
  )
}

function DebtGravity({ coreScale }: any) {
  const ringRef = useRef<THREE.Mesh>(null)
  const { hoveredElement } = useStore()
  
  const timeRef = useRef(0)
  
  useFrame((_state, delta) => {
    if (ringRef.current) {
      if (!hoveredElement) {
        timeRef.current += delta
      }
      ringRef.current.rotation.z = timeRef.current * 0.5
      ringRef.current.rotation.y = Math.sin(timeRef.current * 0.3) * 0.2
    }
  })

  return (
    <group>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0.2, 0]}>
        <torusGeometry args={[coreScale + 0.5, 0.02, 16, 100]} />
        <meshBasicMaterial color={COLORS.debt} transparent opacity={0.3} />
      </mesh>
      {/* Erratic "Pull" particles */}
      <Float speed={5} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[coreScale + 1, 0, 0]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color={COLORS.debt} emissive={COLORS.debt} emissiveIntensity={2} />
        </mesh>
      </Float>
    </group>
  )
}
