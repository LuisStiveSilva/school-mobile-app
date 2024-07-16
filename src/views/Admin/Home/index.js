import React from 'react';
import { admin } from '../data';
import Container from '../../../components/Container';
import RouterButtons from '../../../components/RouterButtons';

export default function HomeAdmin({ navigation }) {
  const routerData = [
    {
      title: 'Usuarios',
      color: '#F09700',
      link: 'MenuAdmin',
      image: require('../../../assets/icons/user.png'),
      routerParams: {
        from: "users"
      }
    },
    {
      title: 'Cursos',
      color: '#2A74B6',
      link: 'MenuAdmin',
      image: require('../../../assets/icons/book.png'),
      routerParams: {
        from: "courses"
      }
    },
    {
      title: 'Horarios',
      color: '#28a745',
      link: 'CreateSchedule',
      image: require('../../../assets/icons/schedule.png'),
      routerParams: {
        from: "schedule"
      }
    },
    {
      title: 'Tutorías',
      color: '#E00208',
      link: 'MenuAdmin',
      image: require('../../../assets/icons/tutor.png'),
      routerParams: {
        from: "tutors"
      }
    }
  ]
  return (
    <Container
      image={admin.image}
      name={admin.name}
    >
      <RouterButtons
        data={routerData}
        navigation={navigation}
      />
    </Container>
  )
}