import React, { useEffect, useState } from "react"
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Modal, Pressable, View } from 'react-native'
import { footerStudent } from "../../../utils/footerData"
import Container from "../../../components/Container"
import CustomTable from "../../../components/CustomTable"
import Footer from "../../../components/Footer"
import axios from "axios"
import { baseUrl } from "../../../utils/baseUrl"
import moment from "moment"

export default function AssistStudent({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState({})
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [nonAttendanceDate, setNonAttendanceDate] = useState([]);
  const [userName, setUserName] = useState('');

  const widthArr = [200, 150]

  const formatDataTable = (assistArray) => {
    let tmpData = []
    const tableHead = ['Curso', 'Faltas']
    assistArray.map(assist => {
      tmpData.push([assist.curso, modalButton(assist)])
    })
    setDataTable({ tableHead, data: tmpData })
  }

  const getUsername = () => {
    const { nombre, apellido } = route.params
    const lastname = apellido.split(" ")[0]
    const firstname = nombre.charAt(0)
    setUserName(`${lastname} ${firstname}.`)
  }

  const getAssists = async () => {
    try {
      setLoading(true)
      const payload = {
        id_estudiante: route.params.id
      }
      const res = await axios.post(`${baseUrl}/studentsAssists`, payload)
      formatDataTable(res.data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const modalButton = (value) => (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => {
        setModalVisible(true)
        setSelectedCourse(value.curso)
        setNonAttendanceDate(JSON.parse(value.asistencias))
      }}
    >
      <Text style={{ textAlign: 'center', marginVertical: 'auto' }}>
        {JSON.parse(value.asistencias).length}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    getUsername()
    getAssists()
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
          Asistencia
        </Text>
        <CustomTable
          data={dataTable}
          widthArr={widthArr}
          height={700}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{selectedCourse}</Text>
              <View style={{ marginVertical: 20 }}>
                {
                  nonAttendanceDate.length > 0 ?
                    nonAttendanceDate.map((e, index) => (
                      <Text key={`faltas-${index}`} style={styles.listText}>
                        {moment(e.fecha).format('DD/MM/YYYY')}
                      </Text>
                    ))
                    : <Text style={styles.listText}>
                      No tienes faltas
                    </Text>
                }
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </Container>
      <Footer
        data={footerStudent}
        navigation={navigation}
        length={5}
        route={route.params}
      />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EBF4F5',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#27509B'
  },

  //  MODAL
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
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 3,
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
  listText: {
    paddingBottom: 10
  }
})