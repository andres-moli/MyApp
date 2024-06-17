import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = ({latitude,longitude}) => {
  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Mi Visita fue aqui" // Título del marcador
          description="Descripción del punto" // Descripción del marcador
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
