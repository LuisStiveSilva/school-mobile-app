import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import InputText from '../../../components/InputText';
import Container from '../../../components/Container';
import { admin } from '../data';
import Select from '../../../components/Select';
import InputDate from '../../../components/InputDate';
import moment from 'moment';
import { baseUrl } from '../../../utils/baseUrl';
import RequestAlert from '../../../components/RequestAlert';

export default function CreateUser({ route, navigation }) {
  const [name, setName] = useState(route.params.from == 'edit' ? route.params.user.nombre : '')
  const [lastname, setLastname] = useState(route.params.from == 'edit' ? route.params.user.apellido : '')
  const [email, setEmail] = useState(route.params.from == 'edit' ? route.params.user.correo : '')
  const [password, setPassword] = useState(route.params.from == 'edit' ? route.params.user.password : '')
  const [rol, setRol] = useState()
  const [dni, setDni] = useState(route.params.from == 'edit' ? route.params.user.dni : '')
  const [specialty, setSpecialty] = useState(route.params.from == 'edit' ? route.params.user.especialidad : '')
  const [birthday, setBirthday] = useState(route.params.from == 'edit' ? route.params.user.fecha_nacimiento : '')
  const [grades, setGrades] = useState([])
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [loading, setLoading] = useState(false)

  const [saveLoading, setSaveLoading] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState({ name: false, lastname: false, email: false, password: false, rol: false, dni: false, birthday: false, specialty: false, grade: false })

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
        setSelectedGrade(tmpArray.find(e => e.id == route.params.user.id_grado))
      }
      setGrades(tmpArray)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getGrades()
  }, [])

  const roles = [
    {
      title: "Estudiante"
    },
    {
      title: "Profesor"
    }
  ]

  const checkError = () => {
    if (
      name.length == 0 ||
      lastname.length == 0 ||
      email.length == 0 ||
      password.length == 0 ||
      dni.length < 8 ||
      (route.params.from == 'create' ? !rol : false) ||
      ((rol?.title == 'Estudiante' || route.params.type == 'Estudiante') ? birthday.length == 0 : false) ||
      ((rol?.title == 'Estudiante' || route.params.type == 'Estudiante') ? !selectedGrade : false) ||
      ((rol?.title == 'Profesor' || route.params.type == 'Profesor') ? specialty.length == 0 : false)
    ) {
      return true
    }
    else return false
  }

  const clearInput = () => {
    setName('')
    setLastname('')
    setEmail('')
    setPassword('')
    setRol(null)
    setDni('')
    setSpecialty('')
    setBirthday('')
    setSelectedGrade(null)
  }

  const saveData = async () => {
    try {
      setSaveLoading(true)
      setOpenAlert(true)
      setError({
        name: name.length == 0,
        lastname: lastname.length == 0,
        email: email.length == 0,
        password: password.length == 0,
        dni: dni.length < 8,
        rol: !rol,
        birthday: (rol?.title == 'Estudiante' || route.params.type == 'Estudiante') ? birthday.length == 0 : false,
        grade: (rol?.title == 'Estudiante' || route.params.type == 'Estudiante') ? !selectedGrade : false,
        specialty: (rol?.title == 'Profesor' || route.params.type == 'Profesor') ? specialty.length == 0 : false
      })
      if (checkError()) {
        setOpenAlert(false)
        return
      }
      let payload = {
        "nombre": name,
        "apellido": lastname,
        "correo": email,
        "password": password,
        "dni": dni
      }

      if (rol?.title == 'Estudiante' || route.params.type == 'Estudiante') {
        payload["fecha_nacimiento"] = moment(String(birthday)).format("YYYY-MM-DD")
        payload["id_grado"] = selectedGrade.id
        if (route.params.from == 'create') {
          await axios.post(`${baseUrl}/students`, payload)
          clearInput()
        }
        else
          await axios.put(`${baseUrl}/students/${route.params.user.id}`, payload)
        setSuccess(true)
      } else if (rol?.title == 'Profesor' || route.params.type == 'Profesor') {
        payload["especialidad"] = specialty
        if (route.params.from == 'create') {
          await axios.post(`${baseUrl}/teachers`, payload)
          clearInput()
        }
        else
          await axios.put(`${baseUrl}/students/${route.params.user.id}`, payload)
        setSuccess(true)
      }
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
          {route.params.from == 'create' ? 'Crear usuario' : 'Editar usuario'}
        </Text>
        {route.params.from == 'create' &&
          <View style={{ paddingTop: 20 }}>
            <Select
              data={roles}
              onSelect={(event) => setRol(event)}
              label="Elija rol"
              error={error.rol}
            />
          </View>
        }
        {(rol || route.params.from == 'edit') &&
          <View>
            <InputText
              label="Nombre"
              value={name}
              onChange={(event) => setName(event)}
              placeholder='Ingrese nombre'
              error={error.name}
              errorLabel="Nombre requerido"
            />
            <InputText
              label="Apellido"
              value={lastname}
              onChange={(event) => setLastname(event)}
              placeholder='Ingrese apellido'
              error={error.lastname}
              errorLabel="Apellido requerido"
            />
            <InputText
              label="DNI"
              value={dni}
              onChange={(event) => setDni(event)}
              inputMode="numeric"
              placeholder='Ingrese DNI'
              error={error.dni}
              errorLabel="DNI requerido"
            />
            {
              (rol?.title == "Estudiante" || route.params.type == 'Estudiante') &&
              <View>
                <InputDate
                  label="Fecha de nacimiento"
                  value={birthday}
                  onChange={(e) => setBirthday(e)}
                  error={error.birthday}
                  errorLabel="Fecha requerida"
                />
                <Select
                  data={grades}
                  onSelect={(event) => setSelectedGrade(event)}
                  defaultValue={selectedGrade}
                  label="Elija grado"
                  error={error.grade}
                  inputLabel="Grado"
                />
              </View>

            }
            {
              (rol?.title == "Profesor" || route.params.type == 'Profesor') &&
              <InputText
                label="Especialidad"
                value={specialty}
                onChange={(event) => setSpecialty(event)}
                placeholder='Ingrese especialidad'
                error={error.specialty}
                errorLabel="Especialidad requerido"
              />
            }
            <InputText
              label="Correo"
              value={email}
              onChange={(event) => setEmail(event)}
              placeholder='Ingrese correo'
              inputMode="email"
              error={error.email}
              errorLabel="Correo requerido"
            />
            <InputText
              label="Contraseña"
              value={password}
              onChange={(event) => setPassword(event)}
              placeholder='Ingrese contraseña'
              error={error.password}
              errorLabel="Contraseña requerida"
            />
            <View style={styles.buttonBlock}>
              <Button
                title="Guardar"
                color="#27509B"
                style={styles.button}
                onPress={saveData}
              />
            </View>
          </View>
        }
      </Container>
      <RequestAlert
        visible={openAlert}
        hide={setOpenAlert}
        loading={saveLoading}
        success={success}
        message={success ?
          (route.params.from == 'edit' ? "Exito al editar usuario" : "Exito al crear usuario") :
          (route.params.from == 'edit' ? "Hubo un error al editar al usuario" : "Hubo un error al crear al usuario")
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