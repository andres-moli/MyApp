import { Linking } from "react-native";

export const makePhoneCall = (phoneNumber) => {
    
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url)
      .then((supported) => {
        if (!supported) {
          return
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
};

export const sendEmail = (emailAddress) => {
    const subject = '';
    const body = '';
    const url = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url)
      .then((supported) => {
        if (!supported) {
          // Alert.alert('Error', 'Email not supported');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };