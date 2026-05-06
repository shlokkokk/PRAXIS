import { motion } from 'framer-motion'
import type { ScenarioNode } from '../../data/scenarios'
import { audio } from '../../utils/audio'

interface Props {
  node: ScenarioNode
  onRequestCouncil: () => void
  onChoose: (optionId: string) => void
  councilActive: boolean
  selectedOption: string | null
}

const RISK_COLORS = { low: 'var(--color-emerald)', medium: 'var(--color-gold)', high: 'var(--color-rose)' }

export default function DecisionPanel({ node, onRequestCouncil, onChoose, councilActive, selectedOption }: Props) {
  return (
    <div className="decision-panel">
      <div className="decision-options">
        {node.options.map((option, i) => (
          <motion.button
            key={option.id}
            className={`decision-option card ${selectedOption === option.id ? 'selected' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onChoose(option.id)}
            onMouseEnter={() => audio.playHover()}
            disabled={!!selectedOption}
          >
            <div className="option-header">
              <span className="option-icon">{option.icon}</span>
              <span className="option-risk" style={{ color: RISK_COLORS[option.riskLevel] }}>
                {option.riskLevel} risk
              </span>
            </div>
            <h3 className="option-label">{option.label}</h3>
            <p className="option-desc">{option.description}</p>
            <div className="option-tags">
              {option.tags.map((tag) => (
                <span key={tag} className="option-tag">{tag}</span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {!councilActive && !selectedOption && (
        <motion.div
          className="council-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="btn btn-secondary" onClick={() => {
            onRequestCouncil()
            audio.playClick()
          }} onMouseEnter={() => audio.playHover()}>
            ⚖️ Consult the AI Council Before Choosing
          </button>
          <p className="council-hint">
            Three AI agents will debate this decision — The Conservator, The Grower, and The Behaviorist
          </p>
        </motion.div>
      )}
    </div>
  )
}
