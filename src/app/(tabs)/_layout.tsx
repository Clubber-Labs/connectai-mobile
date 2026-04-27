import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'

type IconName = ComponentProps<typeof Ionicons>['name']

type TabConfig = {
  name: string
  title: string
  icon: IconName
  iconFocused: IconName
}

const TABS: TabConfig[] = [
  {
    name: 'feed/index',
    title: 'Feed',
    icon: 'home-outline',
    iconFocused: 'home',
  },
  { name: 'map/index', title: 'Mapa', icon: 'map-outline', iconFocused: 'map' },
  {
    name: 'profile/index',
    title: 'Perfil',
    icon: 'person-outline',
    iconFocused: 'person',
  },
]

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f3f4f6',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      {TABS.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
