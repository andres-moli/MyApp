import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Asegúrate de importar FontAwesome5 desde '@expo/vector-icons'
import { makePhoneCall, sendEmail } from '../function/notificaction.function';

const ContactCard = ({ contact, onDelete }) => {
  const confirmDelete = () => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que quieres eliminar el contacto ${contact.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => onDelete(contact.id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.contactCard}>
      <View style={styles.row}>
        <FontAwesome5 name="user" style={styles.icon} />
        <Text style={styles.label}>{contact.name}</Text>
        <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
          <FontAwesome5 name="trash" style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
      {/* <View style={styles.row}>
        <FontAwesome5 name="id-card" style={styles.icon} />
        <Text>{contact.numberDocument}</Text>
      </View> */}
      <View style={styles.row}>
        <FontAwesome5 name="envelope" style={styles.icon} />
        <Text onPress={() => { sendEmail(contact.email) }}>{contact.email}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="phone-alt" style={styles.icon} />
        <Text onPress={() => { makePhoneCall(contact.telefono) }}>{contact.telefono}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="mobile-alt" style={styles.icon} />
        <Text onPress={() => { makePhoneCall(contact.telefono) }}>{contact.celular}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="briefcase" style={styles.icon} />
        <Text>{contact.position}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="calendar-alt" style={styles.icon} />
        <Text>{contact.createdAt?.split("T")[0]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contactCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
    fontSize: 20,
    color: '#333',
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  deleteIcon: {
    fontSize: 20,
    color: 'red',
  },
});

export default ContactCard;
