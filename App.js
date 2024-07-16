import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/views/Login';
import SelectRole from './src/views/SelectRole';
// TEACHER
import HomeTeacher from './src/views/Teacher/Home';
import CalificationTeacher from './src/views/Teacher/Calification';
import AssistTeacher from './src/views/Teacher/Assist';
import ConfigurationTeacher from './src/views/Teacher/Configuration';
// STUDENTS
import HomeStudent from './src/views/Student/Home';
import CalificationStudent from './src/views/Student/Calification';
import AssistStudent from './src/views/Student/Assist';
import TutorshipStudent from './src/views/Student/Tutorships';
import ConfigurationStudent from './src/views/Student/Configuration';
// TUTOR
import AssistTutor from './src/views/Tutor/Assist';
import TutorshipTutor from './src/views/Tutor/Tutorship';
import CreateUser from './src/views/Admin/Create/CreateUser';
import HomeAdmin from './src/views/Admin/Home';
import MenuAdmin from './src/views/Admin/AdminMenu';
import CreateCourses from './src/views/Admin/Create/CreateCourse';
import ListUser from './src/views/Admin/List/ListUser';
import ListCourses from './src/views/Admin/List/ListCourses';
import CreateSchedule from './src/views/Admin/Create/CreateSchedule';
import CreateTutorship from './src/views/Admin/Create/CreateTutors';
import ListTutorships from './src/views/Admin/List/ListTutorships';
import ManualUser from './src/views/Help';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        {/* GENERAL */}
        <Stack.Screen
          name='Login'
          component={Login}
        />
        <Stack.Screen
          name='SelectRole'
          component={SelectRole}
        />
        {/* TEACHER */}
        <Stack.Screen
          name='HomeTeacher'
          component={HomeTeacher}
        />
        <Stack.Screen
          name='CalificationTeacher'
          component={CalificationTeacher}
        />
        <Stack.Screen
          name='AssistTeacher'
          component={AssistTeacher}
        />
        <Stack.Screen
          name='ConfigurationTeacher'
          component={ConfigurationTeacher}
        />
        {/* STUDENT */}
        <Stack.Screen
          name='HomeStudent'
          component={HomeStudent}
        />
        <Stack.Screen
          name='CalificationStudent'
          component={CalificationStudent}
        />
        <Stack.Screen
          name='AssistStudent'
          component={AssistStudent}
        />
        <Stack.Screen
          name='TutorshipStudent'
          component={TutorshipStudent}
        />
        <Stack.Screen
          name='ConfigurationStudent'
          component={ConfigurationStudent}
        />
        {/* TUTOR */}
        
        <Stack.Screen
          name='AssistTutor'
          component={AssistTutor}
        />
        <Stack.Screen
          name='TutorshipTutor'
          component={TutorshipTutor}
        />
        {/* ADMIN */}
        <Stack.Screen
          name='HomeAdmin'
          component={HomeAdmin}
        />
        <Stack.Screen
          name='MenuAdmin'
          component={MenuAdmin}
        />
        <Stack.Screen
          name='CreateUser'
          component={CreateUser}
        />
        <Stack.Screen
          name='ListUser'
          component={ListUser}
        />
        <Stack.Screen
          name='CreateCourses'
          component={CreateCourses}
        />
        <Stack.Screen
          name='ListCourses'
          component={ListCourses}
        />
        <Stack.Screen
          name='CreateSchedule'
          component={CreateSchedule}
        />
        <Stack.Screen
          name='CreateTutors'
          component={CreateTutorship}
        />
        <Stack.Screen
          name='ListTutors'
          component={ListTutorships}
        />
        <Stack.Screen
          name="ManualUser"
          component={ManualUser}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
