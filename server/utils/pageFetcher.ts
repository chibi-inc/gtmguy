import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'

// TODO add security validations and prevent localhost inputs

function isLocalhost(url: string): boolean {
  // Expanded localhost patterns
  const localhostPatterns = [
    /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\])/i,
    /^(https?:\/\/)?0\.0\.0\.0/i,
    /^(https?:\/\/)?.*\.localhost/i
  ]
  try {
    const parsedUrl = new URL(url)
    return localhostPatterns.some(pattern => pattern.test(parsedUrl.hostname))
  } catch {
    return false
  }
}

export async function fetchPageContent(url: string) {
  try {
    // Validate URL format first
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided')
    }

    // Check for localhost
    if (isLocalhost(url)) {
      throw new Error('Localhost URLs are not allowed')
    }

    // NOTE(Andrew Audit): Redirect disabled to prevent CSRF attacks
    const response = await fetch(url, { redirect: "error" })
    const html = await response.text()
    
    // const dom = new JSDOM(html, {
    //   url: url,
    //   runScripts: 'dangerously',
    //   resources: 'usable'
    // })
    //
    // NOTE(Andrew Audit): Disabled JS and resource loading for security concerns
    // If script/resource loading is needed, we have to think about some sandboxed solution
    const dom = new JSDOM(html)

    // Wait for potential dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return dom.serialize()
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
} 
