  import { Ionicons } from "@expo/vector-icons";
  import React, { useEffect, useState } from "react";
  import { NavigationContainer } from "@react-navigation/native";
  import { createNativeStackNavigator } from "@react-navigation/native-stack";
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import LoginScreen from "./src/screens/LoginScreen";
  import HomeScreen from "./src/screens/HomeScreen";
  import InfoScreen from "./src/screens/InfoScreen";
  import { Text, View, Animated, StyleSheet, TouchableOpacity } from "react-native";
  import Toast from 'react-native-toast-message';
import VisitScreen from "./src/screens/VisitScreen";
import VisitDetailScreen from "./src/screens/VisitDetailScreen";
import ClientsScreen from "./src/screens/ClientsCreen";
import ClientDetailScreen from "./src/screens/ClientDetailScreen";
import TasksScreen from "./src/screens/TasksScreen";
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import { VerifyTokenQuery } from "./src/api/auth";
import { LoadingApp } from "./src/function/loading";
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const App = () => {
    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem("userToken");
        //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzZjQ5M2YyLWRiNGItNDU2Yi1iMDlhLWFjNzFjN2FhOWI1ZiIsImhhc0F1dGhvcml6ZWQiOnRydWUsImlhdCI6MTcxOTY4NDYxNCwiZXhwIjoxNzE5NzcxMDE0fQ.p-Rf2PerCju01Msm6pngAE5sPollDp4vGs2fxH8ol9s"
        const verifyToken = await VerifyTokenQuery(token);
        if(verifyToken){
          await AsyncStorage.setItem('userData', JSON.stringify(verifyToken));
          setInitialRoute( "MainTabs");
          return
        }
        setInitialRoute("Login")
        return
        // setIsLoggedIn(!!token); // Se establece en verdadero si existe un token, de lo contrario, en falso
      };
      checkToken();
    }, []);

    if (initialRoute == null)
      // CAMBIA ESTO POR ALGO MEJOR, ESTO ES MIENTRAS SE CARGA LA "SESION" ANTERIOR DEL USUARIO
      return (
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <LoadingApp></LoadingApp>
          <Text>Cargando app...</Text>
        </View>
      );

    const AuthStack = () => (
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VisitDetail" component={VisitDetailScreen} options={{ title: "Detalle de la Visita" }} />
        <Stack.Screen name="ClientDetail" component={ClientDetailScreen} options={{ title: 'Detalle del Cliente', headerShown: true, headerBackTitle: "Volver" }} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    );
    const _renderIcon = (routeName, selectedTab) => {
      let iconName = '';

      switch (routeName) {
        case 'Home':
          iconName = selectedTab === routeName ? 'home' : 'home-outline';
          break;
        case 'Visit':
          iconName = selectedTab === routeName ? 'location' : 'location-outline';
          break;
        case 'Info':
          iconName = selectedTab === routeName ? 'information-circle' : 'information-circle-outline';
          break;
        case 'Client':
          iconName = selectedTab === routeName ? 'person' : 'person-outline';
          break;
        case 'Task':
          iconName = selectedTab === routeName ? 'bag-check' : 'bag-check-outline';
          break;
        default:
          iconName = 'home-outline';
      }

      return <Ionicons name={iconName} size={25} color={selectedTab === routeName ? 'black' : 'gray'} />;
    };
    const renderTabBar = ({ routeName, selectedTab, navigate }) => {
      return (
        <TouchableOpacity
          onPress={() => navigate(routeName)}
          style={styles.tabbarItem}
        >
          {_renderIcon(routeName, selectedTab)}
        </TouchableOpacity>
      );
    }
    const MainTabs = () => (
      <CurvedBottomBarExpo.Navigator
        type="DOWN"
        initialRouteName="Home"
        style={styles.bottomBar}
        shadowStyle={styles.shawdow}
        height={55}
        circleWidth={50}
        bgColor="white"
        screenOptions={({ route }) => ({
        tabBarActiveTintColor: "black",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            }
            if(route.name === "Visit"){
              iconName = focused
                ? "location"
                : "location-outline";
            } 
            else if (route.name === "Info") {
              iconName = focused
                ? "information-circle"
                : "information-circle-outline";
            }
            else if (route.name == "Client"){
              iconName = focused
              ? "person"
              : "person-outline";
            }
            else if (route.name == "Task"){
              iconName = focused
              ? "bag-check"
              : "bag-check-outline";
            }

            return <Ionicons name={iconName} size={size} color={"black"} />;
          },
        })}
        borderTopLeftRight
        renderCircle={({ selectedTab, navigate }) => (
          <Animated.View style={styles.btnCircleUp}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigate("Home")}
            >
              <Ionicons name={'home-outline'} color="gray" size={25} />
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
      >
        <CurvedBottomBarExpo.Screen name="Visit" component={VisitScreen}  options={{ title: "MIS VISTAS" }} position="LEFT" />
        <CurvedBottomBarExpo.Screen name="Client" component={ClientsScreen} options={{ title: "Clientes" }}  position="LEFT"/>
        <CurvedBottomBarExpo.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "HOME" }}
        />
        <CurvedBottomBarExpo.Screen name="Task" component={TasksScreen} options={{ title: "Tareas" }} position="RIGHT" />
        <CurvedBottomBarExpo.Screen name="Info" component={InfoScreen} position="RIGHT" />
      </CurvedBottomBarExpo.Navigator>
    );

    return (
      <NavigationContainer>
        <AuthStack />
        <Toast />
      </NavigationContainer>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    shawdow: {
      shadowColor: '#DDDDDD',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 5,
    },
    button: {
      flex: 1,
      justifyContent: 'center',
    },
    bottomBar: {},
    btnCircleUp: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E8E8E8',
      bottom: 30,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 1,
    },
    imgCircle: {
      width: 30,
      height: 30,
      tintColor: 'gray',
    },
    tabbarItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    img: {
      width: 30,
      height: 30,
    },
    screen1: {
      flex: 1,
      backgroundColor: '#BFEFFF',
    },
    screen2: {
      flex: 1,
      backgroundColor: '#FFEBCD',
    },
  });
export default App;
