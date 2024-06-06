import React,  { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from "@paraboly/react-native-card";
import { HalfModal } from 'react-native-half-modal';
import * as Location from 'expo-location';


const CardHome = () =>{}
const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const createVisit = () => {
    // Aquí puedes implementar la lógica para crear una visita
    // Por ahora, solo cerraremos el modal
    toggleModal();
  };
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Error getting location');
    }
  };
  return (
    <View>
       <CustomButton title="Get Location" onPress={getLocation} />
       {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      {location ? (
        <View style={styles.locationInfo}>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      ) : null}
      <ScrollView  style={styles.scrollView}>
        {Array.from(Array(3).keys()).map((index) => (
          <Card
          key={index}
          title="Title"
          iconName="location"
          iconType="Entypo"
          topRightText="50/301"
          bottomRightText="30 km"
          description="Lorem ipsum dolor sit."
          onPress={() => {}}
          iconBackgroundColor="black"
          shadowStyle={styles.cards}
        />
        ))}
    </ScrollView>
    <TouchableOpacity 
        style={styles.buttomFloanting} 
        onPress={() => { alert('Button is pressed') }} 
    > 
        <Text style={{ color: "white" }}>+</Text> 
    </TouchableOpacity> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  cards: {
    marginBottom: 10
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttomFloanting: {
    borderWidth: 1, 
    borderColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 70, 
    position: 'absolute', 
    top: 390, 
    right: 20, 
    height: 70, 
    backgroundColor: 'black', 
    borderRadius: 100,
    textAlignVertical: "auto"
  }
});

export default HomeScreen;
