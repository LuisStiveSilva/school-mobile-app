import React from 'react'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import { Row, Table } from 'react-native-table-component'

export default function CustomTable({ data, widthArr, height = 300 }) {
  return (
    <View
      style={{ ...styles.tableContainer, ...({ maxHeight: height }) }}
    >
      <ScrollView horizontal={true}>
        {data && data?.data?.length > 0 ?
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              <Row data={data.tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.headerText} />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                {
                  data?.data?.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      style={styles.row}
                      textStyle={styles.text}
                      widthArr={widthArr}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
          :
          <Text>No hay data</Text>
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    paddingTop: 30,
    marginHorizontal: "auto"
  },
  text: {
    textAlign: 'center'
  },
  header: {
    height: 50,
    backgroundColor: '#2A74B6'
  },
  dataWrapper: {
    marginTop: -1
  },
  row: {
    height: 40,
    backgroundColor: '#fff'
  },
  headerText: {
    color: "#fff",
    textAlign: 'center'
  },
})