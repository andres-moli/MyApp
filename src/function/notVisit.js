import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export const NoVisitsAnimation = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/not-vists.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.text}>No tienes visitas para realizar :(</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  animation: {
    width: 300,
    height: 300,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
});
