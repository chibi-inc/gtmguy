import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'
import getUtcStartOfMonth from './getUtcStartOfMonth'

const MONTHLY_CREDITS = 100

/**
 * Authenticates the caller from their Supabase session and consumes one credit.
 *
 * Call this at the top of every AI endpoint. It is the single source of truth
 * for "is this person allowed to spend a credit right now" — the browser is
 * never trusted to enforce it.
 *
 * Throws:
 *   401 — not signed in
 *   402 — no credits remaining this month
 *   500 — account row missing / DB error
 *
 * Returns the remaining credit balance after consumption.
 */
export async function consumeCredit(event: H3Event): Promise<{ remainingCredits: number }> {
  // Identify the user from the session cookie, NOT from the request body.
  // This is what closes the "pass any user_id" hole.
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'You must be signed in to do that.' })
  }

  // Service role is required to read/write the accounts table (RLS bypass),
  // but it now only ever acts on the *authenticated* user's own row.
  const supabase = serverSupabaseServiceRole(event)
  const startOfMonth = getUtcStartOfMonth()

  const { data: account, error: readError } = await supabase
    .from('accounts')
    .select('credits, credits_last_reset')
    .eq('user', user.id)
    .single()

  if (readError || !account) {
    console.error('Error reading account for credit consumption:', readError)
    throw createError({ statusCode: 500, message: 'Could not load your account.' })
  }

  // New billing month → refill FIRST, then spend one.
  // (Previously the "credits <= 0" guard ran before this, permanently locking
  //  out anyone who hit zero last month.)
  if (new Date(account.credits_last_reset) < startOfMonth) {
    const { data: reset, error: resetError } = await supabase
      .from('accounts')
      .update({ credits: MONTHLY_CREDITS - 1, credits_last_reset: startOfMonth })
      .eq('user', user.id)
      .select('credits')
      .single()

    if (resetError || !reset) {
      console.error('Error resetting monthly credits:', resetError)
      throw createError({ statusCode: 500, message: 'Could not reset your monthly credits.' })
    }
    return { remainingCredits: reset.credits }
  }

  // Same month → must have credits left.
  if (account.credits <= 0) {
    throw createError({ statusCode: 402, message: 'No credits remaining for this month!' })
  }

  // Decrement, guarding against a concurrent request having just drained the
  // last credit (the `.gt('credits', 0)` makes the write a no-op in that case).
  const { data: updated, error: updateError } = await supabase
    .from('accounts')
    .update({ credits: account.credits - 1 })
    .eq('user', user.id)
    .gt('credits', 0)
    .select('credits')
    .single()

  if (updateError || !updated) {
    throw createError({ statusCode: 402, message: 'No credits remaining for this month!' })
  }

  return { remainingCredits: updated.credits }
}
