'use client'

import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import {
  KARAT_LABEL,
  gramsToMg,
  dwtToMg,
  oztToMg,
  lotMeltValueCents,
  indicativeRangeCents,
  spotPerGramCents,
  type Karat,
} from '@/lib/gold'
import { formatUsd, parseDollarsToCents } from '@/lib/money'
import type { SpotPrice } from '@/lib/spot'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * The gold valuation calculator.
 *
 * This is the highest-intent element on the site and the input to every bid, so the arithmetic
 * is not done here — it is delegated wholesale to src/lib/gold.ts, which is unit-tested to the
 * cent. This component only collects input and formats output.
 *
 * WHAT IT PROMISES, AND WHAT IT DOES NOT. Melt value is a calculation and is presented as fact.
 * The payout range is an ADJUSTABLE ASSUMPTION the user controls, presented as an estimate,
 * because what a buyer actually pays is theirs to set and moves with spot. The site must never
 * publish a payout-rate promise of its own.
 */

type Unit = 'g' | 'dwt' | 'ozt'
type Row = { id: number; karat: Karat; weight: string; unit: Unit }

const KARATS: Karat[] = ['K10', 'K14', 'K18', 'K22', 'K24']
const UNITS: Array<{ value: Unit; label: string }> = [
  { value: 'g', label: 'grams' },
  { value: 'dwt', label: 'pennyweight' },
  { value: 'ozt', label: 'troy oz' },
]

/** 100 kg. Far beyond any realistic consumer lot, and it keeps the integer maths in safe range. */
const MAX_WEIGHT_MG = 100_000_000

function toMilligrams(weight: number, unit: Unit): number {
  if (unit === 'g') return gramsToMg(weight)
  if (unit === 'dwt') return dwtToMg(weight)
  return oztToMg(weight)
}

export default function GoldCalculator({ spot }: { spot: SpotPrice }) {
  const livePriceCents =
    spot.status === 'live' || spot.status === 'stale' ? spot.pricePerOztCents : null

  const [rows, setRows] = useState<Row[]>([{ id: 1, karat: 'K14', weight: '', unit: 'g' }])
  const [nextId, setNextId] = useState(2)

  // Only used when there is no feed. Keeping it separate from livePriceCents means a manually
  // typed price can never be mistaken for, or persisted as, a live quote.
  const [manualPrice, setManualPrice] = useState('')
  const [minPct, setMinPct] = useState('60')
  const [maxPct, setMaxPct] = useState('90')

  const manualPriceCents = useMemo(() => {
    if (livePriceCents !== null || manualPrice.trim() === '') return null
    try {
      const cents = parseDollarsToCents(manualPrice)
      return cents > 0 ? cents : null
    } catch {
      return null
    }
  }, [manualPrice, livePriceCents])

  const spotCents = livePriceCents ?? manualPriceCents

  const result = useMemo(() => {
    if (spotCents === null) return null

    const items: Array<{ weightMg: number; karatClaimed: Karat }> = []
    for (const row of rows) {
      const weight = Number.parseFloat(row.weight)
      if (!Number.isFinite(weight) || weight <= 0) continue
      const weightMg = toMilligrams(weight, row.unit)
      if (weightMg <= 0 || weightMg > MAX_WEIGHT_MG) continue
      items.push({ weightMg, karatClaimed: row.karat })
    }
    if (items.length === 0) return null

    try {
      const meltCents = lotMeltValueCents(items, spotCents)

      const min = Math.round(Number.parseFloat(minPct) * 100)
      const max = Math.round(Number.parseFloat(maxPct) * 100)
      const rangeValid =
        Number.isFinite(min) && Number.isFinite(max) && min >= 0 && max >= min && max <= 10_000

      return {
        meltCents,
        totalMg: items.reduce((sum, i) => sum + i.weightMg, 0),
        range: rangeValid ? indicativeRangeCents(meltCents, min, max) : null,
      }
    } catch {
      // The library throws rather than returning a wrong number. Show nothing instead.
      return null
    }
  }, [rows, spotCents, minPct, maxPct])

  const addRow = () => {
    setRows((prev) => [...prev, { id: nextId, karat: 'K14', weight: '', unit: 'g' }])
    setNextId((n) => n + 1)
  }

  const updateRow = (id: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const removeRow = (id: number) =>
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((r) => r.id !== id)))

  const selectClass =
    'min-h-11 w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-sm text-ink dark:border-line-strong-dark dark:bg-surface-muted-dark dark:text-ink-dark'

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      {/* ------------------------------------------------------------ inputs */}
      <div className="rounded-card border border-line bg-surface p-6 sm:p-8 dark:border-line-dark dark:bg-surface-muted-dark">
        <h2 className="font-display text-xl font-semibold text-ink dark:text-ink-dark">
          What do you have?
        </h2>
        <p className="mt-2 text-sm text-ink-muted dark:text-ink-muted-dark">
          Add each piece separately if the karat differs. Check the hallmark — it is usually
          stamped 10K, 14K, 585, 750 and so on.
        </p>

        {livePriceCents === null ? (
          <div className="mt-6 rounded-control border border-warning-700/30 bg-warning-50 p-4">
            <label
              htmlFor="manual-spot"
              className="block text-sm font-semibold text-warning-800"
            >
              Enter today&rsquo;s gold price (USD per troy ounce)
            </label>
            <p className="mt-1 text-xs text-warning-800">
              Our live feed is not connected, so we cannot fill this in for you. Look up the
              current spot price and enter it — we will not guess on your behalf.
            </p>
            <input
              id="manual-spot"
              inputMode="decimal"
              value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value)}
              placeholder="4500.00"
              className="tnum mt-3 min-h-11 w-full rounded-control border border-warning-700/40 bg-surface px-3 py-2 text-sm text-ink"
            />
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="grid grid-cols-1 gap-3 rounded-control border border-line p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end dark:border-line-dark"
            >
              <div>
                <label
                  htmlFor={`karat-${row.id}`}
                  className="block text-xs font-semibold text-ink dark:text-ink-dark"
                >
                  Karat
                </label>
                <select
                  id={`karat-${row.id}`}
                  value={row.karat}
                  onChange={(e) => updateRow(row.id, { karat: e.target.value as Karat })}
                  className={cn(selectClass, 'mt-1.5')}
                >
                  {KARATS.map((k) => (
                    <option key={k} value={k}>
                      {KARAT_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`weight-${row.id}`}
                  className="block text-xs font-semibold text-ink dark:text-ink-dark"
                >
                  Weight
                </label>
                <input
                  id={`weight-${row.id}`}
                  inputMode="decimal"
                  value={row.weight}
                  onChange={(e) => updateRow(row.id, { weight: e.target.value })}
                  placeholder="0.00"
                  className={cn(selectClass, 'tnum mt-1.5')}
                />
              </div>

              <div>
                <label
                  htmlFor={`unit-${row.id}`}
                  className="block text-xs font-semibold text-ink dark:text-ink-dark"
                >
                  Unit
                </label>
                <select
                  id={`unit-${row.id}`}
                  value={row.unit}
                  onChange={(e) => updateRow(row.id, { unit: e.target.value as Unit })}
                  className={cn(selectClass, 'mt-1.5')}
                >
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-surface-muted hover:text-danger-700 disabled:opacity-30 dark:text-ink-muted-dark dark:hover:bg-surface-dark"
              >
                <span className="sr-only">Remove item {index + 1}</span>
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addRow} className="mt-4">
          <Plus className="h-4 w-4" aria-hidden />
          Add another item
        </Button>

        <fieldset className="mt-8 border-t border-line pt-6 dark:border-line-dark">
          <legend className="text-sm font-semibold text-ink dark:text-ink-dark">
            Offer assumption
          </legend>
          <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">
            Buyers pay a percentage of melt value, and each sets their own. Adjust these to model
            an offer you have been quoted — these are your figures, not ours.
          </p>
          <div className="mt-3 flex items-end gap-3">
            <div className="w-28">
              <label
                htmlFor="min-pct"
                className="block text-xs font-semibold text-ink dark:text-ink-dark"
              >
                Low %
              </label>
              <input
                id="min-pct"
                inputMode="decimal"
                value={minPct}
                onChange={(e) => setMinPct(e.target.value)}
                className={cn(selectClass, 'tnum mt-1.5')}
              />
            </div>
            <div className="w-28">
              <label
                htmlFor="max-pct"
                className="block text-xs font-semibold text-ink dark:text-ink-dark"
              >
                High %
              </label>
              <input
                id="max-pct"
                inputMode="decimal"
                value={maxPct}
                onChange={(e) => setMaxPct(e.target.value)}
                className={cn(selectClass, 'tnum mt-1.5')}
              />
            </div>
          </div>
        </fieldset>
      </div>

      {/* ------------------------------------------------------------ results */}
      <div className="lg:sticky lg:top-24">
        <div className="rounded-card border border-line bg-surface-muted p-6 sm:p-8 dark:border-line-dark dark:bg-surface-muted-dark">
          <h2 className="font-display text-xl font-semibold text-ink dark:text-ink-dark">
            Melt value
          </h2>

          {result === null ? (
            <p className="mt-6 text-sm text-ink-muted dark:text-ink-muted-dark">
              {spotCents === null
                ? 'Enter the current gold price above to calculate.'
                : 'Enter a karat and weight to calculate.'}
            </p>
          ) : (
            <>
              <p className="tnum mt-5 font-display text-5xl font-semibold text-ink dark:text-ink-dark">
                {formatUsd(result.meltCents)}
              </p>
              <p className="mt-2 text-sm text-ink-muted dark:text-ink-muted-dark">
                Gold content of {(result.totalMg / 1000).toFixed(2)} g at{' '}
                <span className="tnum">{formatUsd(spotCents!)}</span> per troy ounce (
                <span className="tnum">{formatUsd(spotPerGramCents(spotCents!))}</span>/g).
              </p>

              {result.range ? (
                <div className="mt-6 rounded-control border border-line bg-surface p-4 dark:border-line-dark dark:bg-surface-dark">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-800">
                    At your assumed {minPct}&ndash;{maxPct}%
                  </p>
                  <p className="tnum mt-1.5 font-display text-2xl font-semibold text-ink dark:text-ink-dark">
                    {formatUsd(result.range.lowCents)} &ndash; {formatUsd(result.range.highCents)}
                  </p>
                </div>
              ) : null}
            </>
          )}

          {/*
            Not fine print. A hallmark carries legal tolerance and plated items are routinely
            mis-stamped, so presenting this figure as an offer would be a consumer-protection
            problem. It sits inside the result card, at readable size, on purpose.
          */}
          <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-ink-subtle dark:border-line-dark dark:text-ink-muted-dark">
            <strong className="font-semibold">This is an estimate.</strong> It is calculated from
            the karat you selected, which comes from the hallmark. A hallmark is not an assay —
            real purity is confirmed by physical testing, and plated or filled items contain far
            less gold than their stamp suggests. Any offer you receive is subject to that
            inspection.
          </p>
        </div>
      </div>
    </div>
  )
}
