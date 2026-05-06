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

  hoveredElement: { title: string; subtitle: string; value?: string } | null
  setHoveredElement: (element: { title: string; subtitle: string; value?: string } | null) => void

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
    futureFocus: answers[5] || 3,
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
          // --- Net Worth Update (use real projection if available) ---
          let newNetWorth = s.financialTwin?.netWorth || 0;
          if (outcome.longTermProjection?.netWorth) {
            // Blend current net worth toward the 5-year projection a little each decision
            const projectedDiff = outcome.longTermProjection.netWorth - newNetWorth
            newNetWorth = newNetWorth + Math.round(projectedDiff * 0.05) // 5% step toward projection
          }

          // --- Health Score ---
          let newScore = s.financialTwin?.financialHealth.overallScore || 0;
          if (outcome.scoreImpact) {
            newScore = Math.max(0, Math.min(100, newScore + outcome.scoreImpact));
          }

          // --- Mastery Category Updates based on decision tags ---
          const newCategories = { ...s.mastery.categories }
          const tags = (outcome as any).tags as string[] | undefined
          
          if (tags) {
            if (tags.some(t => ['security', 'foundation', 'emergency-fund', 'debt-free', 'debt-payoff', 'entrepreneurship'].includes(t))) {
              newCategories.budgeting = Math.min(100, newCategories.budgeting + Math.abs(outcome.scoreImpact || 5))
            }
            if (tags.some(t => ['growth', 'compound-interest', 'index-funds', 'lump-sum', 'dca', 'employer-match', 'roth', 'retirement', 'angel-investing', 'startup', 'human-capital', 'career'].includes(t))) {
              newCategories.investing = Math.min(100, newCategories.investing + Math.abs(outcome.scoreImpact || 5))
            }
            if (tags.some(t => ['debt-free', 'debt-payoff'].includes(t))) {
              newCategories.debtManagement = Math.min(100, newCategories.debtManagement + Math.abs(outcome.scoreImpact || 5))
            }
            if (tags.some(t => ['loss-aversion', 'panic-sell', 'hedonic-treadmill', 'psychology', 'stealth-wealth', 'discipline', 'patience', 'lifestyle-inflation'].includes(t))) {
              newCategories.behavioralAwareness = Math.min(100, newCategories.behavioralAwareness + Math.abs(outcome.scoreImpact || 5))
            }
            if (tags.some(t => ['rebalance', 'risk-management', 'diamond-hands', 'consistency', 'high-variance'].includes(t))) {
              newCategories.riskManagement = Math.min(100, newCategories.riskManagement + Math.abs(outcome.scoreImpact || 5))
            }
            if (tags.some(t => ['tax-advantaged', 'roth', 'employer-match', 'tax-free'].includes(t))) {
              newCategories.taxOptimization = Math.min(100, newCategories.taxOptimization + Math.abs(outcome.scoreImpact || 5))
            }
          }

          const newTwin = s.financialTwin ? {
            ...s.financialTwin,
            netWorth: newNetWorth,
            financialHealth: {
              ...s.financialTwin.financialHealth,
              overallScore: newScore,
            }
          } : null;

          const categoriesArray = Object.values(newCategories)
          const newOverallMastery = Math.min(100, Math.round(
            categoriesArray.reduce((a, b) => a + b, 0) / 6
          ))

          return { 
            decisionHistory: [...s.decisionHistory, outcome],
            financialTwin: newTwin,
            mastery: {
              ...s.mastery,
              decisionsCount: s.mastery.decisionsCount + 1,
              overallScore: newOverallMastery,
              categories: newCategories,
            }
          };
        }),

      completedScenarios: [],
      addCompletedScenario: (scenarioId) =>
        set((s) => ({
          completedScenarios: [...s.completedScenarios, scenarioId],
          mastery: {
            ...s.mastery,
            streakDays: s.mastery.streakDays + 1,
            scenariosCompleted: s.mastery.scenariosCompleted + 1,
          }
        })),

      showGalaxy: true,
      setShowGalaxy: (show) => set({ showGalaxy: show }),

      hoveredElement: null,
      setHoveredElement: (element) => set({ hoveredElement: element }),

      soundEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      purgeStore: () => {
        set({
          userProfile: null,
          financialTwin: null,
          activeScenario: null,
          currentDecisionNode: null,
          councilDeliberation: null,
          simulation: { ...defaultSimulation },
          mastery: { ...defaultMastery },
          onboarding: { ...defaultOnboarding },
          decisionHistory: [],
          completedScenarios: [],
          currentView: 'landing'
        })
        localStorage.removeItem('praxis-store')
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
      emergencyFundMonths: profile.currentSavings / (profile.monthlyIncome > 0 ? profile.monthlyIncome * 0.7 : 500),
      debtToIncomeRatio: profile.currentDebt / (profile.monthlyIncome > 0 ? profile.monthlyIncome * 12 : 1),
      savingsRate: 0.2,
      investmentDiversification: 0.5,
      overallScore: 45,
    },
  }
}

function generateLifeEvents(profile: UserProfile, years: number): import('../types').LifeEvent[] {
  const events: import('../types').LifeEvent[] = []
  
  // Customizing templates based on profile
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

  // Add age-specific events
  if (profile.age > 25 && profile.age < 35) {
    templates.push({ title: 'Family Expansion', type: 'expense' as const, impact: -15000, prob: 0.1 })
  }
  
  // Customizing probability based on career goal
  const career = profile.careerGoal.toLowerCase()
  const isTech = ['software', 'tech', 'data', 'cyber', 'cloud', 'devops', 'blockchain', 'web3', 'ui/ux'].some(k => career.includes(k))
  const isFinance = ['finance', 'bank', 'accounting', 'cpa', 'venture', 'actuarial'].some(k => career.includes(k))
  const isMedical = ['medicine', 'doctor', 'surgeon', 'nursing', 'healthcare', 'biotech'].some(k => career.includes(k))
  const isBusiness = ['product', 'project', 'scrum', 'management', 'marketing', 'sales', 'growth', 'consulting', 'founder', 'entrepreneurship'].some(k => career.includes(k))

  if (isTech) {
    const promo = templates.find(t => t.title === 'Job Promotion')
    if (promo) promo.prob = 0.28 // Higher promo chance in tech
  } else if (isFinance || isBusiness) {
    const raise = templates.find(t => t.title === 'Salary Raise')
    if (raise) raise.prob = 0.5 // Higher frequency of salary bumps
    const promo = templates.find(t => t.title === 'Job Promotion')
    if (promo) promo.impact = 18000 // Huge jumps in finance/business
  } else if (isMedical) {
    const sideHustle = templates.find(t => t.title === 'Side Hustle Opportunity')
    if (sideHustle) sideHustle.prob = 0.1 // Less time for side hustles
    const emergency = templates.find(t => t.title === 'Medical Bill')
    if (emergency) emergency.prob = 0.05 // Better insurance coverage
  }

  for (let y = 0; y < years; y++) {
    const yearEvents = templates.filter(() => Math.random() < 0.3)
    yearEvents.forEach((template) => {
      if (Math.random() < template.prob) {
        // Adjust impact based on income for some events
        let finalImpact = template.impact
        if (template.type === 'income' && template.title.includes('Raise')) {
          finalImpact = profile.monthlyIncome * 1.5 // Custom raise
        }

        events.push({
          id: crypto.randomUUID(),
          year: y,
          month: Math.floor(Math.random() * 12),
          title: template.title,
          description: `Year ${y + 1}: ${template.title}`,
          type: template.type,
          impact: finalImpact * (0.8 + Math.random() * 0.4),
          probability: template.prob,
        })
      }
    })
  }

  return events.sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month))
}
