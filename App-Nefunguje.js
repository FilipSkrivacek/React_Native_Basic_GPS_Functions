import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";

export default function Home(props) {
  // Stavy pro uchování aktuálního data, stavu stopky a počtu uplynulých sekund
  const [formattedDate, setCurrentDate] = useState("");
  const [DisplayDate, setDisplayDate] = useState("");

  const [isSignedIn, setIsSignedIn] = useState(false);

  const [isInWorkArea, setIsInWorkArea] = useState(false);

  // Funkce pro aktualizaci aktuálního data
  const updateCurrentDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const formattedDate = `${day.toString().padStart(2, "0")}.${month
      .toString()
      .padStart(2, "0")} ${year} ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    const DisplayDate = `${day}.${month} ${year}`;
    setCurrentDate(formattedDate);
    setDisplayDate(DisplayDate);
  };

  useEffect(() => {
    // Aktualizace času každou sekundu
    const intervalId = setInterval(updateCurrentDate, 1000);
  });

  const getPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log("Prosím povolte GPS");
      return;
    }  
  };
  

  const geocode = async () => {
    let currentLocation = await Location.getCurrentPositionAsync()
    .then(data => {
      console.log(data);
    });
  };


  // const geocode = async () => {
  //   let currentLocation = await Location.getCurrentPositionAsync({});
  //   const companyLatitude = 50.775603022284635;
  //   const companyLongitude = 15.052113442651669;
  //   const tolerance = 100;

  //   /// DDM 50.7264924111979, 15.460478079662755
  //   /// Zeyerovka 50.775603022284635, 15.052113442651669

  //   const distance = getDistance(
  //     currentLocation.coords.latitude,
  //     currentLocation.coords.longitude,
  //     companyLatitude,
  //     companyLongitude
  //   );

  //   if (distance <= tolerance) {
  //     setIsInWorkArea(true);
  //   } else {
  //     setIsInWorkArea(false);
  //   }
  // };

  // const getDistance = (lat1, lon1, lat2, lon2) => {
  //   const radlat1 = (Math.PI * lat1) / 180;
  //   const radlat2 = (Math.PI * lat2) / 180;
  //   const theta = lon1 - lon2;
  //   const radtheta = (Math.PI * theta) / 180;
  //   let dist =
  //     Math.sin(radlat1) * Math.sin(radlat2) +
  //     Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //   if (dist > 1) {
  //     dist = 1;
  //   }
  //   dist = Math.acos(dist);
  //   dist = (dist * 180) / Math.PI;
  //   dist = dist * 60 * 1.1515;
  //   return dist * 1609.344;
  // };

  // Funkce pro spuštění stopky po kliknutí na tlačítko "Příchod"
  const onSignInPressed = async () => {

    getPermissions();
    geocode();
    console.log(currentLocation)

      setIsSignedIn(true);
      try {
        await AsyncStorage.setItem('StartTime', formattedDate);
      } catch (error) {
        console.warn(error);
      }
    
  };

  const onSignOutPressed = async () => {
    setIsSignedIn(false);
    // Načtení dat z Local Storage
    const storedUserId = await AsyncStorage.getItem("userid");
    const storedFormattedStartDate = await AsyncStorage.getItem("StartTime");
    const storedToken = await AsyncStorage.getItem("token");

    // Vytvoření objektu pro odeslání dat na server API
    const requestData = {
      userId: Number(storedUserId),
      status: false,
      formattedStart: storedFormattedStartDate,
      formattedEnd: formattedDate,
      note: "Poznámka",
    };

    // Odeslání dat na server API pomocí POST požadavku
    try {
      const response = await axios.post(
        "https://maturitnipraceapi2.azurewebsites.net/api/Shifts/CreateNewShift",
        requestData,
        {
          headers: {
            Authorization: "Bearer " + storedToken,
          },
        }
      );
    } catch (error) {
      console.warn(error);
    }
  };

  // Styly pro komponentu
  const styles = StyleSheet.create({
    root: {
      alignItems: "center",
      padding: 50,
    },
    date: {
      fontSize: 26,
      fontWeight: "bold",
      paddingBottom: 20,
    },
  });

  return (
    <View style={styles.root}>
      <Text style={styles.date}>Dnes je {DisplayDate}</Text>
      {!isSignedIn && (
        <CustomButton
          text="Příchod"
          color={"#E4A11B"}
          onPress={onSignInPressed}
        />
      )}
      {isSignedIn && (
        <CustomButton
          text="Odchod"
          color={"#ef5350"}
          onPress={onSignOutPressed}
        />
      )}
    </View>
  );
}
