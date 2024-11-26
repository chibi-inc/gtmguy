import { defineEventHandler } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server"
import { z } from 'zod'

const bodySchema = z.object({
    status: z.string(),
    customer_email: z.string(),
    customer_id: z.string(),
    transaction_id: z.string()
})

export default defineEventHandler(async (event) => {
    const supabase = serverSupabaseServiceRole(event);
    const body = await readBody(event)

    const bodyParseResult = bodySchema.safeParse(body)

    if (!bodyParseResult.success) {
      throw createError({
        status: 400,
        message: bodyParseResult.error.toString()
      })
    }
    const { status, customer_email, customer_id, transaction_id } = bodyParseResult.data

    try {
        if(status === 'checkout.completed'){
            try {
                // Get the session user and verify if the email matches the checkout email
                const user = await serverSupabaseUser(event)
                if (!user) throw new Error('User not found')

                if (user.email === customer_email) {
                    // Update the user's account to lifetime plan
                    const { data: accountData, error: accountError } = await supabase
                        .from('accounts')
                        .update({ 
                            lifetime_plan: true, 
                            customer_id: customer_id, 
                            transaction_id: transaction_id 
                        })
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
