import { StatusBar } from 'expo-status-bar';
import { StyleSheet, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllPlaces from './screen/AllPlaces';
import AddPlace from './screen/AddPlaces';
import IconButton from './components/UI/IconButton';
import { Colors } from './constants/colors'
import Map from './screen/Map';
import { useEffect, useState } from 'react';
import { init } from './util/database';
import * as SplashScreen from 'expo-splash-screen';
import PlaceDatails from './screen/PlaceDetail';


const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInititalied, setDbInitialized] = useState(false);



  useEffect(() => {
    async function prepare() {
      try {
        // Prevent the splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        // Initialize the database
        await init();

        // Set the DB initialized flag to true
        setDbInitialized(true);

        // Hide the splash screen
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error(error);
      }
    }

    prepare();
  }, []);

  if (!dbInititalied) {
    return null;
  }



  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: Colors.gray700,
          contentStyle: { backgroundColor: Colors.gray700 }
        }}>
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: 'Your Favorite Places',
              headerRight: ({ tintColor }) => (
                <IconButton icon="add" size={24} color={tintColor} onPress={() => { navigation.navigate('AddPlace') }} />
              ),//converted it into a function
            })}
          />
          <Stack.Screen name="AddPlace" component={AddPlace} options={{
            title: 'Add a new Place'
          }} />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="PlaceDatails" component={PlaceDatails} options={{
            title: 'Loading Place...'
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )


}

const styles = StyleSheet.create({

});
