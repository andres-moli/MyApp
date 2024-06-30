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
  Button,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/Cards';
import { QueryVisitByUser } from '../api/visit';
import { NoVisitsAnimation } from '../function/notVisit';

const VisitScreen = () => {
  const navigation = useNavigation();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skip, setSkip] = useState(0);
  const [take] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startDate, setStartDate] = useState(dayjs().startOf('week').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().endOf('week').format('YYYY-MM-DD'));
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  useEffect(() => {
    loadVisits(true);
  }, [endDate]);

  const loadVisits = async (initial = false) => {
    if (initial) {
      setLoading(true);
      setSkip(0);
    } else {
      setIsLoadingMore(true);
    }
    try {
      const newVisits = await QueryVisitByUser({
        pagination: { skip: initial ? 0 : skip, take },
        dateRange: [startDate, endDate],
      });
      if (initial) {
        setVisits(newVisits);
      } else {
        setVisits([...visits, ...newVisits]);
      }
      setHasMore(newVisits.length === take);
      setSkip(initial ? take : skip + take);
    } catch (error) {
      console.error('Error loading visits:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVisits(true);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && !loading && hasMore) {
      loadVisits();
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
      bottomRightText={dayjs(item.dateVisit).format("YYYY-MM-DD HH:mm:ss")}
      description={item.type?.name}
      onPress={() => handlePress(item.id)}
      iconBackgroundColor="black"
      shadowStyle={styles.cards}
    />
  );

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartConfirm = (date) => {
    setStartDate(dayjs(date).format('YYYY-MM-DD'));
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndConfirm = (date) => {
    setEndDate(dayjs(date).format('YYYY-MM-DD'));
    hideEndDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.datePickerContainer}>
        <View style={styles.datePicker}>
          <TouchableOpacity onPress={showStartDatePicker}>
            <Text style={styles.dateText}>Fecha Inicio: {startDate}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartConfirm}
            onCancel={hideStartDatePicker}
          />
        </View>
        <View style={styles.datePicker}>
          <TouchableOpacity onPress={showEndDatePicker}>
            <Text style={styles.dateText}>Fecha Fin: {endDate}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndConfirm}
            onCancel={hideEndDatePicker}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => loadVisits(true)}>
          <Text style={styles.filterButtonText}>Filtrar</Text>
        </TouchableOpacity>
      </View>
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
          data={visits.sort((a, b) => new Date(b.dateVisit) - new Date(a.dateVisit))}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={isLoadingMore && <ActivityIndicator size="large" />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  datePicker: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  filterButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
