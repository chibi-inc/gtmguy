import natural from 'natural'
const tokenizer = new natural.WordTokenizer()
const TfIdf = natural.TfIdf

export function extractParagraphs(content: string): string[] {
  // Remove HTML tags and split into paragraphs
  const cleanContent = content.replace(/<[^>]*>/g, '')
  return cleanContent.split(/\n\n+/).filter(p => p.length > 100)
}

export function extractKeywords(content: string): string[] {
  const tfidf = new TfIdf()
  
  // Remove HTML and tokenize
  const cleanContent = content.replace(/<[^>]*>/g, '')
  const tokens = tokenizer.tokenize(cleanContent.toLowerCase())
  
  // Remove common words and calculate term frequency
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to'])
  const keywords = tokens.filter(token => !stopWords.has(token))
  
  tfidf.addDocument(keywords)
  
  // Get top keywords
  const terms: {term: string, score: number}[] = []
  tfidf.listTerms(0).forEach(item => {
    terms.push({ term: item.term, score: item.tfidf })
  })
  
  return terms.sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.term)
}

export function calculateRelevance(paragraph: string, keywords: string[]): number {
  const paragraphTokens = new Set(
    tokenizer.tokenize(paragraph.toLowerCase())
  )
  
  let matches = 0
  for (const keyword of keywords) {
    if (paragraphTokens.has(keyword)) matches++
  }
  
  return matches / keywords.length
} 