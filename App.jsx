/* eslint-disable no-unused-vars */
/* eslint-disable curly */
/* eslint-disable no-shadow */
/* eslint-disable no-catch-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
/* eslint-disable semi */
/* eslint-disable comma-dangle */
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Alert, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';



const App = () => {
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to access your location',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocationData(latitude, longitude);
      },
      (error) => {
        console.log(error.code, error.message);
        Alert.alert('Error', 'Unable to fetch location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchLocationData = async (latitude, longitude) => {
    try {
      const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
        params: {
        
          q: `${latitude},${longitude}`
        },
      });

      const { current, location } = response.data;

      const weatherData = `
        Location: ${location.name}, ${location.region}
        Temperature: ${current.temp_c} °C
        Condition: ${current.condition.text}
        Humidity: ${current.humidity}%
        Wind Speed: ${current.wind_kph} kph
      `;

      Alert.alert('Weather Data', weatherData);
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Failed to fetch data from the API');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location App</Text>
      <Button title="Get Location" onPress={getCurrentLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
