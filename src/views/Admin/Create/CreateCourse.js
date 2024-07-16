import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import InputText from '../../../components/InputText';
import Container from '../../../components/Container';
import { admin } from '../data';
import Select from '../../../components/Select';
import { baseUrl } from '../../../utils/baseUrl';
import RequestAlert from '../../../components/RequestAlert';

export default function CreateCourses({ route, navigation }) {
  const [name, setName] = useState(route.params.from == 'edit' ? route.params.course.nombre : '')
  const [code, setCode] = useState(route.params.from == 'edit' ? route.params.course.codigo : '')
  const [grades, setGrades] = useState([])
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState([]);
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
      if (route.params.from == 'edit') {
        setSelectedGrade(tmpArray.find(e => e.id == route.params.course.id_grado))
      }
      setGrades(tmpArray)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const getTeachers = async () => {
    try {
      setLoading(true)
      setTeachers([])
      const res = await axios.get(`${baseUrl}/teachers`)
      const tmpArray = []
      res.data.map(e => {
        tmpArray.push({ id: e.id, title: `${e.apellido} ${e.nombre}` })
      })
      if (route.params.from == 'edit') {
        setSelectedTeacher(tmpArray.find(e => e.id == route.params.course.id_profesor))
      }
      setTeachers(tmpArray)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getGrades()
    getTeachers()
  }, [])

  const checkError = () => {
    if (
      name.length == 0 ||
      code.length > 5 ||
      code.length == 0 ||
      !selectedGrade ||
      !selectedTeacher
    ) return true
    else return false
  }

  const clearInput = () => {
    setName('')
    setCode('')
    setSelectedGrade(null)
    setSelectedTeacher(null)
  }

  const saveData = async () => {
    try {
      setSaveLoading(true)
      setOpenAlert(true)
      setError({
        name: name.length == 0,
        code: code.length > 5 || code.length == 0,
        grade: !selectedGrade,
        teacher: !selectedTeacher
      })
      if (checkError()) {
        setOpenAlert(false)
        return
      }
      let payload = {
        nombre: name,
        codigo: code,
        id_profesor: selectedTeacher.id,
        id_grado: selectedGrade.id
      }
      if (route.params.from == 'create') {
        await axios.post(`${baseUrl}/courses`, payload)
        clearInput()
      }
      else
        await axios.put(`${baseUrl}/courses/${route.params.course.id}`, payload)
      setSuccess(true)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    } finally {
      setSaveLoading(false)
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
          {route.params.from == 'create' ? 'Crear curso' : 'Editar curso'}
        </Text>
        <InputText
          label="Nombre"
          value={name}
          onChange={(event) => setName(event)}
          placeholder='Ingrese nombre'
          error={error.name}
          errorLabel="Nombre requerido"
        />
        <Select
          data={grades}
          onSelect={(event) => setSelectedGrade(event)}
          defaultValue={selectedGrade}
          label="Elija grado"
          error={error.grade}
          inputLabel="Grado"
        />
        <Select
          data={teachers}
          onSelect={(event) => setSelectedTeacher(event)}
          defaultValue={selectedTeacher}
          label="Elija profesor"
          error={error.teacher}
          inputLabel="Profesor"
        />
        <InputText
          label="Código"
          value={code}
          onChange={(event) => setCode(event)}
          placeholder='Ingrese código'
          error={error.code}
          errorLabel="Código requerido"
        />

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
        message={success ?
          (route.params.from == 'edit' ? "Exito al editar curso" : "Exito al crear curso") :
          (route.params.from == 'edit' ? "Hubo un error al editar el curso" : "Hubo un error al crear el curso")
        }
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
    marginTop: 10,
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
  }
})