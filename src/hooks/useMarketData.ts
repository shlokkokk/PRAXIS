import { useState, useEffect, useCallback } from 'react'
import { API_URL } from '../config'
const AV_KEY = 'IFA9SY7DHQTY0LMN'
const CACHE_KEY = 'praxis-market-cache'
const CACHE_MS = 10 * 60 * 1000 // 10 minutes

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
  eth: MarketQuote | null
  gold: MarketQuote | null
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
    const res = await fetch(`${API_URL}/api/market-data`)
    if (!res.ok) return { fedRate: null, inflation: null }
    return await res.json()
  } catch {
    return { fedRate: null, inflation: null }
  }
}

export function useMarketData() {
  const [data, setData] = useState<MarketData>({
    sp500: null, btc: null, eth: null, gold: null, fedRate: null, inflation: null, lastUpdated: null, isLive: false
  })
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const load = useCallback(async (force = false) => {
    if (isRefreshing) return

    if (!force) {
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
    }

    setIsRefreshing(true)
    if (force) setLoading(true)

    try {
      const [sp500, btc, eth, gold, macro] = await Promise.all([
        fetchQuote('SPY', 'S&P 500'),
        fetchQuote('BTC-USD', 'Bitcoin'),
        fetchQuote('ETH-USD', 'Ethereum'),
        fetchQuote('GLD', 'Gold'),
        fetchMacroData(),
      ])

      setData(prev => {
        const newData: MarketData = {
          sp500: sp500 || prev.sp500,
          btc: btc || prev.btc,
          eth: eth || prev.eth,
          gold: gold || prev.gold,
          fedRate: macro.fedRate || prev.fedRate,
          inflation: macro.inflation || prev.inflation,
          lastUpdated: Date.now(),
          isLive: !!(sp500 || btc || eth || gold || prev.sp500 || prev.btc || prev.eth || prev.gold),
        }
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(newData)) } catch { /* ignore */ }
        return newData
      })
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [isRefreshing])

  useEffect(() => {
    load()
  }, [])

  const refresh = useCallback(() => {
    const timeSinceLast = data.lastUpdated ? Date.now() - data.lastUpdated : Infinity
    if (timeSinceLast < 60000) {
      return false
    }
    load(true)
    return true
  }, [data.lastUpdated, load])

  return { data, loading, refresh, isRefreshing }
}
