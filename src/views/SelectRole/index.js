import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import Constants from 'expo-constants';
import RouterButtons from '../../components/RouterButtons';

export default function SelectRole({ navigation }) {
  const roles = [
    {
      title: 'Profesor',
      image: require('../../assets/icons/teacher.png'),
      link: 'HomeTeacher',
      color: '#27509B'
    },
    {
      title: 'Estudiante',
      image: require('../../assets/icons/graduation.png'),
      link: 'HomeStudent',
      color: '#27509B'
    },
    {
      title: 'Tutor',
      image: require('../../assets/icons/tutor.png'),
      link: 'HomeTutor',
      color: '#27509B'
    },
    {
      title: 'Admin',
      image: require('../../assets/icons/admin.png'),
      link: 'HomeAdmin',
      color: '#27509B'
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image source={require('../../assets/logo-escuela.webp')} />
      </View>
      <Text style={styles.title}>Seleccione su rol</Text>
      <RouterButtons
        data={roles}
        navigation={navigation}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    padding: 20,
    backgroundColor: '#EBF4F5',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    color: '#27509B',
    fontWeight: 'bold',
    marginTop: 40,
    textAlign: 'center'
  },
  buttonBlock: {
    width: 200,
    marginTop: 30,
    alignSelf: 'center'
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden'
  },
  forgot: {
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: '#27509B',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30
  },
  roles: {

  }
});
