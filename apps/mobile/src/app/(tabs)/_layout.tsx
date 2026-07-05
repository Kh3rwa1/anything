import { useAppTheme, themeStyle } from '@/utils/theme';
import { Tabs } from 'expo-router';
import { Home, BookOpen, User } from 'lucide-react-native';
import { View } from 'react-native';

function TabIcon({ color, focused, icon: Icon }: { color: string; focused: boolean; icon: any }) {
  return (
    <View style={themeStyle({ alignItems: 'center', justifyContent: 'center', paddingTop: 2 })}>
      <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
    </View>
  );
}

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopWidth: 1,
          borderTopColor: theme.tabBorder,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: theme.isDark ? 0.3 : 0.08,
          shadowRadius: 20,
          elevation: 24,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.3,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} icon={Home} />
          ),
        }}
      />

      <Tabs.Screen
        name="learning"
        options={{
          title: 'My Learning',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} icon={BookOpen} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} icon={User} />
          ),
        }}
      />
    </Tabs>
  );
}
