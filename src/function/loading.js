import LottieView from 'lottie-react-native';
import { View, Text, StyleSheet} from 'react-native';
export const LoadingApp = () => {
    return (
        <View style={{ alignItems: 'center',}}>
        <LottieView
          source={require('../assets/animations/loading-animation.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    )
}
const styles = StyleSheet.create({
    loadingContainer: {
      alignItems: 'center',
    },
    loadingAnimation: {
      width: 100,
      height: 100,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
    },
  });