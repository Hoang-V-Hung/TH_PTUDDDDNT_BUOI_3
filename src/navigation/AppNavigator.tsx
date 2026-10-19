import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudyTabNavigator from './StudyTabNavigator';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import AssignmentDetailScreen from '../screens/AssignmentDetailScreen';
import GradeDetailScreen from '../screens/GradeDetailScreen';
import StudentProfileScreen from '../screens/StudentProfileScreen';
import AcademicResultsScreen from '../screens/AcademicResultsScreen';
import type { RootStackParamList } from '../types/navigation';
import { studyColors as c } from '../theme/studyTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerTintColor: c.white,
        headerStyle: { backgroundColor: c.primary },
        headerTitleStyle: { color: c.white, fontSize: 17 },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: c.background },
        orientation: 'portrait',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={StudyTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: 'Chi tiết môn học' }}
      />
      <Stack.Screen
        name="StudentProfile"
        component={StudentProfileScreen}
        options={{ title: 'Thông tin cá nhân' }}
      />
      <Stack.Screen
        name="AcademicResults"
        component={AcademicResultsScreen}
        options={{ title: 'Kết quả học tập' }}
      />
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{ title: 'Chi tiết buổi học' }}
      />
      <Stack.Screen
        name="AssignmentDetail"
        component={AssignmentDetailScreen}
        options={{ title: 'Chi tiết bài tập' }}
      />
      <Stack.Screen
        name="GradeDetail"
        component={GradeDetailScreen}
        options={{ title: 'Kết quả học tập' }}
      />
    </Stack.Navigator>
  );
};
