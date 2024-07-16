import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function InputText({ label, value, onChange, placeholder, inputMode = "text", password = false, error = false, errorLabel = null }) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          style={{ ...styles.input, ...(error && { borderColor: '#E00208' }) }}
          secureTextEntry={password}
          inputMode={inputMode}
          autoCapitalize={inputMode == 'email' && 'none'}
        />
        {error && <Text style={styles.textError}>{errorLabel}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    paddingVertical: 10,
    borderRadius: 10
  },
  textError: {
    fontSize: 12,
    color: '#E00208',
  }
})