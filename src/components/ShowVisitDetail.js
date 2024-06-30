import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ActivityIndicator,ScrollView, Alert } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import { URL_API_GRAPHQL } from '../constants';
import { QueryVisitOne, UpdateVisit } from '../api/visit';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from '@react-navigation/native';
import MapScreen from './Map';
import { makePhoneCall, sendEmail } from '../function/notificaction.function';
import MapComponent from './Map';
import dayjs from 'dayjs';
export const ShowVisitDetailScreen = ({visitId }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [visit, setVisit] = useState(null);
  const confirmUpdate = (realized = null) => {
    if(realized && !(dayjs().isSame(visit?.dateVisit, 'day'))){
      alert("No puedes realizar la visita hasta que no sea el dia")
      return
    }
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas continuar?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Aceptar", onPress: () => {realized == 'realizar' ? handleRealizeVisit(): handleCancelVisit()} }
      ],
      { cancelable: false }
    );
  }
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
        setTimeout(() =>{
          navigation.navigate('MainTabs');
        }, 1000)
       }
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
  useEffect( () =>{
    QueryVisitOne(visitId).then((response) => {
        setVisit(response);
      })
  }, [])


  const handleRealizeVisit = async () => {
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
      <View style={styles.overlay}>
        <View style={styles.container}>
        {/* <View style={stylesModal.header}>
          <Text style={stylesModal.title}>Datos de la visita</Text>
        </View> */}
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
            <View style={stylesModal.labelContainer}>
                <Text style={stylesModal.label}><Icon name="user" size={20} color="#333" /> Nombre del cliente</Text>
                <Text style={stylesModal.value}>{visit?.client?.name}</Text>
            </View>
            <View style={stylesModal.divider} />
            <View style={stylesModal.labelContainer}>
                <Text style={stylesModal.label}><Icon name="map" size={20} color="#333" /> Dirección del cliente</Text>
                <Text style={stylesModal.value}>{visit?.client?.address}</Text>
            </View>
            <View style={stylesModal.divider} />
            <View style={stylesModal.labelContainer}>
                <Text style={stylesModal.label}><Icon name="envelope-o" size={20} color="#333" /> Correo electrónico</Text>
                <Text style={stylesModal.value}  onPress={() => sendEmail(visit?.client?.email)}>{visit?.client?.email}</Text>
            </View>
            <View style={stylesModal.divider} />
            <View style={stylesModal.labelContainer}>
                <Text style={stylesModal.label}><Icon name="phone" size={20} color="#333" /> Número de celular</Text>
                <Text style={stylesModal.value} onPress={() => makePhoneCall(visit?.client?.celular)}>{visit?.client?.celular}</Text>
            </View>
            <View style={stylesModal.divider} />
            <View style={stylesModal.labelContainer}>
                <Text style={stylesModal.label}><Icon name="clipboard" size={20} color="#333" /> ¿Tiene proyecto?</Text>
                <Text style={stylesModal.value}>{visit ? visit?.isProyect ? 'SI' : 'NO' : ''}</Text>
            </View>
            <View style={stylesModal.divider} />
            <View style={stylesModal.labelContainer}>
                <Text style={stylesModal.label}><Icon name="calendar" size={20} color="#333" /> Fecha de la visita</Text>
                <Text style={stylesModal.value}>{dayjs(visit?.dateVisit).format("YYYY-MM-DD HH:mm:ss")}</Text>
            </View>
            <View style={stylesModal.divider} />
            <View style={stylesModal.labelContainer}>
                <Text style={stylesModal.label}><Icon name="tag" size={20} color="#333" /> Tipo de la visita</Text>
                <Text style={stylesModal.value}>{visit?.type?.name}</Text>
            </View>
            <View style={stylesModal.divider} />
            <View style={stylesModal.labelContainer}>
                <Text style={stylesModal.label}><Icon name="file-o" size={20} color="#333" /> Descripción</Text>
                <View style={stylesModal.descriptionContainer}>
                <ScrollView>
                    <Text style={stylesModal.value}>{visit?.description}</Text>
                </ScrollView>
                </View>
            </View>
            <>
            </>
            {(visit?.status == 'confirmed' || visit?.status == 'reprogrammed') && (
                <>
                <View style={stylesModal.divider} />
                <TouchableOpacity style={styles.buttonCancelar} onPress={() => confirmUpdate()}>
                    <Text style={styles.buttonText}><Icon name="remove" size={20} color="#fff" /> Cancelar Visita</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => confirmUpdate("realizar")}>
                    <Text style={styles.buttonText}><Icon name="check" size={20} color="#fff" /> Realizar Visita</Text>
                </TouchableOpacity>
                </>
            )}
            </>
          )}
        </View>
      </View>
 
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#038518',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonCancelar: {
    backgroundColor: '#ab030c',
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
    textAlign: "center"
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
const stylesModal = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  closeButton: {
    padding: 5,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
  },
  labelContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  descriptionContainer: {
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
});
export default ShowVisitDetailScreen;
