import React, { useState } from 'react';
import moment from 'moment';
import { Pressable, StyleSheet, Text, View, Modal, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

export default function InputDate({ label, value, onChange, error = false, errorLabel = null }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(value || dayjs());

  const acceptChange = () => {
    setModalVisible(!modalVisible)
    onChange(date)
  }

  return (
    <View style={styles.inputBlock}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View>
        <TouchableOpacity
          style={{ ...styles.input, ...(error && { borderColor: '#E00208' }) }}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.row}>
            <Text>
              {value ? moment(String(value)).format('DD/MM/YYYY') : 'Seleccionar fecha'}
            </Text>
            <Image style={styles.icon} source={require('../assets/icons/calendar.png')} />
          </View>
        </TouchableOpacity>
        {error && <Text style={styles.textError}>{errorLabel}</Text>}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Seleccionar fecha</Text>

              <View style={styles.dateContainer}>
                <DateTimePicker
                  locale="es"
                  mode="single"
                  date={date}
                  onChange={(params) => setDate(params.date)}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Cerrar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonAccept]}
                  onPress={() => acceptChange()}>
                  <Text style={styles.textStyle}>Aceptar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dateContainer: {
    backgroundColor: '#fff',
  },
  inputBlock: {
    marginVertical: 10
  },
  label: {
    fontSize: 20,
    color: '#27509B',
    fontWeight: 'bold',
    marginBottom: 5
  },
  input: {
    borderWidth: 2,
    borderColor: '#27509B',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10
  },
  textError: {
    fontSize: 12,
    color: '#E00208',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
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
    fontWeight: 'bold'
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    margin: 10
  },
  buttonClose: {
    backgroundColor: '#E00208',
  },
  buttonAccept: {
    backgroundColor: '#2A74B6',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 15
  },
  listText: {
    paddingBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    width: 20,
    height: 20
  }
})