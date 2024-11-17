export const useCredits = () => {
  const user = useSupabaseUser()
  const showUpgradeModal = ref(false)

  const checkAndConsumeCredit = async () => {
    try {
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
        if (creditResult.shouldUpgrade) {
          showUpgradeModal.value = true
          return false
        }
        throw new Error(creditResult.message)
      }

      return true
    } catch (error) {
      console.error('Error checking credits:', error)
      return false
    }
  }

  return {
    checkAndConsumeCredit,
    showUpgradeModal
  }
} 