import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, ScrollView, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ContactSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio').max(100, 'Debe de tener un maximo de 100'),
  email: Yup.string().email('Email inválido').required('El email es obligatorio').max(100, 'Debe de tener un maximo de 100'),
  telefono: Yup.string().required('El teléfono es obligatorio').max(10, 'Debe de tener un maximo de 10'),
  celular: Yup.string().required('El celular es obligatorio').max(10, 'Debe de tener un maximo de 10'),
  position: Yup.string().required('El cargo es obligatorio').max(100, 'Debe de tener un maximo de 100'),
});

const UpdateClientContactModal = ({ isVisible, onClose, onUpdate, contact }) => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Actualizar Contacto</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Formik
              initialValues={{
                name: contact?.name,
                email: contact?.email,
                telefono: contact?.telefono,
                celular: contact?.celular,
                position: contact?.position,
              }}
              validationSchema={ContactSchema}
              onSubmit={(values, { setSubmitting }) => {
                onUpdate({ ...values, id: contact.id });
                setSubmitting(false);
                onClose();
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre</Text>
                    <View style={styles.inputWrapper}>
                      <FontAwesome5 name="user" size={20} color="black" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Ingrese el nombre"
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                      />
                    </View>
                    {errors.name && touched.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputWrapper}>
                      <FontAwesome5 name="envelope" size={20} color="black" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Ingrese el email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        keyboardType="email-address"
                      />
                    </View>
                    {errors.email && touched.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Teléfono</Text>
                    <View style={styles.inputWrapper}>
                      <FontAwesome5 name="phone" size={20} color="black" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Ingrese el teléfono"
                        value={values.telefono}
                        onChangeText={handleChange('telefono')}
                        onBlur={handleBlur('telefono')}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {errors.telefono && touched.telefono ? <Text style={styles.errorText}>{errors.telefono}</Text> : null}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Celular</Text>
                    <View style={styles.inputWrapper}>
                      <FontAwesome5 name="mobile-alt" size={20} color="black" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Ingrese el celular"
                        value={values.celular}
                        onChangeText={handleChange('celular')}
                        onBlur={handleBlur('celular')}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {errors.celular && touched.celular ? <Text style={styles.errorText}>{errors.celular}</Text> : null}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Cargo</Text>
                    <View style={styles.inputWrapper}>
                      <FontAwesome5 name="briefcase" size={20} color="black" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Ingrese el cargo"
                        value={values.position}
                        onChangeText={handleChange('position')}
                        onBlur={handleBlur('position')}
                      />
                    </View>
                    {errors.position && touched.position ? <Text style={styles.errorText}>{errors.position}</Text> : null}
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button title="Actualizar Contacto" onPress={handleSubmit} disabled={isSubmitting} color="#007AFF" />
                    <Button title="Cerrar" onPress={onClose} color="#FF3B30" />
                  </View>
                </>
              )}
            </Formik>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default UpdateClientContactModal;
