import pathlib

profile = pathlib.Path(r'C:\Users\vitor\ConnectAI-Labs\connectai-mobile\src\app\(tabs)\profile\index.tsx')
content = profile.read_text(encoding='utf-8')

# Inserir item "Privacidade" antes de "Sobre o app"
old_item = '''    {
      label: 'Sobre o app',
      icon: 'information-circle-outline',
      onPress: () => router.push('/about'),
    },'''

new_item = '''    {
      label: 'Privacidade',
      icon: 'shield-checkmark-outline' as const,
      onPress: () => router.push('/profile/privacy'),
    },
    {
      label: 'Sobre o app',
      icon: 'information-circle-outline',
      onPress: () => router.push('/about'),
    },'''

assert old_item in content, 'Item not found'
content = content.replace(old_item, new_item, 1)
profile.write_text(content, encoding='utf-8')
print('OK')
