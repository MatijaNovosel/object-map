import Mapbox, {
  Camera,
  FillLayer,
  Images,
  LineLayer,
  MapView,
  ShapeSource,
  SymbolLayer,
  UserLocation
} from "@rnmapbox/maps";
import * as Location from "expo-location";
import { Feature, Point, Polygon } from "geojson";
import { useEffect, useRef, useState } from "react";
import { LogBox, StyleSheet, Text, TouchableOpacity, View } from "react-native";

Mapbox.setAccessToken(
  "pk.eyJ1IjoibWF0aWphbiIsImEiOiJjbWVlY21qYWkwOHI0Mmxxd2x5b3cyZHhmIn0.t5eyG-gZh61bECMruqSPgw"
);

LogBox.ignoreLogs(["ViewTagResolver"]);

export default function HomeScreen() {
  const cameraRef = useRef<Camera>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const zagrebCoords = [15.9819, 45.815];
  const styleURL = "mapbox://styles/matijan/cmeec74b0003001sa4irj2uya";

  const polygonCoords: [number, number][] = [
    [15.98153, 45.81453],
    [15.98156, 45.81464],
    [15.98162, 45.81475],
    [15.98176, 45.81488],
    [15.98184, 45.8149],
    [15.98198, 45.8149],
    [15.98206, 45.81482],
    [15.98262, 45.81446],
    [15.98288, 45.8143],
    [15.9823, 45.81431],
    [15.98182, 45.81433],
    [15.98153, 45.81435],
    [15.98153, 45.8145],
    [15.98153, 45.81453]
  ];

  const polygonFeature: Feature<Polygon> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [polygonCoords]
    }
  };

  const markerFeature: Feature<Point> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: [15.981980856167548, 45.81457330846626]
    }
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status);
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }
    getCurrentLocation();
  }, []);

  const goToLocation = () => {
    cameraRef.current?.flyTo(zagrebCoords, 1000);
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          compassEnabled={false}
          scaleBarEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
        >
          <Images
            images={{ marker: require("../../assets/images/ball.png") }}
          />
          <Camera
            ref={cameraRef}
            centerCoordinate={zagrebCoords}
            zoomLevel={17}
          />
          <UserLocation visible={true} showsUserHeadingIndicator={true} />
          <ShapeSource id="polygonSource" shape={polygonFeature}>
            <FillLayer
              id="polygonFill"
              style={{
                fillColor: "rgba(0,0,255,0)"
              }}
            />
            <LineLayer
              id="polygonBorder"
              style={{
                lineColor: "blue",
                lineWidth: 12
              }}
            />
          </ShapeSource>
          <ShapeSource id="markerSource" shape={markerFeature}>
            <SymbolLayer
              id="markerLayer"
              style={{
                iconImage: "marker",
                iconAllowOverlap: true,
                iconSize: 0.18
              }}
            />
          </ShapeSource>
        </MapView>
        <TouchableOpacity style={styles.button} onPress={goToLocation}>
          <Text style={styles.buttonText}>Center</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    height: "100%",
    width: "100%"
  },
  map: {
    flex: 1
  },
  button: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  buttonText: {
    color: "white",
    fontWeight: "600"
  }
});
