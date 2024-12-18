import OpenAI from 'openai'
import { H3Event } from 'h3'
import { fetchPageContent } from '../utils/pageFetcher'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string
})

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { blogContent, sitemapUrl } = body

  if (!blogContent || !sitemapUrl) {
    throw createError({
      statusCode: 400,
      message: 'Blog content and sitemap URL are required'
    })
  }

  try {
    // Fetch and parse sitemap
    const xmlText = await fetchPageContent(sitemapUrl)
    const urlRegex = /(https?:\/\/[^\s<>"']+)/g
    const urlMatches = xmlText.match(urlRegex)
    
    if (!urlMatches) {
      throw new Error('No URLs found in the sitemap')
    }

    const urls = urlMatches
      .map(url => url.trim())
      .filter(url => url.startsWith('http'))

    if (!urls.length) {
      throw new Error('No valid URLs found in the sitemap')
    }

    // Generate link suggestions
    const suggestions = await generateInternalLinkSuggestions(blogContent, urls)
    
    // Format the enhanced content with markdown
    const enhancedContent = formatEnhancedContent(blogContent, suggestions)

    return {
      success: true,
      data: {
        enhancedContent
      },
      message: 'Content enhanced with internal links'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      message: error.message || 'Failed to process content'
    })
  }
})

async function generateInternalLinkSuggestions(blogContent: string, urls: string[]) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an SEO expert specializing in internal linking. Analyze the content and suggest relevant internal links.
        Consider:
        1. Semantic relevance between content and target URL
        2. Natural placement within the text
        3. User experience and flow
        4. SEO value of the link placement
        5. Avoid overlapping or nested links
        6. Maximum 5-7 relevant links per content

        Return the response in the following JSON format:
        {
          "suggestions": [
            {
              "originalText": "exact text where link should be added",
              "targetUrl": "url to link to",
              "relevanceScore": number between 0-100,
              "contextMatch": number between 0-100,
              "reason": "brief explanation of why this link is relevant"
            }
          ]
        }`
      },
      {
        role: "user",
        content: `Blog Content: ${blogContent.substring(0, 3000)}...
        
        Available URLs to link to:
        ${urls.join('\n')}`
      }
    ],
    response_format: { type: "json_object" }
  })

  const result = JSON.parse(completion.choices[0].message.content || '{"suggestions": []}')
  return result.suggestions
}

function formatEnhancedContent(content: string, suggestions: any[]) {
  let enhancedContent = content

  // Add a summary of changes
  const summary = `## Internal Links Added\n\n${suggestions.map(s => 
    `- [${s.originalText}](${s.targetUrl}) (Relevance: ${s.relevanceScore}%)\n  ${s.reason}`
  ).join('\n\n')}\n\n## Enhanced Content\n\n`

  // Apply the links to the content
  suggestions.forEach(suggestion => {
    const link = `[${suggestion.originalText}](${suggestion.targetUrl})`
    enhancedContent = enhancedContent.replace(suggestion.originalText, link)
  })

  return summary + enhancedContent
} 