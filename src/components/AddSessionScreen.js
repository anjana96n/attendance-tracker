import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { db, storage } from './firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { getAuth } from 'firebase/auth';
import DatePicker from 'react-native-date-picker'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const AddSessionScreen = () => {
  const [heldOnDate, setHeldOnDate] = useState(new Date())
  const [heldOnDate2, setHeldOnDate2] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [className, setClassName] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [classes, setClasses] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'classes'));
        const classList = querySnapshot.docs.map(doc => doc.data().className);
        setClasses(classList);
      } catch (error) {
        Alert.alert('Error', `Failed to load classes: ${error.message}`);
      }
    };

    fetchClasses();
  }, []);

  const handleAddSession = async () => {
    if (className && sessionName && heldOnDate) {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Error', 'User is not authenticated.');
          return;
        }
        // Add student to Firestore with QR code download URL
        await addDoc(collection(db, 'sessions'), {
          className,
          sessionName,
          heldOnDate,
        });

        setSessionName();
        setHeldOnDate();
        setClassName();
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
        {classes.map((cls, index) => (
          <Picker.Item key={index} label={cls} value={cls} />
        ))}
      </Picker>
      <Text style={styles.label}>Session Name</Text>
      <TextInput
        style={styles.input}
        value={sessionName}
        onChangeText={setSessionName}
        placeholder="Enter Session name"
      />

      <Text style={styles.label}>Session Name</Text>
      <TextInput
        style={styles.input}
        value={sessionName}
        onChangeText={setSessionName}
        placeholder="Enter Session name"
      />

      <Text style={styles.label}>Select The Date</Text>
      <Button title="Open" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        date={heldOnDate}
        onConfirm={(date) => {
          setOpen(false)
          setHeldOnDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <Button title="Add Session" onPress={handleAddSession} />
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

export default AddSessionScreen;
