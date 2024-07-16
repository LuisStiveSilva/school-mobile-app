import React, { useEffect, useState } from "react"
import { StyleSheet, Text, SafeAreaView } from 'react-native'
import CheckBox from 'react-native-check-box'
import Container from "../../../components/Container"
import CustomTable from "../../../components/CustomTable"
import Footer from "../../../components/Footer"
import { footerStudent } from "../../../utils/footerData"
import axios from "axios"
import { baseUrl } from "../../../utils/baseUrl"
import moment from "moment"

export default function TutorshipStudent({ route, navigation }) {
  const [dataTable, setDataTable] = useState({})
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  const getUsername = () => {
    const { nombre, apellido } = route.params
    const lastname = apellido.split(" ")[0]
    const firstname = nombre.charAt(0)
    setUserName(`${lastname} ${firstname}.`)
  }

  const handleCheckbox = async (tutor, index, tutorArray) => {
    try {
      setLoading(true)
      let tmpArray = tutorArray
      if (tutor.id_inscripcion) {
        await axios.delete(`${baseUrl}/inscriptions/${tutor.id_inscripcion}`)
        tmpArray[index].asistencia = 'false'
      } else {
        const payload = {
          id_estudiante: route.params.id,
          id_asesoria: tutor.id_asesoria
        }
        await axios.post(`${baseUrl}/inscriptions`, payload)
        tmpArray[index].asistencia = 'true'
      }
      await getTutorships()
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const checkboxTable = (tutor, index, tutorArray) => (
    <CheckBox
      style={{ flex: 1, padding: 10, marginHorizontal: "auto" }}
      onClick={() => {
        handleCheckbox(tutor, index, tutorArray)
      }}
      isChecked={tutor.asistencia == 'true'}
      checkBoxColor={"green"}
    />
  );
  const widthArr = [100, 100, 100, 50]


  const getDataTable = (tutorArray) => {
    let tmpData = []
    const tableHead = ['Curso', 'Fecha', 'Horario', 'Ir']

    tutorArray.map((tutor, index) => {
      tmpData.push([
        tutor.curso,
        moment(String(tutor.fecha).split("T")[0]).format('DD/MM/YYYY'),
        `${tutor.desde} - ${tutor.hasta}`,
        checkboxTable(tutor, index, tutorArray)
      ])
    })
    setDataTable({ tableHead, data: tmpData })
  }

  const getTutorships = async () => {
    try {
      setLoading(true)
      const payload = {
        id_grado: route.params.id_grado,
        id_estudiante: route.params.id
      }
      const res = await axios.post(`${baseUrl}/tutorshipsByGrade`, payload)
      getDataTable(res.data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTutorships()
    getUsername()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        image="https://sacooliveros.edu.pe/images/sacooliveros/Home/logos/logo-saco-oliveros-helicoidal-3.webp"
        name={userName}
        loading={loading}
        userParams={route.params}
        navigation={navigation}
      >
        <Text style={styles.title}>
          Inscribir a tutoría
        </Text>
        <CustomTable
          data={dataTable}
          widthArr={widthArr}
          height={700}
        />
      </Container>
      <Footer
        data={footerStudent}
        navigation={navigation}
        route={route.params}
        length={5}
      />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EBF4F5',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#27509B'
  },
})