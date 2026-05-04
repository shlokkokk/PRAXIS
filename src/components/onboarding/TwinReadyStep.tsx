import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { Sparkles, ShieldCheck, Hammer, Compass, Zap, Telescope } from 'lucide-react'

const ARCHETYPE_INFO: Record<string, { icon: React.ReactNode; label: string; description: string }> = {
  guardian: {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    label: 'The Guardian',
    description: 'You prioritize security, stability, and protecting what you\'ve built. You sleep better knowing your emergency fund is full.',
  },
  builder: {
    icon: <Hammer size={20} strokeWidth={1.5} />,
    label: 'The Builder',
    description: 'Balanced and methodical. You build wealth brick by brick with a mix of safety and growth.',
  },
  explorer: {
    icon: <Compass size={20} strokeWidth={1.5} />,
    label: 'The Explorer',
    description: 'Bold and action-oriented. You chase opportunities and aren\'t afraid to take calculated risks for big returns.',
  },
  strategist: {
    icon: <Zap size={20} strokeWidth={1.5} />,
    label: 'The Strategist',
    description: 'Analytical and patient. You play the long game, optimizing every decision with data and foresight.',
  },
  visionary: {
    icon: <Telescope size={20} strokeWidth={1.5} />,
    label: 'The Visionary',
    description: 'Forward-thinking and ambitious. You see money as a tool for building the future you imagine.',
  },
}

interface Props {
  onComplete: () => void
}

export default function TwinReadyStep({ onComplete }: Props) {
  const { userProfile, financialTwin } = useStore()

  if (!userProfile || !financialTwin) return null

  const archetype = ARCHETYPE_INFO[userProfile.moneyPersonality.archetype] || ARCHETYPE_INFO.builder

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="step-card twin-ready">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(15, 15, 46, 0.5)',
          border: '1px solid rgba(6, 182, 212, 0.5)',
          backdropFilter: 'blur(10px)',
          margin: '0 auto var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(6, 182, 212, 0.2), inset 0 0 20px rgba(6, 182, 212, 0.2)',
          color: 'var(--color-cyan)',
        }}
      >
        <Sparkles size={36} strokeWidth={1.5} />
      </motion.div>

      <h2>
        Your Twin is <span className="gradient-text">Ready</span>
      </h2>

      <p className="step-subtitle">
        Meet the financial version of {userProfile.name}. Your parallel self is ready to navigate
        the financial universe.
      </p>

      <div className="archetype-badge">
        <span>{archetype.icon}</span>
        <span>{archetype.label}</span>
      </div>

      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-6)',
        maxWidth: 400,
        margin: '0 auto var(--space-6)',
        lineHeight: 1.7,
      }}>
        {archetype.description}
      </p>

      <div className="twin-summary">
        <div className="summary-card">
          <div className="label">Starting Net Worth</div>
          <div className="value" style={{ color: financialTwin.netWorth >= 0 ? 'var(--color-emerald)' : 'var(--color-rose)' }}>
            {formatMoney(financialTwin.netWorth)}
          </div>
        </div>
        <div className="summary-card">
          <div className="label">Projected Year 1 Income</div>
          <div className="value">{formatMoney(financialTwin.projectedIncome[0] || 0)}</div>
        </div>
        <div className="summary-card">
          <div className="label">Emergency Fund</div>
          <div className="value">
            {financialTwin.financialHealth.emergencyFundMonths.toFixed(1)} mo
          </div>
        </div>
        <div className="summary-card">
          <div className="label">Financial Health</div>
          <div className="value" style={{ color: 'var(--color-gold)' }}>
            {Math.round(financialTwin.financialHealth.overallScore)}/100
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn-primary btn-lg" onClick={onComplete}>
          Enter the Financial Universe
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 9h10M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
