import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

const Toast = ({ type, message }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }
    ).start();

    setTimeout(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }
      ).start();
    }, 3000); // Hide the toast after 3 seconds
  }, []);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { opacity: fadeAnim }
      ]}
    >
      <View style={[styles.toastContent, type === 'success' ? styles.success : styles.error]}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999
  },
  toastContent: {
    padding: 10,
    borderRadius: 5
  },
  success: {
    backgroundColor: '#4CAF50', // Green
  },
  error: {
    backgroundColor: '#f44336', // Red
  },
  message: {
    color: '#fff',
    fontSize: 16
  }
});

export default Toast;
