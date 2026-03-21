import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FAF5EE',
          borderTopColor: '#EDE4D8',
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: '#3A4830',
        tabBarInactiveTintColor: '#A89878',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 16, color }}>◈</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 16, color }}>⊞</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="upgrade"
        options={{
          title: 'Pro',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 16, color }}>✦</Text>
          ),
        }}
      />
    </Tabs>
  );
}