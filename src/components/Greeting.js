import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const Greeting = ({ username }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon n name="hand-wave" size={30} color="#000" style={styles.icon} />
        <Text style={styles.greeting}>Hola, {username}!</Text>
      </View>
      <Text style={styles.message}>Bienvenido de nuevo. Nos alegra verte.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    margin: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
});
