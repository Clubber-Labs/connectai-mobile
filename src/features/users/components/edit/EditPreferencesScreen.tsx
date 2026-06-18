import { useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { EditFieldScaffold } from './EditFieldScaffold'
import { useEditProfileField } from '../../hooks/useEditProfileField'
import { CategoryMultiSelect } from '@/shared/components/CategoryMultiSelect'
import { InterestsMultiSelect } from '@/shared/components/InterestsMultiSelect'
import {
  MIN_PREFERRED_CATEGORIES,
  MIN_PREFERRED_CATEGORIES_MESSAGE,
} from '@/shared/utils/rolePreferences'
import type { UserProfile } from '@/shared/types'
import { colors } from '@/shared/theme'

type Kind = 'categories' | 'interests'

// Os pickers pesados ganham tela própria. Categorias exige mín. 2 (regra de
// produto); interesses é livre. Mesma casca, troca só o seletor e a regra.
export function EditPreferencesScreen({ kind }: { kind: Kind }) {
  const { profile, save, saving } = useEditProfileField()

  if (!profile) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.brand} />
      </View>
    )
  }

  return (
    <PreferencesForm
      profile={profile}
      kind={kind}
      save={save}
      saving={saving}
    />
  )
}

type FormProps = {
  profile: UserProfile
  kind: Kind
  save: (patch: {
    preferredCategories?: string[]
    preferredSubcategories?: string[]
  }) => void
  saving: boolean
}

function PreferencesForm({ profile, kind, save, saving }: FormProps) {
  const isCategories = kind === 'categories'
  const initial =
    (isCategories
      ? profile.preferredCategories
      : profile.preferredSubcategories) ?? []
  const [selected, setSelected] = useState<string[]>(initial)

  const belowMin = isCategories && selected.length < MIN_PREFERRED_CATEGORIES
  const canSave = !sameValues(selected, initial) && !belowMin

  function onSave() {
    save(
      isCategories
        ? { preferredCategories: selected }
        : { preferredSubcategories: selected },
    )
  }

  return (
    <EditFieldScaffold
      title={isCategories ? 'Categorias de rolê' : 'Interesses'}
      onSave={onSave}
      saving={saving}
      canSave={canSave}
    >
      <Text className="text-content-muted text-[12.5px] leading-5 mb-4">
        {isCategories
          ? 'O que você curte fazer num rolê — escolha de 2 a 10.'
          : 'Temas, estilos e gêneros que você curte. Escolha livre.'}{' '}
        <Text className="text-brand-text font-bold">
          {selected.length} {isCategories ? 'de 10' : 'selecionados'}
        </Text>
      </Text>

      {belowMin && (
        <Text className="text-danger-text text-[12.5px] mb-3">
          {MIN_PREFERRED_CATEGORIES_MESSAGE}
        </Text>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {isCategories ? (
          <CategoryMultiSelect value={selected} onChange={setSelected} />
        ) : (
          <InterestsMultiSelect value={selected} onChange={setSelected} />
        )}
      </ScrollView>
    </EditFieldScaffold>
  )
}

// Comparação ordem-insensível: a ordem dos chips não é semântica.
function sameValues(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const sortedB = [...b].sort()
  return [...a].sort().every((value, i) => value === sortedB[i])
}
