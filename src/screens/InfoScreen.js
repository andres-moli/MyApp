import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const InfoScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información del Usuario</Text>
      {user && (
        <>
          <View style={styles.card}>
            <FontAwesome5 name="user" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
          <View style={styles.card}>
            <FontAwesome5 name="id-card" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Número de Identificación:</Text>
            <Text style={styles.value}>{user.identificationNumber}</Text>
          </View>
          <View style={styles.card}>
            <FontAwesome5 name="black-tie" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Cargo:</Text>
            <Text style={styles.value}>{user.position}</Text>
          </View>
          <View style={styles.card}>
            <FontAwesome5 name="envelope" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.card}>
            <FontAwesome5 name="phone" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Celular:</Text>
            <Text style={styles.value}>{user.celular}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
            <FontAwesome5 name="door-closed" size={20} color="#fff" style={{...styles.icon, textAlign: "center", padding: 1}} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 150,
  },
  value: {
    flex: 1,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default InfoScreen;
