import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
export default function CoursesCard({ data }) {
  return (
    <View style={{ marginTop: 10 }}>
      {
        data.length > 0 ?
          data.map((e, index) => {
            return (
              <View key={`courses-${index}`} style={styles.card}>
                <View>
                  <Text style={styles.cardCourse}>{e.name}</Text>
                  <Text>{e.schedule}</Text>
                </View>
                <View>
                  <Text>{e.classroom}</Text>
                </View>
              </View>
            )
          })
          : <View style={styles.card}>
            <Text>No hay horarios para hoy</Text>
          </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#DDD",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1
  },
  cardCourse: {
    fontWeight: "bold"
  },
  cardButton: {
    backgroundColor: "#27509B",
    paddingVertical: 10
  },
  cardButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
})