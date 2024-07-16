import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Image, View } from 'react-native';
import Container from '../../components/Container';
import Footer from '../../components/Footer';
import { footerStudent, footerTeacher } from '../../utils/footerData';

export default function ManualUser({ route, navigation }) {
  const [userName, setUserName] = useState('');
  const [images, setImages] = useState([]);

  const getUsername = () => {
    const { nombre, apellido } = route.params
    const lastname = apellido.split(" ")[0]
    const firstname = nombre.charAt(0)
    setUserName(`${lastname} ${firstname}.`)
  }

  const manualImages = () => {
    if (route.params.rol == "student") {
      setImages([
        require("../../assets/manual/student/1.png"),
        require("../../assets/manual/student/2.png"),
        require("../../assets/manual/student/3.png"),
        require("../../assets/manual/student/4.png"),
        require("../../assets/manual/student/5.png"),
        require("../../assets/manual/student/6.png"),
      ])
    } else if (route.params.rol == "teacher") {
      setImages([
        require("../../assets/manual/teacher/1.png"),
        require("../../assets/manual/teacher/2.png"),
        require("../../assets/manual/teacher/3.png"),
        require("../../assets/manual/teacher/4.png"),
        require("../../assets/manual/teacher/5.png"),
      ])
    }
  }

  useEffect(() => {
    getUsername()
    manualImages()
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        image="https://sacooliveros.edu.pe/images/sacooliveros/Home/logos/logo-saco-oliveros-helicoidal-3.webp"
        name={userName}
        userParams={route.params}
        navigation={navigation}
      >
        <View>
          {images.map((image, index) => (
            <Image key={index} source={image} style={styles.manualImg} />
          ))}
        </View>
      </Container>
      <Footer
        data={route.params.rol == "student" ? footerStudent : footerTeacher}
        navigation={navigation}
        length={route.params.rol == "student" ? 5 : 4}
        route={route.params}
      />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  manualImg: {
    resizeMode: 'contain',
    height: 600,
    width: 300,
    marginHorizontal: "auto"
  }
})