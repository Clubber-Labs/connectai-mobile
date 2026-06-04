import pathlib

layout = pathlib.Path(r'C:\Users\vitor\ConnectAI-Labs\connectai-mobile\src\app\_layout.tsx')
content = layout.read_text(encoding='utf-8')

# Fix: adicionar selectConsentHydrated ao import do consentStore
old_import = "import { useConsentStore, selectNeedsConsent, selectNeedsVersionBump } from '@/features/privacy/store/consentStore'"
new_import = "import { useConsentStore, selectNeedsConsent, selectNeedsVersionBump, selectConsentHydrated } from '@/features/privacy/store/consentStore'"
assert old_import in content, 'import not found'
content = content.replace(old_import, new_import, 1)

# Fix: esconder GlobalHeader também na tela de consent
old_show_header = "  const showHeader = isAuthenticated && !profileIncomplete"
new_show_header = """  const consentHydrated = useConsentStore(selectConsentHydrated)
  const onConsentFlow = !consentHydrated || useConsentStore(selectNeedsConsent) || useConsentStore(s => selectNeedsVersionBump(s, CONSENT_VERSION))
  const showHeader = isAuthenticated && !profileIncomplete && !onConsentFlow"""
assert old_show_header in content, 'showHeader not found'
content = content.replace(old_show_header, new_show_header, 1)

layout.write_text(content, encoding='utf-8')
print('_layout.tsx OK')
