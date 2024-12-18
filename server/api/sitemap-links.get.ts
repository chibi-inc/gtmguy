import { tools } from '~/config/tools'

export default defineEventHandler(async (event) => {
  // Get blog posts
  const blogPosts = await queryContent('/blog').find()
  
  // Format blog links
  const blogLinks = blogPosts.map(post => ({
    title: post.title,
    url: `/blog/${post._path?.split('/').pop()}`,
    type: 'blog'
  }))

  // Format tool links
  const toolLinks = Object.values(tools).map(tool => ({
    title: tool.name,
    url: `/tools/${tool.id}`,
    type: 'tool'
  }))

  // Combine all links
  const links = [...blogLinks, ...toolLinks]

  return {
    links
  }
}) 