import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const AddClassScreen = ({ navigation }) => {
  const [className, setClassName] = useState('');

  const handleAddClass = async () => {
    if (className) {
      try {
        await addDoc(collection(db, 'classes'), { className });
        Alert.alert('Success', 'Class added successfully!');
        setClassName('');
        navigation.navigate('AddStudent'); // Navigate to AddStudent screen after adding class
      } catch (error) {
        Alert.alert('Error', `An error occurred: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Please enter a class name.');
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
      <Button title="Add Class" onPress={handleAddClass} />
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

export default AddClassScreen;
