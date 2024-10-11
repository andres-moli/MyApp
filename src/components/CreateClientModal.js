import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Text, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome5 } from '@expo/vector-icons';
import { fetchDepartments, fetchCities, createClient } from '../api/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TIPOS_VERTICALES } from '../constants';

const ClientSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('El email es obligatorio'),
  name: Yup.string().required('El nombre es obligatorio'),
  numberDocument: Yup.string()
    .required('El número de documento es obligatorio')
    .max(11, 'El numero maximo es 11')
    .matches(/^\d{9}-\d{1}$/, 'Formato de documento inválido (123456789-0)'),
  telefono: Yup.string().required('El teléfono es obligatorio'),
  celular: Yup.string().required('El celular es obligatorio'),
  departmentId: Yup.string().required('El departamento es obligatorio'),
  cityId: Yup.string().required('La ciudad es obligatoria'),
  address: Yup.string().required('La dirección es obligatoria'),
  vertical: Yup.string().optional(),
});

const CreateClientModal = ({ isVisible, onClose, onCreate }) => {
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchDepartments();
      setDepartments(data);
    };
    loadDepartments();
  }, []);
  const loadCities = async (departmentId) => {
    if (departmentId) {
      const data = await fetchCities(departmentId);
      setCities(data);
    } else {
      setCities([]);
    }
  };
  useEffect(() => {
    loadCities();
  }, []);

  return (
    <Modal visible={isVisible} animationType="none" onRequestClose={onClose}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Crear Nuevo Cliente</Text>
          <Formik
            initialValues={{
              email: '',
              name: '',
              numberDocument: '',
              telefono: '',
              celular: '',
              departmentId: '',
              cityId: '',
              address: '',
              type: 'CLIENTE_FINAL',
              vertical: '',
            }}
            validationSchema={ClientSchema}
            onSubmit={(values, { setSubmitting }) => {
              onCreate(values);
              setSubmitting(false);
              onClose();
            }}
            validateOnChange
            validateOnBlur
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nombre</Text>
                  <View style={styles.inputWrapper}>
                    <FontAwesome5 name="user" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                    />
                  </View>
                  {errors.name && touched.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Número de Documento</Text>
                  <View style={styles.inputWrapper}>
                    <FontAwesome5 name="id-card" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Número de Documento (123456789-0)"
                      value={values.numberDocument}
                      onChangeText={handleChange('numberDocument')}
                      onBlur={handleBlur('numberDocument')}
                    />
                  </View>
                  {errors.numberDocument && touched.numberDocument ? <Text style={styles.errorText}>{errors.numberDocument}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Teléfono</Text>
                  <View style={styles.inputWrapper}>
                    <FontAwesome5 name="phone-alt" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Teléfono"
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
                    <FontAwesome5 name="mobile-alt" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Celular"
                      value={values.celular}
                      onChangeText={handleChange('celular')}
                      onBlur={handleBlur('celular')}
                      keyboardType="phone-pad"
                    />
                  </View>
                  {errors.celular && touched.celular ? <Text style={styles.errorText}>{errors.celular}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <FontAwesome5 name="envelope" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                    />
                  </View>
                  {errors.email && touched.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Dirección</Text>
                  <View style={styles.inputWrapper}>
                    <FontAwesome5 name="map-marker-alt" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Dirección"
                      value={values.address}
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                    />
                  </View>
                  {errors.address && touched.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Descripción</Text>
                  <View style={styles.inputWrapper}>
                    <FontAwesome5 name="comment-alt" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Descripción"
                      value={values.descripcion}
                      onChangeText={handleChange('descripcion')}
                      onBlur={handleBlur('descripcion')}
                    />
                  </View>
                  {errors.descripcion && touched.descripcion ? <Text style={styles.errorText}>{errors.descripcion}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                {/* <FontAwesome5 name="ellipsis-h" style={styles.icon} /> */}
                    <RNPickerSelect
                    selectedValue={values.vertical}
                    onValueChange={handleChange('vertical')}
                    style={{ ...pickerSelectStyles, inputIOS: { ...pickerSelectStyles.inputIOS, width: '100%' } }}
                    placeholder={{ label: 'Selecciona una vertical', value: ""  }}
                    items={TIPOS_VERTICALES}
                    onBlur={handleBlur('vertical')}
                  />
                  {errors.vertical && touched.vertical ? <Text style={styles.errorText}>{errors.vertical}</Text> : null}
                </View>
                <View style={styles.inputContainer}>
                  <RNPickerSelect
                    selectedValue={values.departmentId}
                    onValueChange={(value) => {
                      setFieldValue('departmentId', value);
                      setFieldValue('cityId', ''); // Reset cityId when departmentId changes
                      loadCities(value);
                    }}
                    style={{ ...pickerSelectStyles, inputIOS: { ...pickerSelectStyles.inputIOS, width: '100%' } }}
                    placeholder={{ label: 'Selecciona un departamento', value: null }}
                    items={departments.map((dept) => ({ label: dept.name, value: dept.id }))}
                    onBlur={handleBlur('departmentId')}
                  />
                  {errors.departmentId && touched.departmentId ? <Text style={styles.errorText}>{errors.departmentId}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                  <RNPickerSelect
                    selectedValue={values.cityId}
                    onValueChange={(value) => setFieldValue('cityId', value)}
                    style={{ ...pickerSelectStyles, inputIOS: { ...pickerSelectStyles.inputIOS, width: '100%' } }}
                    placeholder={{ label: 'Selecciona una ciudad', value: null }}
                    items={cities?.map((city) => ({ label: city.name, value: city.id }))}
                    onBlur={handleBlur('cityId')}
                  />
                  {errors.cityId && touched.cityId ? <Text style={styles.errorText}>{errors.cityId}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                  <RNPickerSelect
                    selectedValue={values.type}
                    onValueChange={handleChange('type')}
                    style={{ ...pickerSelectStyles, inputIOS: { ...pickerSelectStyles.inputIOS, width: '100%' } }}
                    placeholder={{ label: 'Selecciona un tipo', value: ""  }}
                    items={[
                      { label: 'Integrador', value: 'INTEGRADOR' },
                      { label: 'Distribuidor', value: 'DISTRIBUIDOR' },
                      { label: 'Instalador', value: 'INSTALADOR' },
                      { label: 'Cliente Final', value: 'CLIENTE_FINAL' },
                    ]}
                    onBlur={handleBlur('type')}
                  />
                  {errors.type && touched.type ? <Text style={styles.errorText}>{errors.type}</Text> : null}
                </View>

                <View style={styles.buttonContainer}>
                  <Button title="Crear Cliente" onPress={handleSubmit} disabled={isSubmitting} />
                  <Button title="Cancelar" onPress={onClose} color="red" />
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
};

export default CreateClientModal;
