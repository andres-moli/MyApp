import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ children, style, ...props }) => {
    return <Text style={[styles.text, style]} {...props}>{children}</Text>;
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Arial',
        color: '#333',
    },
});

export default CustomText;
