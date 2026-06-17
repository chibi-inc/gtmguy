import { JSDOM } from 'jsdom'
import { isIP } from 'net'
import { lookup } from 'dns/promises'

// Uses Node's built-in global fetch (Node 18+), so no node-fetch dependency.

// Reject anything pointing at the local host, the cloud metadata endpoint, or
// any private/reserved network. This is an SSRF guard: the URL is user-supplied
// and we fetch it server-side, so without this a caller could make our server
// hit internal services (e.g. http://169.254.169.254/ for cloud credentials).

function ipv4ToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0
}

function isBlockedIPv4(ip: string): boolean {
  const n = ipv4ToInt(ip)
  const inRange = (base: string, bits: number) =>
    (n >>> (32 - bits)) === (ipv4ToInt(base) >>> (32 - bits))

  return (
    inRange('0.0.0.0', 8) ||        // "this" network
    inRange('10.0.0.0', 8) ||       // private
    inRange('100.64.0.0', 10) ||    // carrier-grade NAT
    inRange('127.0.0.0', 8) ||      // loopback
    inRange('169.254.0.0', 16) ||   // link-local (incl. 169.254.169.254 metadata)
    inRange('172.16.0.0', 12) ||    // private
    inRange('192.0.0.0', 24) ||     // IETF protocol assignments
    inRange('192.168.0.0', 16) ||   // private
    inRange('198.18.0.0', 15) ||    // benchmarking
    inRange('224.0.0.0', 4) ||      // multicast
    inRange('240.0.0.0', 4)         // reserved
  )
}

function isBlockedIPv6(ip: string): boolean {
  const addr = ip.toLowerCase().replace(/^\[|\]$/g, '')

  // IPv4-mapped (::ffff:1.2.3.4) — validate the embedded IPv4 instead.
  const mapped = addr.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return isBlockedIPv4(mapped[1])

  return (
    addr === '::1' ||                // loopback
    addr === '::' ||                 // unspecified
    addr.startsWith('fc') ||         // unique local fc00::/7
    addr.startsWith('fd') ||         // unique local fc00::/7
    addr.startsWith('fe8') ||        // link-local fe80::/10
    addr.startsWith('fe9') ||
    addr.startsWith('fea') ||
    addr.startsWith('feb')
  )
}

function isBlockedAddress(ip: string): boolean {
  const version = isIP(ip)
  if (version === 4) return isBlockedIPv4(ip)
  if (version === 6) return isBlockedIPv6(ip)
  return true // not a recognisable IP → refuse to be safe
}

async function assertSafeUrl(url: string): Promise<URL> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('Invalid URL provided')
  }

  // Only allow plain web fetches — blocks file:, gopher:, data:, etc.
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http(s) URLs are allowed')
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, '')

  // If the host is a literal IP, check it directly.
  if (isIP(hostname)) {
    if (isBlockedAddress(hostname)) throw new Error('This address is not allowed')
    return parsed
  }

  // Otherwise resolve the hostname and reject if ANY resolved address is
  // private/reserved (defends against hostnames that point at internal IPs).
  const resolved = await lookup(hostname, { all: true })
  if (!resolved.length || resolved.some(({ address }) => isBlockedAddress(address))) {
    throw new Error('This address is not allowed')
  }

  return parsed
}

export async function fetchPageContent(url: string) {
  try {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided')
    }

    // Validate scheme + resolved IPs before making any request.
    await assertSafeUrl(url)

    // NOTE(Andrew Audit): Redirect disabled to prevent SSRF via redirect to an
    // internal address (a 3xx could otherwise bypass the check above).
    const response = await fetch(url, { redirect: 'error' })
    const html = await response.text()

    // NOTE(Andrew Audit): Script/resource loading stays disabled for security.
    // If dynamic content is ever needed, do it in a sandbox, not here.
    const dom = new JSDOM(html)

    return dom.serialize()
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}
