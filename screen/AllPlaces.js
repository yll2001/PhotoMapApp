
import PlacesList from "../components/Places/PlacesList";
import { useIsFocused } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";
import { fetchPlaces } from "../util/database";

function AllPlaces({ route }) {
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const IsFocused = useIsFocused();



    useEffect(() => {
        async function loadPlaces() {
            const places = await fetchPlaces();
            setLoadedPlaces(places)
        }

        if (IsFocused) {
            loadPlaces();
            //  setLoadedPlaces(currPlaces => [...currPlaces, route.params.place])

        }

    }, [IsFocused])


    return <PlacesList places={loadedPlaces} />

}

export default AllPlaces;