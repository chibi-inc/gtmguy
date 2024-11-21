import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'

// TODO add security validations and prevent localhost inputs

export async function fetchPageContent(url: string) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    
    const dom = new JSDOM(html, {
      url: url,
      runScripts: 'dangerously',
      resources: 'usable'
    })

    // Wait for potential dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return dom.serialize()
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
} 