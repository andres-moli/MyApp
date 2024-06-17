import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa los iconos que necesites

const ClientCard = ({ client, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.clientName}>{client.name?.toUpperCase()}</Text>
        <View style={styles.clientDetailContainer}>
          <Icon name="document" size={20} color="#666" style={styles.icon} />
          <Text style={styles.clientDetail}>{client.numberDocument}</Text>
        </View>
        <View style={styles.clientDetailContainer}>
          <Icon name="mail" size={20} color="#666" style={styles.icon} />
          <Text style={styles.clientDetail}>{client.email}</Text>
        </View>
        <View style={styles.clientDetailContainer}>
          <Icon name="call" size={20} color="#666" style={styles.icon} />
          <Text style={styles.clientDetail}>{client.telefono}</Text>
        </View>
        <View style={styles.clientDetailContainer}>
          <Icon name="cellular" size={20} color="#666" style={styles.icon} />
          <Text style={styles.clientDetail}>{client.celular}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  clientDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientDetail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
});

export default ClientCard;
