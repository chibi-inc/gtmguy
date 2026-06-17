export const useCredits = () => {
  const user = useSupabaseUser()

  // Client-side pre-flight only: make sure the user is signed in before we
  // bother hitting a tool endpoint. The credit itself is consumed server-side
  // inside each AI endpoint (see server/utils/consumeCredit.ts), which is the
  // single source of truth — the browser is never trusted to enforce billing.
  const checkAndConsumeCredit = async () => {
    if (!user.value?.id) return false
    return true
  }

  return {
    checkAndConsumeCredit
  }
} 