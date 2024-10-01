import { launchCameraAsync, PermissionStatus } from 'expo-image-picker';
import { useCameraPermissions } from 'expo-image-picker';
import { Text, View, Alert, Image, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { useState } from 'react';
import OutilinedButton from '../UI/OutlinedButton';



function ImagePicker({ onTakeImage }) {
    const [pickedImage, setPickedImage] = useState();
    const [CameraPermissionsInformation, requestPermission] = useCameraPermissions();

    async function verifyPermissions() {
        if (CameraPermissionsInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        if (CameraPermissionsInformation.status == PermissionStatus.DENIED) {
            Alert.alert('Insufficient Permission!', 'You need to grant camera permissions to use this app');
            return false;
        }

        return true;

    }

    async function takeImageHandler() {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,

        });

        setPickedImage(image?.assets[0]?.uri);
        onTakeImage(image?.assets[0]?.uri);

    }

    let imagePreview = <Text>No image taken yet.</Text>

    if (pickedImage) {
        imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />
    }
    return (
        <View>
            <View style={styles.imagePreview}>
                {imagePreview}
            </View>
            <OutilinedButton icon="camera" onPress={takeImageHandler}>Take Image</OutilinedButton>


        </View>
    )

}
export default ImagePicker;

const styles = StyleSheet.create({
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',


    }
}
)