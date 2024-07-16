import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { admin } from '../data';
import { baseUrl } from '../../../utils/baseUrl';
import Container from '../../../components/Container';
import Select from '../../../components/Select';
import CustomTable from '../../../components/CustomTable';
import DeleteModal from '../../../components/DeleteModal';

export default function ListCourses({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState(null)
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const widthArr = [200, 80, 80, 80]

  const openDelete = (course) => {
    setVisibleDelete(true)
    setCourseToDelete(course)
  }

  const tableButton = (type, course) => (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onPress={() => { type == 'edit' ? navigation.navigate('CreateCourses', { course: course, from: 'edit' } || {}) : openDelete(course) }}
    >
      <Image style={{ width: 20, height: 20 }} source={type == 'edit' ? require('../../../assets/icons/edit.png') : require('../../../assets/icons/delete.png')} />
    </TouchableOpacity>
  );

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

  const getCourses = async (idGrade) => {
    try {
      setLoading(true)
      let tmpData = []
      const tableHead = ['Nombre', "Código", 'Editar', 'Eliminar']
      const res = await axios.get(`${baseUrl}/coursesByGrade/${idGrade}`)
      res.data.map(course => {
        tmpData.push([`${course.nombre}`, course.codigo, tableButton('edit', course), tableButton('delete', course)])
      })
      setDataTable({ tableHead, data: tmpData })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGrade = async (value) => {
    await getCourses(value.id)
    setSelectedGrade(value)
  }

  const deleteElement = async () => {
    try {
      setLoadingDelete(true)
      await axios.delete(`${baseUrl}/courses/${courseToDelete.id}`)
      await getCourses(selectedGrade.id)
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDelete(false)
      setVisibleDelete(false)
    }
  }

  useEffect(() => {
    getGrades()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        image={admin.image}
        name={admin.name}
        loading={loading}
      >
        <Text style={styles.title}>
          Listar cursos
        </Text>
        <View style={{ paddingTop: 20 }}>
          <Select
            data={grades}
            onSelect={(event) => handleGrade(event)}
            label="Elija grado"
            defaultValue={selectedGrade}
          />
          {dataTable &&
            <CustomTable
              data={dataTable}
              widthArr={widthArr}
            />
          }
          <DeleteModal
            visible={visibleDelete}
            hide={setVisibleDelete}
            loading={loadingDelete}
            message="¿Estás seguro de eliminar el curso?"
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