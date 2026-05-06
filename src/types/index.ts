export interface UserProfile {
  id: string
  name: string
  age: number
  location: string
  careerGoal: string
  currentSavings: number
  currentDebt: number
  monthlyIncome: number
  moneyPersonality: MoneyPersonality
  createdAt: number
}

export interface MoneyPersonality {
  riskTolerance: number
  delayedGratification: number
  researchPatience: number
  automationComfort: number
  lossAversion: number
  futureFocus: number
  archetype: PersonalityArchetype
}

export type PersonalityArchetype =
  | 'guardian'
  | 'builder'
  | 'explorer'
  | 'strategist'
  | 'visionary'

export interface FinancialTwin {
  profile: UserProfile
  projectedIncome: number[]
  projectedExpenses: number[]
  lifeEvents: LifeEvent[]
  netWorth: number
  portfolioAllocation: PortfolioAllocation
  financialHealth: FinancialHealth
}

export interface LifeEvent {
  id: string
  year: number
  month: number
  title: string
  description: string
  type: 'income' | 'expense' | 'investment' | 'emergency' | 'opportunity' | 'milestone'
  impact: number
  probability: number
}

export interface PortfolioAllocation {
  cash: number
  stocks: number
  bonds: number
  crypto: number
  realEstate: number
  retirement: number
}

export interface FinancialHealth {
  emergencyFundMonths: number
  debtToIncomeRatio: number
  savingsRate: number
  investmentDiversification: number
  overallScore: number
}

export interface Scenario {
  id: string
  title: string
  subtitle: string
  description: string
  type: 'first_paycheck' | 'market_crash' | 'windfall' | 'custom'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedMinutes: number
  decisionNodes: DecisionNode[]
  icon: string
  color: string
  unlocked: boolean
}

export interface DecisionNode {
  id: string
  yearIndex: number
  monthIndex: number
  title: string
  context: string
  scenarioContext: ScenarioContext
  options: DecisionOption[]
  councilDeliberation?: CouncilDeliberation
  userChoice?: string
  outcome?: DecisionOutcome
}

export interface ScenarioContext {
  currentSavings: number
  currentDebt: number
  monthlyIncome: number
  monthlyExpenses: number
  portfolioValue: number
  marketCondition: 'bull' | 'bear' | 'neutral' | 'volatile'
  interestRate: number
  inflationRate: number
}

export interface DecisionOption {
  id: string
  label: string
  description: string
  icon: string
  projections: TimeProjection[]
  riskLevel: 'low' | 'medium' | 'high'
  tags: string[]
}

export interface TimeProjection {
  years: number
  netWorth: number
  savings: number
  debt: number
  investmentValue: number
  monthlyPassiveIncome: number
}

export interface CouncilDeliberation {
  agents: AgentOpinion[]
  rebuttals: AgentRebuttal[]
  synthesis: CouncilSynthesis
  biasWarnings: string[]
  timestamp: number
}

export interface AgentOpinion {
  agentId: 'conservator' | 'grower' | 'behaviorist'
  agentName: string
  recommendation: string
  reasoning: string
  keyPoints: string[]
  recommendedOption: string
  confidence: number
  tone: string
}

export interface AgentRebuttal {
  agentId: string
  targetAgentId: string
  rebuttal: string
  concessions: string[]
  counterPoints: string[]
}

export interface CouncilSynthesis {
  summary: string
  agreements: string[]
  disagreements: string[]
  finalRecommendation: string
  confidenceScore: number
  tradeOffs: string[]
}

export interface DecisionOutcome {
  chosenOption: string
  shortTermResult: string
  longTermProjection: TimeProjection
  alternativeOutcomes: {
    optionId: string
    projection: TimeProjection
  }[]
  lessonsLearned: string[]
  scoreImpact: number
}

export interface SimulationState {
  currentYear: number
  currentMonth: number
  totalYears: number
  speed: number
  isPaused: boolean
  isComplete: boolean
}

export interface GalaxyNode {
  id: string
  type: 'cash' | 'stock' | 'bond' | 'debt' | 'crypto' | 'realestate' | 'retirement'
  label: string
  value: number
  volatility: number
  color: string
  position: [number, number, number]
  velocity: [number, number, number]
}

export interface FinancialMastery {
  overallScore: number
  categories: {
    budgeting: number
    investing: number
    debtManagement: number
    behavioralAwareness: number
    taxOptimization: number
    riskManagement: number
  }
  decisionsCount: number
  scenariosCompleted: number
  streakDays: number
}

export type AppView = 'landing' | 'onboarding' | 'simulation' | 'dashboard'

export interface OnboardingStep {
  id: string
  title: string
  subtitle: string
  component: string
}
