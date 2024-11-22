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
    const xmlText = await fetchPageContent(sitemapUrl)
    const urlRegex = /(https?:\/\/[^\s<>"']+)/g
    const urlMatches = xmlText.match(urlRegex)
    
    if (!urlMatches) {
      throw new Error('No URLs found in the content')
    }

    const urls = urlMatches
      .map(url => url.trim())
      .filter(url => url.startsWith('http'))

    if (!urls.length) {
      throw new Error('No valid URLs found. Please check the content format.')
    }

    const suggestions = await generateInternalLinkSuggestions(blogContent, urls)
    
    return {
      success: true,
      data: {
        suggestions,
        linkSummary: generateLinkSummaryTable(suggestions)
      },
      message: 'Internal link suggestions generated successfully'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      message: error.message || 'Failed to generate internal link suggestions'
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

        Return the response in the following JSON format:
        {
          "suggestions": [
            {
              "originalText": "text where link should be added",
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
  return result.suggestions.map((suggestion: any) => ({
    ...suggestion,
    relevanceScore: Math.round(suggestion.relevanceScore),
    contextMatch: Math.round(suggestion.contextMatch)
  }))
}

function generateLinkSummaryTable(suggestions: any[]) {
  return suggestions.map(suggestion => ({
    text: suggestion.originalText,
    url: suggestion.targetUrl,
    relevance: `${suggestion.relevanceScore}%`,
    context: `${suggestion.contextMatch}%`,
    reason: suggestion.reason
  }))
} 