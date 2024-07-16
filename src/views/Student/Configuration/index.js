import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View, SafeAreaView } from 'react-native';
import Footer from '../../../components/Footer';
import InputText from '../../../components/InputText';
import { footerStudent } from '../../../utils/footerData';
import Container from '../../../components/Container';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseUrl';

export default function ConfigurationStudent({ route, navigation }) {
  const [name, setName] = useState(route.params.nombre)
  const [lastname, setLastname] = useState(route.params.apellido)
  const [email, setEmail] = useState(route.params.correo)
  const [password, setPassword] = useState(route.params.password)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ name: false, lastname: false, email: false, password: false });
  const [userName, setUserName] = useState('');

  const checkError = () => {
    if (
      name.length == 0 ||
      lastname.length == 0 ||
      email.length == 0 ||
      password.length < 8
    ) {
      return true
    }
    else return false
  }

  const getUsername = () => {
    const { nombre, apellido } = route.params
    const lastname = apellido.split(" ")[0]
    const firstname = nombre.charAt(0)
    setUserName(`${lastname} ${firstname}.`)
  }
  const saveData = async () => {
    try {
      setLoading(true)
      setError({
        name: name.length == 0,
        lastname: lastname.length == 0,
        email: email.length == 0,
        password: password.length < 8
      })
      if (checkError()) return

      const payload = {
        nombre: name,
        apellido: lastname,
        correo: email,
        password: password,
        dni: route.params.dni,
        fecha_nacimiento: route.params.fecha_nacimiento
      }
      await axios.put(`${baseUrl}/students/${route.params.id}`, payload)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
        <InputText
          label="Nombre"
          value={name}
          onChange={(event) => setName(event)}
          placeholder='Ingrese nombre'
          error={error.name}
          errorLabel='Campo requerido'
        />
        <InputText
          label="Apellido"
          value={lastname}
          onChange={(event) => setLastname(event)}
          placeholder='Ingrese apellido'
          error={error.lastname}
          errorLabel='Campo requerido'
        />
        <InputText
          label="Correo"
          value={email}
          onChange={(event) => setEmail(event)}
          placeholder='Ingrese correo'
          error={error.email}
          errorLabel='Campo requerido'
        />
        <InputText
          label="Cambiar contraseña"
          value={password}
          onChange={(event) => setPassword(event)}
          placeholder='Ingrese nueva contraseña'
          error={error.password}
          errorLabel='Contraseña debe tener mínimo 8 caracteres'
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
    flex: 1
  },
  buttonBlock: {
    width: 200,
    marginTop: 30,
    alignSelf: 'center'
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden'
  },
})