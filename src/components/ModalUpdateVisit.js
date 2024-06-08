import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import { URL_API_GRAPHQL } from '../constants';
import { UpdateVisit } from '../api/visit';
import Toast from 'react-native-toast-message';

export const UpdateVisitModal = ({ isVisible, onClose, visitId }) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateVisit = async (status, latitude = null, longitude= null ) => {
    setLoading(true);

    try {
        const response = await UpdateVisit( {
            id: visitId,
            status,
            latitude,
            longitude
          })
       if(response){
        Toast.show({
          type: 'success',
          text1: '!MUY BIEN!',
          text2: 'La visita se actualizo con éxito',
        })
        onClose();
        return
       }
       onClose();
       return
    } catch (error) {
      console.error('Error updating visit:', error);
      Alert.alert('Error', 'There was an error updating the visit.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelVisit = () => {
    handleUpdateVisit('canceled');
  };

  const handleRealizeVisit = async () => {
    isVisible = false
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    handleUpdateVisit('realized', latitude?.toString(), longitude?.toString() );
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>ESTADO DE LA VISITA</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require('../assets/animations/loading-animation.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
              <Text style={styles.loadingText}>Cargando...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.buttonCancelar} onPress={handleCancelVisit}>
                <Text style={styles.buttonText}>Cancelar Visita</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleRealizeVisit}>
                <Text style={styles.buttonText}>Realizar Visita</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonCancelar: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'gray',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default UpdateVisitModal;
