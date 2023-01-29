import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Switch, Alert, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('username')
      .then(username => setUsername(username))
      .catch(err => console.log(err));

    AsyncStorage.getItem('password')
      .then(password => setPassword(password))
      .catch(err => console.log(err));

    AsyncStorage.getItem('isLogged')
      .then(isLogged => setIsLogged(isLogged === 'true'))
      .catch(err => console.log(err));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const login = async () => {
    if (username === '' || password === '') {
      Alert.alert('Please enter username and password');
    } else {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.1.109:5000/fetchAttendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "username": username,
            "password": password
          })
        });
        const data = await response.json();
        setData(data.data);
        setName(data.name);
        await AsyncStorage.setItem('isLogged', 'true');
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        setIsLogged(true);
        setLoading(false);
      } catch (err) {
        Alert.alert('Something went wrong');
        setLoading(false);
        console.log(err);
      }
    }
  };
  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={[{ fontSize: 25, color: "white" }]}>UIT Attendance</Text>
        {isLogged ?
          <View style={styles.userDetailsContainer}>
            <Text style={{color:"white"}}>{name} - {username}</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                AsyncStorage.setItem('isLogged', false);
                setIsLogged(false);
              }}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
       :null }
      </View>

      <ScrollView contentContainerStyle={styles.attendanceContainer}>
        {isLogged ?
          <View style={styles.attendanceDataContainer}>
            <View style={styles.attendanceHeader}>
              <Text style={styles.attendanceHeaderText}>Course</Text>
              <Text style={styles.attendanceHeaderText}>Total Classes</Text>
              <Text style={styles.attendanceHeaderText}>Classes Taken</Text>
              <Text style={styles.attendanceHeaderText}>Taken Classes</Text>
              <Text style={styles.attendanceHeaderText}>Percentage</Text>
            </View>

            <FlatList
              style={styles.attendanceListContainer}
              data={data.CourseCode}
              renderItem={({ item, index }) => {
                return (
                  // <View style={styles.attendanceListItem}>
                  //   <Text style={[styles.attendanceListItemText,{width:50}]}>{item}</Text>
                  //   <Text style={styles.attendanceListItemText}>{data.TotalClasses[index]}</Text>
                  //   <Text style={styles.attendanceListItemText}>{data.ClassesTaken[index]}</Text>
                  //   <Text style={styles.attendanceListItemText}>{data.ClassesAttended[index]}</Text>
                  //   <Text style={styles.attendanceListItemText}>{data.AttendancePercentage[index]}</Text>
                  // </View>
                  <View style={styles.attendanceListItem}>
              <Text style={[{ fontSize: 9, width: 50, marginVertical: 5 }]}>{item}</Text>
              <Text style={[{ fontSize: 9, width: 60, marginVertical: 5,marginLeft:20 }]}>{data.TotalClasses[index]}</Text>
              <Text style={[{ fontSize: 9, width: 60, marginVertical: 5 }]}>{data.ClassesTaken[index]}</Text>
              <Text style={[{ fontSize: 9, width: 60, marginVertical: 5 }]}>{data.ClassesAttended[index]}</Text>
              <Text style={[{ fontSize: 9, width: 60, marginVertical: 5  }]}>{data.AttendancePercentage[index]}</Text>
            </View>
                )
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          :
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Login</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.inputField}
                onChangeText={text => setUsername(text)}
                value={username}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.inputField}
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={login}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        }
      </ScrollView>
      <StatusBar style="auto" hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000'
  },
  header: {
    width: '100%',
    height: 90,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  userDetailsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 10
  },
  logoutButton: {
    backgroundColor: '#fff',
    padding: 3,
    borderRadius: 5,
    // marginRight: 25
    marginTop: 5
  },
  logoutButtonText: {
    color: '#000'
  },
  attendanceContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  attendanceDataContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  attendanceHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5',
    width: '100%',
    backgroundColor: '#000',
    padding: 10
  },
  attendanceHeaderText: {
    color: '#fff',
    fontSize: 9,
    width: 45
  },
  attendanceListContainer: {
    width: '100%',
    marginTop: 10
  },
  attendanceListItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 8,
    // backgroundColor: '#000',
    // padding: 10
  },
  attendanceListItemText: {
    fontSize: 9
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  inputField: {
    // width: '200%',
    // height: 40,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginTop: 10
  },
  loginButton: {
    width: '100%',
    // height: 40,
    padding: 10,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20
  },
  loginButtonText: {
    color: '#fff'
  }

});
