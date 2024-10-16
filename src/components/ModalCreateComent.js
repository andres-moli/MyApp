import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { CreateVisitComment } from '../api/visit';
import Toast from 'react-native-toast-message';
import { LoadingApp } from '../function/loading';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';

const CreateCommentModal = ({ visible, visitId, onClose, onRefesh }) => {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSubmit = async () => {
    try {
      if(description.length > 8000){
        Alert.alert('La descripcion supera los 8000 caracteres')
        return
      }
      if(description.length == 0){
        Alert.alert('La descripcion es obligatoria')
        return
      }
      if(type == 'COMMITMENTS'){
        if(!date){
          Alert.alert('Debes selecionar una fecha de vencimiento')
          return
        }
      }
      setLoading(true);
      let status = type == 'COMMITMENTS' ? 'PENDINIG' : null
      const response = await CreateVisitComment({type,description,visitId,status,date})
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
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Nuevo Comentario</Text>
        <Text style={styles.label}>Tipo de comentario:</Text>
        <RNPickerSelect
        items={[{label: "Resultado", value: "RESULTS"}, {label: "Compromisos", value: "COMMITMENTS"}]}
        onValueChange={(value) => {
          setType(value)
          if(value == "COMMITMENTS"){
            setDatePickerVisibility(true)
          } else {
            setDatePickerVisibility(false)
            setDate(null)
          }
        }}
        style={styles.picker}
        value={type}
        darkTheme ={true}
        placeholder={{ label: "Selecione un tipo de comentario", value: null }}
      />
        <Text style={styles.label}>Descripción del comentario:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {date ? <Text style={styles.label}>{date ? dayjs(date).format("dddd D [de] MMMM [del] YYYY [a las] hh:mm A") : "No has selecionado el dia"}</Text> : <></>}
        {date ? <Button title="Selecione el día" style={styles.buttonText} onPress={() => setDatePickerVisibility(true)} /> : <></> }
        <Text/>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          date={date || new Date()}
          onConfirm={(date) => {
            setDate(date)
            setDatePickerVisibility(false);
          }}
          minimumDate={new Date()}
          onCancel={() => setDatePickerVisibility(false)}
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
