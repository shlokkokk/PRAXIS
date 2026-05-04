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
      <div className="generating-orb" />

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
