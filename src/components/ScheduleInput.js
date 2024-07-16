import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, View, SafeAreaView, Text, TextInput, ScrollView } from 'react-native';
import InputText from './InputText';
import Select from './Select';

export default function ScheduleInput({ hour, setHour, minute, setMinute, setDay, error, showDay = true, labelTime, errorDay, day }) {
  const days = [
    {
      title: 'Lunes'
    },
    {
      title: 'Martes'
    },
    {
      title: 'Miércoles'
    },
    {
      title: 'Jueves'
    },
    {
      title: 'Viernes'
    },
    {
      title: 'Sabado'
    },
  ]

  return (
    <ScrollView>
      {showDay &&
        <Select
          data={days}
          onSelect={(event) => setDay(event)}
          label="Elija día"
          error={errorDay}
          defaultValue={day}
        />}
      <View style={styles.inputBlock}>
        <View>
          <Text>{labelTime}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              inputMode="numeric"
              value={hour}
              maxLength={2}
              onChangeText={setHour}
              placeholder="hora"
              style={{ ...styles.input, ...(error?.hour && { borderColor: '#E00208' }), ...({ marginRight: 5 }) }}
            />
            <TextInput
              inputMode="numeric"
              value={minute}
              maxLength={2}
              onChangeText={setMinute}
              placeholder="minuto"
              style={{ ...styles.input, ...(error?.minute && { borderColor: '#E00208' }), ...({ marginLeft: 5 }) }}
            />
          </View>
          {(error?.hour || error?.minute) && <Text style={styles.textError}>Horario requerido</Text>}
        </View>
      </View>
    </ScrollView>
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
    borderRadius: 10,
    flex: 0.5,
  },
  textError: {
    fontSize: 12,
    color: '#E00208',
  }
})