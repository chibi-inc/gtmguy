import OpenAI from 'openai';
import { consumeCredit } from '../utils/consumeCredit';

export default defineEventHandler(async (event) => {
  // Authenticate + spend a credit before doing any paid work.
  await consumeCredit(event);

  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { productVision, targetUsers, keyFeatures, constraints } = await readBody(event);

  const prompt = `As a Product Manager, create a comprehensive Product Requirements Document (PRD) following this specific format:

Context:
- Create a compelling marketing statement for this feature/product
- Explain why we're building it now (market timing, opportunity, competitive landscape)
- Make a clear case for why we deserve to win with this feature/product
- Focus on fundamental motivations that should remain stable throughout development

Usage Scenarios:
Create 2-3 detailed, real-life usage narratives that:
- Are anchored to specific user personas in specific moments
- Describe actual problems and how this solution addresses them
- Include contextual details (time, place, situation)
- Show the value proposition in action
Example format: "When [specific user] was doing [specific activity] at [specific time/place], they needed to [solve problem]. Using [feature/product], they were able to..."

Milestones:
Break down the development into clear phases:
1. Initial Risk Mitigation
   - What needs to be validated first?
   - What technical challenges need to be explored?

2. Core Feature Development
   - What are the must-have features for MVP?
   - What's the minimum viable experience?

3. Enhancement Phases
   - What features can be added incrementally?
   - What optimizations can be made post-launch?

4. Future Considerations
   - What potential expansions should be kept in mind?
   - What integrations might be valuable later?

Using the following information:
Product Vision: ${productVision}
Target Users: ${targetUsers}
Key Features: ${keyFeatures}
Constraints: ${constraints}

Format the response in clear markdown with proper headings and sections.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a Product Manager who creates clear, actionable PRDs that focus on real user value and practical implementation steps. Your PRDs are known for being well-structured, user-centric, and maintaining a clear connection between high-level vision and tactical execution.' 
        },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate PRD'
    });
  }
}); 
