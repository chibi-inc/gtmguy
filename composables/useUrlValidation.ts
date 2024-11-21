interface ValidationResult {
  valid: boolean;
  error: string;
}

export function useUrlValidation() {
  const isLocalhost = (url: string): boolean => {
    const localhostPatterns = [
      /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\])/i,
      /^(https?:\/\/)?0\.0\.0\.0/i,
      /^(https?:\/\/)?.*\.localhost/i
    ]
    
    try {
      const parsedUrl = new URL(url)
      return localhostPatterns.some(pattern => pattern.test(parsedUrl.hostname))
    } catch {
      return false
    }
  }

  const validateUrl = (url: string): ValidationResult => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

    if (!url) {
      return { valid: false, error: 'URL is required' }
    }
    if (!urlPattern.test(url)) {
      return { valid: false, error: 'Please enter a valid URL' }
    }
    if (isLocalhost(url)) {
      return { valid: false, error: 'Localhost URLs are not allowed' }
    }
    return { valid: true, error: '' }
  }

  return {
    validateUrl
  }
} 