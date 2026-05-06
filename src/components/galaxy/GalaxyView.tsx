import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import GalaxyScene from './GalaxyScene'
import { useStore } from '../../store/useStore'
import './GalaxyView.css'

export default function GalaxyView() {
  const { financialTwin, mastery, hoveredElement } = useStore()

  if (!financialTwin) return null

  return (
    <div className="galaxy-container">
      <Canvas dpr={[1, 2]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 10, 20]} fov={45} far={2000} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={5} 
          maxDistance={40} 
          maxPolarAngle={Math.PI / 2 + 0.4}
          autoRotate={false}
        />
        
        <Suspense fallback={null}>
          <GalaxyScene />
        </Suspense>

        <EffectComposer multisampling={0}>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={2.0} 
            radius={0.7}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0015, 0.0015)}
            radialModulation={true}
            modulationOffset={0.5}
          />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.2} />
        </EffectComposer>
      </Canvas>
      
      {/* Cyber HUD Overlay */}
      <div className="galaxy-hud">
        {/* Top Left: System Status */}
        <div className="hud-section top-left">
          <div className="hud-label">FINANCIAL_CORE_STATUS</div>
          <div className="hud-value status-active">SYNCHRONIZED</div>
          <div className="hud-health-bar">
             <div className="health-fill" style={{ width: `${financialTwin.financialHealth.overallScore}%` }}></div>
          </div>
          <div className="hud-stats">
            <span>HEALTH_INDEX: {financialTwin.financialHealth.overallScore}</span>
            <span>NET_WORTH: ${financialTwin.netWorth.toLocaleString()}</span>
          </div>
        </div>

        {/* Top Right: Mastery Readout */}
        <div className="hud-section top-right">
          <div className="hud-label">MASTERY_VECTORS</div>
          {Object.entries(mastery.categories).slice(0, 3).map(([key, val]) => (
            <div key={key} className="hud-mini-stat">
              <span className="stat-name">{key.toUpperCase()}</span>
              <div className="stat-dots">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`stat-dot ${i < Math.round(val / 20) ? 'active' : ''}`}></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Center Top: Active Scan (Only when hovering) */}
        {hoveredElement && (
          <div className="hud-section active-scan">
            <div className="hud-label">ACTIVE_SCAN_RESULTS</div>
            <div className="scan-title">{hoveredElement.title}</div>
            <div className="scan-subtitle">{hoveredElement.subtitle}</div>
            {hoveredElement.value && (
              <div className="scan-value status-active">{hoveredElement.value}</div>
            )}
            <div className="scan-decor">
              <div className="decor-line"></div>
              <div className="decor-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Left: Legend */}
        <div className="hud-section bottom-left">
           <div className="hud-legend">
              <div className="legend-item"><span className="dot core"></span> SYSTEM_CORE</div>
              <div className="legend-item"><span className="dot cash"></span> LIQUIDITY</div>
              <div className="legend-item"><span className="dot stocks"></span> GROWTH_VECTORS</div>
              <div className="legend-item"><span className="dot debt"></span> GRAVITY_WELL</div>
           </div>
        </div>

        {/* Bottom Right: Coordinates & Controls */}
        <div className="hud-section bottom-right">
          <div className="hud-coordinates">
            X: {Math.random().toFixed(4)} | Y: {Math.random().toFixed(4)} | Z: {Math.random().toFixed(4)}
          </div>
          <div className="hud-hint">INTERACT_TO_EXPLORE_UNIVERSE</div>
        </div>

        {/* Scanning Line Animation */}
        <div className="hud-scanline"></div>
      </div>
    </div>
  )
}
