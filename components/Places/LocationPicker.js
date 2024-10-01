import { Alert, View, StyleSheet, Text, Image } from "react-native";
import OutilinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from "expo-location";
import { useState, useEffect } from "react";
import { getAddress, getMapPreview } from "../../util/loaction";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";



function LocationPicker({ onPickLocation }) {
    const navigate = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused()// returns a bolean
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
    const [pickedLocation, setPickedLocation] = useState();



    useEffect(() => {
        if (isFocused && route.params) {
            const mapPickedLocation = route.params && {
                lat: route.params.pickedLat,
                lng: route.params.pickedLng
            }
            setPickedLocation(mapPickedLocation);
        }


    }, [route, isFocused]);


    useEffect(() => {
        async function handleLocation() {
            if (pickedLocation) {
                const address = await getAddress(pickedLocation.lat, pickedLocation.lng);
                onPickLocation({ ...pickedLocation, address: address });

            }
        }
        handleLocation();
    }, [pickedLocation, onPickLocation])


    async function verifyPermissions() {

        if (locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        if (locationPermissionInformation.status == PermissionStatus.DENIED) {
            Alert.alert('Insufficient Permission!', 'You need to grant location permissions to use this app');
            return false;
        }

        return true;

    }




    async function getLocationHandler() {
        const hasPermission = await verifyPermissions();

        if (!hasPermission) {
            return;
        }
        const location = await getCurrentPositionAsync();
        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude
        }
        )

    }



    function pickOnMapHandler() {
        navigate.navigate('Map');


    }

    let locationPreview = <Text>No location picked yet</Text>

    if (pickedLocation) {
        locationPreview = <Image style={styles.mapPreviewImage} source={{ uri: getMapPreview(pickedLocation.lat, pickedLocation.lng) }} />
    }



    return (
        <View>
            <View style={styles.mapPreview}>
                {locationPreview}
            </View>
            <View style={styles.actions}>
                <OutilinedButton icon="location" onPress={getLocationHandler}>Locate User</OutilinedButton>
                <OutilinedButton icon="map" onPress={pickOnMapHandler}>Pick on Map</OutilinedButton>
            </View>
        </View>

    )

}
export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,

    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    mapPreviewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 4
    }


});