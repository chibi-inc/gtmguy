import { useRouter } from 'vue-router'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const isLoading = ref(false)
  const errorMessage = ref('')

  const signInWithGoogle = async () => {
    const user = useSupabaseUser()

    if (user.value) {
      await router.push('/app')
      return
    }

    errorMessage.value = ''
    isLoading.value = true

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email profile'
        },
      })

      if (error) {
        errorMessage.value = error.message
      }

    } catch (error) {
      console.error('Error signing in with Google:', error)
      errorMessage.value = 'An unexpected error occurred. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    signInWithGoogle,
    isLoading,
    errorMessage
  }
} 