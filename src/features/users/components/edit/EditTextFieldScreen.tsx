import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  type KeyboardTypeOptions,
} from 'react-native'
import { EditFieldScaffold } from './EditFieldScaffold'
import { useEditProfileField } from '../../hooks/useEditProfileField'
import { editProfileSchema } from '../../schemas/editProfileSchema'
import type { UserProfile } from '@/shared/types'
import { colors } from '@/shared/theme'

// Campos de texto editáveis um a um. Reúsa a casca e a validação por campo do
// editProfileSchema — cada tela manda só o PATCH do seu campo.
export type TextFieldKey = 'name' | 'lastname' | 'username' | 'phone' | 'bio'

type FieldConfig = {
  title: string
  help: string
  keyboardType?: KeyboardTypeOptions
  autoCapitalize?: 'none' | 'words' | 'sentences'
  multiline?: boolean
  maxLength?: number
  prefix?: string
}

const FIELDS: Record<TextFieldKey, FieldConfig> = {
  name: {
    title: 'Nome',
    help: 'Como você aparece no perfil, nos rolês e no mapa. De 4 a 25 letras.',
    autoCapitalize: 'words',
    maxLength: 25,
  },
  lastname: {
    title: 'Sobrenome',
    help: 'Seu sobrenome. De 4 a 55 letras.',
    autoCapitalize: 'words',
    maxLength: 55,
  },
  username: {
    title: 'Nome de usuário',
    help: 'É como te encontram no app. Mínimo de 4 caracteres.',
    autoCapitalize: 'none',
    maxLength: 25,
    prefix: '@',
  },
  phone: {
    title: 'Telefone',
    help: 'Usado para contato e segurança da conta. Só números, com DDD.',
    keyboardType: 'number-pad',
    maxLength: 11,
  },
  bio: {
    title: 'Bio',
    help: '',
    multiline: true,
    maxLength: 255,
  },
}

const TEXT_FIELD_KEYS = Object.keys(FIELDS) as TextFieldKey[]

export function isTextFieldKey(
  value: string | undefined,
): value is TextFieldKey {
  return !!value && TEXT_FIELD_KEYS.includes(value as TextFieldKey)
}

export function EditTextFieldScreen({ field }: { field: TextFieldKey }) {
  const { profile, save, saving, error } = useEditProfileField()

  if (!profile) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.brand} />
      </View>
    )
  }

  return (
    <TextFieldForm
      profile={profile}
      field={field}
      save={save}
      saving={saving}
      serverError={error}
    />
  )
}

type FormProps = {
  profile: UserProfile
  field: TextFieldKey
  save: (patch: Record<TextFieldKey, string>) => void
  saving: boolean
  serverError: string | null
}

function TextFieldForm({
  profile,
  field,
  save,
  saving,
  serverError,
}: FormProps) {
  const config = FIELDS[field]
  const initial = String(profile[field] ?? '')
  const [value, setValue] = useState(initial)

  const parsed = editProfileSchema.shape[field].safeParse(value)
  const changed = value !== initial
  const validationError =
    changed && !parsed.success ? parsed.error.issues[0].message : null
  const canSave = changed && parsed.success
  const displayError = validationError ?? serverError

  return (
    <EditFieldScaffold
      title={config.title}
      onSave={() => save({ [field]: value } as Record<TextFieldKey, string>)}
      saving={saving}
      canSave={canSave}
    >
      {config.multiline ? (
        <TextInput
          className="bg-surface border-[1.5px] border-brand rounded-xl px-4 py-3.5 text-content-secondary text-[15px] leading-6"
          style={{ minHeight: 118, textAlignVertical: 'top' }}
          autoFocus
          multiline
          maxLength={config.maxLength}
          placeholder="Conte um pouco sobre você"
          placeholderTextColor={colors.contentSubtle}
          value={value}
          onChangeText={setValue}
        />
      ) : (
        <View className="flex-row items-center gap-2 bg-surface border-[1.5px] border-brand rounded-xl px-4 py-3.5">
          {config.prefix && (
            <Text className="text-content-subtle text-[17px] font-semibold">
              {config.prefix}
            </Text>
          )}
          <TextInput
            className="flex-1 text-content text-[17px] font-semibold p-0"
            autoFocus
            keyboardType={config.keyboardType}
            autoCapitalize={config.autoCapitalize}
            maxLength={config.maxLength}
            value={value}
            onChangeText={setValue}
          />
        </View>
      )}

      {config.multiline ? (
        <Text className="text-content-subtle text-right text-[12.5px] mt-2.5">
          {value.length}/{config.maxLength}
        </Text>
      ) : (
        <Text className="text-content-subtle text-[12.5px] mt-2.5 leading-5">
          {config.help}
        </Text>
      )}

      {displayError && (
        <Text className="text-danger-text text-[12.5px] mt-2">
          {displayError}
        </Text>
      )}
    </EditFieldScaffold>
  )
}
