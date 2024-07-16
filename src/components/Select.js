import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Select({ data, onSelect, label, defaultValue = null, error = null, inputLabel = null, disabled = false }) {
  return (
    <View>
      {inputLabel && <Text style={styles.label}>{inputLabel}</Text>}
      <SelectDropdown
        data={data}
        onSelect={(selectedItem) => {
          onSelect(selectedItem)
        }}
        disabled={disabled}
        defaultValue={defaultValue}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={{ ...styles.dropdownButtonStyle, ...(error && { marginBottom: 10 }), ...(disabled && { backgroundColor: '#ccc' }) }}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {selectedItem ? selectedItem.title : defaultValue ? defaultValue.title : label}
              </Text>
              <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
              <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
              <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={{ ...styles.dropdownMenuStyle, ...(data.length > 3 && { height: 150 }) }}
      />
      {error && <Text style={styles.textError}>Seleccione algo</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginVertical: 10,
    borderColor: "#27509B",
    borderWidth: 2
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  textError: {
    fontSize: 12,
    color: '#E00208',
  },
  label: {
    fontSize: 20,
    color: '#27509B',
    fontWeight: 'bold',
  },
})