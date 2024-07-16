import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import InputText from '../../../components/InputText';
import Container from '../../../components/Container';
import { admin } from '../data';
import Select from '../../../components/Select';
import { baseUrl } from '../../../utils/baseUrl';
import RequestAlert from '../../../components/RequestAlert';
import ScheduleInput from '../../../components/ScheduleInput';
import moment from 'moment';
import DeleteModal from '../../../components/DeleteModal';

export default function CreateSchedule() {
  const [grades, setGrades] = useState([])
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState({ name: false, code: false, })

  const getGrades = async () => {
    try {
      setLoading(true)
      setGrades([])
      const res = await axios.get(`${baseUrl}/grades`)
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
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const getSessionsByCourse = async (idCourse) => {
    try {
      setLoading(true)
      const res = await axios.get(`${baseUrl}/sessionsByCourse/${idCourse}`)
      const tempArr = []
      if (res.data.length > 0) {
        res.data.map(e => {
          tempArr.push(
            {
              id: e.id,
              day: e.dia,
              fromHour: e.desde.split(':')[0],
              fromMinute: e.desde.split(':')[1],
              toHour: e.hasta.split(':')[0],
              toMinute: e.hasta.split(':')[1],
              classroom: e.aula
            }
          )
        })
      }
      setSchedule(tempArr)
      setCount(count + 1)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const addSchedule = () => {
    const tempArr = schedule
    tempArr.push({
      day: '',
      fromHour: '',
      fromMinute: '',
      toHour: '',
      toMinute: '',
      classroom: ''
    })
    setSchedule(tempArr)
    setCount(count + 1)
  }

  const deleteElement = async () => {
    try {
      setLoadingDelete(true)
      await axios.delete(`${baseUrl}/sessions/${scheduleToDelete}`)
      await getSessionsByCourse(selectedCourse.id)
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDelete(false)
      setVisibleDelete(false)
      setScheduleToDelete(null)
    }
  }

  const removeSchedule = async (value, index) => {
    try {
      if (value.id) {
        setScheduleToDelete(value.id)
        setVisibleDelete(true)
      } else {
        const tempArr = schedule
        tempArr.splice(index, 1)
        setSchedule(tempArr)
        setCount(count + 1)
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getGrades()
  }, [])

  const handleSelectGrade = async (value) => {
    await getCoursesByGrade(value.id)
    setSelectedGrade(value)
  }

  const handleSelectCourse = async (value) => {
    await getSessionsByCourse(value.id)
    setSelectedCourse(value)
  }

  const handleInput = (event, index, type) => {
    const tempArr = schedule
    tempArr[index][type] = event
    setSchedule(tempArr)
    setCount(count + 1)
  }

  const checkError = () => {
    const tempArr = []
    schedule.map((e) => {
      tempArr.push({
        day: !e.day,
        from: {
          hour: e.fromHour.length == 0 || e.fromHour < 0 || e.fromHour > 23,
          minute: e.fromMinute.length == 0 || e.fromMinute < 0 || e.fromMinute > 59
        },
        to: {
          hour: e.toHour.length == 0 || e.toHour < 0 || e.toHour > 23,
          minute: e.toMinute.length == 0 || e.toMinute < 0 || e.toMinute > 59
        },
        classroom: e.classroom.length == 0
      })
    })
    setError(tempArr)
    for (let i = 0; i < tempArr.length; i++) {
      const obj = tempArr[i];
      // Verificar los valores de hour y minute
      if (obj.day !== false || obj.from.hour !== false || obj.from.minute !== false ||
        obj.to.hour !== false || obj.to.minute !== false) {
        // Si encontramos algún valor que no sea false, retornamos false
        return false;
      }
    }
    // Si todos los valores fueron false, retornamos true
    return true;
  }

  const saveData = async () => {
    try {
      setSaveLoading(true)
      setOpenAlert(true)

      const noError = checkError()
      if (!noError) {
        setOpenAlert(false)
        return
      }
      for (const item of schedule) {
        let payload = {
          dia: item.day.title || item.day,
          desde: `${item.fromHour}:${item.fromMinute}`,
          hasta: `${item.toHour}:${item.toMinute}`,
          aula: item.classroom,
          id_curso: selectedCourse.id
        }
        if (item.id) {
          await axios.put(`${baseUrl}/sessions/${item.id}`, payload)
        } else {
          await axios.post(`${baseUrl}/sessions`, payload)
        }
      }
      setSuccess(true)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    } finally {
      setSaveLoading(false)
      getSessionsByCourse(selectedCourse.id)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        image={admin.image}
        name={admin.name}
        loading={loading}
      >
        <Text style={styles.title}>
          Horarios
        </Text>
        <Select
          data={grades}
          onSelect={(event) => handleSelectGrade(event)}
          defaultValue={selectedGrade}
          label="Elija grado"
          error={error.grade}
          inputLabel="Grado"
        />
        {(selectedGrade && courses) &&
          <Select
            data={courses}
            onSelect={(event) => handleSelectCourse(event)}
            defaultValue={selectedCourse}
            label="Elija Curso"
            error={error.course}
            inputLabel="Curso"
          />
        }
        {(selectedGrade && selectedCourse) &&
          <View style={styles.timeContainer}>
            {schedule.length > 0 && schedule.map((e, index) => (
              <View key={`schedule ${index}`}>
                <View style={styles.sessionSubtitle}>
                  <Text style={{ fontWeight: 700, fontSize: 20 }}>Sesión {index + 1}</Text>
                  <TouchableOpacity onPress={() => removeSchedule(e, index)}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../../assets/icons/delete.png')} />
                  </TouchableOpacity>
                </View>
                <InputText
                  label="Aula"
                  value={e?.classroom}
                  onChange={(e) => handleInput(e, index, 'classroom')}
                  placeholder="Ingresa aula"
                  error={error[index]?.classroom}
                  errorLabel="Aula requerida"
                />
                <ScheduleInput
                  labelTime="Desde"
                  hour={e?.fromHour}
                  setHour={(e) => handleInput(e, index, 'fromHour')}
                  minute={e?.fromMinute}
                  setMinute={(e) => handleInput(e, index, 'fromMinute')}
                  setDay={(e) => handleInput(e, index, 'day')}
                  day={e?.day ? { title: e?.day } : null}
                  error={error[index]?.from}
                  errorDay={error[index]?.day}
                />
                <ScheduleInput
                  showDay={false}
                  labelTime="Hasta"
                  hour={e?.toHour}
                  setHour={(e) => handleInput(e, index, 'toHour')}
                  minute={e?.toMinute}
                  setMinute={(e) => handleInput(e, index, 'toMinute')}
                  setDay={(e) => handleInput(e, index, 'day')}
                  error={error[index]?.to}
                />
                <View style={{ borderWidth: 1, borderColor: 'black', marginVertical: 20 }}></View>
              </View>
            ))}
            <TouchableOpacity
              style={{ ...styles.addButton }}
              onPress={() => addSchedule()}
            >
              <Text>Agregar horario</Text>
            </TouchableOpacity>
          </View>
        }
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
        message={success && 'Exito'}
      />
      <DeleteModal
        visible={visibleDelete}
        hide={setVisibleDelete}
        loading={loadingDelete}
        message="¿Estás seguro de eliminar el horario?"
        deleteElement={deleteElement}
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
    marginVertical: 20,
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
  timeContainer: {
    borderColor: '#27509B',
    borderWidth: 2,
    marginVertical: 20,
    padding: 10
  },
  label: {
    fontSize: 20,
    color: '#27509B',
    fontWeight: 'bold',
    marginBottom: 5
  },
  addButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 12,
    marginTop: 10
  },
  sessionSubtitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between',
  }
})