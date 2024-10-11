import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { fetchClientDetails, createClientContact, deleteClientContact, DeleteClientContact, UpdateClienteContactMutation } from '../api/client';
import CreateClientContactModal from '../components/CreateClientContactModal';
import DetailClientCard from '../components/ClientDetialCard';
import ContactCard from '../components/ContactCard';
import { LoadingApp } from '../function/loading';
import { NoVisitsAnimation } from '../function/notVisit';
import Toast from 'react-native-toast-message';
import UpdateClientContactModal from '../components/UpdateClientContact';

const ClientDetailScreen = ({ route }) => {
  const { clientId } = route.params;
  const [client, setClient] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingClient, setLoadingClient] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);


  useEffect(() => {
    loadClientDetails();
  }, []);

  const loadClientDetails = async () => {
    const data = await fetchClientDetails(clientId);
    if (!data) return;
    setClient(data.client);
    setContacts(data.contact);
    setLoadingClient(false);
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity onPress={() => openUpdateContactModal(item)}>
      <ContactCard contact={item} onDelete={handleDeleteContact} />
    </TouchableOpacity>
  );

  const openCreateContactModal = () => {
    setModalVisible(true);
  };
  const openUpdateContactModal = (contact) => {
    setSelectedContact(contact);
    setUpdateModalVisible(true);
  };
  

  const handleCreateContact = async (contactData) => {
    const response = await createClientContact(contactData);
    if (response) {
      setModalVisible(false);
      loadClientDetails();
      Toast.show({
        type: 'success',
        text1: '¡MUY BIEN!',
        text2: 'Contacto creado con éxito',
      });
    }
  };

  const handleDeleteContact = async (contactId) => {
    const response = await DeleteClientContact(contactId);
    if (response) {
      loadClientDetails();
      Toast.show({
        type: 'success',
        text1: '¡ÉXITO!',
        text2: 'Contacto eliminado con éxito',
      });
    }
  };
  const handleUpdateContact = async (contactData) => {
    const response = await UpdateClienteContactMutation(contactData); // Asegúrate de tener una función updateClientContact en tu API
    if (response) {
      setUpdateModalVisible(false);
      loadClientDetails();
      Toast.show({
        type: 'success',
        text1: '!MUY BIEN!',
        text2: 'Contacto actualizado con éxito',
      });
    }
  };
  

  return (
    <View style={styles.container}>
      {loadingClient ? (
        <LoadingApp />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {client && <DetailClientCard detail={client} />}
              <Text style={styles.sectionTitle}>CONTACTOS DEL CLIENTE</Text>
            </>
          }
          data={contacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<NoVisitsAnimation text='No tiene contacto el cliente' />}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={openCreateContactModal}>
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>
      <CreateClientContactModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateContact}
        clientId={clientId}
      />
      <UpdateClientContactModal
      isVisible={updateModalVisible}
      onClose={() => setUpdateModalVisible(false)}
      onUpdate={handleUpdateContact}
      contact={selectedContact}
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
    textAlign: 'center',
  },
  addButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 30, // Ajuste para hacer visible el botón flotante
    right: 20,
    height: 70,
    backgroundColor: 'black',
    borderRadius: 100,
    textAlignVertical: 'auto',
  },
});

export default ClientDetailScreen;
