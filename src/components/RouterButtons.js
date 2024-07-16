import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native'

export default function RouterButtons({ data, navigation }) {
  return (
    <View style={styles.router}>
      {data.map((e, index) => {
        return (
          <TouchableOpacity
            key={`router-button-${index}`}
            style={{ ...styles.routerButton, ...({ backgroundColor: e.color }) }}
            onPress={() => navigation.navigate(e.link, e.routerParams || {})}
          >
            <Image
              style={styles.iconRouter}
              //source={require('../assets/icons/graduation.png')}
              source={e.image}
            />
            <Text
              style={styles.routerLabel}
            >
              {e.title}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  routerButton: {
    width: 150,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconRouter: {
    width: 100,
    height: 100
  },
  routerLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    color: "#fff"
  },
  router: {
    paddingTop: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 30
  }
})