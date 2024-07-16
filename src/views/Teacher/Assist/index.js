import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Button } from 'react-native';
import CheckBox from 'react-native-check-box'
import CustomTable from '../../../components/CustomTable';
import Select from '../../../components/Select';
import Footer from '../../../components/Footer';
import { footerTeacher } from '../../../utils/footerData';
import Container from '../../../components/Container';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseUrl';
import InputDate from '../../../components/InputDate';
import dayjs from 'dayjs';
import moment from 'moment';


export default function AssistTeacher({ route, navigation }) {
  const [dataTable, setDataTable] = useState('')
  const [gradeSelected, setGradeSelected] = useState('');
  const [courseSelected, setCourseSelected] = useState('');
  const [userName, setUserName] = useState('');
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckbox = (studentsArray, index) => {
    let tmpArray = studentsArray
    tmpArray[index].asistencia = !tmpArray[index].asistencia
    setStudents(tmpArray)
    getDataTable(tmpArray)
  }

  const checkboxTable = (student, index, studentsArray) => (
    <CheckBox
      style={{ flex: 1, padding: 10, marginHorizontal: "auto" }}
      onClick={() => {
        handleCheckbox(studentsArray, index)
      }}
      isChecked={student.asistencia}
      checkBoxColor={"green"}
    />
  );
  const widthArr = [250, 100]

  const getUsername = () => {
    const { nombre, apellido } = route.params
    const lastname = apellido.split(" ")[0]
    const firstname = nombre.charAt(0)
    setUserName(`${lastname} ${firstname}.`)
  }

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

  const getDataTable = (studentsArray) => {
    let tmpData = []
    const tableHead = ['Nombre', 'Asistió']
    studentsArray.map((student, index) => {
      tmpData.push([`${student.apellido} ${student.nombre}`, checkboxTable(student, index, studentsArray)])
    })
    setStudents(studentsArray)
    setDataTable({ tableHead, data: tmpData })
  }

  const getStudentsAssists = async (idCourse, dateSelected) => {
    try {
      setLoading(true)
      const payload = {
        id_curso: idCourse,
        fecha: dateSelected
      }
      let students = await axios.post(`${baseUrl}/assistssByDate`, payload)
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
    getStudentsAssists(value.id, moment(String(date)).format("YYYY-MM-DD"))
    setCourseSelected(value)
  }

  const handleDate = async (value) => {
    setDate(value)
    if (!courseSelected) return
    getStudentsAssists(courseSelected.id, moment(String(value)).format("YYYY-MM-DD"))
  }

  const saveData = async () => {
    try {
      setLoading(true)
      for (const student of students) {
        let payload = {
          id_curso: courseSelected.id,
          id_estudiante: student.id_estudiante,
          asistencia: student.asistencia ? 1 : 0
        }
        if (!student.id_asistencia) {
          payload["fecha"] = moment(String(date)).format("YYYY-MM-DD")
          await axios.post(`${baseUrl}/assists`, payload)
        } else {
          await axios.put(`${baseUrl}/assists/${student.id_asistencia}`, payload)
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
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
          defaultValue={gradeSelected}
          label="Elija grado"
        />
        {gradeSelected &&
          <Select
            data={courses}
            onSelect={(event) => handleSelectCourse(event)}
            defaultValue={courseSelected}
            label="Elija curso"
          />
        }
        <InputDate
          value={date}
          onChange={(e) => handleDate(e)}
        />

        {gradeSelected && courseSelected ?
          <View>
            <CustomTable
              data={dataTable}
              widthArr={widthArr}
            />
            <View style={styles.buttonBlock}>
              <Button
                title="Guardar"
                color="#27509B"
                style={styles.button}
                onPress={() => saveData()}
              />
            </View>
          </View>
          : <Text style={styles.noContent}>Seleccione grado y curso</Text>
        }
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
    flex: 1
  },
  noContent: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  checkbox: {
    alignSelf: 'center',
  },
  buttonBlock: {
    width: 200,
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'center'
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden'
  }
})