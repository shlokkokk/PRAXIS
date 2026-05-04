import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { ScenarioNode } from '../../data/scenarios'
import type { CouncilDeliberation } from '../../types'
import { audio } from '../../utils/audio'

interface Props {
  node: ScenarioNode
  selectedOptionId: string
  councilDeliberation: CouncilDeliberation | null
  onContinue: () => void
}

export default function OutcomeReveal({ node, selectedOptionId, councilDeliberation, onContinue }: Props) {
  const selectedOption = useMemo(
    () => node.options.find((o) => o.id === selectedOptionId),
    [node, selectedOptionId]
  )

  if (!selectedOption) return null

  const otherOptions = node.options.filter((o) => o.id !== selectedOptionId)
  const councilPick = councilDeliberation?.synthesis?.finalRecommendation

  return (
    <div className="outcome-reveal">
      <motion.div
        className="outcome-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="outcome-icon">{selectedOption.icon}</span>
        <h2>You Chose: <span className="gradient-text">{selectedOption.label}</span></h2>
      </motion.div>

      <motion.div
        className="outcome-result card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3>What Happened</h3>
        <p>{selectedOption.shortTermResult}</p>
        <div className="outcome-score" style={{
          color: selectedOption.scoreImpact >= 0 ? 'var(--color-emerald)' : 'var(--color-rose)',
        }}>
          {selectedOption.scoreImpact >= 0 ? '+' : ''}{selectedOption.scoreImpact} Financial Mastery Points
        </div>
      </motion.div>

      <motion.div
        className="outcome-lessons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3>💡 Lessons Learned</h3>
        <ul>
          {selectedOption.lessons.map((lesson, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {lesson}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {otherOptions.length > 0 && (
        <motion.div
          className="outcome-alternatives"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3>🔮 Roads Not Taken</h3>
          <div className="alt-grid">
            {otherOptions.map((alt) => (
              <div key={alt.id} className="alt-card card">
                <span className="alt-icon">{alt.icon}</span>
                <h4>{alt.label}</h4>
                <p className="alt-result">{alt.shortTermResult}</p>
                <span className="alt-score" style={{
                  color: alt.scoreImpact >= 0 ? 'var(--color-emerald)' : 'var(--color-rose)',
                }}>
                  {alt.scoreImpact >= 0 ? '+' : ''}{alt.scoreImpact} pts
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {councilPick && (
        <motion.div
          className="outcome-council card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ margin: 0 }}>⚖️ The Council's Recommendation</h3>
            {councilDeliberation?.synthesis?.confidenceScore && (
              <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-violet)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                {Math.round(councilDeliberation.synthesis.confidenceScore * 100)}% Confidence
              </span>
            )}
          </div>
          <p>{councilPick}</p>

          {councilDeliberation?.synthesis?.tradeOffs && councilDeliberation.synthesis.tradeOffs.length > 0 && (
            <div className="council-tradeoffs" style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Trade-Offs Considered:</h4>
              <ul style={{ paddingLeft: 'var(--space-4)', fontSize: 'var(--text-sm)', margin: 0 }}>
                {councilDeliberation.synthesis.tradeOffs.map((tradeoff, i) => (
                  <li key={i} style={{ color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>{tradeoff}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        className="outcome-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <button className="btn btn-primary btn-lg" onClick={onContinue} onMouseEnter={() => audio.playHover()}>
          Continue to Next Decision →
        </button>
      </motion.div>
    </div>
  )
}
