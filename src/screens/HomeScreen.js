import React,  { useState,useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { QueryVisitDashboardData } from '../api/visit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from 'dayjs';
import es from "dayjs/locale/es";
import CreateVisitModal from '../components/ModalCreateVisit';
import UpdateVisitModal from '../components/ModalUpdateVisit';
import { Card } from '../components/Cards';
import { NoVisitsAnimation } from '../function/notVisit';
import { Greeting } from '../components/Greeting';
import { LoadingApp } from '../function/loading';
import { FontAwesome5 } from '@expo/vector-icons';

dayjs.locale("es");

const HomeScreen = ({ navigation, }) => {
  const [dataUser, setdataUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [visitDashboardData, setVisitDashboardData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState(null);

  const openModal = (visitId) => {
    setSelectedVisitId(visitId);
    setIsModalVisibleUpdate(true);
  };

  const closeModal = () => {
    setSelectedVisitId(null);
    setIsModalVisibleUpdate(false);
    onRefresh()
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  async function getData() {
    const data = await QueryVisitDashboardData();
    setdataUser(JSON.parse(await AsyncStorage.getItem("userData")));
    if (data) {
      console.log(data)
      setVisitDashboardData(data);
    }
  }
  useEffect(() => {
    getData();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };
  if (!visitDashboardData) {
    return (
      <View>
        <LoadingApp></LoadingApp>
      </View>
    );
  }
  return (
    <View>
      <Greeting username={dataUser?.name}></Greeting>
      <ScrollView  style={styles.scrollView}  refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {visitDashboardData.earrings.length > 0 ? visitDashboardData.earrings.map((x) => (
            <Card
            key={x.id}
            title= {x.client.name}
            iconName="location"
            iconType="Entypo"
            topRightText={x.status}
            bottomRightText= {dayjs(x.dateVisit).format("YYYY-MM-DD HH:mm:ss")}
            description={x.type.name}
            onPress={() => navigation.navigate('VisitDetail', { visitId: x.id })}
            iconBackgroundColor="black"
            shadowStyle={styles.cards}
            keyExtractor={(item) => item.id}
          />
        )): <NoVisitsAnimation></NoVisitsAnimation>}
    </ScrollView>
    <TouchableOpacity 
        style={styles.buttomFloanting} 
        onPress={toggleModal}
    > 
      <FontAwesome5 name="plus" size={24} color="white" />
    </TouchableOpacity> 
    <CreateVisitModal isVisible={isModalVisible} onClose={toggleModal} onRefresh={onRefresh} toggleModal={toggleModal} navigation={navigation} />
    <UpdateVisitModal
        isVisible={isModalVisibleUpdate}
        onClose={closeModal}
        visitId={selectedVisitId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  cards: {
    marginBottom: 10
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttomFloanting: {
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
  helloText: {
    fontSize: 16,
    autoCapitalize: true
  }
});

export default HomeScreen;
