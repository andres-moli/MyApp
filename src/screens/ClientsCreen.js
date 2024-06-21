import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ScrollView,RefreshControl } from 'react-native';
import { fetchClients, createClient } from '../api/client';
import { FontAwesome5 } from '@expo/vector-icons';
import CreateClientModal from '../components/CreateClientModal';
import ClientCard from '../components/ClientCard';
import { LoadingApp } from '../function/loading';
import { NoVisitsAnimation } from '../function/notVisit';

const ClientsScreen = ({ navigation }) => {
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
  const onRefresh = async () => {
    setPagination({
      skip: 0,
      take: 10
    })
    setRefreshing(true);
    await loadMoreClients();
    setRefreshing(false);
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
      {loading ? <LoadingApp /> : clients.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.noDataContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <NoVisitsAnimation text="No tienes clientes asociados"></NoVisitsAnimation>
        </ScrollView>
      ) :  <FlatList
      data={clients}
      renderItem={renderClient}
      keyExtractor={(item) => item.id}
      onEndReached={loadMoreClients}
      onEndReachedThreshold={0.5}
    />}
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
    bottom: 80,
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 20,
  },
});

export default ClientsScreen;
