export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: 'Investing' | 'Debt' | 'Basics' | 'Taxes' | 'Advanced'
}

const terms: GlossaryTerm[] = [
  {
    id: '401k',
    term: '401(k) / 403(b)',
    definition: 'An employer-sponsored retirement savings plan. Money is deducted from your paycheck before taxes, lowering your taxable income. Many employers offer a "match" (free money) up to a certain percentage.',
    category: 'Investing'
  },
  {
    id: 'apr',
    term: 'APR (Annual Percentage Rate)',
    definition: 'The true cost of borrowing money per year, including interest and any fees. Credit cards often have high APRs (20%+), meaning carrying a balance is very expensive.',
    category: 'Debt'
  },
  {
    id: 'asset',
    term: 'Asset',
    definition: 'Something you own that has value and puts money IN your pocket. Examples: Cash, stocks, real estate, businesses.',
    category: 'Basics'
  },
  {
    id: 'bear-market',
    term: 'Bear Market',
    definition: 'A period when investment prices fall significantly (usually 20% or more from recent highs) and pessimism is high. It\'s often a great time to buy if you have a long time horizon.',
    category: 'Advanced'
  },
  {
    id: 'bull-market',
    term: 'Bull Market',
    definition: 'A period when investment prices are rising or are expected to rise. Driven by economic strength and optimism.',
    category: 'Advanced'
  },
  {
    id: 'compound-interest',
    term: 'Compound Interest',
    definition: 'The "eighth wonder of the world." Earning interest on your interest. It makes your money grow exponentially over long periods of time.',
    category: 'Investing'
  },
  {
    id: 'credit-score',
    term: 'Credit Score',
    definition: 'A 3-digit number (usually 300-850) representing your reliability to pay back debt. A higher score unlocks better interest rates on mortgages and car loans.',
    category: 'Debt'
  },
  {
    id: 'dca',
    term: 'Dollar-Cost Averaging (DCA)',
    definition: 'Investing a fixed amount of money at regular intervals (like $100 every month), regardless of what the stock market is doing. This removes the emotion from investing.',
    category: 'Investing'
  },
  {
    id: 'depreciation',
    term: 'Depreciation',
    definition: 'The decrease in value of an asset over time. Cars are classic depreciating assets—they lose value the moment you drive them off the lot.',
    category: 'Basics'
  },
  {
    id: 'emergency-fund',
    term: 'Emergency Fund',
    definition: 'Cash saved specifically for unexpected expenses (medical bills, car repairs, job loss). Experts recommend keeping 3 to 6 months of living expenses in a highly liquid account.',
    category: 'Basics'
  },
  {
    id: 'hysa',
    term: 'High-Yield Savings Account (HYSA)',
    definition: 'A savings account that pays a significantly higher interest rate than a traditional bank (often 4-5% vs 0.01%). Perfect for storing an emergency fund.',
    category: 'Basics'
  },
  {
    id: 'index-fund',
    term: 'Index Fund',
    definition: 'A type of mutual fund or ETF designed to track the performance of a specific market index (like the S&P 500). They offer instant diversification and low fees.',
    category: 'Investing'
  },
  {
    id: 'inflation',
    term: 'Inflation',
    definition: 'The rate at which the general level of prices for goods and services rises, eroding purchasing power. If inflation is 3%, your money buys 3% less next year.',
    category: 'Basics'
  },
  {
    id: 'liability',
    term: 'Liability',
    definition: 'Something you owe that takes money OUT of your pocket. Examples: Credit card debt, car loans, mortgages.',
    category: 'Debt'
  },
  {
    id: 'liquidity',
    term: 'Liquidity',
    definition: 'How quickly and easily an asset can be converted into cash without losing value. Cash in a checking account is highly liquid; a house is illiquid.',
    category: 'Basics'
  },
  {
    id: 'net-worth',
    term: 'Net Worth',
    definition: 'The fundamental measure of financial health. Calculated by taking everything you own (Assets) and subtracting everything you owe (Liabilities).',
    category: 'Basics'
  },
  {
    id: 'roth-ira',
    term: 'Roth IRA',
    definition: 'An individual retirement account where you contribute after-tax money. The massive benefit: all future growth and withdrawals in retirement are 100% tax-free.',
    category: 'Taxes'
  },
  {
    id: 'sp500',
    term: 'S&P 500',
    definition: 'An index tracking the stock performance of the 500 largest publicly traded companies in the U.S. It is widely considered the best gauge of large-cap U.S. equities.',
    category: 'Investing'
  },
  {
    id: 'yield',
    term: 'Yield',
    definition: 'The income returned on an investment, usually expressed as an annual percentage rate. For example, a stock that pays a dividend has a dividend yield.',
    category: 'Advanced'
  }
];

export const GLOSSARY_TERMS = [...terms].sort((a, b) => a.term.localeCompare(b.term));
