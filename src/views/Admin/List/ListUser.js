import React, { useState } from 'react';
import axios from 'axios';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { admin } from '../data';
import { baseUrl } from '../../../utils/baseUrl';
import Container from '../../../components/Container';
import Select from '../../../components/Select';
import CustomTable from '../../../components/CustomTable';
import DeleteModal from '../../../components/DeleteModal';

export default function ListUser({ navigation }) {
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState({})
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const roles = [
    {
      title: "Estudiante"
    },
    {
      title: "Profesor"
    }
  ]

  const widthArr = [200, 80, 80]

  const openDelete = (user) => {
    setVisibleDelete(true)
    setUserToDelete(user)
  }

  const tableButton = (type, user, rol) => (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onPress={() => { type == 'edit' ? navigation.navigate('CreateUser', { user, type: rol, from: 'edit' } || {}) : openDelete(user) }}
    >
      <Image style={{ width: 20, height: 20 }} source={type == 'edit' ? require('../../../assets/icons/edit.png') : require('../../../assets/icons/delete.png')} />
    </TouchableOpacity>
  );

  const getStudents = async () => {
    try {
      setLoading(true)
      let tmpData = []
      const tableHead = ['Nombre', 'Editar', 'Eliminar']
      const res = await axios.get(`${baseUrl}/students`)
      res.data.map(student => {
        tmpData.push([`${student.apellido} ${student.nombre}`, tableButton('edit', student, "Estudiante"), tableButton('delete', student, "Estudiante")])
      })
      setDataTable({ tableHead, data: tmpData })
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const getTeachers = async () => {
    try {
      setLoading(true)
      let tmpData = []
      const tableHead = ['Nombre', 'Editar', 'Eliminar']
      const res = await axios.get(`${baseUrl}/teachers`)
      res.data.map(teacher => {
        tmpData.push([`${teacher.apellido} ${teacher.nombre}`, tableButton('edit', teacher, "Profesor"), tableButton('delete', teacher, "Profesor")])
      })
      setDataTable({ tableHead, data: tmpData })
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const handleRol = async (selectedRol) => {
    if (selectedRol.title == 'Estudiante') {
      await getStudents()
    } else if (selectedRol.title == 'Profesor') {
      await getTeachers()
    }
    setRol(selectedRol)
  }

  const deleteElement = async () => {
    try {
      setLoadingDelete(true)
      if (rol.title == 'Estudiante') {
        await axios.delete(`${baseUrl}/students/${userToDelete.id}`)
        await getStudents()
      } else {
        await axios.delete(`${baseUrl}/teachers/${userToDelete.id}`)
        await getTeachers()
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDelete(false)
      setVisibleDelete(false)
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
          Listar usuarios
        </Text>
        <View style={{ paddingTop: 20 }}>
          <Select
            data={roles}
            onSelect={(event) => handleRol(event)}
            label="Elija rol"
            defaultValue={rol}
          />
          {rol &&
            <CustomTable
              data={dataTable}
              widthArr={widthArr}
              height={450}
            />
          }
          <DeleteModal
            visible={visibleDelete}
            hide={setVisibleDelete}
            loading={loadingDelete}
            message="¿Estás seguro de eliminar el usuario?"
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