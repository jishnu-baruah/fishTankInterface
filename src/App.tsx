import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, TextInput } from 'react-native';
import Video from 'react-native-video';


const SocketStatusIndicator = ({ connected }) => {
  return (
    <View style={[styles.socketStatus, { backgroundColor: connected ? '#4CAF50' : '#F44336' }]}>
    </View>
  );
};

const App = () => {
  console.disableYellowBox = true;

  const [ip, setIp] = useState("192.168.47.212");
  const [data, setData] = useState({ temperature: '--', water_level: '--' });
  const [light, setLight] = useState(false);
  const [pumps, setPumps] = useState(false);
  const [dispenser, setDispenser] = useState(false);
  const [feedingTime, setFeedingTime] = useState('');
  const [waterChangeInterval, setWaterChangeInterval] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const websocket = useRef(null);

  useEffect(() => {
    initWebSocket();
    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => {
      clearInterval(intervalId);
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  const initWebSocket = () => {
    websocket.current = new WebSocket(`ws://${ip}:81/`);
    websocket.current.onopen = () => {
      console.log('WebSocket connection opened');
      setSocketConnected(true);
    };
    websocket.current.onclose = () => {
      console.log('WebSocket connection closed');
      setTimeout(initWebSocket, 2000);
      setSocketConnected(false);
    };
    websocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setData(data);
    };
  };

  const fetchData = () => {
    fetch(`http://${ip}/data`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const togglePin = (pin) => {
    if (!websocket.current || websocket.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection is not open.');
      return;
    }

    websocket.current.send(pin);
  };

  const handleToggle = (setState, state, pin) => {
    setState(!state);
    togglePin(state ? `${pin}_off` : `${pin}_on`);
  };

  const setFeedingTimeHandler = () => {
    if (!feedingTime) {
      console.error('Feeding time is required.');
      return;
    }

    websocket.current.send(JSON.stringify({ action: 'setFeedingTime', time: feedingTime }));
  };

  const setWaterChangeIntervalHandler = () => {
    if (!waterChangeInterval) {
      console.error('Water change interval is required.');
      return;
    }

    websocket.current.send(JSON.stringify({ action: 'setWaterChangeInterval', interval: waterChangeInterval }));
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('./assets/fish.mp4')}
        rate={1.0}
        volume={1.0}
        muted={true}
        resizeMode={'cover'}
        repeat
        style={styles.video}
        fullscreenOrientation={'portrait'}
      />
      <Text style={styles.title}>Fish Tank</Text>
      <View style={styles.sensorData}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.sensorText, { color: 'white' }]}>Temperature</Text>
          <Text style={{ fontSize: 16, color: 'white' }}>{data.temperature} °C</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.sensorText, { color: 'white' }]}>Distance</Text>
          <Text style={{ fontSize: 16, color: 'white' }}>{data.water_level} cm</Text>
        </View>
      </View>
      <View style={styles.controls}>
        <View style={styles.control}>
          <Switch
            value={light}
            onValueChange={() => handleToggle(setLight, light, 'pin1')}
            style={{ transform: [{ scale: 1.5 }] }} 
          />
          <Text style={[styles.controlLabel, { color: 'white' }]}>Light</Text>
        </View>
        <View style={styles.control}>
          <Switch
            value={pumps}
            onValueChange={() => handleToggle(setPumps, pumps, 'pin2')}
            style={{ transform: [{ scale: 1.5 }] }} 
          />
          <Text style={[styles.controlLabel, { color: 'white' }]}>Pumps</Text>
        </View>
        <View style={styles.control}>
          <Switch
            value={dispenser}
            onValueChange={() => handleToggle(setDispenser, dispenser, 'pin3')}
            style={{ transform: [{ scale: 1.5 }] }} 
          />
          <Text style={[styles.controlLabel, { color: 'white' }]}>Dispenser</Text>
        </View>
      </View>

      <View style={styles.timeSettings}>
        <TextInput
          style={styles.input}
          placeholder="Feeding Time(HH:MM)"
          value={feedingTime}
          onChangeText={setFeedingTime}
          placeholderTextColor="white"
        />
        <TouchableOpacity style={styles.button} onPress={setFeedingTimeHandler}>
          <Text style={styles.buttonText}> + </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.timeSettings}>
        <TextInput
          style={styles.input}
          placeholder="Pump Interval(hours)"
          keyboardType="numeric"
          value={waterChangeInterval}
          onChangeText={setWaterChangeInterval}
          placeholderTextColor="white"
        />
        <TouchableOpacity style={styles.button} onPress={setWaterChangeIntervalHandler}>
          <Text style={styles.buttonText}> + </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.ipContainer}>
        <TextInput
          style={styles.ipInput}
          placeholder="Enter IP address"
          value={ip}
          onChangeText={setIp}
        />
        <View style={{ marginBottom: 40 }}></View>
        <SocketStatusIndicator connected={socketConnected} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  controls: {
    justifyContent: 'center',
    marginBottom: 20,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  controlLabel: {
    marginLeft: 10,
    fontSize: 18,
  },
  sensorData: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  sensorText: {
    fontSize: 24,
    marginBottom: 5,
    color: 'white',
    marginHorizontal: 30,
    fontWeight: 'bold',
  },
  timeSettings: {
    marginBottom: 30,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',

    borderRadius: 10,
  },
  input: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    // padding: 10,
    marginHorizontal: 10,
    width: '60%',
    borderRadius: 10,
    color: 'white',
  },
  button: {
    // backgroundColor: '#2979FF',

    // borderWidth: 1,
    borderColor: '#ccc',
    // padding: 10,
    width: 25,
    borderRadius: 30,
    marginHorizontal: 10,
    marginLeft: 45,
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  ipInput: {
    // padding: 10,
    // width: '60%',

    borderRadius: 10,
    textAlign: 'center',
    color: 'white',
  },
  ipContainer: {
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    // padding: 10,

    borderRadius: 10,
  },
  socketStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
  },
});


export default App;
