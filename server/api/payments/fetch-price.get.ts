import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  // Replace with your actual Paddle price ID
  const PRICE_ID = process.env.PADDLE_PRICE_ID
  const PADDLE_API_KEY = process.env.PADDLE_SECRET_KEY
  const PADDLE_URL = process.env.PADDLE_URL
  try {
    const response = await fetch(`${PADDLE_URL}/prices/${PRICE_ID}`, {
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch price from Paddle')
    }

    const data = await response.json()
    
    // Return just the amount in dollars (converting from cents)
    return parseInt(data.data.unit_price.amount) / 100
  } catch (error) {
    console.error('Error fetching price:', error)
    // Return fallback price if API call fails
    return 69
  }
})
