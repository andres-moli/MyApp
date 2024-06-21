import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/Cards';
import { QueryVisitByUser } from '../api/visit';
import { NoVisitsAnimation } from '../function/notVisit';

const VisitScreen = () => {
  const navigation = useNavigation();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    setLoading(true);
    try {
      const newVisits = await QueryVisitByUser();
      setVisits(newVisits);
    } catch (error) {
      console.error('Error loading visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVisits();
    setRefreshing(false);
  };

  const handlePress = (visitId) => {
    navigation.navigate('VisitDetail', { visitId });
  };

  const renderItem = ({ item }) => (
    <Card
      key={item.id}
      title={item.client.name}
      iconName="location"
      iconType="Entypo"
      topRightText={item.status}
      bottomRightText={item.dateVisit.split('T')[0]}
      description={item.type?.name}
      onPress={() => handlePress(item.id)}
      iconBackgroundColor="black"
      shadowStyle={styles.cards}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : visits.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.noDataContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <NoVisitsAnimation text="No tienes visitas"></NoVisitsAnimation>
        </ScrollView>
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  topRightText: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 14,
    color: 'green',
  },
  bottomRightText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 14,
    color: 'gray',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default VisitScreen;
