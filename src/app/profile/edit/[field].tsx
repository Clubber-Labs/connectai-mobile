import { useLocalSearchParams } from 'expo-router'
import {
  EditTextFieldScreen,
  isTextFieldKey,
} from '@/features/users/components/edit/EditTextFieldScreen'

export default function EditProfileFieldRoute() {
  const { field } = useLocalSearchParams<{ field: string }>()
  if (!isTextFieldKey(field)) return null
  return <EditTextFieldScreen field={field} />
}
