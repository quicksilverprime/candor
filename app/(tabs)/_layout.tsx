import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FDFAF7',
          borderTopColor: '#E8DDD5',
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: '#4A3728',
        tabBarInactiveTintColor: '#A89080',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>◈</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>⊞</Text>
          ),
        }}
      />
    </Tabs>
  );
}