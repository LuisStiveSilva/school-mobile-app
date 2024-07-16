import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from '../../../components/Select';
import CoursesCard from '../../../components/CoursesCard';
import RouterButtons from '../../../components/RouterButtons';
import Container from '../../../components/Container';
import { baseUrl } from '../../../utils/baseUrl';
import moment from 'moment';

export default function HomeTeacher({ route, navigation }) {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [actualDay, setActualDay] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [routerData, setRouterData] = useState([]);
  const [tutorships, setTutorships] = useState([]);

  const days = ["", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]

  const getGrades = async () => {
    try {
      setLoading(true)
      setGrades([])
      const payload = {
        id_profesor: route.params.id
      }
      const res = await axios.post(`${baseUrl}/gradesByTeacher`, payload)
      const tmpArray = []
      res.data.map(e => {
        tmpArray.push({ id: e.id, title: e.nombre })
      })
      setGrades(tmpArray)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const getUsername = () => {
    const { nombre, apellido } = route.params
    const lastname = apellido.split(" ")[0]
    const firstname = nombre.charAt(0)
    setUserName(`${lastname} ${firstname}.`)
  }

  const initialRouter = () => {
    return [
      {
        title: 'Notas',
        color: '#F09700',
        link: 'CalificationTeacher',
        image: require('../../../assets/icons/graduation.png'),
        routerParams: route.params
      },
      {
        title: 'Asistencia',
        color: '#2A74B6',
        link: 'AssistTeacher',
        image: require('../../../assets/icons/asistencia.png'),
        routerParams: route.params
      },
      {
        title: 'Configuración',
        color: '#BBBBBB',
        link: 'ConfigurationTeacher',
        image: require('../../../assets/icons/configuration.png'),
        routerParams: route.params
      },
    ]
  }

  const getSchedule = async (idGrade) => {
    try {
      setLoading(true)

      const payload = {
        id_grado: idGrade,
        id_profesor: route.params.id
      }
      const res = await axios.post(`${baseUrl}/teachersSchedule`, payload)
      let tempSchedule = schedule
      if (res.data.length > 0) {
        const todayCourses = res.data.filter(curso => curso.horario.some(horario => horario.dia === actualDay))
        todayCourses.map(curso => {
          const todaySchedule = curso.horario.find(horario => horario.dia === actualDay);
          tempSchedule.push({
            name: curso.nombre,
            schedule: `${todaySchedule.desde} - ${todaySchedule.hasta}`,
            classroom: todaySchedule.aula
          })
        });
      }
      setSchedule(tempSchedule)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const handleSelectGrade = async (value) => {
    await getSchedule(value.id)
    setSelectedGrade(value)
  }

  const getTutorships = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${baseUrl}/tutorshipsByTeacher/${route.params.id}`)
      let tmpRouterData = initialRouter()
      let tempSchedule = schedule
      if (res.data.length > 0) {
        const tutorButton = {
          title: 'Tutorias',
          color: '#E00208',
          link: 'TutorshipTutor',
          image: require('../../../assets/icons/tutor.png'),
          routerParams: route.params
        }
        tmpRouterData.splice(2, 0, tutorButton)
        setRouterData(tmpRouterData)
        res.data.map(tutor => {
          if (moment().isSame(tutor.fecha.split("T")[0], 'day')) {
            tempSchedule.push({
              name: `Tutoria - ${tutor.nombre_curso}`,
              schedule: `${tutor.desde} - ${tutor.hasta}`,
              classroom: null
            })
          }
        })
      }
      setSchedule(tempSchedule)
      setTutorships(res.data)
      return res.data
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    const day = days[moment().isoWeekday()]
    setActualDay(day)
    getUsername()
    getGrades()
    getTutorships()
  }, []);


  return (
    <Container
      image="https://sacooliveros.edu.pe/images/sacooliveros/Home/logos/logo-saco-oliveros-helicoidal-3.webp"
      name={userName}
      loading={loading}
      userParams={route.params}
      navigation={navigation}
    >
      <Select
        data={grades}
        onSelect={(event) => handleSelectGrade(event)}
        defaultValue={selectedGrade}
        label="Elija grado"
      />
      <CoursesCard
        data={schedule}
      />
      <RouterButtons
        data={routerData}
        navigation={navigation}
      />
    </Container>
  );
}
