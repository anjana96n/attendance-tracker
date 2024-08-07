import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { db, storage } from './firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { getAuth } from 'firebase/auth';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const AddStudentToClassScreen = () => {

  const [students, setStudents] = useState([]);
  const viewShotRef = useRef(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'students'));
        const studentList = querySnapshot.docs.map(doc => doc.data().className);
        setStudents(studentList);
      } catch (error) {
        Alert.alert('Error', `Failed to load classes: ${error.message}`);
      }
    };

    fetchClasses();
  }, []);

  const handleAddStudent = async () => {
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
    <View style={styles.container}>
      <Text style={styles.label}>Class Name</Text>
      <Picker
        selectedValue={className}
        style={styles.input}
        onValueChange={(itemValue) => setClassName(itemValue)}
      >
        <Picker.Item label="Select a class" value="" />
        {students.map((cls, index) => (
          <Picker.Item key={index} label={cls} value={cls} />
        ))}
      </Picker>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter first name"
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter last name"
      />
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        placeholder="Enter mobile number"
        keyboardType="phone-pad"
      />
      {className && firstName && lastName && mobileNumber ? (
        <View style={styles.qrContainer}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0, width: 200, height: 200 }}>
            <QRCode
              value={`Class: ${className}, Name: ${firstName} ${lastName}, Mobile: ${mobileNumber}`}
              size={200}
              quietZone={10} // optional: to ensure QR code is not cropped
            />
          </ViewShot>
        </View>
      ) : null}
      <Button title="Add Student" onPress={handleAddStudent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default AddStudentToClassScreen;
