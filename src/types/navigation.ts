import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StudyTabParamList = {
  Overview: undefined;
  Courses: undefined;
  Schedule: undefined;
  Assignments: undefined;
  Profile: undefined;
};
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<StudyTabParamList> | undefined;
  StudentProfile: undefined;
  AcademicResults: undefined;
  CourseDetail: { courseId: string };
  SessionDetail: { sessionId: string; date: string };
  AssignmentDetail: { assignmentId: string };
  GradeDetail: { resultId: string };
};
export type TabScreenProps<T extends keyof StudyTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<StudyTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
export type DetailScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
