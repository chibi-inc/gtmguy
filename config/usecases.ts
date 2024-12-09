import { tools, stages } from './tools'

// Group tools by stage
export const usecases = {
  understand: {
    id: 'understand',
    name: 'Understand Your Market',
    description: 'Validate your SaaS idea with confidence using our market research and analysis tools',
    stage: 'understand',
    benefits: [
      'Make data-driven decisions',
      'Reduce market entry risks',
      'Identify untapped opportunities'
    ],
    stats: {
      successRate: '87%',
      timeReduction: '60%',
      satisfactionRate: '4.8/5'
    },
    valueProposition: {
      why: 'Market understanding is the foundation of successful SaaS products. 42% of startups fail due to misreading market needs.',
      impact: 'Proper market research can increase your success rate by 3x and reduce development costs by 50%.',
      gtmInsight: 'Understanding your market first ensures product-market fit and enables targeted positioning from day one.'
    },
    useCases: [
      {
        title: 'Ideal Customer Profile',
        description: 'Define your target audience with detailed personas',
        tools: tools['ideal-customer-profile']
      },
      {
        title: 'User Research',
        description: 'Plan and conduct effective user research',
        tools: tools['user-research-planner']
      },
      {
        title: 'SWOT Analysis',
        description: 'Understand your market position and competitive advantages',
        tools: tools['swot-analysis']
      }
    ]
  },
  build: {
    id: 'build',
    name: 'Build Your Product',
    description: 'Ship the right features for your market with our product development tools',
    stage: 'build',
    valueProposition: {
      why: 'Building the right features first time saves costly pivots. 35% of development time is typically wasted on unused features.',
      impact: 'Strategic product development can reduce time-to-market by 40% and increase user adoption by 65%.',
      gtmInsight: 'A well-planned product architecture enables faster market penetration and easier customer onboarding.'
    },
    useCases: [
      {
        title: 'MVP Features',
        description: 'Define and prioritize your MVP features',
        tools: tools['mvp-feature-generator']
      },
      {
        title: 'Product Documentation',
        description: 'Create comprehensive product requirements',
        tools: tools['product-requirements-doc']
      },
      {
        title: 'Feature Prioritization',
        description: 'Prioritize features and plan development',
        tools: tools['feature-prioritization']
      },
      {
        title: 'User Journey',
        description: 'Map and optimize user journeys',
        tools: tools['user-journey-mapper']
      },
      {
        title: 'Metrics & KPIs',
        description: 'Define and track key product metrics',
        tools: tools['metrics-and-kpi']
      }
    ]
  },
  launch: {
    id: 'launch',
    name: 'Launch Your Product',
    description: 'Get your first paying customers with our launch optimization tools',
    stage: 'launch',
    valueProposition: {
      why: 'Launch success determines initial market traction. 70% of SaaS products fail to meet launch targets.',
      impact: 'A strategic launch can increase first-month user acquisition by 200% and reduce customer acquisition costs by 45%.',
      gtmInsight: 'Proper launch planning ensures maximum market visibility and initial user adoption.'
    },
    useCases: [
      {
        title: 'Go-to-Market Strategy',
        description: 'Plan your market entry and launch strategy',
        tools: tools['go-to-market-strategy']
      },
      {
        title: 'Launch Planning',
        description: 'Create detailed launch plans and timelines',
        tools: tools['product-launch-planner']
      },
      {
        title: 'Marketing Content',
        description: 'Generate compelling marketing copy',
        tools: tools['ai-copywriting-assistant']
      }
    ]
  },
  grow: {
    id: 'grow',
    name: 'Grow Your Business',
    description: 'Scale your SaaS systematically with our growth optimization tools',
    stage: 'grow',
    valueProposition: {
      why: 'Sustainable growth is crucial for SaaS success. 80% of SaaS companies struggle with scaling efficiently.',
      impact: 'Systematic growth strategies can increase MRR by 25% and reduce churn by 30%.',
      gtmInsight: 'Data-driven growth optimization enables predictable scaling and market expansion.'
    },
    useCases: [
      {
        title: 'Landing Pages',
        description: 'Optimize landing pages for better conversion rates',
        tools: tools['landing-page-optimizer']
      },
      {
        title: 'SEO Optimization',
        description: 'Improve search visibility and rankings',
        tools: tools['seo-optimization']
      },
      {
        title: 'Link Building',
        description: 'Optimize internal linking structure',
        tools: tools['internal-link-optimizer']
      },
      {
        title: 'A/B Testing',
        description: 'Plan and track optimization experiments',
        tools: tools['ab-test-planner']
      },
      {
        title: 'Content Marketing',
        description: 'Generate SEO-optimized blog content',
        tools: tools['blog-writer']
      }
    ]
  }
}

// Helper function to get usecase by ID
export const getUseCaseById = (id: string) => {
  return usecases[id]
}

// Export stages from tools.ts
export { stages }
