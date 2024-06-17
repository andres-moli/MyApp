import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchClients, createClient } from '../api/client';
import { FontAwesome5 } from '@expo/vector-icons';
import CreateClientModal from '../components/CreateClientModal';
import ClientCard from '../components/ClientCard';
import { LoadingApp } from '../function/loading';

const ClientsScreen = ({ navigation }) => {
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    const newClients = await fetchClients(pagination);
    setClients(newClients);
    setLoading(false);
    setHasMore(newClients.length === pagination.take); // Check if there are more clients to load
  };

  const loadMoreClients = async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const newPagination = { ...pagination, skip: pagination.skip + pagination.take };
      const newClients = await fetchClients(newPagination);
      setClients((prevClients) => [...prevClients, ...newClients]);
      setPagination(newPagination);
      setLoadingMore(false);
      setHasMore(newClients.length === pagination.take); // Check if there are more clients to load
    }
  };

  const renderClient = ({ item }) => (
    <ClientCard
      client={item}
      onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}
    />
  );

  const openCreateClientModal = () => {
    setModalVisible(true);
  };

  const handleCreateClient = async (clientData) => {
    const response = await createClient(clientData);
    if(!response){
      setModalVisible(false);
      return
    }

    setClients([]);
    setPagination({ skip: 0, take: 10 });
    loadClients();
  };

  return (
    <View style={styles.container}>
      {loading ? <LoadingApp /> : null}
      <FlatList
        data={clients}
        renderItem={renderClient}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreClients}
        onEndReachedThreshold={0.5}
      />
      <TouchableOpacity style={styles.addButton} onPress={openCreateClientModal}>
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>
      <CreateClientModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateClient}
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
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 15,
  },
});

export default ClientsScreen;
