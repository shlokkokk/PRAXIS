import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import ParticleField from '../components/ParticleField'
import { Dna, Scale, Sparkles, Clock, GitBranch, Brain, Zap, Target, Eye } from 'lucide-react'
import './Landing.css'

const stats = [
  { value: '$250B+', label: 'Lost yearly to financial illiteracy' },
  { value: '81%', label: 'Want financial guidance in their apps' },
  { value: '19%', label: 'Actually receive any education' },
]

const features = [
  {
    icon: <Dna size={24} strokeWidth={1.5} />,
    title: 'Financial Twin',
    description: 'Create an AI-powered parallel version of your financial self. See your future before you live it.',
    color: 'var(--color-violet)',
  },
  {
    icon: <Scale size={24} strokeWidth={1.5} />,
    title: 'AI Council',
    description: 'Three specialized AI agents debate your decisions in real-time. Watch them argue, learn from the conflict.',
    color: 'var(--color-cyan)',
  },
  {
    icon: <Sparkles size={24} strokeWidth={1.5} />,
    title: 'Financial Galaxy',
    description: 'Your portfolio as a living constellation. Debt as gravity wells. Risk as orbital instability. All in 3D.',
    color: 'var(--color-indigo)',
  },
  {
    icon: <Clock size={24} strokeWidth={1.5} />,
    title: 'Time Acceleration',
    description: 'Fast-forward through decades of consequences in minutes. See what compound interest really does.',
    color: 'var(--color-gold)',
  },
  {
    icon: <GitBranch size={24} strokeWidth={1.5} />,
    title: 'Parallel Timelines',
    description: 'See the future before you choose. Four paths diverge — which reality do you want to live in?',
    color: 'var(--color-emerald)',
  },
  {
    icon: <Brain size={24} strokeWidth={1.5} />,
    title: 'Regret Architecture',
    description: 'Learn through emotionally sticky experiences. Your choices have consequences — and comparison.',
    color: 'var(--color-rose)',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const { userProfile } = useStore()

  const handleStart = useCallback(() => {
    if (userProfile) {
      navigate('/dashboard')
    } else {
      navigate('/onboarding')
    }
  }, [userProfile, navigate])

  return (
    <motion.div
      className="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ParticleField />

      <nav className="landing-nav">
        <div className="nav-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="4" fill="url(#logoGrad)" />
              <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="url(#logoGrad)" strokeWidth="1" opacity="0.6" transform="rotate(-20 16 16)" />
              <ellipse cx="16" cy="16" rx="15" ry="6" fill="none" stroke="url(#logoGrad)" strokeWidth="0.7" opacity="0.4" transform="rotate(30 16 16)" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">PRAXIS</span>
        </div>
        <div className="nav-links">
          {userProfile && (
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleStart}>
            {userProfile ? 'Continue' : 'Get Started'}
          </button>
        </div>
      </nav>

      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge">
            <span className="badge badge-indigo">AI-Native Financial Simulator</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">Learn Finance</span>
            <span className="hero-title-line gradient-text">By Living It</span>
          </h1>

          <p className="hero-subtitle">
            Create your Financial Twin. Navigate realistic scenarios with real data.
            Watch AI agents debate your decisions. Experience decades of consequences in minutes.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={handleStart}>
              <span>Begin Your Financial Life</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              See How It Works
            </button>
          </div>

          <div className="hero-stats">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
              >
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="hero-glow" />
      </section>

      <section className="features" id="features">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge badge-cyan">Core Experience</span>
          <h2 className="section-title">Not a Course. Not a Game.<br /><span className="gradient-text">A Simulation.</span></h2>
          <p className="section-subtitle">
            Praxis doesn't teach you about money — it makes you live with it.
            Every decision has consequences. Every consequence teaches a lesson.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="feature-card card card-glow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="feature-icon" style={{ '--feature-color': feature.color } as React.CSSProperties}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge badge-gold">The Experience</span>
          <h2 className="section-title">From Profile to <span className="gradient-text">Mastery</span></h2>
        </motion.div>

        <div className="steps">
          {[
            { num: '01', title: 'Create Your Twin', desc: 'Answer a few questions. We build a realistic financial version of you — income, expenses, goals, personality.', icon: <Dna size={20} strokeWidth={1.5} /> },
            { num: '02', title: 'Face Scenarios', desc: 'Real financial crossroads. First paycheck decisions. Market crashes. Unexpected windfalls. Each one unique.', icon: <Zap size={20} strokeWidth={1.5} /> },
            { num: '03', title: 'Watch the Council', desc: 'Three AI agents — The Conservator, The Grower, The Behaviorist — debate your options in real-time.', icon: <Scale size={20} strokeWidth={1.5} /> },
            { num: '04', title: 'Make Your Call', desc: 'You decide. Then time accelerates. Months, years flash by. You see the compound consequences of your choice.', icon: <Target size={20} strokeWidth={1.5} /> },
            { num: '05', title: 'Learn from Regret', desc: 'Compare your path to the road not taken. See what the council recommended. Learn through experience, not lectures.', icon: <Eye size={20} strokeWidth={1.5} /> },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="step-item"
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="step-number">{step.num}</div>
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="cta-title">
            Ready to Meet Your<br /><span className="gradient-text">Financial Future?</span>
          </h2>
          <p className="cta-subtitle">
            3 minutes to your first simulation. No credit card. No commitment.
            Just decisions and their consequences.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleStart}>
            Create Your Financial Twin
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">PRAXIS</span>
            <p>Learn finance by living it.</p>
          </div>
          <div className="footer-quote">
            <blockquote>
              "Tell me and I forget. Teach me and I remember. Involve me and I learn."
              <cite>— Benjamin Franklin</cite>
            </blockquote>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}
