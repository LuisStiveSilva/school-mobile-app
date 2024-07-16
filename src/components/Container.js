import React from 'react'
import { StyleSheet, View, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import TopBar from './TopBar';

export default function Container({ image, name, children, loading = false, userParams = null, navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <StatusBar
        animated={true}
        backgroundColor="#E00208"
      />
      <View style={styles.container}>
        <TopBar
          image={image}
          name={name}
          userParams={userParams}
          navigation={navigation}
        />

        {loading
          ? <View style={styles.loading}><ActivityIndicator size={100} color="#2A74B6" /></View>
          : <View style={styles.view}>
            {children}
          </View>
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBF4F5',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 130,
    paddingBottom: 100
  },
  view: {
    paddingHorizontal: 20
  },
  contentContainer: {
    flexGrow: 1,
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
    height: 600
  }
})