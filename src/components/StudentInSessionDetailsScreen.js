import React, { useEffect, useState,useRef } from 'react';
import { 
  ActivityIndicator, 
  View, 
  Text,
  Image, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView,
  Share,
  Button,
  Switch
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, collection,query, where } from 'firebase/firestore';


const StudentInSessionDetailScreen = ({ route, navigation }) => {
  const {docId} = route.params;
  const [studentInSession, setStudentInSession] = useState(null);
  var [studentData, setStudentData] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const viewShotRef = useRef(null);

  const toggleSwitch = () => setIsPaid(previousState => !previousState);

  const markTutes = (tute) => {
    setStudentData((prevData) => ({
      ...prevData,
      [tute]: !prevData[tute]
    }));
  };

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const docRef = doc(db, 'StudentsInSession', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const student = docSnap.data();
          setStudentInSession(student);
          setStudentData(student);
          setIsPaid(student.isPaid)
        } else {
          console.log('No such Student!');
          Alert.alert('Error', 'No such student!');
        }
        setLoading(false); // Update the loading state
      } catch (error) {
        console.error('Error fetching document: ', error);
        setLoading(false); // Update the loading state in case of an error
        Alert.alert('Error', 'No such student!');
      }
    };

    fetchStudentDetails();
  }, [docId]); // Dependency array includes sessionId

  const shareQRCode = async () => {
    try {
      const shareOptions = {
        title: 'Share QR Code',
        url: studentInSession.student.qrCode,
        message: 'Hi, Here is your QR code',
      };
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing QR code: ', error);
      Alert.alert('Error', 'Failed to share QR code.');
    }
  };

  const updateDoc = async () => {
    try {
      const docRef = doc(db, 'StudentsInSession', docId);
      studentData.isPaid = isPaid
      await setDoc(docRef, studentData)
      Alert.alert('sucessfull', 'saved.');
      
    } catch (error) {
      console.error('Error in Saving student: ', error);
      Alert.alert('Error', 'Failed to save.');
    }
  };



  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!studentInSession) {
    return (
      <View style={styles.container}>
        <Text>No student found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
      <View style={styles.dataFieldRow}>
        <Text style={styles.label}>First Name :  </Text>
        <Text style={styles.label}>{studentInSession.student.firstName}</Text>
      </View>

      <View style={styles.dataFieldRow}>
        <Text style={styles.label}>Last Name :  </Text>
        <Text style={styles.label}>{studentInSession.student.lastName}</Text>
      </View>

      <View style={styles.dataFieldRow}>
        <Text style={styles.label}>Mobile Number :  </Text>
        <Text style={styles.label}>{studentInSession.student.mobileNumber}</Text>
      </View>

      <View style={styles.dataFieldRow}>
        <Text style={[styles.label, {
          width : 100,
          alignSelf :'center'
        }]}> Is Fee paid : </Text>
        <Switch
        style = {{}}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isPaid ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isPaid}
        />
      </View>
      

      <View style={styles.dataFieldRow}>
        <Text style={[styles.label, {
          width : 150,
          alignSelf :'center'
        }]}> Is tute 01 offered : </Text>
        <Switch
        style = {{}}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={studentData.tute_01 ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => markTutes('tute_01')}
        value={studentData.tute_01}
        />
      </View>
      <View style={styles.dataFieldRow}>
        <Text style={[styles.label, {
          width : 150,
          alignSelf :'center'
        }]}> Is tute 02 offered : </Text>
        <Switch
        style = {{}}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={studentData.tute_02 ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => markTutes('tute_02')}
        value={studentData.tute_02}
        />
      </View>
      <View style={styles.dataFieldRow}>
        <Text style={[styles.label, {
          width : 150,
          alignSelf :'center'
        }]}> Is tute 03 offered : </Text>
        <Switch
        style = {{}}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={studentData.tute_03 ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => markTutes('tute_03')}
        value={studentData.tute_03}
        />
      </View>
      <View style={styles.dataFieldRow}>
        <Text style={[styles.label, {
          width : 150,
          alignSelf :'center'
        }]}> Is tute 04 offered : </Text>
        <Switch
        style = {{}}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={studentData.tute_04 ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => markTutes('tute_04')}
        value={studentData.tute_04}
        />
      </View>
      <View style={styles.dataFieldRow}>
        <Text style={[styles.label, {
          width : 150,
          alignSelf :'center'
        }]}> Is tute 05 offered : </Text>
        <Switch
        style = {{}}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={studentData.tute_05 ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => markTutes('tute_05')}
        value={studentData.tute_05}
        />
      </View>
        <Text style={styles.label}>QR Code</Text>
        <View style={styles.qrContainer}>
          <Image
            source={{ uri: studentInSession.student.qrCode }}
            style={styles.qrCodeImage}
            resizeMode="contain"
            onError={(error) => console.log('Error loading image:', error)}
          />
        </View>
        <Button title="Share the QR code" onPress={shareQRCode} />
        <Button title="Save" onPress={updateDoc} />

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
  qrCodeImage : {
    width: 200,
    height: 200,
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
  dataFieldRow : {
    flexDirection: 'row',
    flexWrap: "wrap",
  }
});

export default StudentInSessionDetailScreen;
