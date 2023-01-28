import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Switch, Alert,TextInput,TouchableOpacity, FlatList, ScrollView } from 'react-native';
import React, { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function App() {
  const [data, setData] = useState([])
  const [darkMode, setDarkMode] = useState(false)

  const [username, setUsername] = useState('' || AsyncStorage.getItem('username'))
  const [password, setPassword] = useState('' || AsyncStorage.getItem('password'))

  const [isLogged, setIsLogged] = useState(false || AsyncStorage.getItem('isLogged'))

  const [loading, setLoading] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }
  const login = async () => {
    if (username == '' || password == '') {
      Alert.alert('Please enter username and password')
    }
    else {
      AsyncStorage.setItem('isLogged', false)
      setLoading(true)
      await fetch('http://192.168.1.109:5000/fetchAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": username,
          "password": password
        })
      })

        .then(response => response.json())
        .then(data => {
          console.log(data)
          setData(data)
          AsyncStorage.setItem('isLogged', true)
          AsyncStorage.setItem('username', username)
          AsyncStorage.setItem('password', password)
          setIsLogged(true)
          setLoading(false)
        })
        .catch(err => {
          Alert.alert('Something went wrong')
          setLoading(false)
          console.log(err)
        }
        )

    }
  }

  // useEffect(() => {
  //   if (AsyncStorage.getItem('isLogged') === false) {
  //     setIsLogged(false)
  //   }
  //   else {
  //     setIsLogged(true)
  //   }
  // }, [login])




  return (
    <View style={[styles.container, darkMode && styles.darkTheme]}>
      <View style={styles.header}>
        <Text style={[{ fontSize: 25 }, darkMode && styles.darkTheme]}>UIT Attendance</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={darkMode}
        />
      </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center',width:'100%' }}>
      {isLogged==true ? <View style={{ flex: 1, width: '100%',marginTop:10}}>
        <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 10, borderColor: "black", borderWidth: 1 }}>
          <Text style={[{ fontSize: 9 }]}>Course</Text>
          <Text style={[{ fontSize: 9 }]}>Total Classes</Text>
          <Text style={[{ fontSize: 9 }]}>Classes Taken</Text>
          <Text style={[{ fontSize: 9 }]}>Taken Classes</Text>
          <Text style={[{ fontSize: 9 }]}>Percentage</Text>
        </View>
        
        <FlatList
        style={{width: '100%' }}
        data={data.CourseCode}
        renderItem={({ item, index }) => {
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, backgroundColor: '#f5f5f5', borderColor: "black", borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderRadius: 10 }}>
              <Text style={[{ fontSize: 9, width: 50, marginVertical: 9 }]}>{item}</Text>
              <Text style={[{ fontSize: 9, width: 60, marginVertical: 9, paddingLeft: 14 }]}>{data.TotalClasses[index]}</Text>
              <Text style={[{ fontSize: 9, width: 60, marginVertical: 9, paddingLeft: 10 }]}>{data.ClassesTaken[index]}</Text>
              <Text style={[{ fontSize: 9, width: 60, marginVertical: 9, paddingLeft: 10 }]}>{data.ClassesAttended[index]}</Text>
              <Text style={[{ fontSize: 9, width: 60, marginVertical: 9 }]}>{data.AttendancePercentage[index]}</Text>
            </View>
          )
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      
      </View> :<View style={{ flex: 1, width: '100%', padding: 20,flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
        <Text style={{ fontSize: 20, marginTop: 50 }}>Login</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 15, marginRight: 10 }}>Username</Text>
          <TextInput
            style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1,paddingHorizontal:10  }}
            onChangeText={text => setUsername(text)}
            value={username}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 15, marginRight: 10 }}>Password</Text>
          <TextInput
            style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1,paddingHorizontal:10 }}
            onChangeText={text => setPassword(text)}
            value={password}
          />
        </View>
        <TouchableOpacity style={{width:90, backgroundColor: 'blue', padding: 10, marginTop: 20,flexDirection:'row',alignItems:'center',justifyContent:'center' }} onPress={login}>
          <Text style={{ color: '#fff' }}>Login</Text>
        </TouchableOpacity>
      </View> }
      </ScrollView>


      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkTheme: {
    backgroundColor: '#000',
    color: '#fff'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20
  }
});
