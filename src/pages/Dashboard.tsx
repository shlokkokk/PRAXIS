import { useCallback, useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { 
  CheckCircle, 
  ArrowRight, 
  Coins, 
  TrendingDown, 
  Target, 
  Zap, 
  Activity, 
  LineChart as ChartIcon, 
  Shield, 
  Award,
  Wallet,
  RefreshCw,
  AlertTriangle,
  X
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts'
import ParticleField from '../components/ParticleField'
import GalaxyView from '../components/galaxy/GalaxyView'
import './Dashboard.css'

const SCENARIOS = [
  {
    id: 'first_paycheck',
    title: 'The First Paycheck',
    subtitle: 'Your career begins. Every dollar matters.',
    description: 'You just got your first real job. 401k? Emergency fund? Pay off debt? Apartment budget? Every decision shapes the next decade.',
    icon: <Coins size={20} strokeWidth={1.5} />,
    difficulty: 'beginner' as const,
    estimatedMinutes: 15,
    color: '#10b981',
  },
  {
    id: 'market_crash',
    title: 'The Market Crash',
    subtitle: 'Markets just dropped 30%. What now?',
    description: 'Your portfolio took a massive hit. Panic sell? Buy the dip? Hold steady? This is where fortunes are made — or lost.',
    icon: <TrendingDown size={20} strokeWidth={1.5} />,
    difficulty: 'intermediate' as const,
    estimatedMinutes: 12,
    color: '#f43f5e',
  },
  {
    id: 'windfall',
    title: 'The Windfall',
    subtitle: 'An unexpected $10,000. What would you do?',
    description: 'Money falls into your lap. Start a side hustle? Pay off student loans? Invest? The options are endless — but math doesn\'t lie.',
    icon: <Target size={20} strokeWidth={1.5} />,
    difficulty: 'intermediate' as const,
    estimatedMinutes: 12,
    color: '#fbbf24',
  },
]

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'var(--color-emerald)',
  intermediate: 'var(--color-gold)',
  advanced: 'var(--color-rose)',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { userProfile, financialTwin, mastery, completedScenarios, decisionHistory, purgeStore } = useStore()
  const [showResetModal, setShowResetModal] = useState(false)

  // Scroll lock when modal is open
  useEffect(() => {
    if (showResetModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showResetModal])

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  if (!userProfile || !financialTwin) {
    navigate('/onboarding')
    return null
  }

  const healthScore = Math.round(financialTwin.financialHealth.overallScore)
  const netWorth = financialTwin.netWorth

  const projectionData = useMemo(() => {
    return financialTwin.projectedIncome.map((income, i) => {
      // Find life events for this year
      const yearEvents = financialTwin.lifeEvents.filter(e => e.year === i)
      const event = yearEvents.length > 0 ? yearEvents[0] : null
      
      return {
        year: `Year ${i + 1}`,
        income: income,
        netWorth: Math.round(netWorth * Math.pow(1.07, i) + (income * 0.2 * i)),
        event: event ? event.title : null,
        eventType: event ? event.type : null,
      }
    })
  }, [financialTwin, netWorth])

  const masteryData = useMemo(() => {
    const { categories } = mastery
    return [
      { subject: 'Budgeting', A: categories.budgeting || 40, fullMark: 100 },
      { subject: 'Investing', A: categories.investing || 30, fullMark: 100 },
      { subject: 'Debt', A: categories.debtManagement || 50, fullMark: 100 },
      { subject: 'Behavior', A: categories.behavioralAwareness || 60, fullMark: 100 },
      { subject: 'Risk', A: categories.riskManagement || 45, fullMark: 100 },
    ]
  }, [mastery])

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    if (payload.event) {
      return (
        <svg x={cx - 6} y={cy - 6} width={12} height={12} fill="white">
          <circle cx="6" cy="6" r="4" fill="var(--color-cyan)" stroke="white" strokeWidth={2} />
        </svg>
      )
    }
    return null
  }

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ParticleField />

      <nav className="dashboard-nav">
        <div className="nav-logo">
          <span className="logo-text" style={{ fontSize: 'var(--text-lg)' }}>PRAXIS</span>
        </div>
        <div className="nav-links">
          <span className="nav-greeting">Welcome back, {userProfile.name}</span>
          <button 
            className="btn-reset-timeline"
            onClick={() => setShowResetModal(true)}
            title="Reset Timeline"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </nav>

      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <motion.div 
            className="modal-content reset-warning-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowResetModal(false)}>
              <X size={20} />
            </button>
            
            <div className="modal-header-icon reset-icon">
              <AlertTriangle size={32} />
            </div>
            
            <h2>Reset Financial Timeline?</h2>
            <p>
              This action is <strong>irreversible</strong>. You will lose your current Financial Twin, 
              decision history, and mastery progress. You will need to re-onboard to start a new timeline.
            </p>
            
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowResetModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-danger" 
                onClick={() => {
                  purgeStore()
                  navigate('/landing')
                }}
              >
                Reset Everything
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="dashboard-content">
        <motion.div
          className="dashboard-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="twin-overview" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div className="twin-info" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <h1>{userProfile.name}'s Financial Universe</h1>
              <p className="twin-meta">
                {userProfile.age} · {userProfile.location} · {userProfile.careerGoal}
              </p>
            </div>
            
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <GalaxyView />
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon" style={{ color: netWorth >= 0 ? 'var(--color-emerald)' : 'var(--color-rose)' }}>
                <Wallet size={24} strokeWidth={1.5} />
              </div>
              <div className="stat-info">
                <span className="stat-label-text">Net Worth</span>
                <span className="stat-value-text" style={{ color: netWorth >= 0 ? 'var(--color-emerald)' : 'var(--color-rose)' }}>
                  {formatMoney(netWorth)}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: 'var(--color-gold)' }}>
                <Activity size={24} strokeWidth={1.5} />
              </div>
              <div className="stat-info">
                <span className="stat-label-text">Health Score</span>
                <span className="stat-value-text" style={{ color: 'var(--color-gold)' }}>
                  {healthScore}/100
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: 'var(--color-violet)' }}>
                <Award size={24} strokeWidth={1.5} />
              </div>
              <div className="stat-info">
                <span className="stat-label-text">Mastery Level</span>
                <span className="stat-value-text">Junior</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: 'var(--color-cyan)' }}>
                <Zap size={24} strokeWidth={1.5} />
              </div>
              <div className="stat-info">
                <span className="stat-label-text">Decisions</span>
                <span className="stat-value-text">{decisionHistory.length}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-charts">
            <div className="chart-card">
              <div className="chart-header">
                <h3><ChartIcon size={18} /> Wealth Path Projection</h3>
                <p>10-year parallel projection based on current trajectory</p>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-violet)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-violet)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="year" 
                      stroke="var(--color-text-tertiary)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'var(--color-deep)', 
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="netWorth" 
                      stroke="var(--color-violet)" 
                      fillOpacity={1} 
                      fill="url(#colorNetWorth)" 
                      strokeWidth={3}
                      dot={<CustomDot />}
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-cyan)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-footer">
                <span className="event-legend"><span className="dot" /> Probabilistic Life Event</span>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3><Shield size={18} /> Financial Mastery</h3>
                <p>Knowledge distribution across 5 core domains</p>
              </div>
              <div className="chart-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={masteryData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      stroke="var(--color-text-secondary)" 
                      fontSize={10}
                    />
                    <Radar
                      name="Mastery"
                      dataKey="A"
                      stroke="var(--color-cyan)"
                      fill="var(--color-cyan)"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-footer">
                <span className="conflict-tag">Council Conflict Density: 24% (Low)</span>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="scenarios-section">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
              Choose Your <span className="gradient-text">Scenario</span>
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
              Each scenario is a unique financial crossroad. Your choices shape your twin's future.
            </p>
          </div>

          <div className="scenarios-grid">
            {SCENARIOS.map((scenario, i) => {
              const isCompleted = completedScenarios.includes(scenario.id)
              return (
                <motion.div
                  key={scenario.id}
                  className={`scenario-card card card-glow ${isCompleted ? 'completed' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  onClick={() => navigate(`/simulation/${scenario.id}`)}
                >
                  <div className="scenario-header">
                    <div className="scenario-icon" style={{ background: `${scenario.color}20`, borderColor: `${scenario.color}40` }}>
                      {scenario.icon}
                    </div>
                    <div className="scenario-meta">
                      <span className="badge" style={{
                        background: `${DIFFICULTY_COLORS[scenario.difficulty]}15`,
                        color: DIFFICULTY_COLORS[scenario.difficulty],
                        border: `1px solid ${DIFFICULTY_COLORS[scenario.difficulty]}30`,
                      }}>
                        {scenario.difficulty}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                        ~{scenario.estimatedMinutes} min
                      </span>
                    </div>
                  </div>

                  <h3 className="scenario-title">{scenario.title}</h3>
                  <p className="scenario-subtitle">{scenario.subtitle}</p>
                  <p className="scenario-desc">{scenario.description}</p>

                  <div className="scenario-action">
                    {isCompleted ? (
                      <div className="scenario-completed">
                        <div className="completed-tag">
                          <CheckCircle size={14} strokeWidth={2} />
                          <span>Simulation Mastered</span>
                        </div>
                        <span className="replay-link">
                          Explore Alternative Timelines <ArrowRight size={14} />
                        </span>
                      </div>
                    ) : (
                      <div className="scenario-start">
                        Start Scenario <ArrowRight size={16} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {decisionHistory.length > 0 && (
          <section className="history-section">
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
              Decision <span className="gradient-text">History</span>
            </h2>
            <div className="history-list">
              {decisionHistory.map((decision, i) => (
                <div key={i} className="history-item card">
                  <div className="history-choice">{decision.chosenOption}</div>
                  <div className="history-result">{decision.shortTermResult}</div>
                  <div className="history-score" style={{
                    color: decision.scoreImpact >= 0 ? 'var(--color-emerald)' : 'var(--color-rose)',
                  }}>
                    {decision.scoreImpact >= 0 ? '+' : ''}{decision.scoreImpact} pts
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  )
}
