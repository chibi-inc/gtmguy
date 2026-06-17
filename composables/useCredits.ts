export const useCredits = () => {
  const user = useSupabaseUser()

  // Client-side pre-flight only. The credit itself is consumed server-side
  // inside each AI endpoint (see server/utils/consumeCredit.ts), which is the
  // single source of truth — the browser is never trusted to enforce billing.
  // This just (a) confirms the user is signed in and (b) does a read-only check
  // so we don't optimistically decrement the on-screen counter or fire a
  // request when the user is already out of credits.
  const checkAndConsumeCredit = async () => {
    if (!user.value?.id) return false

    try {
      const { hasCredits } = await $fetch<{ remaining: number; hasCredits: boolean }>(
        '/api/auth/credits/status'
      )
      return hasCredits
    } catch (error) {
      console.error('Error checking credits:', error)
      return false
    }
  }

  return {
    checkAndConsumeCredit
  }
} 