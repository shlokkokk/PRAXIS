import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, generateUserProfile, generateFinancialTwin } from '../store/useStore'
import ParticleField from '../components/ParticleField'
import WelcomeStep from '../components/onboarding/WelcomeStep'
import IdentityStep from '../components/onboarding/IdentityStep'
import PersonalityStep from '../components/onboarding/PersonalityStep'
import GeneratingStep from '../components/onboarding/GeneratingStep'
import TwinReadyStep from '../components/onboarding/TwinReadyStep'
import './Onboarding.css'

const TOTAL_STEPS = 5

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
  }),
}

export default function Onboarding() {
  const navigate = useNavigate()
  const {
    onboarding,
    updateOnboarding,
    setUserProfile,
    setFinancialTwin,
    setView,
  } = useStore()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)


  const goNext = useCallback(() => {
    if (step === 2) {
      setDirection(1)
      setStep(3)

      setTimeout(() => {
        const profile = generateUserProfile(onboarding)
        const twin = generateFinancialTwin(profile)
        setUserProfile(profile)
        setFinancialTwin(twin)
        setStep(4)
      }, 3500)
      return
    }

    if (step < TOTAL_STEPS - 1) {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }, [step, onboarding, setUserProfile, setFinancialTwin])

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }, [step])

  const handleComplete = useCallback(() => {
    setView('dashboard')
    navigate('/dashboard')
  }, [setView, navigate])

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={goNext} />
      case 1:
        return (
          <IdentityStep
            data={onboarding}
            onUpdate={updateOnboarding}
            onNext={goNext}
            onBack={goBack}
          />
        )
      case 2:
        return (
          <PersonalityStep
            data={onboarding}
            onUpdate={updateOnboarding}
            onNext={goNext}
            onBack={goBack}
          />
        )
      case 3:
        return <GeneratingStep />
      case 4:
        return <TwinReadyStep onComplete={handleComplete} />
      default:
        return null
    }
  }

  return (
    <motion.div
      className="onboarding"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ParticleField />

      <div className="onboarding-header">
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <span className="step-counter">
          {step + 1} / {TOTAL_STEPS}
        </span>
      </div>

      <div className="onboarding-content">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="step-container"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
