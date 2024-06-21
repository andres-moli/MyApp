import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

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
  const getStatusColor = (status) => {
    switch (status) {
      case 'canceled':
        return { color: '#ff0000', label: 'Cancelada' };
      case 'confirmed':
        return { color: '#0000ff', label: 'Confirmada' };
      case 'programmed':
        return { color: '#ffa500', label: 'Programada' };
      case 'realized':
        return { color: '#008000', label: 'Realizada' };
      case 'reprogrammed':
        return { color: '#800080', label: 'Reprogramada' };
      default:
        return { color: '#808080', label: 'Unknown' };
    }
  };

  const { color, label } = getStatusColor(topRightText);

  return (
    <TouchableOpacity style={[styles.card, shadowStyle]} onPress={onPress}>
      <View style={[styles.statusBar, { backgroundColor: color }]} />
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Icon name={iconName} size={30} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.bottomRightText}>{bottomRightText}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { backgroundColor: color }]}>{label}</Text>
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
  statusBar: {
    width: 10,
    height: '100%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
  bottomRightText: {
    marginTop: 5,
    color: 'gray',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: 'white',
    fontWeight: 'bold',
  },
});
