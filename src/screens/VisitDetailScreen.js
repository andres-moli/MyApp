import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import ShowVisitDetailScreen from '../components/ShowVisitDetail';
import CreateCommentModal from '../components/ModalCreateComent';
import { QueryVisitComments } from '../api/visit';
import { NoVisitsAnimation } from '../function/notVisit';
import { FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';

const VisitDetailScreen = ({ route, navigation }) => {
  const { visitId } = route.params;
  const [isCollapsedDetails, setIsCollapsedDetails] = useState(true);
  const [isCollapsedObservations, setIsCollapsedObservations] = useState(true);
  const [isCollapsedComments, setIsCollapsedComments] = useState(true);
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCreatComent, setModalVisibleCreatComent] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const toggleModal = () => {
    setModalVisibleCreatComent(!modalVisibleCreatComent);
  };

  const toggleModalClose = () => {
    setIsCollapsedDetails(true);
    setIsCollapsedObservations(true);
    setIsCollapsedComments(true);
    setModalVisibleCreatComent(false);
  };

  const onRefeshComent = () => {
    QueryVisitComments(visitId).then((e) => {
      setComments(e);
    });
  };

  useEffect(() => {
    QueryVisitComments(visitId).then((e) => {
      setComments(e);
    });
  }, [visitId]);

  const renderCommentCard = ({ item }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{item.user.name}</Text>
        <Text style={styles.commentDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
        {item.type == "COMMITMENTS" ? <Text style={styles.commentDate}>Fecha vencimiento: {dayjs(item.date).format("YYYY-MM-DD HH:mm")}</Text> : <></> }
        <Text style={styles.commentDate}>Fecha de creacion: {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}</Text>
      </View>
      <TouchableOpacity style={styles.readMoreButton} onPress={() => {
        setModalContent(item.description);
        setModalVisible(true);
      }}>
        <Text style={styles.readMoreText}>Leer más</Text>
      </TouchableOpacity>
    </View>
  );

  const listHeaderComponent = () => (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsCollapsedDetails(!isCollapsedDetails)}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Detalle de la visita</Text>
          <Ionicons name={isCollapsedDetails ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsedDetails}>
        <ShowVisitDetailScreen visitId={visitId} />
      </Collapsible>

      <TouchableOpacity onPress={() => setIsCollapsedObservations(!isCollapsedObservations)}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Resultados</Text>
          <Ionicons name={isCollapsedObservations ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsedObservations}>
        {
          comments.filter(comment => comment.type === 'RESULTS').length > 0
            ? <View style={styles.content}>
                <FlatList
                  data={comments.filter(comment => comment.type === 'RESULTS')}
                  renderItem={renderCommentCard}
                  keyExtractor={item => item.id.toString()}
                  key={item => item.id.toString()}
                  scrollEnabled={false}
                />
              </View>
            : <NoVisitsAnimation text='No se tienen comentarios de resultados' />
        }
      </Collapsible>

      <TouchableOpacity onPress={() => setIsCollapsedComments(!isCollapsedComments)}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Compromisos</Text>
          <Ionicons name={isCollapsedComments ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsedComments}>
        {
          comments.filter(comment => comment.type === 'COMMITMENTS').length > 0
            ? <View style={styles.content}>
                <FlatList
                  data={comments.filter(comment => comment.type === 'COMMITMENTS')}
                  renderItem={renderCommentCard}
                  keyExtractor={item => item.id.toString()}
                  key={item => item.id.toString()}
                  scrollEnabled={false}
                />
              </View>
            : <NoVisitsAnimation text='No se tienen comentarios de compromisos' />
        }
      </Collapsible>
    </View>
  );

  return (
    <>
    <FlatList
      data={[]}
      ListHeaderComponent={listHeaderComponent}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => null}
      ListFooterComponent={
        <>
          <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text>{modalContent}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModal}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <CreateCommentModal visible={modalVisibleCreatComent} onClose={toggleModalClose} visitId={visitId} onRefesh={onRefeshComent} />
        </>
      }
    />
      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  backButton: {
    marginVertical: 20,
    padding: 20,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  visitCard: {

  },
  visitTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  visitDetails: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
  },
  button: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  commentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentDescription: {
    fontSize: 14,
    color: '#666',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
  },
  readMoreButton: {
    marginLeft: 10,
  },
  readMoreText: {
    color: 'blue',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeModal: {
    marginTop: 20,
    color: 'blue',
  },
  buttomFloanting: {
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'relative',
    top: 210,
    right: 20,
    height: 70,
    backgroundColor: 'black',
    borderRadius: 100,
    textAlignVertical: "auto"
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

export default VisitDetailScreen;
