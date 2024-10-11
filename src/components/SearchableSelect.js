import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-searchable-dropdown-kj';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DropdownComponent = ({ data, placeholder, onChange }) => {
  const [value, setValue] = useState(null);

  const handleChange = (item) => {
    setValue(item.value);
    if (onChange) {
      onChange(item); // Notificar al componente padre sobre el cambio
    }
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      searchPlaceholder="Buscar..."
      value={value}
      onChange={handleChange}
      // renderLeftIcon={() => (
      //   <AntDesign style={styles.icon} color="black" name="Search" size={20} />
      // )}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    margin: 12,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
