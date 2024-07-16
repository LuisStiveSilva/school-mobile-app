import React, { useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import Container from '../../../components/Container';
import { footerTeacher } from '../../../utils/footerData';
import Footer from '../../../components/Footer';
import CustomTable from '../../../components/CustomTable';
import dayjs from 'dayjs';
import { baseUrl } from '../../../utils/baseUrl';
import axios from 'axios';
import moment from 'moment';

export default function TutorshipTutor({ route, navigation }) {
  const [dataTable, setDataTable] = useState([])
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  const widthArr = [150, 100, 100]

  const formatDataTable = (tutorArray) => {
    let tmpData = []
    const tableHead = ['Curso', 'Fecha', "Horario"]
    tutorArray.map((tutor) => {
      tmpData.push([tutor.nombre_curso, moment(String(tutor.fecha).split("T")[0]).format("DD/MM/YYYY"), `${tutor.desde} - ${tutor.hasta}`])
    })

    setDataTable({ tableHead, data: tmpData })
  }

  const getTutorships = async () => {
    try {
      setLoading(true)
      const payload = {
        fecha: moment(String(dayjs())).format("YYYY/MM/DD"),
        id_profesor: route.params.id
      }
      const res = await axios.post(`${baseUrl}/tutorshipsByTeacherDate`, payload)
      formatDataTable(res.data)
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

  useEffect(() => {
    getUsername()
    getTutorships()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        image="https://sacooliveros.edu.pe/images/sacooliveros/Home/logos/logo-saco-oliveros-helicoidal-3.webp"
        name={userName}
        loading={loading}
      >
        <Text style={styles.title}>
          Horario Tutorías
        </Text>
        <CustomTable
          data={dataTable}
          widthArr={widthArr}
        />
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
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#27509B'
  }
})