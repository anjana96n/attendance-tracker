import React, { useState,useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { getAuth } from 'firebase/auth';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [firstName, setFirstName] = useState(student.firstName);
  const [lastName, setLastName] = useState(student.lastName);
  const [className, setClassName] = useState(student.className);
  const [mobileNumber, setMobileNumber] = useState(student.mobileNumber);
  const auth = getAuth();
  const viewShotRef = useRef(null);

  const handleDownloadQR = async () => {
    try {
      const qrData = `Class: ${className}, Name: ${firstName} ${lastName}, Mobile: ${mobileNumber}`;
      const qrRef = React.createRef();

      // Capture the QR code as an image
      qrRef.current.toDataURL((data) => {
        const uri = FileSystem.documentDirectory + `qrcode_${firstName}_${lastName}.png`;

        FileSystem.writeAsStringAsync(uri, data, { encoding: FileSystem.EncodingType.Base64 }).then(async () => {
          const permission = await MediaLibrary.requestPermissionsAsync();
          if (permission.granted) {
            await MediaLibrary.createAssetAsync(uri);
            Alert.alert('Success', 'QR Code downloaded successfully!');
          } else {
            Alert.alert('Error', 'Permission to save QR code was denied.');
          }
        }).catch((error) => {
          Alert.alert('Error', `Failed to download QR code: ${error.message}`);
        });
      });
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  const handleSaveDetails = async () => {
    if (className && firstName && lastName && mobileNumber) {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Error', 'User is not authenticated.');
          return;
        }

        const qrData = `Class: ${className}, Name: ${firstName} ${lastName}, Mobile: ${mobileNumber}`;
       
        // Capture the QR code as an image
        const uri = await viewShotRef.current.capture();
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Create a reference to the location where the QR code will be stored
        const storageRef = ref(storage, `qrcodes/${className}_${firstName}_${lastName}.png`);
        
        // Upload the QR code image to Firebase Storage
        await uploadBytes(storageRef, blob);

        // Get the download URL of the uploaded QR code
        const downloadURL = await getDownloadURL(storageRef);

        // Add student to Firestore with QR code download URL
        await addDoc(collection(db, 'students'), {
          className,
          firstName,
          lastName,
          mobileNumber,
          qrCode: downloadURL, // Store the QR code download URL
        });

        // Download the QR code image using the download URL
        const downloadResumable = FileSystem.createDownloadResumable(
          downloadURL,
          FileSystem.documentDirectory + `${className}_${firstName}_${lastName}.png`
        );

        const { uri: localUri } = await downloadResumable.downloadAsync();

        // Save the file to the user's media library
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
          await MediaLibrary.createAssetAsync(localUri);
          Alert.alert('Success', 'Student added successfully and QR code downloaded!');
        } else {
          Alert.alert('Success', 'Student added successfully, but permission to save QR code was denied.');
        }

        setClassName('');
        setFirstName('');
        setLastName('');
        setMobileNumber('');
      } catch (error) {
        Alert.alert('Error', `An error occurred: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Class</Text>
        <TextInput
          style={styles.input}
          value={className}
          onChangeText={setClassName}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>QR Code</Text>
        <View style={styles.qrContainer}>
          <QRCode
            value={`Class: ${className}, Name: ${firstName} ${lastName}, Mobile: ${mobileNumber}`}
            size={200}
            quietZone={10}
            getRef={(ref) => (this.qrCode = ref)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleDownloadQR}>
          <Text style={styles.buttonText}>Download QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSaveDetails}>
          <Text style={styles.buttonText}>Save Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    width: '100%', // Ensure the container takes up the full width
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    width: '100%', // Ensure the input takes up the full width
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%', // Ensure the button takes up the full width
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default StudentDetailScreen;
