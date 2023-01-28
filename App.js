import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';


export default function App() {
  const [data, setData] = useState([])
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }
  useEffect(() => {
    fetch('http://192.168.1.108:5000/')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(err => console.log(err))
  }, [])


  // "CourseCode": [],
  //   "TotalClasses": [],
  //   "ClassesTaken": [],
  //   "ClassesAttended": [],
  //   "AttendancePercentage": []
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
      <View style={{ flex: 1, width: '100%', padding: 20 }}>
        <View style={{marginTop:50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 10, borderColor:"black",borderWidth:1}}>
          <Text style={[{ fontSize: 9 }]}>Course</Text>
          <Text style={[{ fontSize: 9 }]}>Total Classes</Text>
          <Text style={[{ fontSize: 9 }]}>Classes Taken</Text>
          <Text style={[{ fontSize: 9 }]}>Taken Classes</Text>
          <Text style={[{ fontSize: 9 }]}>Percentage</Text>
        </View>
        {
          data.CourseCode && data.CourseCode.map((item, index) => {
            return (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal:5, backgroundColor: '#f5f5f5', borderColor:"black",borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1, borderRadius: 10 }}>
                <Text style={[{ fontSize: 9,width:50,marginVertical:9 }]}>{item}</Text>
                <Text style={[{ fontSize: 9,width:60,marginVertical:9,paddingLeft:14 }]}>{data.TotalClasses[index]}</Text>
                <Text style={[{ fontSize: 9,width:60,marginVertical:9,paddingLeft:10 }]}>{data.ClassesTaken[index]}</Text>
                <Text style={[{ fontSize: 9,width:60,marginVertical:9,paddingLeft:10 }]}>{data.ClassesAttended[index]}</Text>
                <Text style={[{ fontSize: 9,width:60,marginVertical:9 }]}>{data.AttendancePercentage[index]}</Text>
              </View>
            )
          }
          )
        }
      </View>
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
