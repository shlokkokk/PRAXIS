import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CouncilDeliberation } from '../../types'
import './CouncilPanel.css'

interface Props {
  deliberation: CouncilDeliberation | null
  isLoading: boolean
  onReady: () => void
}

const AGENT_STYLES: Record<string, { color: string; icon: string; gradient: string }> = {
  conservator: { color: '#06b6d4', icon: '🛡️', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  grower: { color: '#10b981', icon: '📈', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  behaviorist: { color: '#8b5cf6', icon: '🧠', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
}

type Tab = 'opinions' | 'rebuttals' | 'synthesis'

export default function CouncilPanel({ deliberation, isLoading, onReady }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('opinions')
  const [revealIndex, setRevealIndex] = useState(0)

  useEffect(() => {
    if (deliberation && !isLoading) {
      setRevealIndex(0)
      const timer = setInterval(() => {
        setRevealIndex((prev) => {
          if (prev >= 2) {
            clearInterval(timer)
            onReady()
            return prev
          }
          return prev + 1
        })
      }, 800)
      return () => clearInterval(timer)
    }
  }, [deliberation, isLoading])

  if (isLoading) {
    return (
      <div className="council-panel">
        <div className="council-header">
          <h3>⚖️ AI Council Deliberation</h3>
          <div className="council-phase">Analyzing decision...</div>
        </div>
        <div className="council-loading">
          <div className="council-loading-agents">
            {['conservator', 'grower', 'behaviorist'].map((id, i) => (
              <motion.div
                key={id}
                className="loading-agent"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              >
                <span className="loading-agent-icon">{AGENT_STYLES[id].icon}</span>
                <span className="loading-agent-name">
                  {id === 'conservator' ? 'The Conservator' : id === 'grower' ? 'The Grower' : 'The Behaviorist'}
                </span>
                <div className="loading-dots">
                  <span /><span /><span />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!deliberation) return null

  return (
    <div className="council-panel">
      <div className="council-header">
        <h3>⚖️ AI Council Deliberation</h3>
        <div className="council-tabs">
          {(['opinions', 'rebuttals', 'synthesis'] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={`council-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'opinions' ? '💬 Opinions' : tab === 'rebuttals' ? '⚔️ Rebuttals' : '🤝 Synthesis'}
            </button>
          ))}
        </div>
      </div>

      <div className="council-body">
        <AnimatePresence mode="wait">
          {activeTab === 'opinions' && (
            <motion.div key="opinions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="council-opinions">
              {deliberation.agents.map((agent, i) => {
                const style = AGENT_STYLES[agent.agentId] || AGENT_STYLES.conservator
                if (i > revealIndex) return null
                return (
                  <motion.div
                    key={agent.agentId}
                    className="agent-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    style={{ borderColor: `${style.color}30` }}
                  >
                    <div className="agent-header">
                      <span className="agent-icon">{style.icon}</span>
                      <div>
                        <h4 className="agent-name" style={{ color: style.color }}>{agent.agentName}</h4>
                        <span className="agent-confidence">
                          {Math.round(agent.confidence * 100)}% confident
                        </span>
                      </div>
                    </div>
                    <p className="agent-recommendation">{agent.recommendation}</p>
                    <p className="agent-reasoning">{agent.reasoning}</p>
                    <ul className="agent-points">
                      {agent.keyPoints.map((pt, j) => (
                        <li key={j}>{pt}</li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'rebuttals' && (
            <motion.div key="rebuttals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="council-rebuttals">
              {deliberation.rebuttals.map((r, i) => {
                const style = AGENT_STYLES[r.agentId] || AGENT_STYLES.conservator
                const targetStyle = AGENT_STYLES[r.targetAgentId] || AGENT_STYLES.conservator
                return (
                  <div key={i} className="rebuttal-card card">
                    <div className="rebuttal-header">
                      <span style={{ color: style.color }}>{style.icon}</span>
                      <span className="rebuttal-arrow">→</span>
                      <span style={{ color: targetStyle.color }}>{targetStyle.icon}</span>
                    </div>
                    <p className="rebuttal-text">{r.rebuttal}</p>
                    {r.concessions.length > 0 && (
                      <div className="rebuttal-concession">
                        <strong>Concedes:</strong> {r.concessions[0]}
                      </div>
                    )}
                  </div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'synthesis' && (
            <motion.div key="synthesis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="council-synthesis">
              <div className="synthesis-summary card">
                <h4>🎯 Council Consensus</h4>
                <p>{deliberation.synthesis.summary}</p>
                <div className="synthesis-confidence">
                  Confidence: {Math.round(deliberation.synthesis.confidenceScore * 100)}%
                </div>
              </div>

              <div className="synthesis-section">
                <h4>✅ Areas of Agreement</h4>
                <ul>{deliberation.synthesis.agreements.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>

              <div className="synthesis-section">
                <h4>⚡ Points of Conflict</h4>
                <ul>{deliberation.synthesis.disagreements.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>

              {deliberation.biasWarnings.length > 0 && (
                <div className="bias-warnings">
                  <h4>⚠️ Bias Warnings</h4>
                  {deliberation.biasWarnings.map((w, i) => (
                    <div key={i} className="bias-warning">{w}</div>
                  ))}
                </div>
              )}

              <div className="synthesis-recommendation">
                <h4>💡 Final Recommendation</h4>
                <p>{deliberation.synthesis.finalRecommendation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
