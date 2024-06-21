import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, ScrollView, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Asegúrate de importar los iconos que necesitas

const CreateClientContactModal = ({ isVisible, onClose, onCreate, clientId }) => {
  const [contactData, setContactData] = useState({
    celular: '',
    clientId: clientId,
    email: '',
    name: '',
    numberDocument: '',
    position: '',
  });

  const handleInputChange = (name, value) => {
    setContactData({ ...contactData,    clientId: clientId, [name]: value });
  };

  const handleSubmit = () => {
    onCreate(contactData);
  };
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0; 
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset} // Ajusta según sea necesario
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Nuevo Contacto</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="user" size={20} color="black" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese el nombre"
                  value={contactData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                />
              </View>
            </View>
            {/* <View style={styles.inputContainer}>
              <Text style={styles.label}>Número de Documento</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="id-card" size={20} color="black" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese el número de documento"
                  value={contactData.numberDocument}
                  onChangeText={(value) => handleInputChange('numberDocument', value)}
                />
              </View>
            </View> */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="envelope" size={20} color="black" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese el email"
                  value={contactData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Teléfono</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="phone" size={20} color="black" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese el teléfono"
                  value={contactData.telefono}
                  onChangeText={(value) => handleInputChange('telefono', value)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Celular</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="mobile-alt" size={20} color="black" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese el celular"
                  value={contactData.celular}
                  onChangeText={(value) => handleInputChange('celular', value)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cargo</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="briefcase" size={20} color="black" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese la posición"
                  value={contactData.position}
                  onChangeText={(value) => handleInputChange('position', value)}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Crear Contacto" onPress={handleSubmit} color="#007AFF" />
              <Button title="Cerrar" onPress={onClose} color="#FF3B30" />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40, // Ajuste para espacio adicional al final del ScrollView
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default CreateClientContactModal;
