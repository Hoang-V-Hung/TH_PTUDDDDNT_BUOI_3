import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import type { StudyTabParamList } from '../types/navigation';
import OverviewScreen from '../screens/OverviewScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { studyColors as c } from '../theme/studyTheme';

const Tab = createBottomTabNavigator<StudyTabParamList>();
const icons: Record<keyof StudyTabParamList, [string, string]> = {
  Overview: ['home', 'home-outline'],
  Courses: ['book', 'book-outline'],
  Schedule: ['calendar', 'calendar-outline'],
  Assignments: ['checkbox', 'checkbox-outline'],
  Profile: ['person', 'person-outline'],
};
function screenOptions({
  route,
}: {
  route: RouteProp<StudyTabParamList>;
}): BottomTabNavigationOptions {
  return {
    headerShown: false,
    tabBarActiveTintColor: c.primary,
    tabBarInactiveTintColor: c.muted,
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: styles.label,
    tabBarLabelPosition: 'below-icon',
    tabBarHideOnKeyboard: true,
    tabBarIcon: ({ focused, color, size }) => (
      <View style={[styles.icon, focused && styles.activeIcon]}>
        <Icon
          name={icons[route.name][focused ? 0 : 1]}
          color={color}
          size={Math.min(size, 22)}
        />
      </View>
    ),
  };
}
export default function StudyTabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={props => ({
        ...screenOptions(props),
        tabBarStyle: [
          styles.tabBar,
          {
            height: 70 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ],
      })}
    >
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{ title: 'Tổng quan' }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{ title: 'Môn học' }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ title: 'Thời khóa biểu', tabBarLabel: 'Lịch học' }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{ title: 'Bài tập' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Cá nhân và kết quả học tập',
          tabBarLabel: 'Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: c.surface,
    borderTopColor: c.border,
    paddingTop: 7,
    elevation: 0,
  },
  label: { fontSize: 10, fontWeight: '600', marginTop: 3 },
  icon: {
    width: 48,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: { backgroundColor: c.primarySoft },
});
