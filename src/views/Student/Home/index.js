import React, { useEffect, useState } from 'react';
import Container from '../../../components/Container';
import CoursesCard from '../../../components/CoursesCard';
import RouterButtons from '../../../components/RouterButtons';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseUrl';
import moment from 'moment';

export default function HomeStudent({ route, navigation }) {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState([]);

  const days = ["", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]

  const getUsername = () => {
    const { nombre, apellido } = route.params
    const lastname = apellido.split(" ")[0]
    const firstname = nombre.charAt(0)
    setUserName(`${lastname} ${firstname}.`)
  }

  const getSchedule = async (actualDay) => {
    try {
      setLoading(true)
      const payload = {
        id_grado: route.params.id_grado
      }
      const res = await axios.post(`${baseUrl}/studentsSchedule`, payload)
      if (res.data.length > 0) {
        const todayCourses = res.data.filter(curso => curso.horario.some(horario => horario.dia === actualDay))
        const tempSchedule = todayCourses.map(curso => {
          const todaySchedule = curso.horario.find(horario => horario.dia === actualDay);
          return {
            name: curso.nombre,
            schedule: `${todaySchedule.desde} - ${todaySchedule.hasta}`,
            classroom: todaySchedule.aula
          };
        });
        setSchedule(tempSchedule)
      }
    } catch (error) {
      console.error("get schedule error", error);
    } finally {
      setLoading(false)
    }
  }

  const routerData = [
    {
      title: 'Notas',
      color: '#F09700',
      link: 'CalificationStudent',
      image: require('../../../assets/icons/graduation.png'),
      routerParams: route.params
    },
    {
      title: 'Asistencia',
      color: '#2A74B6',
      link: 'AssistStudent',
      image: require('../../../assets/icons/asistencia.png'),
      routerParams: route.params
    },
    {
      title: 'Tutoría',
      color: '#E00208',
      link: 'TutorshipStudent',
      image: require('../../../assets/icons/tutor.png'),
      routerParams: route.params
    },
    {
      title: 'Configuración',
      color: '#BBBBBB',
      link: 'ConfigurationStudent',
      image: require('../../../assets/icons/configuration.png'),
      routerParams: route.params
    },
  ]

  useEffect(() => {
    const day = days[moment().isoWeekday()]
    getUsername()
    getSchedule(day)
  }, []);

  return (
    <Container
      image="https://sacooliveros.edu.pe/images/sacooliveros/Home/logos/logo-saco-oliveros-helicoidal-3.webp"
      name={userName}
      loading={loading}
      userParams={route.params}
      navigation={navigation}
    >
      <CoursesCard
        data={schedule}
      />
      <RouterButtons
        data={routerData}
        navigation={navigation}
      />
    </Container>
  )
}