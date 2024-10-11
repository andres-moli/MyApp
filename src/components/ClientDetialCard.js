import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import { makePhoneCall, sendEmail } from '../function/notificaction.function';
import { UpdateClientMutation, fetchDepartments, fetchCities } from '../api/client'; // Suponiendo que tienes una función para actualizar los detalles del cliente
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TIPOS_VERTICALES } from '../constants';

const ClientDetailsSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('El email es obligatorio'),
  name: Yup.string().required('El nombre es obligatorio'),
  numberDocument: Yup.string()
    .required('El número de documento es obligatorio')
    .max(11, 'El número máximo es 11')
    .matches(/^\d{9}-\d{1}$/, 'Formato de documento inválido (123456789-0)'),
  telefono: Yup.string().required('El teléfono es obligatorio'),
  celular: Yup.string().required('El celular es obligatorio'),
  departmentId: Yup.string().required('El departamento es obligatorio'),
  cityId: Yup.string().required('La ciudad es obligatoria'),
  address: Yup.string().required('La dirección es obligatoria')
});

const DetailClientCard = ({ detail }) => {
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
    loadCities(detail.department?.id);
  }, []);

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const result = await UpdateClientMutation(values,detail.id);
      if(result) return   Alert.alert('Éxito', 'Los detalles del cliente han sido actualizados.');
      Alert.alert('Error', 'No se pudo actualizar los detalles del cliente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar los detalles del cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView>
      <Formik
        initialValues={{
          name: detail.name,
          numberDocument: detail.numberDocument,
          email: detail.email,
          telefono: detail.telefono,
          celular: detail.celular,
          departmentId: detail.department?.id,
          cityId: detail.city?.id,
          address: detail.address,
          type: detail.type,
          vertical: detail.vertical,
          descripcion: detail.descripcion,
          userId: detail.user?.id
        }}
        validationSchema={ClientDetailsSchema}
        onSubmit={handleUpdate}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.label}>Nombre</Text>
              <Icon name="person" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.value}
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                multiline={true}
                autoCorrect ={true}
                editable= {true}
                numberOfLines={4}
              />
              {errors.name && touched.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Documento</Text>
              <Icon name="document" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.value}
                value={values.numberDocument}
                onChangeText={handleChange('numberDocument')}
                onBlur={handleBlur('numberDocument')}
              />
              {errors.numberDocument && touched.numberDocument ? (
                <Text style={styles.errorText}>{errors.numberDocument}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <Text style={styles.label} onPress={()=> {sendEmail(values.email)}}>Email</Text>
              <Icon name="mail" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.value}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && touched.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <Text style={styles.label} onPress={()=> {makePhoneCall(values.telefono)}}>Teléfono</Text>
              <Icon name="call" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.value}
                value={values.telefono}
                onChangeText={handleChange('telefono')}
                onBlur={handleBlur('telefono')}
                keyboardType="phone-pad"
              />
              {errors.telefono && touched.telefono ? (
                <Text style={styles.errorText}>{errors.telefono}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <Text style={styles.label} onPress={()=> {makePhoneCall(values.celular)}}>Celular</Text>
              <Icon name="cellular" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.value}
                value={values.celular}
                onChangeText={handleChange('celular')}
                onBlur={handleBlur('celular')}
                keyboardType="phone-pad"
              />
              {errors.celular && touched.celular ? (
                <Text style={styles.errorText}>{errors.celular}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Dirección</Text>
              <Icon name="home" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.value}
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
              />
              {errors.address && touched.address ? (
                <Text style={styles.errorText}>{errors.address}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Descripción</Text>
              <Icon name="document-text" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.value}
                value={values.descripcion}
                onChangeText={handleChange('descripcion')}
                onBlur={handleBlur('descripcion')}
                multiline={true}
                autoCorrect ={true}
                editable= {true}
                numberOfLines={4}
              />
              {errors.descripcion && touched.descripcion ? (
                <Text style={styles.errorText}>{errors.descripcion}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <RNPickerSelect
                value={values.vertical || ""}
                selectedValue={values.vertical || ""}
                onValueChange={handleChange('vertical')}
                style={pickerSelectStyles}
                placeholder={{ label: 'Selecciona una vertical', value: "" }}
                items={TIPOS_VERTICALES}
                onBlur={handleBlur('vertical')}
              />
              {errors.vertical && touched.vertical ? (
                <Text style={styles.errorText}>{errors.vertical}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <RNPickerSelect
                selectedValue={values.departmentId}
                onValueChange={(value) => {
                  setFieldValue('departmentId', value);
                  setFieldValue('cityId', ''); // Reset cityId when departmentId changes
                  loadCities(value);
                }}
                value={values.departmentId}
                style={pickerSelectStyles}
                placeholder={{ label: 'Selecciona un departamento', value: null }}
                items={departments.map((dept) => ({ label: dept.name, value: dept.id }))}
                onBlur={handleBlur('departmentId')}
              />
              {errors.departmentId && touched.departmentId ? (
                <Text style={styles.errorText}>{errors.departmentId}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <RNPickerSelect
                value={values?.cityId || detail?.city?.id}
                selectedValue={detail?.city?.ids}
                onValueChange={(value) => setFieldValue('cityId', value)}
                style={pickerSelectStyles}
                placeholder={{ label: 'Selecciona una ciudad', value: null }}
                items={cities?.map((city) => ({ label: city.name, value: city.id }))}
                onBlur={handleBlur('cityId')}
              />
              {errors.cityId && touched.cityId ? (
                <Text style={styles.errorText}>{errors.cityId}</Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <RNPickerSelect
                value={values.type}
                selectedValue={values.type}
                onValueChange={handleChange('type')}
                style={{ ...pickerSelectStyles, inputIOS: { ...pickerSelectStyles.inputIOS, width: '100%' } }}
                placeholder={{ label: 'Selecciona un tipo', value: "" }}
                items={[
                  { label: 'Integrador', value: 'INTEGRADOR' },
                  { label: 'Distribuidor', value: 'DISTRIBUIDOR' },
                  { label: 'Instalador', value: 'INSTALADOR' },
                  { label: 'Cliente Final', value: 'CLIENTE_FINAL' },
                ]}
                onBlur={handleBlur('type')}
              />
            </View>
            <Button onPress={handleSubmit} title={isSubmitting ? 'Actualizando...' : 'Actualizar'} disabled={isSubmitting} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  section: {
    marginBottom: 12,
  },
  icon: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 12,
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
    marginBottom: 12,
  },
});

export default DetailClientCard;
