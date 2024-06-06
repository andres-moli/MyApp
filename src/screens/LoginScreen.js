import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import Background from '../components/Background';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
    //   const response = await axios.post('https://your-api.com/login', { email, password });
    //   const { token, user } = response.data;

      await AsyncStorage.setItem('userToken', "scsc");
      await AsyncStorage.setItem('userData', JSON.stringify({}));

      navigation.navigate('Main');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Background>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />
      <CustomText style={styles.welcomeText}>Welcome back.</CustomText>
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
      <CustomText style={styles.forgotPasswordText}>Forgot your password?</CustomText>
      <CustomButton title="LOGIN" onPress={handleLogin} style={styles.loginButton} />
      <CustomText style={styles.signUpText}>
        Don’t have an account? <CustomText style={styles.signUpLink}>Sign up</CustomText>
      </CustomText>
      </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#6e6e6e',
  },
  loginButton: {
    width: '100%',
    marginBottom: 20,
  },
  signUpText: {
    color: '#6e6e6e',
  },
  signUpLink: {
    color: '#000',
  },
});

export default LoginScreen;
