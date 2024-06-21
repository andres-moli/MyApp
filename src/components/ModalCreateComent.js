import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { CreateVisitComment } from '../api/visit';
import Toast from 'react-native-toast-message';
import { LoadingApp } from '../function/loading';

const CreateCommentModal = ({ visible, visitId, onClose, onRefesh }) => {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      if(description.length > 8000){
        Toast.show({
          type: 'info',
          text1: '!MUY MAL!',
          text2: 'La descripcion supera los 8000 caracteres',
        });
        return
      }
      setLoading(true);
      let status = type == 'COMMITMENTS' ? 'PENDINIG' : null
      const response = await CreateVisitComment({type,description,visitId,status})
      if(response){
        Toast.show({
            type: 'success',
            text1: '!MUY BIEN!',
            text2: 'El comentario se creo con exito se creo con éxito',
          });
          setDescription("")
          setType("")
      }
      onRefesh()
      onClose();
    } catch (error) {
      console.error('Error al crear el comentario:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal visible={visible} transparent={true} >
      <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Nuevo Comentario</Text>
        <Text style={styles.label}>Tipo de comentario:</Text>
        <RNPickerSelect
        items={[{label: "Resultado", value: "RESULTS"}, {label: "Compromisos", value: "COMMITMENTS"}]}
        onValueChange={(value) => setType(value)}
        style={styles.picker}
        value={type}
        darkTheme ={true}
        placeholder={{ label: "Selecione un tipo de visita", value: null }}
      />
        <Text style={styles.label}>Descripción del comentario:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar Comentario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <View style={{paddingStart: 10}}>
        {loading ? <LoadingApp></LoadingApp> : <></>}
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 100,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: "column",
    paddingHorizontal: 20,
    height: 50,
    width: '100%',
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center"
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    padding: 10,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    width: '100%',
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  attachButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  attachButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
export default CreateCommentModal;
