  import { Ionicons } from "@expo/vector-icons";
  import React, { useEffect, useState } from "react";
  import { NavigationContainer } from "@react-navigation/native";
  import { createNativeStackNavigator } from "@react-navigation/native-stack";
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import LoginScreen from "./src/screens/LoginScreen";
  import HomeScreen from "./src/screens/HomeScreen";
  import InfoScreen from "./src/screens/InfoScreen";
  import { Text, View } from "react-native";
  import Toast from 'react-native-toast-message';
import VisitScreen from "./src/screens/VisitScreen";
import VisitDetailScreen from "./src/screens/VisitDetailScreen";
import ClientsScreen from "./src/screens/ClientsCreen";
import ClientDetailScreen from "./src/screens/ClientDetailScreen";

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const App = () => {
    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem("userToken");
        setInitialRoute(Boolean(token) ? "MainTabs" : "Login");
        // setIsLoggedIn(!!token); // Se establece en verdadero si existe un token, de lo contrario, en falso
      };
      checkToken();
    }, []);

    if (initialRoute == null)
      // CAMBIA ESTO POR ALGO MEJOR, ESTO ES MIENTRAS SE CARGA LA "SESION" ANTERIOR DEL USUARIO
      return (
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text>Splash</Text>
        </View>
      );

    const AuthStack = () => (
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VisitDetail" component={VisitDetailScreen} options={{ title: "Detalle de la Visita" }} />
        <Stack.Screen name="ClientDetail" component={ClientDetailScreen} options={{ title: 'Detalle del Cliente' }} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    );

    const MainTabs = () => (
      <Tab.Navigator
      initialRouteName="Home"
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

            return <Ionicons name={iconName} size={size} color={"black"} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "HOME" }}
        />
        <Tab.Screen name="Visit" component={VisitScreen}  options={{ title: "MIS VISTAS" }} />
        <Tab.Screen name="Client" component={ClientsScreen} options={{ title: "Clientes" }} />
        <Tab.Screen name="Info" component={InfoScreen} />
      </Tab.Navigator>
    );

    return (
      <NavigationContainer>
        <AuthStack />
        <Toast />
      </NavigationContainer>
    );
  };

  export default App;
