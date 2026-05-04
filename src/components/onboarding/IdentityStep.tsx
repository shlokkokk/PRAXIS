import { useMemo } from 'react'

const LOCATIONS = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
  'San Francisco, CA', 'Columbus, OH', 'Charlotte, NC', 'Indianapolis, IN',
  'Seattle, WA', 'Denver, CO', 'Washington, DC', 'Nashville, TN',
  'Portland, OR', 'Boston, MA', 'Las Vegas, NV', 'Atlanta, GA',
  'Miami, FL', 'Minneapolis, MN', 'Detroit, MI', 'Other',
]

const CAREERS = [
  'Software Engineering', 'Data Science', 'Product Management',
  'Marketing', 'Finance / Accounting', 'Healthcare / Nursing',
  'Education / Teaching', 'Design / UX', 'Sales', 'Law',
  'Consulting', 'Entrepreneurship', 'Engineering (Non-Software)',
  'Freelancing / Gig Work', 'Trades / Skilled Labor', 'Government',
  'Nonprofit / Social Work', 'Arts / Entertainment', 'Student',
  'Other',
]

interface Props {
  data: {
    name: string
    age: number
    location: string
    careerGoal: string
    currentSavings: number
    currentDebt: number
    monthlyIncome: number
  }
  onUpdate: (data: Partial<Props['data']>) => void
  onNext: () => void
  onBack: () => void
}

function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
  }
  return `$${value}`
}

export default function IdentityStep({ data, onUpdate, onNext, onBack }: Props) {
  const canProceed = useMemo(() => {
    return data.name.trim().length > 0 && data.location.length > 0 && data.careerGoal.length > 0
  }, [data.name, data.location, data.careerGoal])

  return (
    <div className="step-card">
      <h2>Who Are <span className="gradient-text">You?</span></h2>
      <p className="step-subtitle">
        Let's build the foundation of your Financial Twin. The more accurate, the more realistic your simulation.
      </p>

      <div style={{ textAlign: 'left' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">What should we call you?</label>
          <input
            id="name"
            className="input"
            type="text"
            placeholder="Your first name"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            autoFocus
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="age">Age</label>
            <input
              id="age"
              className="input"
              type="number"
              min={16}
              max={65}
              value={data.age}
              onChange={(e) => onUpdate({ age: parseInt(e.target.value) || 22 })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="location">Location</label>
            <select
              id="location"
              className="input"
              value={data.location}
              onChange={(e) => onUpdate({ location: e.target.value })}
            >
              <option value="">Select city...</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="career">Career Goal / Current Field</label>
          <select
            id="career"
            className="input"
            value={data.careerGoal}
            onChange={(e) => onUpdate({ careerGoal: e.target.value })}
          >
            <option value="">Select career path...</option>
            {CAREERS.map((career) => (
              <option key={career} value={career}>{career}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div className="slider-container">
            <div className="slider-header">
              <label className="form-label">Monthly Income (Gross)</label>
              <span className="slider-value">{formatCurrency(data.monthlyIncome)}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={20000}
              step={250}
              value={data.monthlyIncome}
              onChange={(e) => onUpdate({ monthlyIncome: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <div className="slider-container">
              <div className="slider-header">
                <label className="form-label">Current Savings</label>
                <span className="slider-value">{formatCurrency(data.currentSavings)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100000}
                step={500}
                value={data.currentSavings}
                onChange={(e) => onUpdate({ currentSavings: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="slider-container">
              <div className="slider-header">
                <label className="form-label">Current Debt</label>
                <span className="slider-value">{formatCurrency(data.currentDebt)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={200000}
                step={1000}
                value={data.currentDebt}
                onChange={(e) => onUpdate({ currentDebt: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canProceed}
          style={{ opacity: canProceed ? 1 : 0.5 }}
        >
          Continue
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
