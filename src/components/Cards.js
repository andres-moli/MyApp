import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'; // Asegúrate de tener instalada esta librería

export const Card = ({
  title,
  iconName,
  iconType,
  topRightText,
  bottomRightText,
  description,
  onPress,
  iconBackgroundColor,
  shadowStyle,
}) => {
  return (
    <TouchableOpacity style={[styles.card, shadowStyle]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Icon name={iconName} size={30} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.topRightText}>{topRightText}</Text>
        <Text style={styles.bottomRightText}>{bottomRightText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  description: {
    color: 'gray',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  topRightText: {
    fontSize: 14,
    color: 'gray',
  },
  bottomRightText: {
    fontSize: 14,
    color: 'gray',
  },
});
