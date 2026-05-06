import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

interface AssetClusterProps {
  radius: number
  count: number
  color: string
  size: number
  speed: number
  spread: number
  label: string
}

export default function AssetCluster({ radius, count, color, size, speed, spread, label }: AssetClusterProps) {
  const groupRef = useRef<THREE.Mesh>(null)
  const { setHoveredElement, hoveredElement } = useStore()
  
  // Create randomized positions within the cluster
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      ),
      scale: Math.random() * 0.5 + 0.5,
      rotationSpeed: Math.random() * 0.02
    }))
  }, [count, spread])

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (groupRef.current) {
      if (!hoveredElement) {
        timeRef.current += delta * speed
      }
      groupRef.current.rotation.y = timeRef.current
    }
  })

  return (
    <group ref={groupRef}>
      <group 
        position={[radius, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredElement({
            title: label.toUpperCase(),
            subtitle: 'ASSET_CLUSTER_ANALYSIS',
            value: 'STABLE'
          })
        }}
        onPointerOut={() => setHoveredElement(null)}
      >
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Instances range={count}>
            <icosahedronGeometry args={[size, 1]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={2} 
              roughness={0.1}
              metalness={0.9}
            />
            {particles.map((p, i) => (
              <Instance 
                key={i} 
                position={p.position} 
                scale={p.scale} 
              />
            ))}
          </Instances>
        </Float>
        
        {/* Connection lines between particles for a "networked" look */}
        {count > 1 && (
           <mesh>
             <sphereGeometry args={[spread * 0.6, 16, 16]} />
             <meshBasicMaterial color={color} wireframe transparent opacity={0.05} />
           </mesh>
        )}
      </group>
      
      {/* Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
