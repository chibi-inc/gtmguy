import { defineEventHandler } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server"

export default defineEventHandler(async (event) => {
    const supabase = serverSupabaseServiceRole(event);
    const payment_details = await readBody(event)
    try {
        if(payment_details.name === 'checkout.completed'){
            const checkout_details = payment_details.data
            try {
                // Get the session user and verify if the email matches the checkout email
                const user = await serverSupabaseUser(event)
                if (!user) throw new Error('User not found')

                if (user.email === checkout_details.customer.email) {
                    // Update the user's account to lifetime plan
                    const { data: accountData, error: accountError } = await supabase
                        .from('accounts')
                        .update({ lifetime_plan: true })
                        .eq('user', user.id)
                        .select()

                    if (accountError) throw accountError

                    return { success: true, data: accountData }
                } else {
                    throw new Error('Email mismatch between authenticated user and checkout')
                }
            } catch(error: any) {
                console.error(error)
                throw createError({
                    statusCode: 400,
                    message: error.message
                })
            }
        }
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            message: 'Failed to verify payment'
        })
    }
})