import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  UserProfile,
  FinancialTwin,
  Scenario,
  DecisionNode,
  CouncilDeliberation,
  SimulationState,
  FinancialMastery,
  AppView,
  PortfolioAllocation,
  MoneyPersonality,
  PersonalityArchetype,
  DecisionOutcome,
} from '../types'

interface OnboardingData {
  step: number
  name: string
  age: number
  location: string
  careerGoal: string
  currentSavings: number
  currentDebt: number
  monthlyIncome: number
  personalityAnswers: number[]
}

interface AppState {
  currentView: AppView
  setView: (view: AppView) => void

  onboarding: OnboardingData
  updateOnboarding: (data: Partial<OnboardingData>) => void
  resetOnboarding: () => void

  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile) => void

  financialTwin: FinancialTwin | null
  setFinancialTwin: (twin: FinancialTwin) => void

  activeScenario: Scenario | null
  setActiveScenario: (scenario: Scenario | null) => void

  currentDecisionNode: DecisionNode | null
  setCurrentDecisionNode: (node: DecisionNode | null) => void

  councilDeliberation: CouncilDeliberation | null
  setCouncilDeliberation: (deliberation: CouncilDeliberation | null) => void
  isCouncilLoading: boolean
  setCouncilLoading: (loading: boolean) => void

  simulation: SimulationState
  updateSimulation: (state: Partial<SimulationState>) => void
  resetSimulation: () => void

  mastery: FinancialMastery
  updateMastery: (mastery: Partial<FinancialMastery>) => void

  decisionHistory: DecisionOutcome[]
  addDecisionOutcome: (outcome: DecisionOutcome) => void

  completedScenarios: string[]
  addCompletedScenario: (scenarioId: string) => void

  showGalaxy: boolean
  setShowGalaxy: (show: boolean) => void

  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void

  purgeStore: () => void
}

const defaultOnboarding: OnboardingData = {
  step: 0,
  name: '',
  age: 22,
  location: '',
  careerGoal: '',
  currentSavings: 5000,
  currentDebt: 0,
  monthlyIncome: 3500,
  personalityAnswers: [],
}

const defaultSimulation: SimulationState = {
  currentYear: 0,
  currentMonth: 0,
  totalYears: 10,
  speed: 1,
  isPaused: true,
  isComplete: false,
}

const defaultMastery: FinancialMastery = {
  overallScore: 0,
  categories: {
    budgeting: 0,
    investing: 0,
    debtManagement: 0,
    behavioralAwareness: 0,
    taxOptimization: 0,
    riskManagement: 0,
  },
  decisionsCount: 0,
  scenariosCompleted: 0,
  streakDays: 0,
}

function calculateArchetype(answers: number[]): PersonalityArchetype {
  if (answers.length < 5) return 'builder'
  const avg = answers.reduce((a, b) => a + b, 0) / answers.length
  const riskScore = answers[0] || 3
  const patienceScore = answers[1] || 3
  if (riskScore <= 2 && patienceScore >= 4) return 'guardian'
  if (riskScore >= 4 && patienceScore >= 4) return 'strategist'
  if (riskScore >= 4 && patienceScore <= 2) return 'explorer'
  if (avg >= 3.5) return 'visionary'
  return 'builder'
}

function buildMoneyPersonality(answers: number[]): MoneyPersonality {
  return {
    riskTolerance: answers[0] || 3,
    delayedGratification: answers[1] || 3,
    researchPatience: answers[2] || 3,
    automationComfort: answers[3] || 3,
    lossAversion: answers[4] || 3,
    archetype: calculateArchetype(answers),
  }
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'landing',
      setView: (view) => set({ currentView: view }),

      onboarding: { ...defaultOnboarding },
      updateOnboarding: (data) =>
        set((s) => ({ onboarding: { ...s.onboarding, ...data } })),
      resetOnboarding: () => set({ onboarding: { ...defaultOnboarding } }),

      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),

      financialTwin: null,
      setFinancialTwin: (twin) => set({ financialTwin: twin }),

      activeScenario: null,
      setActiveScenario: (scenario) => set({ activeScenario: scenario }),

      currentDecisionNode: null,
      setCurrentDecisionNode: (node) => set({ currentDecisionNode: node }),

      councilDeliberation: null,
      setCouncilDeliberation: (deliberation) =>
        set({ councilDeliberation: deliberation }),
      isCouncilLoading: false,
      setCouncilLoading: (loading) => set({ isCouncilLoading: loading }),

      simulation: { ...defaultSimulation },
      updateSimulation: (state) =>
        set((s) => ({ simulation: { ...s.simulation, ...state } })),
      resetSimulation: () => set({ simulation: { ...defaultSimulation } }),

      mastery: { ...defaultMastery },
      updateMastery: (mastery) =>
        set((s) => ({
          mastery: { ...s.mastery, ...mastery },
        })),

      decisionHistory: [],
      addDecisionOutcome: (outcome) =>
        set((s) => {
          // Calculate new stats based on the decision
          let newNetWorth = s.financialTwin?.netWorth || 0;
          let newScore = s.financialTwin?.financialHealth.overallScore || 0;
          const newEmergencyMonths = s.financialTwin?.financialHealth.emergencyFundMonths || 0;
          const newDebtRatio = s.financialTwin?.financialHealth.debtToIncomeRatio || 0;

          // Simple logic: parse shortTermResult string for positive/negative impacts (MVP logic)
          if (outcome.shortTermResult.includes('Increase') || outcome.shortTermResult.includes('+')) {
            newNetWorth += 1000;
          } else if (outcome.shortTermResult.includes('Decrease') || outcome.shortTermResult.includes('-')) {
            newNetWorth -= 500;
          }

          if (outcome.scoreImpact) {
             newScore = Math.max(0, Math.min(100, newScore + outcome.scoreImpact));
          }

          const newTwin = s.financialTwin ? {
            ...s.financialTwin,
            netWorth: newNetWorth,
            financialHealth: {
              ...s.financialTwin.financialHealth,
              overallScore: newScore,
              emergencyFundMonths: newEmergencyMonths,
              debtToIncomeRatio: newDebtRatio,
            }
          } : null;

          return { 
            decisionHistory: [...s.decisionHistory, outcome],
            financialTwin: newTwin,
            mastery: {
              ...s.mastery,
              decisionsCount: s.mastery.decisionsCount + 1,
              overallScore: Math.max(0, Math.min(1000, s.mastery.overallScore + (outcome.scoreImpact || 0) * 10))
            }
          };
        }),

      completedScenarios: [],
      addCompletedScenario: (scenarioId) =>
        set((s) => ({
          completedScenarios: [...s.completedScenarios, scenarioId],
        })),

      showGalaxy: true,
      setShowGalaxy: (show) => set({ showGalaxy: show }),

      soundEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      purgeStore: () => {
        localStorage.removeItem('praxis-store')
        set({
          userProfile: null,
          financialTwin: null,
          activeScenario: null,
          currentDecisionNode: null,
          councilDeliberation: null,
          simulation: { ...defaultSimulation },
          mastery: { ...defaultMastery },
          decisionHistory: [],
          completedScenarios: [],
          currentView: 'landing'
        })
      },
    }),
    {
      name: 'praxis-store',
      partialize: (state) => ({
        userProfile: state.userProfile,
        financialTwin: state.financialTwin,
        mastery: state.mastery,
        decisionHistory: state.decisionHistory,
        completedScenarios: state.completedScenarios,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
)

export function generateUserProfile(onboarding: OnboardingData): UserProfile {
  return {
    id: crypto.randomUUID(),
    name: onboarding.name,
    age: onboarding.age,
    location: onboarding.location,
    careerGoal: onboarding.careerGoal,
    currentSavings: onboarding.currentSavings,
    currentDebt: onboarding.currentDebt,
    monthlyIncome: onboarding.monthlyIncome,
    moneyPersonality: buildMoneyPersonality(onboarding.personalityAnswers),
    createdAt: Date.now(),
  }
}

export function generateFinancialTwin(profile: UserProfile): FinancialTwin {
  const incomeGrowthRate = 0.04
  const years = 10

  const projectedIncome: number[] = []
  const projectedExpenses: number[] = []
  const annualIncome = profile.monthlyIncome * 12

  for (let y = 0; y < years; y++) {
    const income = annualIncome * Math.pow(1 + incomeGrowthRate, y)
    const expenses = income * (0.65 + Math.random() * 0.1)
    projectedIncome.push(Math.round(income))
    projectedExpenses.push(Math.round(expenses))
  }

  const baseAllocation: PortfolioAllocation = {
    cash: 0.3,
    stocks: 0.25,
    bonds: 0.1,
    crypto: 0.05,
    realEstate: 0,
    retirement: 0.3,
  }

  if (profile.moneyPersonality.riskTolerance >= 4) {
    baseAllocation.stocks = 0.4
    baseAllocation.crypto = 0.1
    baseAllocation.cash = 0.15
    baseAllocation.bonds = 0.05
  } else if (profile.moneyPersonality.riskTolerance <= 2) {
    baseAllocation.cash = 0.4
    baseAllocation.bonds = 0.25
    baseAllocation.stocks = 0.1
    baseAllocation.crypto = 0
  }

  return {
    profile,
    projectedIncome,
    projectedExpenses,
    lifeEvents: generateLifeEvents(profile, years),
    netWorth: profile.currentSavings - profile.currentDebt,
    portfolioAllocation: baseAllocation,
    financialHealth: {
      emergencyFundMonths: profile.currentSavings / (profile.monthlyIncome * 0.7),
      debtToIncomeRatio: profile.currentDebt / (profile.monthlyIncome * 12),
      savingsRate: 0.2,
      investmentDiversification: 0.5,
      overallScore: 45,
    },
  }
}

function generateLifeEvents(profile: UserProfile, years: number): import('../types').LifeEvent[] {
  const events: import('../types').LifeEvent[] = []
  const templates = [
    { title: 'Car Repair Emergency', type: 'emergency' as const, impact: -1500, prob: 0.3 },
    { title: 'Medical Bill', type: 'emergency' as const, impact: -2500, prob: 0.2 },
    { title: 'Salary Raise', type: 'income' as const, impact: 5000, prob: 0.4 },
    { title: 'Job Promotion', type: 'income' as const, impact: 12000, prob: 0.15 },
    { title: 'Side Hustle Opportunity', type: 'opportunity' as const, impact: 8000, prob: 0.25 },
    { title: 'Market Correction', type: 'investment' as const, impact: -8000, prob: 0.15 },
    { title: 'Tax Refund', type: 'income' as const, impact: 2000, prob: 0.6 },
    { title: 'Apartment Lease Increase', type: 'expense' as const, impact: -1200, prob: 0.5 },
    { title: 'Student Loan Milestone', type: 'milestone' as const, impact: 0, prob: 0.3 },
    { title: 'First Investment Dividend', type: 'investment' as const, impact: 500, prob: 0.35 },
  ]

  for (let y = 0; y < years; y++) {
    const yearEvents = templates.filter(() => Math.random() < 0.3)
    yearEvents.forEach((template) => {
      if (Math.random() < template.prob) {
        events.push({
          id: crypto.randomUUID(),
          year: y,
          month: Math.floor(Math.random() * 12),
          title: template.title,
          description: `Year ${y + 1}: ${template.title}`,
          type: template.type,
          impact: template.impact * (0.8 + Math.random() * 0.4),
          probability: template.prob,
        })
      }
    })
  }

  return events.sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month))
}
