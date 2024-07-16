import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { admin } from '../data';
import { baseUrl } from '../../../utils/baseUrl';
import Container from '../../../components/Container';
import CustomTable from '../../../components/CustomTable';
import DeleteModal from '../../../components/DeleteModal';
import moment from 'moment';

export default function ListTutorships({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState({})
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [tutorshipToDelete, setTutorshipToDelete] = useState(null);

  const widthArr = [120, 120, 100, 100, 100, 80]

  const openDelete = (tutorship) => {
    setVisibleDelete(true)
    setTutorshipToDelete(tutorship)
  }

  const tableButton = (type, tutorship) => (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onPress={() => { type == 'edit' ? navigation.navigate('CreateTutors', { tutorship, from: 'edit' } || {}) : openDelete(tutorship) }}
    >
      <Image style={{ width: 20, height: 20 }} source={type == 'edit' ? require('../../../assets/icons/edit.png') : require('../../../assets/icons/delete.png')} />
    </TouchableOpacity>
  );

  const getTutorships = async () => {
    try {
      setLoading(true)
      let tmpData = []
      const tableHead = ['Curso', 'Profesor', 'Fecha', 'Horario', 'Editar', 'Eliminar']
      const res = await axios.get(`${baseUrl}/tutorships`)
      res.data.map(tutorship => {
        tmpData.push([`${tutorship.curso}`, `${tutorship.profesor}`, `${moment(String(tutorship.fecha.split("T")[0])).format("DD/MM/YYYY")}`, `${tutorship.desde} - ${tutorship.hasta}`, tableButton('edit', tutorship), tableButton('delete', tutorship)])
      })
      setDataTable({ tableHead, data: tmpData })
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const deleteElement = async () => {
    try {
      setLoadingDelete(true)

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDelete(false)
      setVisibleDelete(false)
    }
  }

  useEffect(() => {
    getTutorships()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        image={admin.image}
        name={admin.name}
        loading={loading}
      >
        <Text style={styles.title}>
          Listar tutorías
        </Text>
        <View style={{ paddingTop: 20 }}>
          <CustomTable
            data={dataTable}
            widthArr={widthArr}
            height={450}
          />
          <DeleteModal
            visible={visibleDelete}
            hide={setVisibleDelete}
            loading={loadingDelete}
            message="¿Estás seguro de eliminar la tutoria?"
            deleteElement={deleteElement}
          />
        </View>
      </Container>
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