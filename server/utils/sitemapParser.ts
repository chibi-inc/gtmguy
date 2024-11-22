import { XMLParser } from 'fast-xml-parser'

export async function parseSitemap(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await fetch(sitemapUrl, {
      headers: {
        'Accept': 'application/xml, text/xml, */*',
        'User-Agent': 'GTMGuy-Bot/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`)
    }
    
    const xmlData = await response.text()
    
    // Create parser with options to handle different XML formats
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      parseAttributeValue: true,
      trimValues: true
    })
    
    const parsed = parser.parse(xmlData)
    
    // Handle different sitemap formats
    if (parsed.sitemapindex) {
      const urls: string[] = []
      const sitemaps = Array.isArray(parsed.sitemapindex.sitemap) 
        ? parsed.sitemapindex.sitemap 
        : [parsed.sitemapindex.sitemap]
        
      for (const sitemap of sitemaps) {
        const loc = sitemap.loc || sitemap
        if (typeof loc === 'string') {
          const subUrls = await parseSitemap(loc)
          urls.push(...subUrls)
        }
      }
      return urls
    }
    
    // Handle urlset format
    if (parsed.urlset) {
      const urlEntries = Array.isArray(parsed.urlset.url) 
        ? parsed.urlset.url 
        : [parsed.urlset.url]
      
      return urlEntries
        .map((entry: any) => entry.loc || entry)
        .filter((url: any): url is string => typeof url === 'string')
    }

    // If we get here, try to parse as plain text
    const urlMatches = xmlData.match(/https?:\/\/[^\s<>"']+/g)
    if (urlMatches) {
      return urlMatches
    }
    
    throw new Error('Could not parse sitemap format')
  } catch (error: any) {
    console.error('Sitemap parsing error:', error)
    throw new Error(`Failed to parse sitemap: ${error.message}`)
  }
} 