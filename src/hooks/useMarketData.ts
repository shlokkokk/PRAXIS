import { useState, useEffect } from 'react'

const AV_KEY = 'IFA9SY7DHQTY0LMN'
const CACHE_KEY = 'praxis-market-cache'
const CACHE_MS = 5 * 60 * 1000 // 5 minutes

export interface MarketQuote {
  symbol: string
  label: string
  price: number
  change: number
  changePercent: number
}

export interface MarketData {
  sp500: MarketQuote | null
  btc: MarketQuote | null
  fedRate: number | null
  inflation: number | null
  lastUpdated: number | null
  isLive: boolean
}

async function fetchQuote(symbol: string, label: string): Promise<MarketQuote | null> {
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${AV_KEY}`
    )
    const json = await res.json()
    const q = json['Global Quote']
    if (!q || !q['05. price']) return null
    return {
      symbol,
      label,
      price: parseFloat(q['05. price']),
      change: parseFloat(q['09. change']),
      changePercent: parseFloat(q['10. change percent']?.replace('%', '') || '0'),
    }
  } catch {
    return null
  }
}

async function fetchMacroData(): Promise<{ fedRate: number | null; inflation: number | null }> {
  try {
    const res = await fetch('http://localhost:8000/api/market-data')
    if (!res.ok) return { fedRate: null, inflation: null }
    return await res.json()
  } catch {
    return { fedRate: null, inflation: null }
  }
}

export function useMarketData() {
  const [data, setData] = useState<MarketData>({
    sp500: null, btc: null, fedRate: null, inflation: null, lastUpdated: null, isLive: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed: MarketData = JSON.parse(cached)
        if (parsed.lastUpdated && Date.now() - parsed.lastUpdated < CACHE_MS) {
          setData(parsed)
          setLoading(false)
          return
        }
      }
    } catch { /* ignore */ }

    async function load() {
      setLoading(true)
      try {
        const [sp500, btc, macro] = await Promise.all([
          fetchQuote('SPY', 'S&P 500'),
          fetchQuote('BTC-USD', 'Bitcoin'),
          fetchMacroData(),
        ])

        const newData: MarketData = {
          sp500,
          btc,
          fedRate: macro.fedRate,
          inflation: macro.inflation,
          lastUpdated: Date.now(),
          isLive: !!(sp500 || btc),
        }

        setData(newData)
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(newData)) } catch { /* ignore */ }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { data, loading }
}
