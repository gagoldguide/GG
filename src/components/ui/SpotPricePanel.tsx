import { formatUsd } from '@/lib/money'
import { spotPerGramCents } from '@/lib/gold'
import type { SpotPrice } from '@/lib/spot'
import { hasPrice } from '@/lib/spot'

/**
 * Renders the spot price — or, deliberately, renders the absence of one.
 *
 * There is no fallback number anywhere in this component. If the feed is unconfigured or down,
 * it says so. A plausible-looking wrong gold price would silently poison every valuation on the
 * site and every bid anchored to one.
 */
export default function SpotPricePanel({ spot }: { spot: SpotPrice }) {
  return (
    <div className="rounded-card border border-line bg-surface-muted p-6 sm:p-8 dark:border-line-dark dark:bg-surface-muted-dark">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
          Gold spot price
        </h2>
        <span className="text-xs font-medium text-ink-subtle dark:text-ink-muted-dark">
          XAU / USD
        </span>
      </div>

      {hasPrice(spot) ? (
        <>
          <p className="tnum mt-6 font-display text-4xl font-semibold text-ink dark:text-ink-dark">
            {formatUsd(spot.pricePerOztCents)}
            <span className="ml-2 align-middle text-base font-normal text-ink-muted dark:text-ink-muted-dark">
              / troy oz
            </span>
          </p>
          <p className="tnum mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">
            {formatUsd(spotPerGramCents(spot.pricePerOztCents))} per gram
          </p>

          {spot.status === 'stale' ? (
            <p className="mt-3 rounded-control bg-warning-50 px-3 py-2 text-xs text-warning-800">
              Live feed unreachable — showing the last confirmed price from{' '}
              <time dateTime={spot.fetchedAt.toISOString()}>
                {spot.fetchedAt.toUTCString()}
              </time>
              .
            </p>
          ) : (
            <p className="mt-3 text-xs text-ink-subtle dark:text-ink-muted-dark">
              Updated{' '}
              <time dateTime={spot.fetchedAt.toISOString()}>{spot.fetchedAt.toUTCString()}</time>{' '}
              · {spot.source}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="tnum mt-6 font-display text-4xl font-semibold text-ink-subtle dark:text-ink-muted-dark">
            &mdash;&mdash;
          </p>
          <p className="mt-2 text-sm text-ink-muted dark:text-ink-muted-dark">
            {spot.status === 'unconfigured'
              ? 'Live pricing is not connected yet. Set GOLD_API_KEY to enable it.'
              : 'The price feed is temporarily unavailable. Rather than show an estimate, we show nothing.'}
          </p>
        </>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm dark:border-line-dark">
        {[
          ['10K', '41.7% gold'],
          ['14K', '58.3% gold'],
          ['18K', '75.0% gold'],
          ['24K', '99.9% fine'],
        ].map(([karat, purity]) => (
          <div key={karat}>
            <dt className="font-semibold text-ink dark:text-ink-dark">{karat}</dt>
            <dd className="tnum text-ink-muted dark:text-ink-muted-dark">{purity}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
