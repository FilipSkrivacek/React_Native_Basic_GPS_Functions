import { Button, StyleSheet, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function App() {

  const [location, setLocation] = useState();

  

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Prosím povolte GPS");
        return;
      }  
    };
    getPermissions();
  }, []);

  const geocode = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log(currentLocation);
  };

  const reverseGeocode = async () => {

    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude
    });

    console.log("Adresa:");
    console.log(reverseGeocodedAddress);
  };


  const caniwork = () => {
    const companyLatitude = 50.7264924111979;
    const companyLongitude = 15.460478079662755;
    const tolerance = 100;
  
    const distance = getDistance(
      location.coords.latitude,
      location.coords.longitude,
      companyLatitude,
      companyLongitude
    );
  
    if (distance <= tolerance) {
      console.log("Ano, můžeš");
    } else {
      console.log("Ne, nemůžeš");
    }
  };
  
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist * 1609.344;
  };


  return (
    <View style={styles.container}>
      <Button title="Zjistit souřadnice" onPress={geocode} />
      <Button title="Zjistit adresu" onPress={reverseGeocode} />
      <Button title="Můžu pracovat?" onPress={caniwork} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});