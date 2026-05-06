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
    
    // Alpha Vantage returns 'Information' or 'Note' when rate limited
    if (json.Information || json.Note) {
      console.warn('Alpha Vantage Rate Limit Hit:', json.Information || json.Note)
      return null
    }

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

async function fetchCrypto(id: string, symbol: string, label: string): Promise<MarketQuote | null> {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`)
    const json = await res.json()
    const data = json[id]
    if (!data || !data.usd) return null
    
    return {
      symbol,
      label,
      price: data.usd,
      change: data.usd * (data.usd_24h_change / 100),
      changePercent: data.usd_24h_change
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
      // 1. Fetch Crypto and Macro Data (No strict rate limits)
      const [btc, eth, macro] = await Promise.all([
        fetchCrypto('bitcoin', 'BTC-USD', 'Bitcoin'),
        fetchCrypto('ethereum', 'ETH-USD', 'Ethereum'),
        fetchMacroData(),
      ])

      // 2. Fetch Stocks sequentially with 1.2s delay to respect Alpha Vantage's 1 req/sec limit
      const sp500 = await fetchQuote('SPY', 'S&P 500')
      await new Promise(r => setTimeout(r, 1200)) 
      const gold = await fetchQuote('GLD', 'Gold')

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
