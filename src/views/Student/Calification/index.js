import React, { useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import Container from '../../../components/Container';
import { footerStudent } from '../../../utils/footerData';
import CustomTable from '../../../components/CustomTable';
import Footer from '../../../components/Footer';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseUrl';

export default function CalificationStudent({ route, navigation }) {
  const [dataTable, setDataTable] = useState('')
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const widthArr = [120, 60, 60, 60, 60, 60]

  const getUsername = () => {
    const { nombre, apellido } = route.params
    const lastname = apellido.split(" ")[0]
    const firstname = nombre.charAt(0)
    setUserName(`${lastname} ${firstname}.`)
  }

  const formatDataTable = (calificationsArray) => {
    let tmpData = []
    const tableHead = ['Curso', 'Cuat. 1', 'Cuat. 2', 'Cuat. 3', 'Cuat. 4', 'Prom']

    const transformCalifications = (califications, period) => {
      const parsed = JSON.parse(califications)
      const nota = parsed?.find(e => e?.periodo == period)?.nota
      return nota
    }
    const calculateAverage = (califications) => {
      const parsed = JSON.parse(califications)
      const nota1 = Number(parsed?.find(e => e?.periodo == "Cuatrimestre 1")?.nota) || 0
      const nota2 = Number(parsed?.find(e => e?.periodo == "Cuatrimestre 2")?.nota) || 0
      const nota3 = Number(parsed?.find(e => e?.periodo == "Cuatrimestre 3")?.nota) || 0
      const nota4 = Number(parsed?.find(e => e?.periodo == "Cuatrimestre 4")?.nota) || 0
      const average = (nota1 + nota2 + nota3 + nota4) / 4
      return average
    }
    calificationsArray.map(calification => {
      tmpData.push([
        calification.curso,
        transformCalifications(calification.calificaciones, 'Cuatrimestre 1') || '-',
        transformCalifications(calification.calificaciones, 'Cuatrimestre 2') || '-',
        transformCalifications(calification.calificaciones, 'Cuatrimestre 3') || '-',
        transformCalifications(calification.calificaciones, 'Cuatrimestre 4') || '-',
        calculateAverage(calification.calificaciones) || '-'
      ])
    })
    setDataTable({ tableHead, data: tmpData })
  }

  const getCalifications = async () => {
    try {
      setLoading(true)
      const payload = {
        id_estudiante: route.params.id
      }
      const res = await axios.post(`${baseUrl}/calificationsByStudent`, payload)
      formatDataTable(res.data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCalifications()
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
          Notas
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
  }
})