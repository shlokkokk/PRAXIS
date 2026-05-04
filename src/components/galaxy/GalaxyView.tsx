import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import GalaxyScene from './GalaxyScene'
import './GalaxyView.css'

export default function GalaxyView() {
  return (
    <div className="galaxy-container">
      <Canvas dpr={[1, 2]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 8, 15]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={5} 
          maxDistance={30} 
          maxPolarAngle={Math.PI / 2 + 0.2}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <Suspense fallback={null}>
          <GalaxyScene />
        </Suspense>

        {/* High-End Post Processing for the "Godly" look */}
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.6}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.002, 0.002)}
            radialModulation={true}
            modulationOffset={0.5}
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
      
      <div className="galaxy-overlay">
        <div className="galaxy-legend">
          <div className="legend-item"><span className="dot core"></span> Core Health</div>
          <div className="legend-item"><span className="dot cash"></span> Liquidity</div>
          <div className="legend-item"><span className="dot investment"></span> Growth</div>
          <div className="legend-item"><span className="dot debt"></span> Debt Pull</div>
        </div>
        <div className="galaxy-controls-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 15l7-7 7 7"/>
          </svg>
          Drag to explore your financial universe
        </div>
      </div>
    </div>
  )
}
