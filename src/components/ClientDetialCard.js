import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa los iconos que necesites
import { sendEmail } from '../function/notificaction.function';

const DetailClientCard = ({ detail }) => {
  return (
    <View style={styles.card}>
      {/* <View style={styles.section}>
        <Icon name="card" size={24} color="#666" style={styles.icon} />
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value}>{detail.id}</Text>
      </View> */}
      <View style={styles.section}>
        <Icon name="person" size={24} color="#666" style={styles.icon} />
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{detail.name}</Text>
      </View>
      <View style={styles.section}>
        <Icon name="document" size={24} color="#666" style={styles.icon} />
        <Text style={styles.label}>Documento</Text>
        <Text style={styles.value}>{detail.numberDocument}</Text>
      </View>
      <View style={styles.section}>
        <Icon name="mail" size={24} color="#666" style={styles.icon} />
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value} onPress={()=>sendEmail(detail.email)}>{detail.email}</Text>
      </View>
      <View style={styles.section}>
        <Icon name="call" size={24} color="#666" style={styles.icon} />
        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>{detail.telefono}</Text>
      </View>
      <View style={styles.section}>
        <Icon name="cellular" size={24} color="#666" style={styles.icon} />
        <Text style={styles.label}>Celular</Text>
        <Text style={styles.value}>{detail.celular}</Text>
      </View>
      <View style={styles.section}>
        <Icon name="calendar" size={24} color="#666" style={styles.icon} />
        <Text style={styles.label}>Creado</Text>
        <Text style={styles.value}>{detail.createdAt?.split("T")[0]}</Text>
      </View>
      <View style={styles.section}>
        <Icon name="sync" size={24} color="#666" style={styles.icon} />
        <Text style={styles.label}>Actualizado</Text>
        <Text style={styles.value}>{detail.updatedAt?.split("T")[0]}</Text>
      </View>
      {/* <View style={styles.section}>
        <Icon name="trash" size={24} color="#666" style={styles.icon} />
        <Text style={styles.label}>Eliminado</Text>
        <Text style={styles.value}>{detail.deletedAt}</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
});

export default DetailClientCard;
