import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/Cards';
import { QueryVisitByUser } from '../api/visit';

const VisitScreen = () => {
  const navigation = useNavigation();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMoreVisits();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setVisits([]);
    await loadMoreVisits();
    setRefreshing(false);
  };

  const loadMoreVisits = async () => {

    if (loading || !hasMore) return;

    setLoading(true);

    const pagination = { skip: page * 10, take: 10 };

    try {
      const newVisits = await QueryVisitByUser(pagination);
      setVisits([...visits, ...newVisits]);
      setPage(page + 1);
      setHasMore(newVisits.length > 0);
    } catch (error) {
      console.error('Error loading more visits:', error);
    } finally {
      setLoading(false);
    }
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
      onPress={() => {
        handlePress(item.id);
      }}
      iconBackgroundColor="black"
      shadowStyle={styles.cards}
      keyExtractor={(item) => item.id}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={visits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadMoreVisits}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
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
});

export default VisitScreen;
