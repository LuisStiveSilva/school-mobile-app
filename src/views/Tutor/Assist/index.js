import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import CheckBox from 'react-native-check-box'
import { tutor } from '../data';
import Container from '../../../components/Container';
import Select from '../../../components/Select';
import { assists } from './data';
import { footerTutor } from '../../../utils/footerData';
import CustomTable from '../../../components/CustomTable';
import Footer from '../../../components/Footer';

export default function AssistTutor({ navigation }) {
  const [dataTable, setDataTable] = useState('')
  const [courseSelected, setCourseSelected] = useState('');

  const widthArr = [250, 100]
  const courses = [
    {
      title: "Matemática"
    },
    {
      title: "Física"
    }
  ]
  const dates = [
    {
      title: "Hoy"
    }
  ]

  const checkboxTable = (value, index) => (
    <CheckBox
      style={{ flex: 1, padding: 10, marginHorizontal: "auto" }}
      onClick={() => {
        value = !value
      }}
      isChecked={value}
      checkBoxColor={"green"}
    />
  );

  const getData = () => {
    let tmpData = []
    const tableHead = ['Nombre', 'Asistió']
    assists.map((assist, index) => {
      tmpData.push([assist.name, checkboxTable(assist.assist, index)])
    })

    setDataTable({ tableHead, data: tmpData })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        image={tutor.image}
        name={tutor.name}
      >
        <Select
          data={dates}
          onSelect={(event) => console.log(event)}
          defaultValue={{
            title: "Hoy"
          }}
          label="Elija fecha"
        />
        <Select
          data={courses}
          onSelect={(event) => setCourseSelected(event)}
          label="Elija curso"
        />
        {courseSelected ?
          <CustomTable
            data={dataTable}
            widthArr={widthArr}
          />
          : <Text style={styles.noContent}>Seleccione curso</Text>
        }
      </Container>
      <Footer
        data={footerTutor}
        navigation={navigation}
      />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  noContent: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  checkbox: {
    alignSelf: 'center',
  },
})