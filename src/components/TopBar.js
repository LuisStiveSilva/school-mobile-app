import React from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'

export default function TopBar({ image, name, userParams = null, navigation }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <Image style={styles.tinyLogo} source={{ uri: image }} resizeMode='contain' />
        <Text style={styles.name}>{name}</Text>
      </View>
      {userParams &&
        <TouchableOpacity onPress={() => navigation.navigate('ManualUser', userParams)}>
          <Image style={styles.helpButton} source={require('../assets/icons/help.png')} />
        </TouchableOpacity>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#27509B',
    position: 'absolute',
    width: "100%",
    top: 0,
    padding: 20,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: 'center'
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,

  },
  name: {
    color: "#fff",
    fontWeight: 'bold'
  },
  helpButton: {
    width: 30,
    height: 30
  }
})