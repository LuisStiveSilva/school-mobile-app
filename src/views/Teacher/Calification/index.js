import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Modal, View, Pressable, ActivityIndicator } from 'react-native';
import Select from '../../../components/Select';
import Footer from '../../../components/Footer';
import CustomTable from '../../../components/CustomTable';
import { footerTeacher } from '../../../utils/footerData';
import Container from '../../../components/Container';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseUrl';
import InputText from '../../../components/InputText';

export default function CalificationTeacher({ route, navigation }) {
  const [dataTable, setDataTable] = useState('')
  const [gradeSelected, setGradeSelected] = useState('');
  const [courseSelected, setCourseSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentSelected, setStudentSelected] = useState(null);
  const [periodSelected, setPeriodSelected] = useState(null);
  const [calificationSelected, setCalificationSelected] = useState(null);
  const [newCalification, setNewCalification] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(false);

  const widthArr = [120, 60, 60, 60, 60, 60]

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

  const getCoursesByGrade = async (idGrade) => {
    try {
      setLoading(true)
      setCourses([])
      const payload = {
        id_profesor: route.params.id,
        id_grado: idGrade
      }
      const res = await axios.post(`${baseUrl}/coursesByGradeAndTeacher`, payload)
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

  const getUsername = () => {
    const { nombre, apellido } = route.params
    const lastname = apellido.split(" ")[0]
    const firstname = nombre.charAt(0)
    setUserName(`${lastname} ${firstname}.`)
  }

  const handleModal = (student, period) => {
    setOpenModal(true)
    const calificationFound = student.calification.find(e => e.periodo == period)
    setNewCalification(calificationFound?.nota == '-' ? '' : String(calificationFound?.nota))
    setStudentSelected(student)
    setPeriodSelected(period)
    setCalificationSelected(calificationFound)
  }

  const tableButton = (calification, student, period) => (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onPress={() => handleModal(student, period)}
    >
      <Text>{calification}</Text>
    </TouchableOpacity>
  );

  const getDataTable = (studentsArray) => {
    let tmpData = []
    const tableHead = ['Nombre', 'Cuat. 1', 'Cuat. 2', 'Cuat. 3', 'Cuat. 4', 'Prom']
    const getCalificationPeriod = (calification, period) => {
      return calification.find(e => e.periodo == period)?.nota
    }
    const calculateAverage = (calification) => {
      const calification1 = getCalificationPeriod(calification, 'Cuatrimestre 1') == '-' ? 0 : Number(getCalificationPeriod(calification, 'Cuatrimestre 1'))
      const calification2 = getCalificationPeriod(calification, 'Cuatrimestre 2') == '-' ? 0 : Number(getCalificationPeriod(calification, 'Cuatrimestre 2'))
      const calification3 = getCalificationPeriod(calification, 'Cuatrimestre 3') == '-' ? 0 : Number(getCalificationPeriod(calification, 'Cuatrimestre 3'))
      const calification4 = getCalificationPeriod(calification, 'Cuatrimestre 4') == '-' ? 0 : Number(getCalificationPeriod(calification, 'Cuatrimestre 4'))
      const average = (calification1 + calification2 + calification3 + calification4) / 4
      return average
    }
    studentsArray.map(student => {
      tmpData.push([
        `${student.apellido} ${student.nombre}`,
        tableButton(getCalificationPeriod(student.calification, 'Cuatrimestre 1') || '-', student, 'Cuatrimestre 1'),
        tableButton(getCalificationPeriod(student.calification, 'Cuatrimestre 2') || '-', student, 'Cuatrimestre 2'),
        tableButton(getCalificationPeriod(student.calification, 'Cuatrimestre 3') || '-', student, 'Cuatrimestre 3'),
        tableButton(getCalificationPeriod(student.calification, 'Cuatrimestre 4') || '-', student, 'Cuatrimestre 4'),
        calculateAverage(student.calification) || '-'
      ])
    })
    setDataTable({ tableHead, data: tmpData })
  }

  const getStudents = async (idCourse) => {
    try {
      setLoading(true)
      const payload = {
        id_curso: idCourse
      }
      let students = await axios.get(`${baseUrl}/studentsByCourse/${idCourse}`)
      let califications = await axios.post(`${baseUrl}/studentsCalificationByCourse`, payload)
      const filteredCalifications = califications.data.filter(e => e.periodo)
      students.data.map(student => {
        student.calification = [
          {
            id: filteredCalifications.find(calification => calification.periodo == 'Cuatrimestre 1' && calification.id_estudiante == student.id)?.id_calificacion,
            periodo: 'Cuatrimestre 1',
            nota: filteredCalifications.find(calification => calification.periodo == 'Cuatrimestre 1' && calification.id_estudiante == student.id)?.nota || '-'
          },
          {
            id: filteredCalifications.find(calification => calification.periodo == 'Cuatrimestre 2' && calification.id_estudiante == student.id)?.id_calificacion,
            periodo: 'Cuatrimestre 2',
            nota: filteredCalifications.find(calification => calification.periodo == 'Cuatrimestre 2' && calification.id_estudiante == student.id)?.nota || '-'
          },
          {
            id: filteredCalifications.find(calification => calification.periodo == 'Cuatrimestre 3' && calification.id_estudiante == student.id)?.id_calificacion,
            periodo: 'Cuatrimestre 3',
            nota: filteredCalifications.find(calification => calification.periodo == 'Cuatrimestre 3' && calification.id_estudiante == student.id)?.nota || '-'
          },
          {
            id: filteredCalifications.find(calification => calification.periodo == 'Cuatrimestre 4' && calification.id_estudiante == student.id)?.id_calificacion,
            periodo: 'Cuatrimestre 4',
            nota: filteredCalifications.find(calification => calification.periodo == 'Cuatrimestre 4' && calification.id_estudiante == student.id)?.nota || '-'
          },
          {
            id: filteredCalifications.find(calification => calification.periodo == 'Promedio' && calification.id_estudiante == student.id)?.id_calificacion,
            periodo: 'Promedio',
            nota: filteredCalifications.find(calification => calification.periodo == 'Promedio' && calification.id_estudiante == student.id)?.nota || '-'
          },
        ]
      })

      const sortedStudents = students.data.sort(function (a, b) {
        if (a.apellido < b.apellido) { return -1; }
        if (a.apellido > b.apellido) { return 1; }
        return 0;
      })

      getDataTable(sortedStudents)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const handleSelectGrade = async (value) => {
    await getCoursesByGrade(value.id)
    setGradeSelected(value)
  }

  const handleSelectCourse = async (value) => {
    await getStudents(value.id)
    setCourseSelected(value)
  }

  const saveData = async () => {
    try {
      setModalLoading(true)
      if (Number(newCalification) < 1 || Number(newCalification) > 20) {
        setError(true)
        return
      }
      const payload = {
        nota: newCalification,
        periodo: periodSelected,
        id_curso: courseSelected.id,
        id_estudiante: studentSelected.id
      }
      if (calificationSelected.id) {
        await axios.put(`${baseUrl}/califications/${calificationSelected.id}`, payload)
      } else {
        await axios.post(`${baseUrl}/califications`, payload)
      }
      setOpenModal(false)
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoading(false)
      await getStudents(courseSelected.id)
    }
  }

  useEffect(() => {
    getUsername()
    getGrades()
  }, []);



  return (
    <SafeAreaView style={styles.safeArea}>
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
          label="Elija grado"
          defaultValue={gradeSelected}
        />
        {gradeSelected &&
          <Select
            data={courses}
            onSelect={(event) => handleSelectCourse(event)}
            defaultValue={courseSelected}
            label="Elija cursos"
          />
        }

        {gradeSelected && courseSelected ?
          <CustomTable
            data={dataTable}
            widthArr={widthArr}
            height={400}
          />
          : <Text style={styles.noContent}>Seleccione grado y curso</Text>
        }
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          onRequestClose={() => {
            setOpenModal(!openModal);
            setError(false)
          }}
        >
          <View style={styles.centeredView}>
            {modalLoading ?
              <ActivityIndicator size={100} color="#2A74B6" />
              :
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>{studentSelected?.apellido} {studentSelected?.nombre}</Text>
                <View style={{ width: 250 }}>
                  <InputText
                    label={periodSelected}
                    value={newCalification}
                    onChange={setNewCalification}
                    placeholder='Escriba nota'
                    inputMode="numeric"
                    error={error}
                    errorLabel="Nota requerida, debe ser entre 1 y 20"
                  />
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setOpenModal(!openModal)
                      setError(false)
                    }}>
                    <Text style={styles.textStyle}>Cerrar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonAccept]}
                    onPress={() => saveData()}>
                    <Text style={styles.textStyle}>Guardar</Text>
                  </Pressable>
                </View>
              </View>
            }
          </View>
        </Modal>
      </Container>
      <Footer
        data={footerTeacher}
        navigation={navigation}
        route={route.params}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EBF4F5',
  },
  noContent: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 300,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    margin: 10
  },
  buttonClose: {
    backgroundColor: '#E00208',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 15
  },
  buttonAccept: {
    backgroundColor: '#2A74B6',
  },
})