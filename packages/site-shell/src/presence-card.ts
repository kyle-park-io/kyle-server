/*
  The panel behind the masthead's "N online".

  Plain DOM rather than a framework component, because it mounts inside a
  SolidJS masthead on the home page and inside a static Astro one on the
  blog. Both call render() with the same data and get the same panel.

  See presence.ts for the socket and the data.
*/

import {
  elapsedLabel,
  flagOf,
  regionName,
  type Presence,
  type PresenceBucket,
} from './presence';

const NS = 'presence';

function el(tag: string, className: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function section(label: string): HTMLElement {
  const wrap = el('div', `${NS}__section`);
  wrap.appendChild(el('p', `${NS}__label`, label));
  return wrap;
}

/**
 * One row of a breakdown. The tinted fill behind the row is the bar: it is
 * sized to the row's share of the largest bucket, so the shape of the list
 * carries the distribution without a separate chart element to align.
 */
function breakdownRow(
  leading: string,
  name: string,
  count: number,
  max: number,
): HTMLElement {
  const row = el('div', `${NS}__row`);
  const share = max > 0 ? Math.round((count / max) * 100) : 0;
  row.style.setProperty('--presence-share', `${share}%`);

  if (leading !== '') {
    row.appendChild(el('span', `${NS}__flag`, leading));
  }
  const label = el('span', `${NS}__row-name`, name);
  label.title = name;
  row.appendChild(label);
  row.appendChild(el('span', `${NS}__row-count`, String(count)));
  return row;
}

function breakdown(
  label: string,
  buckets: PresenceBucket[],
  leading: (key: string) => string,
  naming: (key: string) => string,
  limit = 4,
): HTMLElement | null {
  if (buckets.length === 0) return null;

  const wrap = section(label);
  const max = buckets[0]?.n ?? 0;
  for (const bucket of buckets.slice(0, limit)) {
    wrap.appendChild(
      breakdownRow(leading(bucket.key), naming(bucket.key), bucket.n, max),
    );
  }

  // Everything past the cut, as one line, so the panel's height stays put
  // however many countries are represented.
  const rest = buckets.slice(limit);
  if (rest.length > 0) {
    const others = rest.reduce((sum, bucket) => sum + bucket.n, 0);
    wrap.appendChild(
      el('p', `${NS}__more`, `+${rest.length} more · ${others}`),
    );
  }
  return wrap;
}

/** Replaces the contents of `root` with the panel for `presence`. */
export function renderPresenceCard(
  root: HTMLElement,
  presence: Presence,
): void {
  root.textContent = '';
  root.className = `${NS}__card`;

  const you = presence.you;
  if (you) {
    const wrap = section('You');

    const where = el('p', `${NS}__you-where`);
    const flag = flagOf(you.country);
    if (flag !== '') where.appendChild(el('span', `${NS}__flag`, flag));
    where.appendChild(
      document.createTextNode(regionName(you.country) || 'Somewhere'),
    );
    wrap.appendChild(where);

    const client = [you.browser, you.os].filter(Boolean).join(' on ');
    if (client !== '') wrap.appendChild(el('p', `${NS}__you-client`, client));

    const facts = [you.ip, `${elapsedLabel(you.since)} here`].filter(Boolean);
    wrap.appendChild(el('p', `${NS}__you-meta`, facts.join(' · ')));

    root.appendChild(wrap);
  }

  const where = breakdown(
    'Where',
    presence.countries,
    flagOf,
    (code) => regionName(code) || code,
  );
  if (where) root.appendChild(where);

  const reading = breakdown(
    'Reading',
    presence.pages,
    () => '',
    (path) => path,
  );
  if (reading) root.appendChild(reading);

  // With no breakdowns and no "you" there is nothing to show but the number
  // already in the masthead, which happens against an older counter server.
  if (root.childElementCount === 0) {
    const wrap = section('Online');
    wrap.appendChild(
      el(
        'p',
        `${NS}__you-meta`,
        presence.count === 1
          ? 'Just you, right now.'
          : `${presence.count} people reading.`,
      ),
    );
    root.appendChild(wrap);
  }
}
