import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from '@firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import AuthScreen from './src/components/AuthScreen';
import AuthenticatedScreen from './src/components/AuthenticatedScreen';
import AddStudentScreen from './src/components/AddStudentScreen'; 
import StudentList from './src/components/StudentList'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCBTPs3j4R8GVtEGax6cLRl52S4TOXqy1Y",
  authDomain: "attendance-tracker-a0d08.firebaseapp.com",
  projectId: "attendance-tracker-a0d08",
  storageBucket: "attendance-tracker-a0d08.appspot.com",
  messagingSenderId: "666724407848",
  appId: "1:666724407848:web:bcbcc6f9a34edbcd1b331d",
  measurementId: "G-VG9CY2P382"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const Stack = createStackNavigator(); 

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); 
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Authenticated" options={{ headerShown: false }}>
              {props => <AuthenticatedScreen {...props} user={user} handleAuthentication={handleAuthentication} />}
            </Stack.Screen>
            <Stack.Screen name="AddStudent" component={AddStudentScreen} />
            <Stack.Screen name="StudentList" component={StudentList} />
          </>
        ) : (
          <Stack.Screen name="Auth">
            {props => (
              <ScrollView contentContainerStyle={styles.container}>
                <AuthScreen
                  {...props}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                  handleAuthentication={handleAuthentication}
                />
              </ScrollView>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default App;
