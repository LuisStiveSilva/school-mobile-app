import React, { useState } from 'react';
import axios from 'axios';
import { Button, StyleSheet, Text, View, Image, Alert } from 'react-native';
import InputText from '../../components/InputText';
import Constants from 'expo-constants';
import { baseUrl } from '../../utils/baseUrl';
import RequestAlert from '../../components/RequestAlert';

export default function Login({ navigation }) {
  const [dni, setDni] = useState('99999999')
  const [password, setPassword] = useState('password');
  const [error, setError] = useState({ dni: false, password: false });
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [success, setSuccess] = useState(false);

  const checkEmpty = () => {
    setError({
      dni: !dni,
      password: !password
    })
  }

  const login = async () => {
    try {
      checkEmpty()
      if (!dni || !password) return
      setLoading(true)
      setOpenAlert(true)
      const payload = {
        dni,
        password
      }
      if (dni == 99999999 && password == 'password') {
        navigation.navigate('HomeAdmin')
        setSuccess(true)
        setOpenAlert(false)
        setLoading(false)
        return
      }
      const user = await axios.post(`${baseUrl}/login`, payload)
      if (user.data.rol == 'teacher')
        navigation.navigate('HomeTeacher', user.data)
      else if (user.data.rol == 'student')
        navigation.navigate('HomeStudent', user.data)
      setSuccess(true)
      setOpenAlert(false)
    } catch (error) {
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image source={require('../../assets/logo-escuela.webp')} />
      </View>
      <Text style={styles.title}>Bienvenido</Text>
      <InputText
        label="DNI"
        value={dni}
        onChange={setDni}
        placeholder="Ingrese su dni"
        inputMode="numeric"
        error={error.dni}
        errorLabel="Escriba dni"
      />
      <InputText
        label="Contraseña"
        value={password}
        onChange={setPassword}
        placeholder="Ingrese su contraseña"
        password={true}
        error={error.password}
        errorLabel="Escriba contraseña"
      />
      <RequestAlert
        visible={openAlert}
        hide={setOpenAlert}
        loading={loading}
        success={success}
        message={success ? "Exito" : "Error al iniciar sesión"}
      />
      <View style={styles.buttonBlock}>
        <Button
          title="Ingresar"
          color="#27509B"
          style={styles.button}
          onPress={login}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    padding: 20,
    backgroundColor: '#EBF4F5',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    color: '#27509B',
    fontWeight: 'bold',
    marginTop: 40,
    textAlign: 'center'
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
  forgot: {
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: '#27509B',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30
  },
});
