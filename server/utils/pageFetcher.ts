import fetch from 'node-fetch'

// TODO add security validations and prevent localhost inputs

export async function fetchPageContent(url: string) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    return html
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
} 