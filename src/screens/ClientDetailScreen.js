import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { fetchClientDetails, createClientContact } from '../api/client'; // Asegúrate de tener estas funciones definidas
import CreateClientContactModal from '../components/CreateClientContactModal'; // Asegúrate de que este archivo exporte correctamente el componente
import DetailClientCard from '../components/ClientDetialCard'; // Ajusta el nombre del componente si es necesario
import ContactCard from '../components/ContactCard';
import { LoadingApp } from '../function/loading';
import { NoVisitsAnimation } from '../function/notVisit';
import Toast from 'react-native-toast-message';

const ClientDetailScreen = ({ route }) => {
  const { clientId } = route.params;
  const [client, setClient] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingClient, setLoadingClient] = useState(true);
  useEffect(() => {
    loadClientDetails();
  }, []);

  const loadClientDetails = async () => {
    const data = await fetchClientDetails(clientId);
    if(!data) return
    setClient(data.client);
    setContacts(data.contact);
    setLoadingClient(false)
  };

  const renderContact = ({ item }) => (
    <ContactCard contact={item}></ContactCard>
  );

  const openCreateContactModal = () => {
    setModalVisible(true);
  };

  const handleCreateContact = async (contactData) => {
    const response = await createClientContact(contactData);
    if(response){
      setModalVisible(false);
      loadClientDetails();
      Toast.show({
        type: 'success',
        text1: '!MUY BIEN!',
        text2: 'Contacto creado con éxito',
      })
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}></Text>
      <Text style={styles.sectionTitle}>DETALLE DEL CLIENTE</Text>
      {loadingClient ? <LoadingApp></LoadingApp> : <></>}
      {client && (
        <DetailClientCard detail={client}></DetailClientCard>
      )}
      <Text style={styles.sectionTitle}>CONTACTOS DEL CLIENTE</Text>
      {
       contacts?.length > 0 ?
       <>
             <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        style={styles.contactList}
        key={(item) => item.id}
      />
       </> 
       : <NoVisitsAnimation text='No tiene contacto el cliente'></NoVisitsAnimation>
      }
      <TouchableOpacity style={styles.addButton} onPress={openCreateContactModal}>
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>
      <CreateClientContactModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateContact}
        clientId={clientId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "center"
  },
  contactList: {
    flex: 1,
    marginTop: 10,
  },
  contactCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    borderWidth: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 70, 
    position: 'absolute', 
    top: 590, 
    right: 20, 
    height: 70, 
    backgroundColor: 'black', 
    borderRadius: 100,
    textAlignVertical: "auto"
  },
});

export default ClientDetailScreen;
