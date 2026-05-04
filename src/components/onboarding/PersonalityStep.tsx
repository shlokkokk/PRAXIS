import { useCallback } from 'react'

const QUESTIONS = [
  {
    id: 'risk',
    question: 'Your portfolio drops 20% overnight. What\'s your gut reaction?',
    options: [
      { value: 1, label: 'Sell everything immediately' },
      { value: 2, label: 'Sell some to limit losses' },
      { value: 3, label: 'Hold and wait it out' },
      { value: 4, label: 'Buy more — it\'s on sale' },
      { value: 5, label: 'Double down aggressively' },
    ],
    scale: ['Risk Averse', 'Risk Seeking'],
  },
  {
    id: 'patience',
    question: 'Would you rather have $1,000 today or $1,500 in one year?',
    options: [
      { value: 1, label: '$1,000 now, no question' },
      { value: 2, label: 'Probably take the money now' },
      { value: 3, label: 'Depends on my situation' },
      { value: 4, label: 'Lean toward waiting' },
      { value: 5, label: '$1,500 in a year, easy' },
    ],
    scale: ['Instant Gratification', 'Delayed Gratification'],
  },
  {
    id: 'research',
    question: 'Before making a financial decision, how much research do you do?',
    options: [
      { value: 1, label: 'Go with my gut' },
      { value: 2, label: 'Quick Google search' },
      { value: 3, label: 'Read a few articles' },
      { value: 4, label: 'Deep research mode' },
      { value: 5, label: 'Spreadsheets & analysis' },
    ],
    scale: ['Intuitive', 'Analytical'],
  },
  {
    id: 'automation',
    question: 'How do you feel about automated investing (robo-advisors, auto-transfers)?',
    options: [
      { value: 1, label: 'I need full control' },
      { value: 2, label: 'Prefer manual with some help' },
      { value: 3, label: 'Open to some automation' },
      { value: 4, label: 'Love it, set and forget' },
      { value: 5, label: 'Automate everything possible' },
    ],
    scale: ['Manual Control', 'Full Automation'],
  },
  {
    id: 'loss',
    question: 'You discover you overpaid $200 on something last month. How does this make you feel?',
    options: [
      { value: 5, label: 'Doesn\'t bother me at all' },
      { value: 4, label: 'Slightly annoyed' },
      { value: 3, label: 'Frustrated but move on' },
      { value: 2, label: 'It ruins my day' },
      { value: 1, label: 'I\'d lose sleep over it' },
    ],
    scale: ['Loss Sensitive', 'Loss Tolerant'],
  },
]

interface Props {
  data: {
    personalityAnswers: number[]
  }
  onUpdate: (data: { personalityAnswers: number[] }) => void
  onNext: () => void
  onBack: () => void
}

export default function PersonalityStep({ data, onUpdate, onNext, onBack }: Props) {
  const answers = data.personalityAnswers

  const handleSelect = useCallback((questionIndex: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = value
    onUpdate({ personalityAnswers: newAnswers })
  }, [answers, onUpdate])

  const allAnswered = answers.length === QUESTIONS.length && answers.every((a) => a > 0)

  return (
    <div className="step-card">
      <h2>Your Money <span className="gradient-text">Personality</span></h2>
      <p className="step-subtitle">
        How you think about money matters more than how much you have.
        These 5 questions reveal your financial decision-making style.
      </p>

      <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: 'var(--space-2)' }}>
        {QUESTIONS.map((q, qi) => (
          <div key={q.id} className="personality-question">
            <h3>
              <span style={{ color: 'var(--color-violet)', marginRight: 'var(--space-2)' }}>
                {qi + 1}.
              </span>
              {q.question}
            </h3>
            <div className="personality-options">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  className={`personality-option ${answers[qi] === opt.value ? 'active' : ''}`}
                  onClick={() => handleSelect(qi, opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="personality-scale">
              <span>{q.scale[0]}</span>
              <span>{q.scale[1]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!allAnswered}
          style={{ opacity: allAnswered ? 1 : 0.5 }}
        >
          Generate My Twin
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
