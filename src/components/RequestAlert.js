import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Modal, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

export default function RequestAlert({ visible, hide, loading, success, message }) {
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
              <Image style={styles.image} source={success ? require("../assets/icons/success.png") : require("../assets/icons/error.png")} />
              <Text style={styles.message}>{message}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => hide(!visible)}>
                <Text style={styles.textStyle}>Cerrar</Text>
              </Pressable>
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
    height: 350,
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
    justifyContent:"center",
    alignItems: "center"
  }
})