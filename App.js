import { Button, StyleSheet, TextInput, View, Text } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState();
  const [loading, setLoading] = useState();

  // Permission
  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Prosím povolte GPS");
        return;
      }
    };
    getPermissions();
  }, []);

  // Zjišťování souřednic
  const geocode = async () => {
    setLoading(true);
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    console.warn(`Latitude: ${currentLocation.coords.latitude}, Longitude: ${currentLocation.coords.longitude}` );
    setLoading(false);
  };

  // Zjištění adresy
  const reverseGeocode = async () => {
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });

    console.warn(reverseGeocodedAddress);
  };

  // Často používané souřadnice
  // DDM 50.7264924111979, 15.460478079662755
  // Zeyerovka 50.775603022284635, 15.052113442651669
  // SPŠSE a VOŠ 50.773186370485085, 15.064687119687196

  const caniwork = () => {

    // Zadání souřadnic firmy a velikosti tolerance
    const companyLatitude = 50.773186370485085;
    const companyLongitude = 15.064687119687196;
    const tolerance = 100;

    const distance = getDistance(
      location.coords.latitude,
      location.coords.longitude,
      companyLatitude,
      companyLongitude
    );

    // Kontrola jestli je osoba v toleranci metrů
    if (distance <= tolerance) {
      console.warn("Ano, můžeš");
    } else {
      console.warn("Ne, nemůžeš");
    }
  };



  // Výpočet metrů
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
    {loading && <Text>Načítání...</Text>}
    <Button title="Zjistit souřadnice" onPress={geocode} />
    <Button title="Zjistit adresu" onPress={reverseGeocode} />
    <Button title="Můžu pracovat?" onPress={caniwork} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
