import React, { useState } from "react";
import { View, TextInput, StyleSheet, Image, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "../components/CustomText";
import CustomButton from "../components/CustomButton";
import Background from "../components/Background";
import { QuerySignIn } from "../api/auth";
import { LoadingApp } from "../function/loading";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    
    try {
      setLoading(true);
      const response = await QuerySignIn(email,password)
      
      if(!response) {
        //Toast.error("Usuario o contraseña incorrecto");
        //Alert.alert('Permission Denied', 'Usuario o contraseña incorrecto');
        return
      } 
      await AsyncStorage.setItem("userToken",response.token);
      await AsyncStorage.setItem("userData", JSON.stringify(response.user));
      setEmail("")
      setPassword("")
      navigation.navigate("MainTabs");
    } catch (error) {
      Toast.error("Permission to access location was denied");
      //Alert.alert('Permission Denied', 'Permission to access location was denied');
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <Image source={require("../../assets/icon.png")} style={styles.logo} />
      <CustomText style={styles.welcomeText}>¡BIENVENIDO OTRA VEZ!.</CustomText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        />
        {loading ? <LoadingApp></LoadingApp> : <></>}
      <CustomText style={styles.forgotPasswordText}>
      ¿Olivdaste tu contraseña?
      </CustomText>
      <CustomButton
        title="LOGIN"
        onPress={handleLogin}
        style={styles.loginButton}
      />
      {/* <CustomText style={styles.signUpText}>
        Don’t have an account?{" "}
        <CustomText style={styles.signUpLink}>Sign up</CustomText>
      </CustomText> */}
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 220,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    alignSelf: "flex-end",
    marginBottom: 20,
    color: "#6e6e6e",
  },
  loginButton: {
    width: "100%",
    marginBottom: 20,
  },
  signUpText: {
    color: "#6e6e6e",
  },
  signUpLink: {
    color: "#000",
  },
});

export default LoginScreen;
