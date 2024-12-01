export const useCredits = () => {
  const user = useSupabaseUser()

  const checkAndConsumeCredit = async () => {
    try {
      if (!user.value?.id) return false

      // Remove lifetime plan check for now

      // First check if user has lifetime plan
      // const { data: accountData, error: accountError } = await supabase
      //   .from('accounts')
      //   .select('lifetime_plan')
      //   .eq('user', user.value.id)
      //   .single()

      // if (accountError) throw accountError

      // If user has lifetime plan, allow generation without consuming credits
      // if (accountData?.lifetime_plan) {
      //   return true
      // }

      // If not lifetime plan, proceed with credit check and consumption
      const creditCheck = await fetch('/api/auth/credits/consume', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.value.id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const creditResult = await creditCheck.json()

      if (!creditResult.success) {
        // if (creditResult.shouldUpgrade) {
        //   .value = true
        //   return false
        // }
        throw new Error(creditResult.message)
      }

      return true
    } catch (error) {
      console.error('Error checking credits:', error)
      return false
    }
  }

  return {
    checkAndConsumeCredit
    // 
  }
} 