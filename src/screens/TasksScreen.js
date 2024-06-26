import React, { useEffect, useState, useCallback } from "react";
import { Text, View, TouchableOpacity, Modal, StyleSheet, Alert, ScrollView, RefreshControl } from "react-native";
import { QueryTask, updateTaskStatus } from "../api/visitComent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { NoVisitsAnimation } from "../function/notVisit";
import Toast from "react-native-toast-message";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from "dayjs";

const TasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // Tarea seleccionada para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [fullDescriptionModalVisible, setFullDescriptionModalVisible] = useState(false);
  const [selectedTaskDescription, setSelectedTaskDescription] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf('week').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().endOf('week').format('YYYY-MM-DD'));
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const fetchTasks = useCallback(async () => {
    const { id } = await JSON.parse(await AsyncStorage.getItem("userData"));
    const variables = {
      where: {
        user: {
          _eq: id,
        },
        type: {
          _eq: "commitments",
        },
        status: {
          _eq: "pendinig",
        },
        date: {
          _gte: startDate,
          _lte: endDate,
        },
      },
    };

    const fetchedTasks = await QueryTask(variables);
    setTasks(fetchedTasks);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // Función para manejar el clic en una tarea y mostrar el modal
  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const showMoreText = (text) => {
    setSelectedTaskDescription(text);
    setFullDescriptionModalVisible(true);
  };

  // Función para actualizar el estado de la tarea y cerrar el modal
  const handleUpdateStatus = async (status) => {
    if (!selectedTask) return;

    const updateInput = {
      id: selectedTask.id,
      status: status,
    };

    Alert.alert(
      "Confirmar acción",
      `¿Estás seguro de marcar esta tarea como ${status === "REALIZED" ? "Realizada" : "Cancelada"}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            const updatedTask = await updateTaskStatus(updateInput);

            if (updatedTask) {
              Toast.show({
                type: 'success',
                text1: '!MUY BIEN!',
                text2: 'La tarea se actualizo con éxito',
              });
              // Filtrar la tarea actualizada del listado
              const updatedTasks = tasks.filter((task) => task.id !== updatedTask.id);
              setTasks(updatedTasks);
              setModalVisible(false);
            } else {
              Alert.alert("Error", "No se pudo actualizar el estado de la tarea");
            }
          },
        },
      ]
    );
  };

  // Función para navegar a la visita asociada
  const navigateToVisit = (visitId) => {
    setModalVisible(false);
    // Implementar la navegación a la pantalla de detalle de visita
    navigation.navigate("VisitDetail", { visitId });
  };

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
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.filterButton} onPress={fetchTasks}>
          <Text style={styles.filterButtonText}>Filtrar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.taskList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {tasks.length === 0 ? (
          <NoVisitsAnimation text="No hay tareas pendientes" />
        ) : (
          tasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskCard} onPress={() => handleTaskPress(task)}>
              <View style={styles.taskCardContent}>
                <Text style={styles.taskDescription} numberOfLines={2} ellipsizeMode="tail">{task.description}</Text>
                <Text onPress={() => showMoreText(task.description)} style={{color: "blue"}}>Leer mas</Text>
                <Text style={styles.taskDate}>Fecha de vencimiento: {dayjs(task.date).format("YYYY-MM-DD HH:mm")}</Text>
              </View>
              <Ionicons name="checkmark-circle-outline" size={52} color="black" style={styles.taskIcon} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal para actualizar el estado de la tarea */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#4CAF50" }]} onPress={() => handleUpdateStatus("REALIZED")}>
              <Text style={styles.modalButtonText}>Marcar como Realizado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#F44336" }]} onPress={() => handleUpdateStatus("CANCELED")}>
              <Text style={styles.modalButtonText}>Cancelar Tarea</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => navigateToVisit(selectedTask?.visit?.id)}>
              <Text style={styles.modalButtonText}>Ver Visita</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para descripción completa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fullDescriptionModalVisible}
        onRequestClose={() => setFullDescriptionModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.fullDescriptionModalView}>
            <ScrollView>
              <Text style={styles.fullDescriptionText}>{selectedTaskDescription}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalButton} onPress={() => setFullDescriptionModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  taskList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskCardContent: {
    flex: 1,
  },
  taskDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  taskDate: {
    fontSize: 12,
    color: "gray",
    fontWeight: 'bold',
  },
  taskIcon: {
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullDescriptionModalView: {
    width: "80%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullDescriptionText: {
    fontSize: 16,
  },
  modalButton: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#2196F3",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
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
});

export default TasksScreen;
