import { useMemo, useState, useEffect } from 'react'
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
  X,
  ShieldCheck,
  Hammer,
  Compass,
  Telescope,
  Volume2,
  VolumeX,
  Dna,
  Eye,
  GraduationCap,
  BookOpen
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
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
import { API_URL } from '../config'
import { useMarketData } from '../hooks/useMarketData'
import { audio } from '../utils/audio'
import GlossaryModal from '../components/glossary/GlossaryModal'
import './Dashboard.css'

const SCENARIOS = [
  {
    id: 'summer_hustle',
    title: 'The Summer Hustle',
    subtitle: 'From your first summer job to your freshman dorm.',
    description: 'Navigate the crucial years between 16 and 19. Car payments, prom costs, student loans, and credit card traps. Build the foundation.',
    icon: <GraduationCap size={20} strokeWidth={1.5} />,
    difficulty: 'beginner' as const,
    estimatedMinutes: 15,
    color: '#06b6d4',
  },
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

const MASTERY_LEVELS = [
  { min: 0,  label: 'Novice',    color: 'var(--color-text-tertiary)' },
  { min: 15, label: 'Learner',   color: 'var(--color-emerald)' },
  { min: 30, label: 'Junior',    color: 'var(--color-cyan)' },
  { min: 45, label: 'Adept',     color: 'var(--color-violet)' },
  { min: 60, label: 'Expert',    color: 'var(--color-gold)' },
  { min: 80, label: 'Master',    color: '#f43f5e' },
]

const ARCHETYPE_INFO: Record<string, { icon: React.ReactNode; label: string; description: string }> = {
  guardian:   { 
    icon: <ShieldCheck size={32} strokeWidth={1.2} />, 
    label: 'The Guardian',
    description: 'Prioritizes safety and fortress-like stability. Capital preservation is your primary directive.'
  },
  builder:    { 
    icon: <Hammer size={32} strokeWidth={1.2} />,      
    label: 'The Builder',
    description: 'Methodical and balanced. You construct wealth through consistent, disciplined accumulation.'
  },
  explorer:   { 
    icon: <Compass size={32} strokeWidth={1.2} />,     
    label: 'The Explorer',
    description: 'Bold opportunity seeker. You navigate high-volatility markets with calculated aggression.'
  },
  strategist: { 
    icon: <Zap size={32} strokeWidth={1.2} />,         
    label: 'The Strategist',
    description: 'Analytical long-game player. You optimize for efficiency, tax-minimization, and compound math.'
  },
  visionary:  { 
    icon: <Telescope size={32} strokeWidth={1.2} />,   
    label: 'The Visionary',
    description: 'Future-architect. You see capital as fuel for building a specific, ambitious reality.'
  },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { userProfile, financialTwin, mastery, updateMastery, completedScenarios, decisionHistory, purgeStore, soundEnabled, setSoundEnabled, showGalaxy, setShowGalaxy } = useStore()
  const [showResetModal, setShowResetModal] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)
  const [apiStatus, setApiStatus] = useState<'offline' | 'connected' | 'council'>('offline')
  const [showColdStartBanner, setShowColdStartBanner] = useState(false)
  const [tickerCooldown, setTickerCooldown] = useState(false)
  const { data: marketData, loading: marketLoading, refresh: refreshMarket, isRefreshing: marketRefreshing } = useMarketData()

  useEffect(() => {
    audio.init()
    audio.setEnabled(soundEnabled)
  }, [soundEnabled])

  useEffect(() => {
    // Show cold-start banner only if still offline after 4s (avoids flash on fast connections)
    const bannerTimer = setTimeout(() => {
      setApiStatus(prev => {
        if (prev === 'offline') setShowColdStartBanner(true)
        return prev
      })
    }, 4000)

    const checkServer = async () => {
      try {
        const res = await fetch(`${API_URL}/health`)
        if (!res.ok) { setApiStatus('offline'); return }
        const data = await res.json()
        const newStatus = data.ai_enabled ? 'council' : 'connected'
        setApiStatus(newStatus)
        setShowColdStartBanner(false) // auto-dismiss on connection
      } catch {
        setApiStatus('offline')
      }
    }
    checkServer()
    const interval = setInterval(checkServer, 8000)
    return () => { clearInterval(interval); clearTimeout(bannerTimer) }
  }, [])

  // Self-healing: Recalibrate Mastery if state is corrupted (e.g. score > 100)
  useEffect(() => {
    if (mastery.overallScore > 100 || (mastery.overallScore > 0 && Object.values(mastery.categories).every(v => v === 0))) {
      const cats = Object.values(mastery.categories)
      const actualAverage = Math.round(cats.reduce((a, b) => a + b, 0) / 6)
      updateMastery({ overallScore: Math.min(100, actualAverage) })
    }
  }, [mastery, updateMastery])

  // Scroll lock when modal is open
  useEffect(() => {
    if (showResetModal || showGlossary) {
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

  const masteryLevel = MASTERY_LEVELS.slice().reverse().find(l => mastery.overallScore >= l.min) || MASTERY_LEVELS[0]
  const archetypeInfo = userProfile.moneyPersonality?.archetype 
    ? ARCHETYPE_INFO[userProfile.moneyPersonality.archetype] 
    : null

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
      { subject: 'Budgeting',  A: categories.budgeting          || 0, fullMark: 100 },
      { subject: 'Investing',  A: categories.investing          || 0, fullMark: 100 },
      { subject: 'Debt',       A: categories.debtManagement     || 0, fullMark: 100 },
      { subject: 'Behavior',   A: categories.behavioralAwareness|| 0, fullMark: 100 },
      { subject: 'Tax',        A: categories.taxOptimization    || 0, fullMark: 100 },
      { subject: 'Risk',       A: categories.riskManagement     || 0, fullMark: 100 },
    ]
  }, [mastery])

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    if (payload.event) {
      return (
        <g key={payload.year}>
          <circle cx={cx} cy={cy} r={8} fill="var(--color-cyan)" fillOpacity={0.15} />
          <circle cx={cx} cy={cy} r={4} fill="var(--color-cyan)" stroke="#fff" strokeWidth={2} />
        </g>
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
        {/* Left Segment: Identity & Streak */}
        <div className="nav-segment identity">
          <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} onMouseEnter={() => audio.playHover()}>
            <div className="logo-icon">
              <img src="/praxis-icon.svg" alt="Praxis Logo" />
            </div>
            <span className="logo-text">PRAXIS</span>
          </div>
          <div className="divider" />
          <div className="user-readout">
            <div className="user-text">
              <span className="welcome-text">WELCOME BACK,</span>
              <span className="user-name">{userProfile.name}</span>
            </div>
            <div className="streak-indicator">
              <span className="streak-fire">🔥</span>
              <span className="streak-value">{mastery.streakDays || 0}</span>
              <span className="streak-label">STREAK</span>
            </div>
          </div>
        </div>

        {/* Center Segment: Intelligence Status */}
        <div className="nav-segment intelligence">
          <div className={`status-node ${apiStatus}`}>
            <div className="pulse-container">
              <div className="pulse-core" />
              <div className="pulse-ring" />
            </div>
            <span className="status-text">
              {apiStatus === 'council' && 'QUANTUM_COUNCIL_ONLINE'}
              {apiStatus === 'connected' && 'API_CONNECTED · NO_AI'}
              {apiStatus === 'offline' && 'HEURISTIC_MOCK_ACTIVE'}
            </span>
          </div>
        </div>

        {/* Right Segment: Global Controls */}
        <div className="nav-segment controls">
          <button 
            className="btn-nav"
            onClick={() => {
              setSoundEnabled(!soundEnabled)
              if (!soundEnabled) audio.playClick()
            }}
            onMouseEnter={() => audio.playHover()}
            title="Aural Environment"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button 
            className="btn-nav"
            onClick={() => setShowGlossary(true)}
            onMouseEnter={() => audio.playHover()}
            title="Quantum Lexicon"
          >
            <BookOpen size={16} />
          </button>
          <button 
            className="btn-nav danger"
            onClick={() => setShowResetModal(true)}
            onMouseEnter={() => audio.playHover()}
            title="Reset Timeline"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </nav>

      {showColdStartBanner && (
        <motion.div
          className="cold-start-banner"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
        >
          <div className="cold-start-inner">
            <span className="cold-start-dot" />
            <span className="cold-start-text">
              Backend is starting up — this can take up to 30s. Hang tight.
            </span>
            <button className="cold-start-close" onClick={() => setShowColdStartBanner(false)}>✕</button>
          </div>
        </motion.div>
      )}

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
              <button className="btn-secondary" onClick={() => setShowResetModal(false)} onMouseEnter={() => audio.playHover()}>
                Cancel
              </button>
              <button 
                className="btn-danger" 
                onClick={() => {
                  purgeStore()
                  navigate('/landing')
                }}
                onMouseEnter={() => audio.playHover()}
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
              {archetypeInfo && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: 'var(--color-violet)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {archetypeInfo.icon}
                  {archetypeInfo.label.toUpperCase()}
                </div>
              )}
            </div>

            {/* Live Market Ticker */}
            <motion.div 
              className="market-ticker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'flex',
                gap: 'var(--space-6)',
                justifyContent: 'center',
                padding: 'var(--space-3) var(--space-6)',
                background: 'rgba(5, 5, 16, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--space-8)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                flexWrap: 'wrap'
              }}
            >
              {marketLoading ? (
                <span style={{ color: 'var(--color-text-tertiary)' }}>SYNCING WITH MARKETS...</span>
              ) : (
                <>
                  {marketData.sp500 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>S&P 500</span>
                      <span>${marketData.sp500.price.toFixed(2)}</span>
                      <span style={{ color: marketData.sp500.change >= 0 ? 'var(--color-emerald)' : 'var(--color-rose)' }}>
                        {marketData.sp500.change >= 0 ? '▲' : '▼'} {Math.abs(marketData.sp500.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {marketData.btc && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>BTC</span>
                      <span>${marketData.btc.price.toFixed(2)}</span>
                      <span style={{ color: marketData.btc.change >= 0 ? 'var(--color-emerald)' : 'var(--color-rose)' }}>
                        {marketData.btc.change >= 0 ? '▲' : '▼'} {Math.abs(marketData.btc.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {marketData.fedRate !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>FED RATE</span>
                      <span style={{ color: 'var(--color-gold)' }}>{marketData.fedRate.toFixed(2)}%</span>
                    </div>
                  )}
                  {marketData.inflation !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>INFLATION</span>
                      <span style={{ color: 'var(--color-rose)' }}>{marketData.inflation.toFixed(1)}%</span>
                    </div>
                  )}
                  
                  <div className="ticker-actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    {marketData.isLive && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-emerald)', fontSize: '10px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)', boxShadow: '0 0 8px var(--color-emerald)' }} />
                        LIVE
                      </div>
                    )}
                    
                    <button 
                      className={`btn-ticker-refresh ${tickerCooldown ? 'cooldown' : ''}`}
                      onClick={() => {
                        const success = refreshMarket()
                        if (!success) {
                          setTickerCooldown(true)
                          setTimeout(() => setTickerCooldown(false), 2000)
                        } else {
                          audio.playClick()
                        }
                      }}
                      onMouseEnter={() => audio.playHover()}
                      disabled={marketRefreshing}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: tickerCooldown ? 'var(--color-rose)' : 'var(--color-text-tertiary)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '10px',
                        transition: 'all 0.2s ease',
                        opacity: marketRefreshing ? 0.5 : 1
                      }}
                    >
                      <RefreshCw size={12} className={marketRefreshing ? 'spin' : ''} style={{ animation: marketRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                      {tickerCooldown ? 'COOLING DOWN...' : 'SYNC'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
            
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                  Financial Identity Matrix
                </span>
                <div className="view-toggle-pill">
                  <button 
                    className={showGalaxy ? 'active' : ''} 
                    onClick={() => {
                      setShowGalaxy(true)
                      audio.playClick()
                    }}
                    onMouseEnter={() => audio.playHover()}
                  >
                    <Eye size={12} /> VISUAL GALAXY
                  </button>
                  <button 
                    className={!showGalaxy ? 'active' : ''} 
                    onClick={() => {
                      setShowGalaxy(false)
                      audio.playClick()
                    }}
                    onMouseEnter={() => audio.playHover()}
                  >
                    <Dna size={12} /> TWIN DNA
                  </button>
                </div>
              </div>

              <div className="identity-viewport card">
                {showGalaxy ? (
                  <div className="galaxy-container">
                    <GalaxyView />
                  </div>
                ) : (
                  <motion.div 
                    className="dna-readout"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="dna-grid">
                      <div className="dna-section main">
                        <div className="archetype-hero">
                          <div className="archetype-icon-large">
                            {archetypeInfo?.icon}
                          </div>
                          <div className="archetype-details">
                            <h3>{archetypeInfo?.label}</h3>
                            <p>{(archetypeInfo as any)?.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="dna-section portfolio">
                        <h4>Allocation Strategy</h4>
                        <div className="allocation-bars">
                          {Object.entries(financialTwin.portfolioAllocation).map(([key, val]) => (
                            <div key={key} className="allocation-row">
                              <div className="alloc-label">
                                <span>{key}</span>
                                <span>{Math.round((val as number) * 100)}%</span>
                              </div>
                              <div className="alloc-bar-bg">
                                <motion.div 
                                  className={`alloc-bar-fill ${key}`} 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(val as number) * 100}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="dna-section behavioral">
                        <h4>Psychological Anchors</h4>
                        <div className="trait-chips">
                          <div className="trait-chip">
                            <span className="label">Risk Tolerance</span>
                            <span className="value">{userProfile.moneyPersonality.riskTolerance}/5</span>
                          </div>
                          <div className="trait-chip">
                            <span className="label">Gratification</span>
                            <span className="value">{userProfile.moneyPersonality.delayedGratification}/5</span>
                          </div>
                          <div className="trait-chip">
                            <span className="label">Research Patience</span>
                            <span className="value">{userProfile.moneyPersonality.researchPatience}/5</span>
                          </div>
                          <div className="trait-chip">
                            <span className="label">Automation</span>
                            <span className="value">{userProfile.moneyPersonality.automationComfort}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
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
                <span className="stat-value-text" style={{ color: masteryLevel.color }}>{masteryLevel.label}</span>
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
                  <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-violet)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--color-violet)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="year" 
                      stroke="var(--color-text-tertiary)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      dy={5}
                      interval={0}
                    />
                    <Tooltip 
                      cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                      contentStyle={{ 
                        background: 'rgba(5, 5, 16, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                      itemStyle={{ color: '#fff', fontWeight: 600 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="netWorth" 
                      stroke="var(--color-violet)" 
                      fillOpacity={1} 
                      fill="url(#colorNetWorth)" 
                      strokeWidth={3}
                      animationDuration={1500}
                      dot={<CustomDot />}
                      activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: 'var(--color-cyan)' }}
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
                <p>Knowledge distribution across 6 core domains</p>
              </div>
              <div className="chart-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={masteryData}>
                    <defs>
                      <linearGradient id="masteryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-cyan)" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="var(--color-cyan)" stopOpacity={0.1}/>
                      </linearGradient>
                      <filter id="radarGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0" />
                        <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <PolarGrid gridType="circle" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      stroke="var(--color-text-tertiary)" 
                      fontSize={10}
                      tick={{ fill: 'var(--color-text-tertiary)', fontWeight: 700, letterSpacing: '0.05em' }}
                    />
                    
                    {/* Ghost Boundary */}
                    <Radar
                      dataKey="fullMark"
                      stroke="rgba(139, 92, 246, 0.15)"
                      strokeWidth={1}
                      fill="rgba(139, 92, 246, 0.03)"
                      fillOpacity={1}
                      isAnimationActive={false}
                    />

                    {/* Main Data Radar */}
                    <Radar
                      name="Mastery"
                      dataKey="A"
                      stroke="var(--color-cyan)"
                      strokeWidth={3}
                      fill="url(#masteryGradient)"
                      fillOpacity={1}
                      animationDuration={2500}
                      animationEasing="ease-out"
                      dot={{ r: 4, fill: 'var(--color-cyan)', stroke: '#fff', strokeWidth: 2, filter: 'url(#radarGlow)' }}
                    />

                  </RadarChart>
                </ResponsiveContainer>

                {/* Tactical Sonar Overlay (Guaranteed Centering) */}
                <div className="sonar-overlay">
                  <motion.div
                    className="sonar-beam"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
              <div className="chart-footer">
                <span className="conflict-tag">Overall Mastery Score: {mastery.overallScore}/100</span>
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
                  onMouseEnter={() => audio.playHover()}
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
      <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
    </motion.div>
  )
}
