import React from 'react';
import { StyleSheet, Text } from 'react-native'
import { admin } from '../data';
import Container from '../../../components/Container';
import RouterButtons from '../../../components/RouterButtons';

export default function MenuAdmin({ route, navigation }) {
  const data = [
    {
      from: "users",
      title: "Usuarios",
      link: {
        create: 'CreateUser',
        list: 'ListUser'
      }
    },
    {
      from: "courses",
      title: "Cursos",
      link: {
        create: 'CreateCourses',
        list: 'ListCourses'
      }
    },
    {
      from: "tutors",
      title: "Tutorías",
      link: {
        create: 'CreateTutors',
        list: 'ListTutors'
      }
    },
    {
      from: "schedule",
      title: "Horarios",
      link: {
        create: 'CreateSchedule',
        list: 'ListSchedule'
      }
    },
  ]

  const routerData = [
    {
      title: 'Crear',
      color: '#F09700',
      link: data.find(e => e.from == route.params.from).link.create,
      image: require('../../../assets/icons/pencil.png'),
      routerParams: {
        from: "create"
      }
    },
    {
      title: 'Listar',
      color: '#2A74B6',
      link: data.find(e => e.from == route.params.from).link.list,
      image: require('../../../assets/icons/list.png'),
    }
  ]

  return (
    <Container
      image={admin.image}
      name={admin.name}
    >
      <Text style={styles.title} >
        {data.find(e => e.from == route.params.from).title}
      </Text>
      <RouterButtons
        data={routerData}
        navigation={navigation}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#27509B'
  }
})