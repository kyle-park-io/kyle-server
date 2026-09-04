/*
  Live presence: how many people are reading the site right now, where they
  are, what they are reading, and who you are.

  One implementation, mounted twice. The SolidJS home page and the Astro blog
  both show this in their masthead, and everything else those two share has
  drifted at least once - so the markup, the styling and the socket handling
  all live here rather than being written twice.

  The socket is served by the Go proxy at /ws
  (ingress-reverse-proxy/redis/wstotcp.go).
*/

export interface PresenceBucket {
  key: string;
  n: number;
}

/** The reader's own details. Only ever sent to that reader. */
export interface PresenceYou {
  country?: string;
  browser?: string;
  os?: string;
  ip?: string;
  /** Unix seconds when this connection opened. */
  since: number;
}

export interface Presence {
  count: number;
  countries: PresenceBucket[];
  pages: PresenceBucket[];
  you?: PresenceYou;
}

/**
 * Reads a message from the socket.
 *
 * A bare number is the old protocol, which sent nothing but a count. The
 * proxy and this page deploy as separate images, so for the length of a
 * rollout one of them is always the old one, and a count on its own beats a
 * masthead stuck at zero.
 */
export function parsePresence(raw: string): Presence | null {
  const text = raw.trim();
  if (text === '') return null;

  if (text[0] === '{') {
    try {
      const parsed = JSON.parse(text) as Partial<Presence>;
      if (typeof parsed.count !== 'number') return null;
      return {
        count: parsed.count,
        countries: parsed.countries ?? [],
        pages: parsed.pages ?? [],
        you: parsed.you,
      };
    } catch {
      return null;
    }
  }

  const count = Number.parseInt(text, 10);
  if (Number.isNaN(count)) return null;
  return { count, countries: [], pages: [] };
}

/** The flag for a two-letter region code, built from regional indicators. */
export function flagOf(code: string | undefined): string {
  if (!code || code.length !== 2 || !/^[A-Za-z]{2}$/.test(code)) return '';
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    0x1f1e6 + upper.charCodeAt(0) - 65,
    0x1f1e6 + upper.charCodeAt(1) - 65,
  );
}

/** The reader's own language's name for a region, falling back to the code. */
export function regionName(code: string | undefined): string {
  if (!code) return '';
  try {
    const names = new Intl.DisplayNames(undefined, { type: 'region' });
    return names.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

/** "3m", "2h" - how long this reader has been connected. */
export function elapsedLabel(
  sinceUnixSeconds: number,
  now = Date.now(),
): string {
  const seconds = Math.max(0, Math.floor(now / 1000 - sinceUnixSeconds));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

/* --- socket ------------------------------------------------------------- */

export interface PresenceOptions {
  /** Origin of the socket, e.g. `wss://jungho.dev`. */
  origin: string;
  /** The page being read, sent so the "reading" breakdown can be built. */
  path: string;
  onUpdate: (presence: Presence) => void;
}

/**
 * Opens the presence socket and keeps it open.
 *
 * Reconnects with a backoff that stops growing at half a minute: the socket
 * is decoration, and a masthead counter is not worth hammering a proxy that
 * is down. Returns a function that closes it for good.
 */
export function connectPresence(options: PresenceOptions): () => void {
  let socket: WebSocket | null = null;
  let retryDelay = 1000;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let closed = false;

  const open = (): void => {
    if (closed) return;
    const url = `${options.origin}/ws?path=${encodeURIComponent(options.path)}`;

    try {
      socket = new WebSocket(url);
    } catch {
      scheduleRetry();
      return;
    }

    socket.onopen = () => {
      retryDelay = 1000;
    };
    socket.onmessage = (event: MessageEvent) => {
      const presence = parsePresence(String(event.data));
      if (presence) options.onUpdate(presence);
    };
    socket.onclose = () => {
      socket = null;
      scheduleRetry();
    };
    socket.onerror = () => {
      // onclose always follows, and it is where the retry is scheduled.
      // Retrying here as well opened two sockets for every failure.
    };
  };

  const scheduleRetry = (): void => {
    if (closed) return;
    clearTimeout(retryTimer);
    retryTimer = setTimeout(open, retryDelay);
    retryDelay = Math.min(retryDelay * 2, 30000);
  };

  open();

  return () => {
    closed = true;
    clearTimeout(retryTimer);
    socket?.close();
    socket = null;
  };
}
