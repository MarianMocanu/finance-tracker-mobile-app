import { Camera, CameraType } from 'expo-camera';
import { FC, useRef, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Button from './Button';
import { SimpleModal } from './Modal';
import { colors } from '@globals/style';
import { FontAwesome5 } from '@expo/vector-icons';

type Props = {
  images: string[];
  setImages: (images: string[]) => void;
};

export const ImagePicker: FC<Props> = ({ images, setImages }) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [visible, setVisible] = useState(false);
  const cameraRef = useRef<Camera>(null);

  async function handleTakePicture(): Promise<void> {
    const image = await cameraRef.current?.takePictureAsync({
      quality: 0.2,
      base64: true,
      exif: true,
    });
    if (image) {
      // console.log(JSON.stringify(image, null, 2));
      setImages([...images, image.base64!]);
    }
    setVisible(false);
  }

  function openCamera(): void {
    if (permission?.granted) {
      setVisible(true);
      return;
    }
    requestPermission().then(response => {
      if (response.granted) {
        setVisible(true);
      }
    });
  }

  return (
    <>
      <View style={styles.picturesContainer}>
        {images.map((image, index) => (
          <>
            <Image key={index} source={{ uri: image }} style={styles.picture} />
            <Button onPress={() => setImages(images.filter((_, i) => i !== index))}>
              <FontAwesome5
                name="times"
                style={{ ...styles.icon, color: '#FFF', position: 'absolute', right: 10, top: 5 }}
              />
            </Button>
          </>
        ))}
        <Button onPress={openCamera} style={styles.addPicture}>
          <FontAwesome5 name="camera" style={styles.icon} />
        </Button>
      </View>
      <SimpleModal
        visible={visible}
        closeModal={() => setVisible(false)}
        height={'50%'}
        transparent
      >
        <View style={styles.container}>
          <Camera type={CameraType.back} style={styles.camera} ref={cameraRef}>
            <Button onPress={handleTakePicture} text="Take picture" primary style={styles.button} />
            <View style={styles.frame} />
          </Camera>
        </View>
      </SimpleModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: -20,
    backgroundColor: 'transparent',
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  button: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
    marginVertical: 60,
    marginHorizontal: 20,
  },
  picturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  picture: {
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 5,
    width: 100,
    height: 100,
  },
  addPicture: {
    borderRadius: 10,
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: colors.blue.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    lineHeight: 20,
    color: colors.blue.dark,
  },
});
