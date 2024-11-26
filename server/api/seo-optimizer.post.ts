import OpenAI from 'openai'
import { fetchPageContent } from '../utils/pageFetcher'
import { JSDOM } from 'jsdom'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  })

  const { url } = await readBody(event)
  
  // Fetch the actual page content
  const pageContent = await fetchPageContent(url)

  // Extract HTML elements
  const dom = new JSDOM(pageContent)
  const document = dom.window.document

  // Extract tags
  const imgTags = Array.from(document.getElementsByTagName('img'))
    .map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt')
    }))

  const aTags = Array.from(document.getElementsByTagName('a'))
    .map(a => ({
      href: a.getAttribute('href'),
      text: a.textContent?.trim()
    }))

  const h1Tags = Array.from(document.getElementsByTagName('h1'))
    .map(h1 => h1.textContent?.trim())

  const prompt = `As an SEO expert, analyze this URL, its content, and the following extracted elements:

URL: ${url}

Current Page Content:
${pageContent ? pageContent.substring(0, 2000) + '...' : 'Unable to fetch page content'}

Extracted Elements:
H1 Tags Found:
${JSON.stringify(h1Tags, null, 2)}

Images Found:
${JSON.stringify(imgTags, null, 2)}

Links Found:
${JSON.stringify(aTags, null, 2)}

Please analyze the current implementation and provide detailed recommendations in these areas:

1. Title Tag & Meta Description
   - Current implementation
   - Recommended improvements
   - Best practices and character limits

2. Content Structure
   - Current heading hierarchy (H1, H2, H3)
   - Content organization analysis
   - Keyword placement opportunities

3. Technical SEO
   - URL structure analysis
   - Mobile responsiveness check
   - Page speed considerations
   - Schema markup suggestions

4. Content Optimization
   - Primary keyword analysis
   - Secondary keyword suggestions
   - Content gaps identified
   - Word count recommendations

5. User Experience
   - Readability assessment
   - Content formatting analysis
   - Mobile optimization suggestions

6. Image Accessibility
   - List all <img> tags found
   - Identify images missing alt text
   - Evaluate quality of existing alt text
   - Provide specific recommendations for each image

7. Internal Linking Structure
   - List all <a> tags with href attributes
   - Identify which links point to the same domain (${new URL(url).hostname})
   - Analyze anchor text quality
   - Flag any broken or empty links
   - Evaluate internal link distribution

8. Featured Snippet Optimization
   - Current snippet eligibility
   - Content structuring recommendations
   - Q&A content suggestions

9. Current Status vs Improvements
   Please create a detailed comparison table that includes:
   - Current title tag vs optimized title tag
   - Current meta description vs optimized version
   - Current H1 vs recommended H1
   - Existing keywords vs recommended target keywords
   - Current URL structure vs optimized URL structure
   - Existing image alt texts vs optimized versions
   - Current internal linking status vs recommended structure

Format the response in clear sections using markdown, with actionable steps for each area. For each recommendation, include the current implementation and the specific suggested improvement.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert SEO consultant with deep knowledge of search engine optimization and content strategy.' 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ]
    })

    return completion.choices[0].message.content

  } catch (error: any) {
    console.error('OpenAI API Error:', error)
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate SEO recommendations'
    })
  }
}) 