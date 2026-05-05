import { useMemo } from 'react'

import SearchableSelect from '../ui/SearchableSelect'
import { ALL_COUNTRIES, ENHANCED_CAREERS } from '../../utils/constants'

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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              value={data.age || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                onUpdate({ age: val === '' ? 0 : parseInt(val, 10) })
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="location">Location</label>
            <SearchableSelect
              id="location"
              value={data.location}
              onChange={(value) => onUpdate({ location: value })}
              options={ALL_COUNTRIES}
              placeholder="Search country..."
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="career">Career Goal / Current Field</label>
          <SearchableSelect
            id="career"
            value={data.careerGoal}
            onChange={(value) => onUpdate({ careerGoal: value })}
            options={ENHANCED_CAREERS}
            placeholder="Search career path..."
          />
        </div>

        <div className="form-group">
          <div className="slider-container">
            <div className="slider-header">
              <label className="form-label">Monthly Income (Gross)</label>
              <span className="slider-value">{formatCurrency(data.monthlyIncome)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={20000}
              step={50}
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
                step={100}
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
                step={100}
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
