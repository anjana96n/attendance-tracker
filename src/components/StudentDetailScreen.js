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
    backgroundColor: '#f8f9fa',
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default StudentDetailScreen;
