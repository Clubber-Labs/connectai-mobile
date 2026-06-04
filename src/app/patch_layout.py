import pathlib

layout = pathlib.Path(r'C:\Users\vitor\ConnectAI-Labs\connectai-mobile\src\app\_layout.tsx')
content = layout.read_text(encoding='utf-8')

# 1. Adicionar imports
old_imports = "import { useAuthStore } from '@/features/auth/store/authStore'"
new_imports = """import { useAuthStore } from '@/features/auth/store/authStore'
import { useConsentStore, selectNeedsConsent, selectNeedsVersionBump } from '@/features/privacy/store/consentStore'
import { CONSENT_VERSION } from '@/features/privacy/services/consentService'"""
assert old_imports in content, 'imports not found'
content = content.replace(old_imports, new_imports, 1)

# 2. Enriquecer o AuthGuard com gate de consentimento
old_guard = """function AuthGuard() {
  const status = useAuthStore(s => s.status)
  const profileIncomplete = useAuthStore(s => s.profileIncomplete)
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading' || status === 'offline') return

    const inAuthGroup = segments[0] === '(auth)'
    const onCompleteProfile =
      inAuthGroup && (segments as string[])[1] === 'complete-profile'

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (
      status === 'authenticated' &&
      profileIncomplete &&
      !onCompleteProfile
    ) {
      router.replace('/(auth)/complete-profile')
    } else if (status === 'authenticated' && !profileIncomplete && inAuthGroup) {
      router.replace('/(tabs)/feed')
    }
  }, [status, profileIncomplete, segments, router])

  return null
}"""

new_guard = """function AuthGuard() {
  const status = useAuthStore(s => s.status)
  const profileIncomplete = useAuthStore(s => s.profileIncomplete)
  const segments = useSegments()
  const router = useRouter()

  const needsConsent      = useConsentStore(selectNeedsConsent)
  const needsVersionBump  = useConsentStore(s => selectNeedsVersionBump(s, CONSENT_VERSION))

  useEffect(() => {
    if (status === 'loading' || status === 'offline') return

    const inAuthGroup      = segments[0] === '(auth)'
    const onCompleteProfile = inAuthGroup && (segments as string[])[1] === 'complete-profile'
    const onConsentScreen   = inAuthGroup && (segments as string[])[1] === 'consent'

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/login')
      return
    }

    if (status === 'authenticated' && profileIncomplete && !onCompleteProfile) {
      router.replace('/(auth)/complete-profile')
      return
    }

    // Gate de consentimento: usuário autenticado com perfil completo mas sem consentimento
    // (novo usuário) ou com versão desatualizada (version bump) → tela de consent.
    if (
      status === 'authenticated' &&
      !profileIncomplete &&
      (needsConsent || needsVersionBump) &&
      !onConsentScreen
    ) {
      router.replace('/(auth)/consent')
      return
    }

    // Autenticado, com perfil e consentimento OK → sai do grupo auth
    if (
      status === 'authenticated' &&
      !profileIncomplete &&
      !needsConsent &&
      !needsVersionBump &&
      inAuthGroup
    ) {
      router.replace('/(tabs)/feed')
    }
  }, [status, profileIncomplete, needsConsent, needsVersionBump, segments, router])

  return null
}"""

assert old_guard in content, 'AuthGuard not found'
content = content.replace(old_guard, new_guard, 1)
layout.write_text(content, encoding='utf-8')
print('OK')
