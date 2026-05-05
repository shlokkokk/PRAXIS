import { useState, useEffect } from 'react'

const STEPS = [
  'Analyzing your financial profile...',
  'Mapping economic context to your location...',
  'Calculating income projections...',
  'Generating life event probabilities...',
  'Building your Financial Twin...',
]

export default function GeneratingStep() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1
        return prev
      })
    }, 650)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="generating-container">
      <div className="quantum-loader-container">
        <svg viewBox="0 0 100 100" className="quantum-hex-svg">
          <defs>
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <polygon 
            points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" 
            fill="none" 
            stroke="var(--color-cyan)" 
            strokeWidth="0.5" 
            className="hex-path-outer" 
          />
          <polygon 
            points="50,15 80.3,32.5 80.3,67.5 50,85 19.7,67.5 19.7,32.5" 
            fill="none" 
            stroke="var(--color-violet)" 
            strokeWidth="1.5" 
            className="hex-path-inner" 
            filter="url(#glow)"
          />
          <polygon 
            points="50,30 67.3,40 67.3,60 50,70 32.7,60 32.7,40" 
            fill="url(#brandGradient)" 
            className="hex-path-core" 
            filter="url(#glow)"
          />
        </svg>
        <div className="scanning-line" />
      </div>

      <div className="generating-text">
        <h2>
          Generating Your <span className="gradient-text">Financial Twin</span>
        </h2>
        <p>Weaving your data into a parallel financial universe...</p>
      </div>

      <div className="generating-steps">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`gen-step ${i === activeStep ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}
          >
            <div className="gen-step-dot" />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
