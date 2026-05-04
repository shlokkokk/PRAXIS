import { motion } from 'framer-motion'
import type { ScenarioData } from '../../data/scenarios'
import './SimComponents.css'

interface Props {
  scenario: ScenarioData
  onStart: () => void
}

export default function ScenarioIntro({ scenario, onStart }: Props) {
  return (
    <div className="scenario-intro">
      <motion.div
        className="intro-icon"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: `${scenario.color}20`, borderColor: `${scenario.color}40` }}
      >
        {scenario.icon}
      </motion.div>

      <motion.h1
        className="intro-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {scenario.title}
      </motion.h1>

      <motion.p
        className="intro-subtitle gradient-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {scenario.subtitle}
      </motion.p>

      <motion.div
        className="intro-backstory"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p>{scenario.backstory}</p>
      </motion.div>

      <motion.div
        className="intro-meta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span>{scenario.nodes.length} decisions</span>
        <span>•</span>
        <span>{scenario.totalYears} year simulation</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <button className="btn btn-primary btn-lg" onClick={onStart}>
          Begin Scenario
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 9h10M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </motion.div>
    </div>
  )
}
