import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';

const AddStudentScreen = () => {
  const [className, setClassName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const viewShotRef = useRef(null);

  const handleAddStudent = async () => {
    if (className && firstName && lastName && mobileNumber) {
      try {
        const qrData = `Class: ${className}, Name: ${firstName} ${lastName}, Mobile: ${mobileNumber}`;

        // Capture the QR code as a base64 string
        const uri = await viewShotRef.current.capture();
        const response = await fetch(uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result;

          // Add student to Firestore with QR code
          await addDoc(collection(db, 'students'), {
            className,
            firstName,
            lastName,
            mobileNumber,
            qrCode: base64data, // Store the base64-encoded QR code string
          });

          Alert.alert('Success', 'Student added successfully!');
          setClassName('');
          setFirstName('');
          setLastName('');
          setMobileNumber('');
        };
        reader.readAsDataURL(blob);
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
      <TextInput
        style={styles.input}
        value={className}
        onChangeText={setClassName}
        placeholder="Enter class name"
      />
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
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
        <QRCode value={`Class: ${className}, Name: ${firstName} ${lastName}, Mobile: ${mobileNumber}`} />
      </ViewShot>
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
});

export default AddStudentScreen;
