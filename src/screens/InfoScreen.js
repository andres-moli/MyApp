import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InfoScreen = ({navigation}) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
            {/* <CustomText style={styles.headerText}>Let's start</CustomText>
      <CustomText style={styles.infoText}>
        Your amazing app starts here. Open your favorite code editor and start editing this project.
      </CustomText> */}
      <CustomButton title="LOGOUT" onPress={handleLogout} style={styles.logoutButton} />
      <CustomText style={styles.infoText}>This is the Info screen.</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
  },
});

export default InfoScreen;
