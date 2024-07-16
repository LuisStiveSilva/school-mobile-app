import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native'

export default function Footer({ data, navigation, length = 4, route }) {
  return (
    <View style={styles.footer}>
      <View style={styles.footerFlex}>
        {data.map((e, index) => (
          <TouchableOpacity
            key={`footer-${index}`}
            style={{ ...styles.footerButton, ...({ width: `${100 / length}%` }) }}
            onPress={() => navigation.navigate(e.link, route)}
          >
            <Image
              style={styles.iconRouter}
              source={e.image}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -15,
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
  },
  footerFlex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  footerButton: {
    backgroundColor: "#E00208",
    borderWidth: 1,
    paddingVertical: 10
  },
  iconRouter: {
    width: 30,
    height: 30,
    margin: 'auto'
  }
})
