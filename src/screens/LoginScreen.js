import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import Background from '../components/Background';
import { QuerySignIn } from '../api/auth';
import { LoadingApp } from '../function/loading';
import { URL_API_GRAPHQL } from '../constants';
import * as Yup from 'yup';
import Modal from 'react-native-modal';

const LoginScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required('El email es obligatorio'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es obligatoria'),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    const { email, password } = values;
    try {
      const response = await QuerySignIn(email, password);
      if (!response) {
        alert('Usuario o contraseña incorrecto');
        return;
      }
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      navigation.navigate('MainTabs');
    } catch (error) {
      alert('Permission to access location was denied');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required('El email es obligatorio'),
  });

  const handleForgotPassword = async (values, { setSubmitting }) => {
    const { email } = values;
    try {
      const response = await axios.post('https://intranet.cytech.net.co:3002/graphql', {
        query: `
          query Query($email: String!) {
            sendEmailRecovryPassword(email: $email)
          }
        `,
        variables: {
          email,
        },
      });

      if (response.data.errors) {
        alert('Error enviando el email de recuperación');
      } else {
        alert(`Email de recuperación enviado a ${email}`);
      }
    } catch (error) {
      alert('Error enviando el email de recuperación');
      console.error(error);
    } finally {
      setSubmitting(false);
      setModalVisible(false);
    }
  };

  return (
    <Background>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />
      <CustomText style={styles.welcomeText}>¡BIENVENIDO OTRA VEZ!.</CustomText>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            {isSubmitting ? <LoadingApp /> : null}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <CustomText style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </CustomText>
            </TouchableOpacity>
            <CustomButton
              title="LOGIN"
              onPress={handleSubmit}
              style={styles.loginButton}
            />
            <Text style={styles.forgotPasswordText} onLongPress={() => alert(URL_API_GRAPHQL)}>versión 1.0.8</Text>
          </>
        )}
      </Formik>

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <CustomText style={styles.modalTitle}>Recuperar Contraseña</CustomText>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleForgotPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && touched.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
                <CustomButton
                  title="Enviar"
                  onPress={handleSubmit}
                  style={styles.loginButton}
                />
                <CustomButton
                  title="Regresar"
                  onPress={() => setModalVisible(false)}
                  style={styles.loginButton}
                />
              </>
            )}
          </Formik>
        </View>
      </Modal>
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
    width: 250,
    height: 220,
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default LoginScreen;
