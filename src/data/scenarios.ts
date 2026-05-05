import type { UserProfile, FinancialTwin, TimeProjection } from '../types'

export interface ScenarioNode {
  id: string
  year: number
  month: number
  title: string
  context: string
  conservatorAdvice?: string
  growerAdvice?: string
  behavioristAdvice?: string
  options: ScenarioOption[]
}

export interface ScenarioOption {
  id: string
  label: string
  description: string
  icon: string
  riskLevel: 'low' | 'medium' | 'high'
  projection: TimeProjection
  shortTermResult: string
  lessons: string[]
  scoreImpact: number
  tags: string[]
}

export interface ScenarioData {
  id: string
  title: string
  subtitle: string
  description: string
  backstory: string
  icon: string
  color: string
  totalYears: number
  nodes: ScenarioNode[]
}

function varyAmount(base: number, variance: number): number {
  return Math.round(base * (1 + (Math.random() - 0.5) * 2 * variance))
}

function buildProjection(base: number, rate: number, years: number, monthly = 0): TimeProjection {
  let value = base
  for (let i = 0; i < years; i++) value = value * (1 + rate) + monthly * 12
  return {
    years,
    netWorth: Math.round(value),
    savings: Math.round(value * 0.3),
    debt: 0,
    investmentValue: Math.round(value * 0.5),
    monthlyPassiveIncome: Math.round(value * 0.004),
  }
}

function firstPaycheckScenario(profile: UserProfile, _twin: FinancialTwin): ScenarioData {
  const income = profile.monthlyIncome
  const salary = varyAmount(income, 0.1)

  return {
    id: 'first_paycheck',
    title: 'THE FIRST PAYCHECK',
    subtitle: `You just landed your first real job — $${salary.toLocaleString()}/month`,
    description: 'Every dollar you allocate now echoes through the next decade. This is where financial habits are born — or broken.',
    backstory: `It's your first month at a new ${profile.careerGoal} role in ${profile.location}. Your first real paycheck just hit: $${salary.toLocaleString()} after taxes. You have $${profile.currentSavings.toLocaleString()} in savings and $${profile.currentDebt.toLocaleString()} in debt. The financial universe is watching. What you do next matters.`,
    icon: '💰',
    color: '#10b981',
    totalYears: 5,
    nodes: [
      {
        id: 'fp-1',
        year: 0,
        month: 0,
        title: 'The Emergency Fund Question',
        context: `Your first paycheck is $${salary.toLocaleString()}. Rent takes $${Math.round(salary * 0.3).toLocaleString()}, essentials take $${Math.round(salary * 0.25).toLocaleString()}. You have $${Math.round(salary * 0.45).toLocaleString()} left. What's priority #1?`,
        conservatorAdvice: 'Without an emergency fund, one flat tire or ER visit wipes you out. Build that cushion first — 3 to 6 months of expenses.',
        growerAdvice: 'Every month you delay investing, you lose compound growth. Even $200/month into an index fund now will dwarf a savings account over 10 years.',
        behavioristAdvice: 'Notice how the "safe" option feels emotionally comforting? That comfort might be loss aversion speaking. The real risk might be playing it too safe.',
        options: [
          {
            id: 'fp-1-a',
            label: 'Build Emergency Fund First',
            description: `Save $${Math.round(salary * 0.35).toLocaleString()}/month until you have 6 months of expenses`,
            icon: '🛡️',
            riskLevel: 'low',
            projection: buildProjection(profile.currentSavings + salary * 0.35 * 12, 0.045, 5),
            shortTermResult: 'You built a solid 6-month emergency fund in 8 months. Sleep quality: excellent. Growth: modest.',
            lessons: ['Emergency funds prevent debt spirals', 'Security enables future risk-taking', 'Cash loses value to inflation over time'],
            scoreImpact: 12,
            tags: ['security', 'foundation'],
          },
          {
            id: 'fp-1-b',
            label: 'Start Investing Immediately',
            description: `Put $${Math.round(salary * 0.25).toLocaleString()}/month into a diversified index fund (VOO/VTI)`,
            icon: '📈',
            riskLevel: 'medium',
            projection: buildProjection(profile.currentSavings, 0.09, 5, salary * 0.25),
            shortTermResult: 'Your investments grew 12% in year one. But a surprise expense forced you to sell some at a loss.',
            lessons: ['Starting early with investing is powerful', 'Without emergency savings, you may sell at the worst time', 'Dollar-cost averaging reduces timing risk'],
            scoreImpact: 8,
            tags: ['growth', 'compound-interest'],
          },
          {
            id: 'fp-1-c',
            label: 'Split 50/50: Save & Invest',
            description: `Half to emergency fund, half to index fund — $${Math.round(salary * 0.175).toLocaleString()} each`,
            icon: '⚖️',
            riskLevel: 'medium',
            projection: buildProjection(profile.currentSavings, 0.07, 5, salary * 0.175),
            shortTermResult: 'Balanced approach. Emergency fund took 14 months but investments started compounding immediately.',
            lessons: ['Balance is not a weakness — it\'s a strategy', 'Partial diversification still captures upside', 'Consistency matters more than optimization'],
            scoreImpact: 15,
            tags: ['balanced', 'diversification'],
          },
          {
            id: 'fp-1-d',
            label: 'Aggressive Debt Payoff',
            description: `Throw everything at your $${profile.currentDebt.toLocaleString()} debt first`,
            icon: '💥',
            riskLevel: 'low',
            projection: buildProjection(profile.currentSavings, 0.05, 5, salary * 0.2),
            shortTermResult: profile.currentDebt > 0 ? 'Debt-free in record time. The psychological weight lifted was immense.' : 'With no debt, this freed up maximum cash flow for future moves.',
            lessons: ['Debt freedom is a guaranteed return on investment', 'The emotional benefit of zero debt is underrated', 'Opportunity cost: market gains during payoff period'],
            scoreImpact: profile.currentDebt > 5000 ? 14 : 6,
            tags: ['debt-free', 'psychology'],
          },
        ],
      },
      {
        id: 'fp-2',
        year: 1,
        month: 6,
        title: 'The 401(k) Decision',
        context: `18 months into your career. Your employer offers a 401(k) with 4% match. You're currently saving $${Math.round(salary * 0.15).toLocaleString()}/month. Do you contribute?`,
        options: [
          {
            id: 'fp-2-a',
            label: 'Max the Employer Match (4%)',
            description: 'Contribute exactly 4% to get the full employer match — free money.',
            icon: '🎯',
            riskLevel: 'low',
            projection: buildProjection(salary * 12 * 0.04 * 2, 0.08, 5, salary * 0.04 * 2),
            shortTermResult: 'Employer match = instant 100% return on your 4%. Smart baseline move.',
            lessons: ['Employer match is literally free money', 'Pre-tax contributions lower your tax bill', '401(k) grows tax-deferred for decades'],
            scoreImpact: 18,
            tags: ['tax-advantaged', 'employer-match'],
          },
          {
            id: 'fp-2-b',
            label: 'Max Out the 401(k) ($23,500/yr)',
            description: 'Go all-in on retirement — maximum annual contribution.',
            icon: '🚀',
            riskLevel: 'medium',
            projection: buildProjection(23500, 0.09, 5, 23500),
            shortTermResult: 'Aggressive retirement saving. Tight budget now but your future self will be wealthy.',
            lessons: ['Tax-advantaged space is limited — use it or lose it', 'Living lean now funds freedom later', 'Compounding at this rate makes millionaires'],
            scoreImpact: 15,
            tags: ['retirement', 'aggressive-saving'],
          },
          {
            id: 'fp-2-c',
            label: 'Skip 401(k), Invest in Roth IRA',
            description: 'Pay taxes now, grow tax-free forever with a Roth IRA ($7,000/yr limit).',
            icon: '💎',
            riskLevel: 'medium',
            projection: buildProjection(7000, 0.09, 5, 7000),
            shortTermResult: 'Tax-free growth forever. Smaller contributions but maximum flexibility.',
            lessons: ['Roth IRA = tax-free withdrawals in retirement', 'Young people in low tax brackets benefit most from Roth', 'You can withdraw Roth contributions penalty-free'],
            scoreImpact: 14,
            tags: ['roth', 'tax-free'],
          },
          {
            id: 'fp-2-d',
            label: 'No Retirement Yet — Focus on Now',
            description: 'Keep all income liquid. You\'re young, retirement is decades away.',
            icon: '😎',
            riskLevel: 'high',
            projection: buildProjection(salary * 0.15 * 12, 0.04, 5, salary * 0.15),
            shortTermResult: 'Maximum flexibility now. But you left employer match money on the table — the Grower is screaming.',
            lessons: ['Leaving employer match = turning down a raise', 'Every year delayed costs exponentially more later', 'Short-term flexibility vs long-term security trade-off'],
            scoreImpact: -5,
            tags: ['yolo', 'opportunity-cost'],
          },
        ],
      },
      {
        id: 'fp-3',
        year: 3,
        month: 0,
        title: 'The Lifestyle Inflation Trap',
        context: `Year 3 — you got a 15% raise! New salary: $${Math.round(salary * 1.15).toLocaleString()}/month. Your friends are upgrading apartments, buying new cars. What do you do with the extra income?`,
        options: [
          {
            id: 'fp-3-a',
            label: 'Keep Living Like Before',
            description: 'Invest 100% of the raise. Same apartment, same lifestyle.',
            icon: '🧠',
            riskLevel: 'low',
            projection: buildProjection(salary * 0.15 * 36, 0.09, 5, salary * 0.15 * 1.15),
            shortTermResult: 'The "stealth wealth" approach. Friends think you\'re the same. Your net worth quietly explodes.',
            lessons: ['Lifestyle inflation is the #1 wealth killer for earners', 'Saving raises = accelerated wealth building', 'Your happiness didn\'t change with the old lifestyle — why would upgrading help?'],
            scoreImpact: 20,
            tags: ['stealth-wealth', 'discipline'],
          },
          {
            id: 'fp-3-b',
            label: 'Upgrade Modestly (50/50 Split)',
            description: 'Half the raise for lifestyle, half for investing.',
            icon: '⚖️',
            riskLevel: 'low',
            projection: buildProjection(salary * 0.15 * 36, 0.07, 5, salary * 0.1 * 1.15),
            shortTermResult: 'A nicer apartment and more investing. Balanced and sustainable.',
            lessons: ['Reward yourself — but not with 100% of gains', 'Sustainable habits beat extreme discipline', 'The middle path often wins long-term'],
            scoreImpact: 14,
            tags: ['balanced', 'sustainable'],
          },
          {
            id: 'fp-3-c',
            label: 'Enjoy Life — Upgrade Everything',
            description: 'New apartment, better car, dining out. You earned it.',
            icon: '🎉',
            riskLevel: 'high',
            projection: buildProjection(salary * 0.15 * 36, 0.04, 5, salary * 0.02),
            shortTermResult: 'Life feels amazing... for about 3 months. Then the new normal kicks in and you need more.',
            lessons: ['Hedonic adaptation: upgrades become the new baseline quickly', 'Lifestyle inflation is almost impossible to reverse', 'The hedonic treadmill is real — research by Daniel Kahneman confirms it'],
            scoreImpact: -8,
            tags: ['lifestyle-inflation', 'hedonic-treadmill'],
          },
        ],
      },
    ],
  }
}

function marketCrashScenario(profile: UserProfile, _twin: FinancialTwin): ScenarioData {
  const portfolioValue = varyAmount(25000, 0.2)
  return {
    id: 'market_crash',
    title: 'THE MARKET CRASH',
    subtitle: 'Markets just dropped 30%. Your portfolio is bleeding.',
    description: 'This is the moment that separates investors from speculators. Your emotions are screaming — but what does the math say?',
    backstory: `You\'ve been investing for 3 years. Your portfolio was worth $${portfolioValue.toLocaleString()} yesterday. This morning you wake up to news of a global market crash — your portfolio is now worth $${Math.round(portfolioValue * 0.7).toLocaleString()}. That\'s $${Math.round(portfolioValue * 0.3).toLocaleString()} gone overnight. Your phone won\'t stop buzzing with panic from friends. What do you do?`,
    icon: '📉',
    color: '#f43f5e',
    totalYears: 5,
    nodes: [
      {
        id: 'mc-1',
        year: 0,
        month: 0,
        title: 'The Panic Moment',
        context: `Your $${portfolioValue.toLocaleString()} portfolio just dropped to $${Math.round(portfolioValue * 0.7).toLocaleString()}. Headlines scream doom. Friends are selling. Your heart is racing. What\'s your move?`,
        options: [
          {
            id: 'mc-1-a', label: 'Sell Everything — Get Out Now', description: 'Lock in losses. Move to cash. Wait for the storm to pass.', icon: '🏃', riskLevel: 'high',
            projection: { years: 5, netWorth: Math.round(portfolioValue * 0.7), savings: Math.round(portfolioValue * 0.7), debt: 0, investmentValue: 0, monthlyPassiveIncome: 0 },
            shortTermResult: 'You sold at the bottom. The market recovered 18 months later. You missed the entire rebound.', lessons: ['Selling during crashes locks in losses permanently', 'Panic selling is the most expensive emotion in investing', 'Markets have recovered from every crash in history'], scoreImpact: -15, tags: ['panic-sell', 'loss-aversion'],
          },
          {
            id: 'mc-1-b', label: 'Hold Steady — Change Nothing', description: 'Don\'t look at your portfolio. Keep contributing as normal.', icon: '🧘', riskLevel: 'medium',
            projection: { years: 5, netWorth: Math.round(portfolioValue * 1.4), savings: Math.round(portfolioValue * 0.3), debt: 0, investmentValue: Math.round(portfolioValue * 1.1), monthlyPassiveIncome: Math.round(portfolioValue * 0.004) },
            shortTermResult: 'Gut-wrenching patience. But by year 2, your portfolio passed its pre-crash value. By year 5, you\'re up 40%.', lessons: ['Time in market beats timing the market', 'Staying invested through crashes is the hardest — and most rewarding — thing', 'Your continued contributions bought shares at discount prices'], scoreImpact: 18, tags: ['diamond-hands', 'patience'],
          },
          {
            id: 'mc-1-c', label: 'Buy the Dip — Invest More', description: 'Everything is on sale. Deploy your emergency fund into the market.', icon: '🛒', riskLevel: 'high',
            projection: { years: 5, netWorth: Math.round(portfolioValue * 1.8), savings: 0, debt: 0, investmentValue: Math.round(portfolioValue * 1.8), monthlyPassiveIncome: Math.round(portfolioValue * 0.006) },
            shortTermResult: 'Incredibly brave — or reckless? The market dropped another 10% before recovering. But your average cost was low, and returns were exceptional.', lessons: ['Buying during crashes = buying at discount', 'But using your emergency fund leaves you exposed', 'The best investors in history bought during panics — but they could afford to wait'], scoreImpact: 10, tags: ['buy-the-dip', 'aggressive'],
          },
          {
            id: 'mc-1-d', label: 'Rebalance — Shift to Bonds', description: 'Sell some stocks, move to bonds. Reduce volatility.', icon: '🔄', riskLevel: 'low',
            projection: { years: 5, netWorth: Math.round(portfolioValue * 1.15), savings: Math.round(portfolioValue * 0.2), debt: 0, investmentValue: Math.round(portfolioValue * 0.95), monthlyPassiveIncome: Math.round(portfolioValue * 0.003) },
            shortTermResult: 'Lower volatility, lower returns. You slept better but missed some of the recovery gains.', lessons: ['Rebalancing during crashes is strategic — not panicking', 'Bonds provide stability but at the cost of growth', 'Risk tolerance is real — there\'s no shame in reducing exposure you can\'t handle'], scoreImpact: 8, tags: ['rebalance', 'risk-management'],
          },
        ],
      },
      {
        id: 'mc-2', year: 1, month: 6, title: 'The Recovery Begins',
        context: 'Markets have rebounded 15% from the bottom. Your portfolio is recovering. But another crash could happen. Do you change your strategy?',
        options: [
          { id: 'mc-2-a', label: 'Stay the Course', description: 'Keep doing what you were doing.', icon: '🎯', riskLevel: 'low', projection: buildProjection(portfolioValue * 0.85, 0.09, 4), shortTermResult: 'Consistency wins. By year 3, you passed your pre-crash highs.', lessons: ['The hardest part of investing is doing nothing', 'Consistency compounds', 'Most returns come from a few best days — missing them is devastating'], scoreImpact: 15, tags: ['consistency'] },
          { id: 'mc-2-b', label: 'Increase Contributions', description: 'Boost monthly investing by 50%.', icon: '⚡', riskLevel: 'medium', projection: buildProjection(portfolioValue * 0.85, 0.09, 4, profile.monthlyIncome * 0.15), shortTermResult: 'Accelerated recovery. Tighter budget but portfolio growth was remarkable.', lessons: ['Dollar-cost averaging is most powerful after crashes', 'Increasing investments during recovery amplifies returns'], scoreImpact: 18, tags: ['dca', 'acceleration'] },
          { id: 'mc-2-c', label: 'Take Profits — Lock In Gains', description: 'Sell the recovery and move to cash.', icon: '💰', riskLevel: 'medium', projection: buildProjection(portfolioValue * 0.85, 0.04, 4), shortTermResult: 'You locked in a modest gain. But the market kept climbing without you.', lessons: ['Trying to time the market usually means missing the best days', 'Cash feels safe but inflation erodes it'], scoreImpact: -3, tags: ['market-timing'] },
        ],
      },
    ],
  }
}

function windfallScenario(profile: UserProfile, _twin: FinancialTwin): ScenarioData {
  const amount = varyAmount(10000, 0.15)
  return {
    id: 'windfall',
    title: 'THE WINDFALL',
    subtitle: `An unexpected $${amount.toLocaleString()} just landed in your account.`,
    description: 'Sudden money reveals your financial instincts. There are no wrong answers — but some answers are mathematically better than others.',
    backstory: `A relative passed away and left you $${amount.toLocaleString()}. It\'s sitting in your checking account right now. You have $${profile.currentDebt.toLocaleString()} in debt, $${profile.currentSavings.toLocaleString()} in savings, and your monthly income is $${profile.monthlyIncome.toLocaleString()}. This is a test of priorities.`,
    icon: '🎯',
    color: '#fbbf24',
    totalYears: 5,
    nodes: [
      {
        id: 'wf-1', year: 0, month: 0, title: 'The Allocation Decision',
        context: `$${amount.toLocaleString()} is yours. No strings attached. Your financial council is convening. What do you do?`,
        options: [
          { id: 'wf-1-a', label: 'Invest It All in Index Funds', description: `Lump sum $${amount.toLocaleString()} into VOO/VTI.`, icon: '📈', riskLevel: 'medium', projection: buildProjection(amount, 0.09, 5), shortTermResult: 'Historically, lump sum investing beats dollar-cost averaging 66% of the time.', lessons: ['Lump sum investing is statistically optimal', 'Time in market > timing the market', 'Index funds are the evidence-based gold standard'], scoreImpact: 14, tags: ['lump-sum', 'index-funds'] },
          { id: 'wf-1-b', label: 'Pay Off All Debt', description: `Wipe out your $${profile.currentDebt.toLocaleString()} debt instantly.`, icon: '💥', riskLevel: 'low', projection: buildProjection(amount - profile.currentDebt, 0.06, 5, profile.monthlyIncome * 0.1), shortTermResult: 'Debt-free. The relief is physical. Your monthly cash flow just increased significantly.', lessons: ['Debt payoff = guaranteed return equal to the interest rate', 'Psychological freedom from debt is powerful', 'Freed cash flow enables future investing'], scoreImpact: profile.currentDebt > 5000 ? 16 : 8, tags: ['debt-payoff'] },
          { id: 'wf-1-c', label: 'Split: Debt + Invest + Fun', description: '40% debt, 40% investing, 20% enjoy life.', icon: '🎨', riskLevel: 'low', projection: buildProjection(amount * 0.4, 0.08, 5, profile.monthlyIncome * 0.08), shortTermResult: 'A balanced approach. Reduced debt, started investing, AND enjoyed the moment. Sustainable and smart.', lessons: ['The "boring" balanced approach often wins', 'Allowing yourself to enjoy money prevents binge spending later', 'Partial progress in multiple areas compounds'], scoreImpact: 18, tags: ['balanced', 'holistic'] },
          { id: 'wf-1-d', label: 'Start a Side Business', description: `Invest $${amount.toLocaleString()} into launching a side hustle.`, icon: '🚀', riskLevel: 'high', projection: buildProjection(amount * 0.3, 0.15, 5, amount * 0.05), shortTermResult: '70% chance of modest success, 20% chance of failure, 10% chance of life-changing returns.', lessons: ['Entrepreneurship is the highest-variance financial decision', 'Most businesses fail — but the learning is invaluable', 'Asymmetric upside: you can only lose $10k but could gain much more'], scoreImpact: 5, tags: ['entrepreneurship', 'high-variance'] },
        ],
      },
      {
        id: 'wf-2', year: 2, month: 0, title: 'Two Years Later: Another Opportunity',
        context: 'Your windfall decision played out. Now a friend is starting a tech company and offering you a 5% equity stake for $5,000. Your portfolio is performing well.',
        options: [
          { id: 'wf-2-a', label: 'Invest in the Startup', description: '$5,000 for 5% equity in your friend\'s company.', icon: '🎲', riskLevel: 'high', projection: buildProjection(5000, 0.20, 3), shortTermResult: 'High risk, high reward. 80% of startups fail — but the 20% that succeed can return 10-100x.', lessons: ['Angel investing is high-risk, high-reward', 'Only invest what you can afford to lose completely', 'Diversification means not betting everything on one opportunity'], scoreImpact: 3, tags: ['angel-investing', 'startup'] },
          { id: 'wf-2-b', label: 'Stick with Index Funds', description: 'Add $5,000 to your proven index fund strategy.', icon: '📊', riskLevel: 'low', projection: buildProjection(5000, 0.09, 3), shortTermResult: 'Boring but effective. Your index fund continued its steady march upward.', lessons: ['Boring investing is usually the best investing', 'FOMO is not a financial strategy', 'Consistent contributions matter more than one-off bets'], scoreImpact: 12, tags: ['index-funds', 'consistency'] },
          { id: 'wf-2-c', label: 'Build Your Skills Instead', description: 'Spend $5,000 on certifications, courses, and career development.', icon: '📚', riskLevel: 'low', projection: buildProjection(0, 0.0, 3), shortTermResult: 'No direct financial return — but your next salary negotiation yielded a 20% raise.', lessons: ['Human capital is your biggest asset when young', 'Career growth often outpaces investment returns', 'Investing in yourself is the highest-ROI decision early in your career'], scoreImpact: 16, tags: ['human-capital', 'career'] },
        ],
      },
    ],
  }
}

function summerHustleScenario(_profile: UserProfile, _twin: FinancialTwin): ScenarioData {
  return {
    id: 'summer_hustle',
    title: 'THE SUMMER HUSTLE',
    subtitle: 'From your first summer job to your freshman dorm.',
    description: 'Navigate the crucial years between 16 and 19. Car payments, prom costs, student loans, and credit card traps. Build the foundation.',
    backstory: `You just finished a grueling 10-week summer job as a lifeguard, saving exactly $2,000. You are 16, heading into your Junior year of high school. The decisions you make over the next 4 years will dictate whether you graduate college ahead of the pack, or drowning in debt.`,
    icon: '🎒',
    color: '#06b6d4',
    totalYears: 4,
    nodes: [
      {
        id: 'sh-1', year: 0, month: 0, title: 'The $2k Allocation',
        context: 'You have $2,000 in your checking account. It\'s the most money you\'ve ever seen. What do you do with it?',
        conservatorAdvice: 'Save it in a High-Yield Savings Account. Prom, college applications, and emergencies are coming fast. Cash is king for a teenager.',
        growerAdvice: 'Open a Custodial Roth IRA and buy the S&P 500. $2k invested at age 16 can become $100k by retirement. Don\'t waste the magic of compound interest.',
        behavioristAdvice: 'The urge to buy a car or a gaming PC is strong. That\'s instant gratification. Be careful not to lock yourself into expensive habits (like gas and insurance) too early.',
        options: [
          { id: 'sh-1-a', label: 'Buy a Used Car', description: '$1,500 down payment, $500 saved for gas and insurance.', icon: '🚗', riskLevel: 'high', projection: buildProjection(0, 0, 4, -100), shortTermResult: 'You have freedom, but gas and insurance drain your monthly cash flow instantly.', lessons: ['Cars are depreciating liabilities', 'Maintenance and insurance often cost more than the car over time'], scoreImpact: 2, tags: ['liability', 'lifestyle-inflation'] },
          { id: 'sh-1-b', label: 'High-Yield Savings Account', description: 'Put the $2,000 in a 5% HYSA.', icon: '🏦', riskLevel: 'low', projection: buildProjection(2000, 0.05, 4), shortTermResult: 'Boring, but safe. You earn $100 in interest the first year and have cash ready for senior year.', lessons: ['Liquidity is important for near-term goals', 'HYSAs protect against inflation better than checking accounts'], scoreImpact: 10, tags: ['savings', 'liquidity'] },
          { id: 'sh-1-c', label: 'Custodial Roth IRA', description: 'Invest $2,000 into an S&P 500 Index Fund.', icon: '📈', riskLevel: 'medium', projection: buildProjection(2000, 0.09, 4), shortTermResult: 'The money is locked up, but your 10-year projection just skyrocketed due to starting at age 16.', lessons: ['Time in the market is your greatest asset', 'Tax-free growth in a Roth IRA is incredibly powerful'], scoreImpact: 16, tags: ['investing', 'compound-interest'] },
          { id: 'sh-1-d', label: 'YOLO (Gaming PC & Clothes)', description: 'Spend $2,000 on immediate upgrades.', icon: '🎮', riskLevel: 'high', projection: buildProjection(0, 0, 4), shortTermResult: 'You had a great weekend. Now you have $0 and your PC is already depreciating.', lessons: ['Instant gratification destroys wealth building', 'Consumer goods lose 50% of value instantly'], scoreImpact: 0, tags: ['consumption', 'zero-savings'] },
        ],
      },
      {
        id: 'sh-2', year: 1, month: 6, title: 'The Senior Expense',
        context: 'It\'s Senior Year spring. Prom and a class trip to Florida will cost $800 total. How are you paying?',
        options: [
          { id: 'sh-2-a', label: 'Put it on a Credit Card', description: 'Pay minimums at 24% APR.', icon: '💳', riskLevel: 'high', projection: buildProjection(-800, -0.24, 3), shortTermResult: 'You went, but the $800 trip is going to cost you $1,200 after interest.', lessons: ['Credit card interest is financial poison', 'Never finance lifestyle events'], scoreImpact: 0, tags: ['credit-card', 'debt'] },
          { id: 'sh-2-b', label: 'Pay Cash from Savings', description: 'Use your HYSA or summer job cash.', icon: '💵', riskLevel: 'low', projection: buildProjection(1200, 0.05, 3), shortTermResult: 'You paid in full, enjoyed the trip stress-free, and still have savings left over.', lessons: ['Cash reserves eliminate financial stress', 'Sinking funds for expected expenses work'], scoreImpact: 12, tags: ['savings', 'planning'] },
          { id: 'sh-2-c', label: 'Skip the Trip, Preserve Capital', description: 'Say no to the trip, keep your investments growing.', icon: '🛡️', riskLevel: 'low', projection: buildProjection(2000, 0.09, 3), shortTermResult: 'You missed out on memories, but mathematically your net worth is protected.', lessons: ['Opportunity cost works both ways (money vs memories)', 'Extreme frugality can lead to regret'], scoreImpact: 8, tags: ['frugality', 'opportunity-cost'] },
        ],
      },
      {
        id: 'sh-3', year: 2, month: 0, title: 'The College Crossroads',
        context: 'You got accepted! Now for the biggest financial decision of your life: Where do you go?',
        options: [
          { id: 'sh-3-a', label: 'Dream Out-of-State Uni', description: 'Take out $40k/year in student loans for the "experience".', icon: '🏛️', riskLevel: 'high', projection: buildProjection(-160000, -0.06, 10), shortTermResult: 'You had a fun freshman year, but you are now chained to a massive, non-bankruptable debt anchor.', lessons: ['Student loans cripple future cash flow', 'The "college experience" is rarely worth six-figure debt'], scoreImpact: 0, tags: ['student-loans', 'debt-trap'] },
          { id: 'sh-3-b', label: 'In-State Public Uni', description: 'Use a partial scholarship. Only $10k/year in loans.', icon: '🏫', riskLevel: 'medium', projection: buildProjection(-40000, -0.06, 10), shortTermResult: 'A balanced approach. You get a solid degree with manageable debt that a starting salary can cover.', lessons: ['ROI on state schools is often higher than private', 'Minimizing early debt accelerates wealth building post-grad'], scoreImpact: 14, tags: ['education-roi', 'balance'] },
          { id: 'sh-3-c', label: 'Community College First', description: '2 years at CC living at home, then transfer. $0 debt.', icon: '🏠', riskLevel: 'low', projection: buildProjection(0, 0, 10), shortTermResult: 'You missed the dorm experience, but you will graduate with exactly $0 in student loan debt.', lessons: ['Community college is the ultimate financial hack', 'Starting life at net-zero is better than starting at negative $50k'], scoreImpact: 18, tags: ['debt-free', 'optimization'] },
        ],
      },
      {
        id: 'sh-4', year: 3, month: 0, title: 'The Plastic Trap',
        context: 'Freshman fall. A bank is on campus giving away free pizza if you sign up for a credit card. What\'s your move?',
        options: [
          { id: 'sh-4-a', label: 'Sign up for the Rewards Card', description: 'Get a $2,000 limit and immediately buy a new MacBook.', icon: '🍕', riskLevel: 'high', projection: buildProjection(-2000, -0.24, 1), shortTermResult: 'You got the pizza and the laptop, but you are now carrying a balance at 24% interest.', lessons: ['Banks target students because they lack financial literacy', 'Never carry a balance on a credit card'], scoreImpact: 0, tags: ['credit-card', 'revolving-debt'] },
          { id: 'sh-4-b', label: 'Secured Student Card', description: 'Get a $500 limit card, use it only for gas, and set to autopay.', icon: '💳', riskLevel: 'low', projection: buildProjection(0, 0, 1), shortTermResult: 'You got the pizza, paid no interest, and your credit score is already 720 by sophomore year.', lessons: ['Credit cards are tools, not free money', 'Building credit early saves thousands on future mortgages'], scoreImpact: 18, tags: ['credit-building', 'automation'] },
          { id: 'sh-4-c', label: 'Refuse the Card', description: 'Rip up the application. Debit cards only.', icon: '🛑', riskLevel: 'low', projection: buildProjection(0, 0, 1), shortTermResult: 'You avoided debt, but you also aren\'t building a credit history.', lessons: ['Avoiding credit completely makes renting apartments and buying cars harder later', 'Credit scores are a necessary game'], scoreImpact: 8, tags: ['debt-avoidance', 'no-credit'] },
        ],
      },
    ],
  }
}

export function getScenario(id: string, profile: UserProfile, twin: FinancialTwin): ScenarioData {
  switch (id) {
    case 'summer_hustle': return summerHustleScenario(profile, twin)
    case 'market_crash': return marketCrashScenario(profile, twin)
    case 'windfall': return windfallScenario(profile, twin)
    case 'first_paycheck':
    default: return firstPaycheckScenario(profile, twin)
  }
}
