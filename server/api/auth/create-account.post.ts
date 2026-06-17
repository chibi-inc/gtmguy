import { serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server"
import { H3Event } from "h3"

export default defineEventHandler(async (event: H3Event) => {
    // Identify the user from their session, NOT from the request body.
    // A caller can no longer create/seed an account for an arbitrary user id.
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({ statusCode: 401, message: 'You must be signed in to do that.' });
    }

    // Create Supabase client
    const supabase = serverSupabaseServiceRole(event);

    // Check if an account already exists for the user
    const { data: existingAccount, error: checkError } = await supabase
      .from('accounts')
      .select('user')
      .eq('user', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing account:', checkError);
      return { success: false, message: 'Failed to check existing account.' };
    }

    if (existingAccount) {
      return { success: true, message: 'Account already exists.' };
    }

    // Insert data into the accounts table only if no existing account
    const { data, error } = await supabase
      .from('accounts')
      .insert([
        { user: user.id, credits: 100, credits_last_reset: getUtcStartOfMonth() }
      ]);

    // Handle errors
    if (error) {
      console.error('Error inserting user account:', error);
      return { success: false, message: 'Failed to insert account data.' };
    }

    return { success: true, data };
});
