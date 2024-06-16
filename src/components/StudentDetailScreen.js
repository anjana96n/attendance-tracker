import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const StudentDetailScreen = ({ route }) => {
  const { student } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <Text style={styles.value}>{student.firstName}</Text>

      <Text style={styles.label}>Last Name</Text>
      <Text style={styles.value}>{student.lastName}</Text>

      <Text style={styles.label}>Class</Text>
      <Text style={styles.value}>{student.className}</Text>

      <Text style={styles.label}>Mobile Number</Text>
      <Text style={styles.value}>{student.mobileNumber}</Text>

      <Text style={styles.label}>QR Code</Text>
      <View style={styles.qrContainer}>
        <QRCode value={student.qrCode} size={200} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StudentDetailScreen;
