import { serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server"
import { H3Event } from "h3"

const MONTHLY_CREDITS = 100

// Read-only credit check used by the client as a pre-flight before calling a
// tool. It never mutates anything — actual consumption happens server-side in
// server/utils/consumeCredit.ts. Identity comes from the session, not the body.
export default defineEventHandler(async (event: H3Event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({ statusCode: 401, message: 'You must be signed in to do that.' });
  }

  const supabase = serverSupabaseServiceRole(event);

  const { data: account, error } = await supabase
    .from('accounts')
    .select('credits, credits_last_reset')
    .eq('user', user.id)
    .single();

  if (error || !account) {
    console.error('Error reading credit status:', error);
    throw createError({ statusCode: 500, message: 'Could not load your account.' });
  }

  // If a new month has started, the next request will refill — so for display
  // purposes the user effectively has a full allowance again.
  const resetDue = new Date(account.credits_last_reset) < getUtcStartOfMonth();
  const remaining = resetDue ? MONTHLY_CREDITS : account.credits;

  return { remaining, hasCredits: remaining > 0 };
});
