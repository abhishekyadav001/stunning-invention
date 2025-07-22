import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import TextileForm from './components/TextTileForm';

export default function App() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#181a1b' : '#fff';
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TextileForm />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
