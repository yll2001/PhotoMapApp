import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import OutilinedButton from "../components/UI/OutlinedButton";
import { useEffect, useState } from "react";
import { fetchPlaceDatails } from "../util/database";

function PlaceDatails({ route, navigation }) {
    const [fetchPlaces, setFetchedPlaces] = useState();


    function showOnMapHandler({ route }) {
        navigation.navigate('Map', {
            initialLat: fetchPlaces.location.lat,
            initialLng: fetchPlaces.location.lng
        });


    }

    const selectedPLaceId = route.params.placeId;

    useEffect(() => {
        async function loadPlaceData() {
            const place = fetchPlaceDatails(selectedPLaceId);
            setFetchedPlaces(place);
            navigation.setOptions({
                title: place.title
            })
        }
        loadPlaceData();

    }, [selectedPLaceId])


    if (!fetchPlaces) {
        return (
            <View style={styles.fallback}>
                <Text>Loading place data...</Text>
            </View>
        )
    }

    return <ScrollView>
        <Image style={styles.image} source={{ uri: fetchPlaces.imageUri }} />
        <View style={styles.locationContainer}>
            <View style={styles.addressContainer}>
                <Text style={styles.address}>{fetchPlaces.address}</Text>
            </View>
        </View>
        <OutilinedButton icon="map" onPress={showOnMapHandler}>View on Map</OutilinedButton>
    </ScrollView>

}
export default PlaceDatails;

const styles = StyleSheet.create({
    fallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    image: {
        height: '35%',
        minHeight: 300,
        width: '100%'
    },
    locationContainer: {
        justifyContent: 'center',
        alignItems: 'center'

    },
    addressContainer: {
        padding: 20
    },
    address: {
        color: Colors.primary500,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16

    },


})