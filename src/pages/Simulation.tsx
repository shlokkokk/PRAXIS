import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import CouncilPanel from '../components/council/CouncilPanel'
import DecisionPanel from '../components/simulation/DecisionPanel'
import { API_URL } from '../config'
import TimelineBar from '../components/simulation/TimelineBar'
import ScenarioIntro from '../components/simulation/ScenarioIntro'
import OutcomeReveal from '../components/simulation/OutcomeReveal'
import { getScenario, type ScenarioData } from '../data/scenarios'
import { audio } from '../utils/audio'
import './Simulation.css'

type SimPhase = 'intro' | 'decision' | 'council' | 'choosing' | 'outcome' | 'complete'

export default function Simulation() {
  const { scenarioId } = useParams<{ scenarioId: string }>()
  const navigate = useNavigate()
  const {
    userProfile,
    financialTwin,
    updateSimulation,
    councilDeliberation,
    setCouncilDeliberation,
    isCouncilLoading,
    setCouncilLoading,
    addDecisionOutcome,
    addCompletedScenario,
  } = useStore()

  const [phase, setPhase] = useState<SimPhase>('intro')
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [scenario, setScenario] = useState<ScenarioData | null>(null)

  useEffect(() => {
    if (!userProfile || !financialTwin) {
      navigate('/onboarding')
      return
    }
    const s = getScenario(scenarioId || 'first_paycheck', userProfile, financialTwin)
    setScenario(s)
    updateSimulation({
      currentYear: 0,
      currentMonth: 0,
      totalYears: s.totalYears,
      isPaused: false,
      isComplete: false,
    })
  }, [scenarioId, userProfile, financialTwin, navigate, updateSimulation])

  const currentNode = useMemo(() => {
    if (!scenario) return null
    return scenario.nodes[currentNodeIndex] || null
  }, [scenario, currentNodeIndex])

  const handleStartScenario = useCallback(() => {
    setPhase('decision')
  }, [])

  const handleRequestCouncil = useCallback(async () => {
    if (!currentNode || !scenario || !userProfile || !financialTwin) return
    setPhase('council')
    setCouncilLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/deliberate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: scenario.id,
          node_id: currentNode.id,
          title: currentNode.title,
          context: currentNode.context,
          options: currentNode.options.map(o => ({
            id: o.id,
            label: o.label,
            description: o.description
          })),
          user_profile: userProfile,
          financial_twin: financialTwin
        })
      })

      if (!response.ok) throw new Error('API failed')
      const data = await response.json()
      setCouncilDeliberation(data)
    } catch (error) {
      console.log('Using mock deliberation fallback:', error)
      // Fallback if backend is not running or fails
      const mockDeliberation = generateMockDeliberation(currentNode)
      setCouncilDeliberation(mockDeliberation)
    } finally {
      setCouncilLoading(false)
    }
  }, [currentNode, scenario, userProfile, financialTwin, setCouncilDeliberation, setCouncilLoading])

  const handleMakeChoice = useCallback((optionId: string) => {
    setSelectedOption(optionId)
    setPhase('outcome')
    audio.playClick()

    if (!currentNode) return
    const option = currentNode.options.find((o) => o.id === optionId)
    if (!option) return

    const outcome = {
      chosenOption: option.label,
      shortTermResult: option.shortTermResult,
      longTermProjection: option.projection,
      alternativeOutcomes: currentNode.options
        .filter((o) => o.id !== optionId)
        .map((o) => ({ optionId: o.id, projection: o.projection })),
      lessonsLearned: option.lessons,
      scoreImpact: option.scoreImpact,
      tags: option.tags, // Pass tags so mastery categories update correctly
    }

    addDecisionOutcome(outcome)
  }, [currentNode, addDecisionOutcome])

  const handleNextNode = useCallback(() => {
    if (!scenario) return
    const nextIndex = currentNodeIndex + 1

    if (nextIndex >= scenario.nodes.length) {
      setPhase('complete')
      addCompletedScenario(scenario.id)
      return
    }

    setCurrentNodeIndex(nextIndex)
    setSelectedOption(null)
    setCouncilDeliberation(null)
    setPhase('decision')
    audio.playClick()

    updateSimulation({
      currentYear: scenario.nodes[nextIndex].year,
      currentMonth: scenario.nodes[nextIndex].month,
    })
  }, [scenario, currentNodeIndex, addCompletedScenario, setCouncilDeliberation, updateSimulation])

  if (!scenario || !userProfile) return null

  return (
    <motion.div
      className="simulation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="sim-nav">
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')} onMouseEnter={() => audio.playHover()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Exit
        </button>

        <div className="sim-nav-center">
          <span className="sim-scenario-title">{scenario.title}</span>
          {phase !== 'intro' && phase !== 'complete' && currentNode && (
            <span className="sim-time">
              Year {currentNode.year + 1}, Month {currentNode.month + 1}
            </span>
          )}
        </div>

        <div className="sim-nav-right">
          <span className="sim-progress">
            {currentNodeIndex + 1} / {scenario.nodes.length} decisions
          </span>
        </div>
      </div>

      <div className="sim-content">
        {phase !== 'intro' && phase !== 'complete' && (
          <TimelineBar
            currentNode={currentNodeIndex}
            totalNodes={scenario.nodes.length}
            nodes={scenario.nodes}
          />
        )}
        
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ScenarioIntro scenario={scenario} onStart={handleStartScenario} />
            </motion.div>
          )}

          {(phase === 'decision' || phase === 'council' || phase === 'choosing') && currentNode && (
            <motion.div
              key={`decision-container-${currentNodeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="sim-step-container"
            >
              <div className="decision-header" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 className="decision-title">{currentNode.title}</h2>
                <p className="decision-context">{currentNode.context}</p>
              </div>

              <div className="sim-decision-layout">
                <div className="sim-main-panel">
                  <DecisionPanel
                    node={currentNode}
                    onRequestCouncil={handleRequestCouncil}
                    onChoose={handleMakeChoice}
                    councilActive={phase === 'council' || phase === 'choosing'}
                    selectedOption={selectedOption}
                  />
                </div>

                {(phase === 'council' || phase === 'choosing') && (
                  <motion.div
                    className="sim-council-panel"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CouncilPanel
                      deliberation={councilDeliberation}
                      isLoading={isCouncilLoading}
                      onReady={() => setPhase('choosing')}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {phase === 'outcome' && currentNode && selectedOption && (
            <motion.div key="outcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OutcomeReveal
                node={currentNode}
                selectedOptionId={selectedOption}
                councilDeliberation={councilDeliberation}
                onContinue={handleNextNode}
              />
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              className="sim-complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="complete-content">
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)' }}>🎉</div>
                <h2>Scenario <span className="gradient-text">Complete</span></h2>
                <p>
                  You navigated {scenario.nodes.length} critical financial decisions.
                  Every choice taught you something — whether you realized it or not.
                </p>
                <div className="step-actions" style={{ marginTop: 'var(--space-8)' }}>
                  <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} onMouseEnter={() => audio.playHover()}>
                    Back to Dashboard
                  </button>
                  <button className="btn btn-primary" onClick={() => {
                    setCurrentNodeIndex(0)
                    setSelectedOption(null)
                    setCouncilDeliberation(null)
                    setPhase('intro')
                    const s = getScenario(scenarioId || 'first_paycheck', userProfile!, financialTwin!)
                    setScenario(s)
                  }} onMouseEnter={() => audio.playHover()}>
                    Play Again (Different Variations)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function generateMockDeliberation(node: import('../data/scenarios').ScenarioNode) {
  const options = node.options

  return {
    agents: [
      {
        agentId: 'conservator' as const,
        agentName: 'The Conservator',
        recommendation: `I recommend "${options[0]?.label || 'the safe option'}". Security first.`,
        reasoning: `In uncertain times, protecting your capital is paramount. ${node.conservatorAdvice || 'Building an emergency fund should always come before aggressive investing. History shows that those who prioritize liquidity survive financial storms.'} The peace of mind alone is worth the potentially lower returns.`,
        keyPoints: [
          'Emergency fund must come first — aim for 6 months of expenses',
          'Avoid high-risk positions when your foundation isn\'t solid',
          'Remember 2008 and 2020 — markets can crash at any time',
        ],
        recommendedOption: options[0]?.id || '',
        confidence: 0.82,
        tone: 'protective',
      },
      {
        agentId: 'grower' as const,
        agentName: 'The Grower',
        recommendation: `I recommend "${options[1]?.label || 'the growth option'}". Time is your greatest asset.`,
        reasoning: `${node.growerAdvice || 'Every day you delay investing is compound interest you\'ll never get back. The S&P 500 has returned an average of 10% annually since inception.'} Starting early, even with small amounts, is the single most impactful financial decision a young person can make. The math is irrefutable.`,
        keyPoints: [
          '$500/month at 10% annual return = $1M+ in 30 years',
          'Time in market beats timing the market — every single study confirms this',
          'Tax-advantaged accounts (401k, Roth IRA) are free money you\'re leaving on the table',
        ],
        recommendedOption: options[1]?.id || options[0]?.id || '',
        confidence: 0.88,
        tone: 'energetic',
      },
      {
        agentId: 'behaviorist' as const,
        agentName: 'The Behaviorist',
        recommendation: `Before choosing, consider why you're leaning the way you are.`,
        reasoning: `${node.behavioristAdvice || 'I notice a potential loss aversion bias here. You might be overweighting the fear of losing money versus the opportunity cost of not acting.'} The question isn't just "what's the best option" — it's "what will you actually stick with?" The best financial plan is the one you'll follow consistently.`,
        keyPoints: [
          'Watch for loss aversion — we feel losses 2x more intensely than equivalent gains',
          'Status quo bias might keep you in a suboptimal position just because it feels safe',
          'Consider: what would you advise your best friend to do in this exact situation?',
        ],
        recommendedOption: options[Math.min(1, options.length - 1)]?.id || '',
        confidence: 0.75,
        tone: 'observational',
      },
    ],
    rebuttals: [
      {
        agentId: 'conservator',
        targetAgentId: 'grower',
        rebuttal: 'Your 10% average return hides devastating years. What about someone who invested in 2007 and needed the money in 2009? Average returns mean nothing if you can\'t survive the downturns.',
        concessions: ['Starting early is indeed powerful for long-term wealth'],
        counterPoints: ['Without an emergency fund, any market downturn forces selling at the worst time'],
      },
      {
        agentId: 'grower',
        targetAgentId: 'conservator',
        rebuttal: 'Holding too much cash is the silent killer of wealth. Inflation at 3% means your "safe" savings lose purchasing power every single year. Safety is an illusion if your money shrinks.',
        concessions: ['A basic emergency fund is reasonable before aggressive investing'],
        counterPoints: ['Opportunity cost of not investing is real and measurable — every year delayed costs thousands'],
      },
      {
        agentId: 'behaviorist',
        targetAgentId: 'conservator',
        rebuttal: 'Your advice, while emotionally comforting, may trigger a different bias: the "save everything" mentality that leads to analysis paralysis and never actually investing.',
        concessions: ['Emotional comfort with financial decisions does lead to better long-term adherence'],
        counterPoints: ['The "perfect" level of safety is a moving goalpost — at some point you have to act'],
      },
    ],
    synthesis: {
      summary: 'The Council recommends a balanced approach: secure your foundation first, then systematically deploy capital into growth vehicles. The key insight is that this isn\'t an either-or decision — it\'s a sequencing decision.',
      agreements: [
        'Starting early with any financial strategy is better than waiting for the "perfect" moment',
        'Some level of emergency reserves is non-negotiable before taking market risk',
        'Behavioral awareness of your own biases will save you more money than any strategy',
      ],
      disagreements: [
        'How much emergency fund is "enough" before investing (Conservator says 6-12 months, Grower says 3 months is fine)',
        'Whether to prioritize tax-advantaged investing over building a larger cash cushion',
      ],
      finalRecommendation: `Based on your profile, the Council suggests: ${options[1]?.label || 'a balanced approach'}. Start with a 3-month emergency fund, then allocate systematically into growth vehicles.`,
      confidenceScore: 0.78,
      tradeOffs: [
        'More security now = less growth later',
        'More risk now = potentially higher returns but more stress',
        'The "best" option depends on what you\'ll actually follow through on',
      ],
    },
    biasWarnings: [
      'Loss aversion may be influencing your initial preference',
      'Consider whether anchoring to your current financial position is holding you back',
    ],
    timestamp: Date.now(),
  }
}
