import { useCallback, useRef, useState } from 'react'
import { View, ActivityIndicator, FlatList, type TextInput } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useSearchUsers } from '@/features/users/hooks/useSearchUsers'
import { UserSearchInput } from '@/features/users/components/UserSearchInput'
import { UserSearchCard } from '@/features/users/components/UserSearchCard'
import { UserSearchEmpty } from '@/features/users/components/UserSearchEmpty'

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<TextInput>(null)
  const {
    users,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchUsers(query)

  // Foca o input toda vez que a aba ganha foco — autoFocus do TextInput só
  // dispara no mount inicial, e a aba persiste entre navegações.
  useFocusEffect(
    useCallback(() => {
      inputRef.current?.focus()
    }, []),
  )

  const trimmed = query.trim()
  const showIdle = trimmed.length < 2
  const showSpinner = !showIdle && isLoading
  const showNoResults = !showIdle && !isLoading && users.length === 0

  return (
    <View className="flex-1 bg-black">
      <UserSearchInput
        ref={inputRef}
        value={query}
        onChange={setQuery}
        loading={!showIdle && isLoading}
      />

      {showIdle ? (
        <UserSearchEmpty kind="idle" />
      ) : showSpinner ? (
        <View className="items-center py-12">
          <ActivityIndicator color="#8b5cf6" />
        </View>
      ) : showNoResults ? (
        <UserSearchEmpty kind="no-results" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={u => u.id}
          renderItem={({ item }) => <UserSearchCard user={item} />}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-zinc-900 mx-4" />
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage()
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                color="#8b5cf6"
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  )
}
