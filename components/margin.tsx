'use client'
import React, { useEffect, useState } from 'react'
import { DriftClient, MarginCategory } from '@drift-labs/sdk'
import { Connection, PublicKey } from '@solana/web3.js'

type MarketOverview = {
  market: string
  imfFactor: number
  initialLeverage: number
  initialLeverageWithSize: number
  maintenanceLeverage: number
  maintenanceLeverageWithSize: number
}

export default function IMFOverviewTable() {
  const [rows, setRows] = useState<MarketOverview[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const connection = new Connection('https://api.mainnet-beta.solana.com')
      const dummyWallet = { publicKey: new PublicKey('11111111111111111111111111111111') } as any

      const driftClient = await DriftClient.from(connection, dummyWallet)
      const state = await driftClient.getStateAccount()
      const results: MarketOverview[] = []

      const notionalSize = 100_000

      for (let i = 0; i < state.numberOfMarkets; i++) {
        const market = await driftClient.getPerpMarketAccount(i)
        const name = Buffer.from(market.name).toString('utf-8').replace(/\0/g, '')

        const price = Number(market.amm.historicalOracleData.lastOraclePrice.toString()) / 1e6
        const imf = market.imfFactor / 1e6

        const positionSize = (notionalSize * 1e6) / price

        const initial = driftClient.getMarketMarginRatio(MarginCategory.INITIAL, i, 0)
        const initialWithSize = driftClient.getMarketMarginRatio(MarginCategory.INITIAL, i, positionSize)
        const maint = driftClient.getMarketMarginRatio(MarginCategory.MAINTENANCE, i, 0)
        const maintWithSize = driftClient.getMarketMarginRatio(MarginCategory.MAINTENANCE, i, positionSize)

        results.push({
          market: name,
          imfFactor: imf,
          initialLeverage: +(1 / (initial / 1e4)).toFixed(2),
          initialLeverageWithSize: +(1 / (initialWithSize / 1e4)).toFixed(2),
          maintenanceLeverage: +(1 / (maint / 1e4)).toFixed(2),
          maintenanceLeverageWithSize: +(1 / (maintWithSize / 1e4)).toFixed(2),
        })
      }

      setRows(results)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2>IMF Market Overview</h2>
      <p>Calculated for a $100,000 notional position</p>
      <table>
        <thead>
          <tr>
            <th>Market</th>
            <th>IMF Factor</th>
            <th>Init Lev</th>
            <th>Init Lev (w/size)</th>
            <th>Maint Lev</th>
            <th>Maint Lev (w/size)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.market}</td>
              <td>{row.imfFactor.toFixed(6)}</td>
              <td>{row.initialLeverage}x</td>
              <td>{row.initialLeverageWithSize}x</td>
              <td>{row.maintenanceLeverage}x</td>
              <td>{row.maintenanceLeverageWithSize}x</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
