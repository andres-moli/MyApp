import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Text, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome5 } from '@expo/vector-icons'; // Importar FontAwesome5 para los iconos
import { fetchDepartments, fetchCities, createClient } from '../api/client';

const CreateClientModal = ({ isVisible, onClose, onCreate }) => {
  const [clientData, setClientData] = useState({
    email: '',
    name: '',
    numberDocument: '',
    telefono: '',
    celular: '',
    departmentId: '',
    cityId: '',
    address: '',
    type: 'CLIENTE_FINAL',
    vertical: '',
  });
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const clearData = () => {
    setClientData({
      email: '',
      name: '',
      numberDocument: '',
      telefono: '',
      celular: '',
      departmentId: '',
      cityId: '',
      address: '',
      type: 'CLIENTE_FINAL',
      vertical: '',
    })
  }
  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchDepartments();
      setDepartments(data);
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (clientData.departmentId) {
        const data = await fetchCities(clientData.departmentId);
        setCities(data);
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [clientData.departmentId]);

  const handleInputChange = (name, value) => {
    setClientData((prevClientData) => ({
      ...prevClientData,
      [name]: value,
      ...(name === 'departmentId' && { cityId: '' }) // Reset cityId when departmentId changes
    }));
  };

  const handleSubmit = () => {
    onCreate(clientData);
    clearData()
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear Nuevo Cliente</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="user" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={clientData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número de Documento</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="id-card" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Número de Documento"
              value={clientData.numberDocument}
              onChangeText={(value) => handleInputChange('numberDocument', value)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="phone-alt" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={clientData.telefono}
              onChangeText={(value) => handleInputChange('telefono', value)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Celular</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="mobile-alt" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Celular"
              value={clientData.celular}
              onChangeText={(value) => handleInputChange('celular', value)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="envelope" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={clientData.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dirección</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="map-marker-alt" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              value={clientData.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vertical</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="ellipsis-h" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Vertical"
              value={clientData.vertical}
              onChangeText={(value) => handleInputChange('vertical', value)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          {/* <Text style={styles.label}>Departamento</Text> */}
          <RNPickerSelect
            selectedValue={clientData.departmentId}
            onValueChange={(value) => handleInputChange('departmentId', value)}
            style={{ ...pickerSelectStyles, inputIOS: { ...pickerSelectStyles.inputIOS, width: '100%' } }}
            placeholder={{ label: 'Selecciona un departamento', value: null }}
            items={departments.map((dept) => (
              { label: dept.name, value: dept.id }
            ))}
          />
        </View>

        <View style={styles.inputContainer}>
          {/* <Text style={styles.label}>Ciudad</Text> */}
          <RNPickerSelect
            selectedValue={clientData.cityId}
            onValueChange={(value) => handleInputChange('cityId', value)}
            style={{ ...pickerSelectStyles, inputIOS: { ...pickerSelectStyles.inputIOS, width: '100%' } }}
            placeholder={{ label: 'Selecciona una ciudad', value: null }}
            items={cities?.map((city) => (
              { label: city.name, value: city.id }
            ))}
          />
        </View>

        <View style={styles.inputContainer}>
          {/* <Text style={styles.label}>Tipo</Text> */}
          <RNPickerSelect
            selectedValue={clientData.type}
            onValueChange={(value) => handleInputChange('type', value)}
            style={{ ...pickerSelectStyles, inputIOS: { ...pickerSelectStyles.inputIOS, width: '100%' } }}
            placeholder={{ label: 'Selecciona un tipo', value: null }}
            items={[
              { label: 'Integrador', value: 'INTEGRADOR' },
              { label: 'Distribuidor', value: 'DISTRIBUIDOR' },
              { label: 'Instalador', value: 'INSTALADOR' },
              { label: 'Cliente Final', value: 'CLIENTE_FINAL' },
            ]}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button title="Crear Cliente" onPress={handleSubmit} />
          <Button title="Cancelar" onPress={onClose} color="red" />
        </View>
      </ScrollView>
    </Modal>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 10,
  },
  placeholder: {
    color: 'gray',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    marginTop: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    fontSize: 20,
    color: '#333',
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
});

export default CreateClientModal;
