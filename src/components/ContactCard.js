import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Asegúrate de importar FontAwesome5 desde '@expo/vector-icons'
import { makePhoneCall } from '../function/notificaction.function';

const ContactCard = ({ contact }) => {
  return (
    <View style={styles.contactCard}>
      <View style={styles.row}>
        <FontAwesome5 name="user" style={styles.icon} />
        <Text style={styles.label}>{contact.name}</Text>
      </View>
      {/* <View style={styles.row}>
        <FontAwesome5 name="id-card" style={styles.icon} />
        <Text>{contact.numberDocument}</Text>
      </View> */}
      <View style={styles.row}>
        <FontAwesome5 name="envelope" style={styles.icon} />
        <Text>{contact.email}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="phone-alt" style={styles.icon} />
        <Text onPress={()=> {makePhoneCall(contact.telefono)}}>{contact.telefono}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="mobile-alt" style={styles.icon} />
        <Text onPress={()=> {makePhoneCall(contact.telefono)}}>{contact.celular}</Text>
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
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default ContactCard;
