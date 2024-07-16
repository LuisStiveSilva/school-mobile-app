import React from 'react';
import { Pressable, StyleSheet, Text, View, Modal, ActivityIndicator } from 'react-native';

export default function DeleteModal({ visible, hide, loading, message, deleteElement }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        hide(!visible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {loading
            ? <ActivityIndicator size={100} color="#2A74B6" />
            :
            <View style={styles.view}>
              <Text style={styles.message}>{message}</Text>
              <View style={{  flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => hide(!visible)}>
                  <Text style={styles.textStyle}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonAccept]}
                  onPress={() => deleteElement()}>
                  <Text style={styles.textStyle}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          }
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 350,
    maxHeight: 350,
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
    justifyContent: "center",
    alignItems: "center"
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
  image: {
    width: 150,
    height: 150,
  },
  message: {
    fontSize: 21,
    fontWeight: "bold",
    paddingVertical: 10,
    textAlign: "center"
  },
  view: {
    justifyContent: "center",
    alignItems: "center"
  }
})