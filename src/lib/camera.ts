import {Alert, Platform} from 'react-native';
import {
  request,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from 'react-native-permissions';

export const checkCameraPermission = async (
  setIsCameraPermissionGranted: (value: boolean) => void,
) => {
  request(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  ).then(async (result: any) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        // console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        Alert.alert(
          'Permission Denied',
          'You need to grant camera permission first',
        );
        openSettings();
        break;
      case RESULTS.GRANTED:
        setIsCameraPermissionGranted(true);
        break;
      case RESULTS.BLOCKED:
        Alert.alert(
          'Permission Blocked',
          'You need to grant camera permission first',
        );
        openSettings();
        break;
    }
  });
};
