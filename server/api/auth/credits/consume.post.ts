import { serverSupabaseServiceRole } from "#supabase/server"
import { H3Event } from "h3"

export default defineEventHandler(async (event: H3Event) => {
    // Get the user_id from the request body
    const body = await readBody(event);
    const { user_id } = body;
  
    // Create Supabase client
    const supabase = serverSupabaseServiceRole(event);
  
    // Check current credits
    const { data: account, error: checkError } = await supabase
      .from('accounts')
      .select('credits, credits_last_reset')
      .eq('user', user_id)
      .single();

    if (checkError) {
      console.error('Error checking credits:', checkError);
      return { success: false, message: 'Failed to check credits.' };
    }

    // If no credits left
    if (!account || account.credits <= 0) {
      return { 
        success: false, 
        message: 'No credits remaining for this month!',
        // shouldUpgrade: true
      };
    }

    // If the last reset is the month before, reset the credits to 100
    // Edit the last reset to the current date

    if (account.credits_last_reset < getUtcStartOfMonth()) {
      const { error: resetError } = await supabase
        .from('accounts')
        .update({ credits: 99, credits_last_reset: getUtcStartOfMonth() })
        .eq('user', user_id);

      if (resetError) {
        console.error('Error resetting credits:', resetError);
        return { success: false, message: 'Failed to reset credits.' };
      }

      return { 
        success: true, 
        remainingCredits: 99
        };
    }
  
    // Decrement credits
    const { error: updateError } = await supabase
      .from('accounts')
      .update({ credits: account.credits - 1 })
      .eq('user', user_id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return { success: false, message: 'Failed to update credits.' };
    }

    return { 
      success: true, 
      remainingCredits: account.credits - 1
    };
}); 