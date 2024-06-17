import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput,StyleSheet ,TouchableOpacity, Switch } from 'react-native';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import es from "dayjs/locale/es";
import Toast from 'react-native-toast-message';
import { QueryClients } from '../api/client';
import { CreateVisit, QueryTypeVisit } from '../api/visit';
import { LoadingApp } from "../function/loading";

const CREATE_VISIT_URL = 'http://your-api-url.com/createVisit'; // Reemplaza esta URL por la URL de tu endpoint de creación de visita

export const CreateVisitModal = ({ isVisible, onClose,onRefresh, toggleModal }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [description, setDescription] = useState('');
  const [isProyect, setIsProject] = useState(false);
  const [status, setStatus] = useState('confirmed');
  const [visitDate, setVisitDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [clients, setClients] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
    useEffect( () => {
        QueryClients().then((response) => {
            setClients(response);
        })
        QueryTypeVisit().then((response) => {
            setTypes(response)
        })
        // Llamar al servicio para obtener los tipos
    }, []);
  const toggleSwitch = () => setIsProject(previousState => !previousState);
  const handleCreateVisit = () => {
    setLoading(true);
    // Realizar la llamada a la API para crear la visita
    CreateVisit({
      clientId: selectedClientId,
      typeId: selectedTypeId,
      dateVisit:visitDate,
      description,
      isProyect,
      status, // Hardcoded for example
    })
    .then(response => {
    if(response){
      Toast.show({
        type: 'success',
        text1: '!MUY BIEN!',
        text2: 'La visita se creo con éxito',
      });
        onClose();
        onRefresh()
    }
    if(!response){
      onClose();
      setTimeout(() => {
        toggleModal()
      }, 2000);
    }
    })
    .catch(error => {
      console.error('Error creating visit:', error);
    }).finally(() =>{
      setLoading(false);
    });
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} finally={onRefresh} toggleModal={toggleModal} >
    <View style={styles.container}>
      <Text style={styles.header}>Crear una visita</Text>
      {loading ? <LoadingApp></LoadingApp> : <></>}
      <Text style={styles.label}>Cliente:</Text>
      <RNPickerSelect
        items={clients.map(client => ({ label: client.name, value: client.id }))}
        onValueChange={(value) => setSelectedClientId(value)}
        value={selectedClientId}
        style={styles.select}
        darkTheme ={true}
        styles={pickerSelectStyles.inputAndroid}
        placeholder={{ label: "Selecione un cliente", value: null }}
      />
      <Text style={styles.label}>Tipo de visita:</Text>
      <RNPickerSelect
        items={types.map(type => ({ label: type.name, value: type.id }))}
        onValueChange={(value) => setSelectedTypeId(value)}
        value={selectedTypeId}
        style={styles.select}
        styles={pickerSelectStyles.inputAndroid}
        darkTheme ={true}
        placeholder={{ label: "Selecione un tipo de visita", value: null }}
      />
      <Text style={styles.label}>{"¿Tiene proyecto? (NO / SI)"}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#0ac729' }}
        thumbColor={isProyect ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isProyect}
      />
      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        value={description}
        onChangeText={(text) => setDescription(text)}
        style={styles.input}
        multiline={false}
        autoCorrect ={true}
        editable= {true}
        numberOfLines={4}
      />
      <Text style={styles.label}>{visitDate ? dayjs(visitDate).format("dddd D [de] MMMM [del] YYYY") : "No has selecionado el dia"}:</Text>
      <Button title="Selecione el día" style={styles.buttonText} onPress={() => setDatePickerVisibility(true)} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setVisitDate(date);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateVisit}>
        <Text style={styles.buttonText}>Crear Visita</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </Modal>
  );
};
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      justifyContent: 'flex-start',
      flexDirection: "column"
    },
    header: {
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
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginBottom: 20,
      width: '100%',
      minHeight: 100,
      textAlignVertical: "top"
    },
    select: {
      inputIOS: {
        ...this.input,
        paddingRight: 30,
      },
      inputAndroid: {
        ...this.input,
      },
    },
    button: {
      backgroundColor: 'black',
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    cancelButton: {
      marginTop: 10,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: 'gray',
      fontSize: 16,
    },
  });
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30 // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30 // to ensure the text is never behind the icon
    }
});
export default CreateVisitModal;
