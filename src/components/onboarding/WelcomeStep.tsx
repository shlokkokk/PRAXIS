import { motion } from 'framer-motion'
import { Orbit, Dna, Brain, Zap } from 'lucide-react'

interface Props {
  onNext: () => void
}

export default function WelcomeStep({ onNext }: Props) {
  return (
    <div className="step-card">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(15, 15, 46, 0.5)',
          border: '1px solid rgba(139, 92, 246, 0.5)',
          backdropFilter: 'blur(10px)',
          margin: '0 auto var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.2), inset 0 0 20px rgba(139, 92, 246, 0.2)',
          color: 'var(--color-violet)',
        }}
      >
        <Orbit size={40} strokeWidth={1.5} />
      </motion.div>

      <h2>
        Welcome to <span className="gradient-text">Praxis</span>
      </h2>

      <p className="step-subtitle">
        You're about to create your Financial Twin — an AI-powered parallel version
        of your financial self. In minutes, you'll navigate real scenarios, watch
        AI agents debate your decisions, and experience the future before you live it.
      </p>

      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-8)',
          textAlign: 'left',
          maxWidth: 400,
          margin: '0 auto var(--space-8)',
        }}
      >
        {[
          { icon: <Dna size={20} strokeWidth={1.5} />, text: 'Create your personalized financial profile' },
          { icon: <Brain size={20} strokeWidth={1.5} />, text: 'Discover your money personality archetype' },
          { icon: <Zap size={20} strokeWidth={1.5} />, text: 'Generate your AI-powered Financial Twin' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-card)',
              border: '1px solid var(--color-border)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            {item.text}
          </motion.div>
        ))}
      </motion.div>

      <div className="step-actions">
        <button className="btn btn-primary btn-lg" onClick={onNext}>
          Let's Begin
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 9h10M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-secondary)',
        fontWeight: 500,
        marginTop: 'var(--space-4)',
        opacity: 0.8
      }}>
        Takes about 3 minutes · No account needed · Your data stays local
      </p>
    </div>
  )
}
