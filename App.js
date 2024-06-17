import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import AuthScreen from './src/components/AuthScreen';
import AuthenticatedScreen from './src/components/AuthenticatedScreen';
import AddStudentScreen from './src/components/AddStudentScreen'; 
import StudentListScreen from './src/components/StudentListScreen'; 
import StudentDetailScreen from './src/components/StudentDetailScreen';
import AddClassScreen from './src/components/AddClassScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './src/components/firebaseConfig';


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
  }, []);

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
            {/* <Stack.Screen name="StudentList" component={StudentList} /> */}
            <Stack.Screen name="AddClass" component={AddClassScreen} />
            <Stack.Screen name="StudentList" component={StudentListScreen} />
            <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
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
