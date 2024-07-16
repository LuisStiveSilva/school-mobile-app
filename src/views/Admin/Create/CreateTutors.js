import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import Container from '../../../components/Container';
import { admin } from '../data';
import Select from '../../../components/Select';
import InputDate from '../../../components/InputDate';
import moment from 'moment';
import { baseUrl } from '../../../utils/baseUrl';
import RequestAlert from '../../../components/RequestAlert';
import dayjs from 'dayjs';
import ScheduleInput from '../../../components/ScheduleInput';

export default function CreateTutorship({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(route.params.from == 'edit' ? route.params.tutorship.fecha.split("T")[0] : dayjs());
  const [fromTime, setFromTime] = useState({ hour: route.params.from == 'edit' ? route.params?.tutorship?.desde?.split(':')[0] : '', minute: route.params.from == 'edit' ? route.params?.tutorship?.desde?.split(':')[1] : '' });
  const [toTime, setToTime] = useState({ hour: route.params.from == 'edit' ? route.params.tutorship.hasta.split(':')[0] : '', minute: route.params.from == 'edit' ? route.params.tutorship.hasta.split(':')[1] : '' });
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(route.params.from == 'edit' ? { id: route.params.tutorship.id_grado } : null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(route.params.from == 'edit' ? { id: route.params.tutorship.id_curso, title: route.params.tutorship.curso } : null);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(route.params.from == 'edit' ? { id: route.params.tutorship.id_profesor, title: route.params.tutorship.profesor } : null);
  const [count, setCount] = useState(0);

  const xd = {
    "tutorship": {
      "curso": "Fisica 1",
      "desde": "12:00",
      "fecha": "2024-07-15T00:00:00.000Z",
      "hasta": "13:30",
      "id_asesoria": 1,
      "id_curso": 11,
      "id_grado": 1,
      "id_profesor": 4,
      "profesor": "Silva Luis"
    }
  }

  const getGrades = async () => {
    try {
      setLoading(true)
      setGrades([])
      const res = await axios.get(`${baseUrl}/grades`)
      const tmpArray = []
      res.data.map(e => {
        tmpArray.push({ id: e.id, title: e.nombre })
      })
      if (route.params.from == 'edit') {
        setSelectedGrade(tmpArray.find(e => e.id == route.params.tutorship.id_grado))
      }
      setGrades(tmpArray)
    } catch (error) {
      console.error(`getGrades`, error);
    } finally {
      setLoading(false)
    }
  }
  const getTeachers = async () => {
    try {
      setLoading(true)
      setTeachers([])
      const res = await axios.get(`${baseUrl}/teachers`)
      const tmpArray = []
      res.data.map(e => {
        tmpArray.push({ id: e.id, title: `${e.apellido} ${e.nombre}` })
      })
      if (route.params.from == 'edit') {
        setSelectedGrade(tmpArray.find(e => e.id == route.params.tutorship.id_profesor))
      }
      setTeachers(tmpArray)
    } catch (error) {
      console.error(`getTeachers`, error);
    } finally {
      setLoading(false)
    }
  }
  const getCoursesByGrade = async (idGrade) => {
    try {
      setLoading(true)
      setCourses([])
      const res = await axios.get(`${baseUrl}/coursesByGrade/${idGrade}`)
      const tmpArray = []
      res.data.map(e => {
        tmpArray.push({ id: e.id, title: e.nombre })
      })
      setCourses(tmpArray)
    } catch (error) {
      console.error(`getCoursesByGrade`, error);
    } finally {
      setLoading(false)
    }
  }
  const handleGrade = async (value) => {
    await getCoursesByGrade(value.id)
    setSelectedGrade(value)
  }

  const clearInput = () => {
    setSelectedDate(dayjs())
    setFromTime({ hour: '', minute: '' })
    setToTime({ hour: '', minute: '' })
    setSelectedCourse(null)
    setSelectedGrade(null)
    setSelectedTeacher(null)
  }

  const checkError = () => {
    if (
      !selectedDate ||
      !selectedCourse ||
      !selectedTeacher ||
      !selectedGrade ||
      fromTime.hour.length == 0 ||
      fromTime.minute.length == 0 ||
      toTime.hour.length == 0 ||
      toTime.minute.length == 0
    ) {
      return true
    }
    else return false
  }

  const handleTime = (origin, type, value) => {
    if (origin == 'from') {
      let tmpArray = fromTime
      tmpArray[type] = value
      setFromTime(tmpArray)
      setCount(count + 1)
    }
    if (origin == 'to') {
      let tmpArray = toTime
      tmpArray[type] = value
      setToTime(tmpArray)
      setCount(count + 1)
    }
  }

  const saveData = async () => {
    try {
      setSaveLoading(true)
      setOpenAlert(true)
      setError({
      })
      if (checkError()) {
        setOpenAlert(false)
        return
      }      
      let payload = {
        "fecha": moment(String(selectedDate)).format("YYYY-MM-DD"),
        "desde": `${fromTime.hour}:${fromTime.minute}`,
        "hasta": `${toTime.hour}:${toTime.minute}`,
        "id_profesor": selectedTeacher.id,
        "id_curso": selectedCourse.id
      }
      if (route.params.from == 'create') {
        await axios.post(`${baseUrl}/tutorships`, payload)
        clearInput()
      }
      else
        await axios.put(`${baseUrl}/tutorships/${route.params.tutorship.id_asesoria}`, payload)
      setSuccess(true)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    } finally {
      setSaveLoading(false)
    }
  }


  useEffect(() => {
    getGrades()
    getTeachers()
    if (route.params.from == 'edit') {
      getCoursesByGrade(selectedGrade.id)
    }
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        image={admin.image}
        name={admin.name}
        loading={loading}
      >
        <Text style={styles.title}>
          {route.params.from == 'create' ? 'Crear tutoría' : 'Editar tutoría'}
        </Text>
        <InputDate
          label='Fecha'
          value={selectedDate}
          onChange={setSelectedDate}
          error={error.date}
          errorLabel="Seleccione fecha"
        />
        <ScheduleInput
          hour={fromTime.hour}
          setHour={(e) => handleTime("from", "hour", e)}
          minute={fromTime.minute}
          setMinute={(e) => handleTime("from", "minute", e)}
          error={error.fromTime}
          showDay={false}
          labelTime="Desde"
        />
        <ScheduleInput
          hour={toTime.hour}
          setHour={(e) => handleTime("to", "hour", e)}
          minute={toTime.minute}
          setMinute={(e) => handleTime("to", "minute", e)}
          error={error.toTime}
          showDay={false}
          labelTime="Hasta"
        />
        <Select
          data={grades}
          onSelect={(e) => handleGrade(e)}
          label="Seleccione grado"
          defaultValue={selectedGrade}
          error={error.grade}
          inputLabel="Grado"
          disabled={route.params.from == 'edit'}
        />
        <Select
          data={courses}
          onSelect={(e) => setSelectedCourse(e)}
          label="Seleccione curso"
          defaultValue={selectedCourse}
          error={error.course}
          inputLabel="Curso"
          disabled={courses.length == 0}
        />
        <Select
          data={teachers}
          onSelect={(e) => setSelectedTeacher(e)}
          label="Seleccione profesor"
          defaultValue={selectedTeacher}
          error={error.teacher}
          inputLabel="Profesor"
        />
        <View style={styles.buttonBlock}>
          <Button
            title="Guardar"
            color="#27509B"
            style={styles.button}
            onPress={saveData}
          />
        </View>
      </Container>
      <RequestAlert
        visible={openAlert}
        hide={setOpenAlert}
        loading={saveLoading}
        success={success}
        message={success ?
          (route.params.from == 'edit' ? "Exito al editar tutoría" : "Exito al crear tutoría") :
          (route.params.from == 'edit' ? "Hubo un error al editar al tutoría" : "Hubo un error al crear al tutoría")
        }
      />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  buttonBlock: {
    width: 200,
    marginVertical: 10,
    alignSelf: 'center'
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden'
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#27509B'
  },
})