export const useSeo = () => {
  const defaultMeta = {
    title: 'GTMGuy - AI-Powered Go-to-Market Strategy Tools',
    description: 'Create comprehensive go-to-market strategies, ICPs, and product launch plans in minutes with AI. Start free and transform your GTM strategy.',
    image: '/og-image.png', // Add your default OG image
    url: 'https://gtmguy.ai', // Replace with your actual domain
    type: 'website',
  }

  const setSeo = (meta: Partial<typeof defaultMeta> = {}) => {
    const finalMeta = { ...defaultMeta, ...meta }

    useHead({
      title: finalMeta.title,
      titleTemplate: '%s | GTMGuy',
      meta: [
        { name: 'description', content: finalMeta.description },
        
        // Open Graph
        { property: 'og:type', content: finalMeta.type },
        { property: 'og:title', content: finalMeta.title },
        { property: 'og:description', content: finalMeta.description },
        { property: 'og:image', content: finalMeta.image },
        { property: 'og:url', content: finalMeta.url },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: finalMeta.title },
        { name: 'twitter:description', content: finalMeta.description },
        { name: 'twitter:image', content: finalMeta.image },
        
        // Additional SEO tags
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'canonical', href: finalMeta.url },
      ],
    })
  }

  return {
    setSeo,
  }
} 