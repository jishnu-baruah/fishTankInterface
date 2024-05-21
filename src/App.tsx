import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import Video from 'react-native-video';

const App = () => {
  const [ip, setIp] = useState("192.168.70.37");
  const [data, setData] = useState(null);
  const [feedReminder, setFeedReminder] = useState(false);
  const [waterChangeReminder, setWaterChangeReminder] = useState(false);
  const [feedCountdown, setFeedCountdown] = useState(1800); // 30 minutes in seconds
  const [waterChangeCountdown, setWaterChangeCountdown] = useState(1140); // 19 minutes in seconds

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
      updateCountdowns();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = () => {
    fetch('http://' + ip + '/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleRefresh = () => {
    console.log('Refreshing data... from http://' + ip + '/data');
    fetchData();
  };

  const calculateWaterLevel = (distance) => {
    if (distance <= 5) {
      return '100%';
    } else if (distance >= 17) {
      return '0%';
    } else {
      return `${((17 - distance) / 12) * 100}%`;
    }
  };

  const renderDataCard = (label, value) => (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const updateCountdowns = () => {
    setFeedCountdown((prevCountdown) => {
      if (prevCountdown === 0) {
        setFeedReminder(true);
        return 0;
      }
      return prevCountdown - 1;
    });

    setWaterChangeCountdown((prevCountdown) => {
      if (prevCountdown === 0) {
        setWaterChangeReminder(true);
        return 0;
      }
      return prevCountdown - 1;
    });
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
      <Text style={styles.title}>Tank Status</Text>
      {data ? (
        <View style={styles.cardContainer}>
          {renderDataCard('Temperature', `${data.temperature} °C`)}
          {renderDataCard('Water Level', calculateWaterLevel(data.water_level))}
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading data...</Text>
      )}
      <View style={{ height: 200, marginBottom: 250 }}></View>
      <View style={styles.reminderContainer}>
        <Image source={require('./assets/reminder.png')} style={styles.reminderIcon} />
        <Text style={styles.reminderText}>{!feedReminder ? `Feed in: ${formatTime(feedCountdown)}` : 'Reminder: Feed the fish!'}</Text>
      </View>
      <View style={styles.reminderContainer}>
        <Image source={require('./assets/reminder.png')} style={styles.reminderIcon} />
        <Text style={styles.reminderText}>{!waterChangeReminder ? `Water change in: ${formatTime(waterChangeCountdown)}` : 'Reminder: Change the water!'}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0d0d47', // Set background color to transparent
    zIndex: -1, // Push background behind other content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: 'white',
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%', // Adjust width for spacing between cards
    // backgroundColor: '#2196F3',
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 18,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2979FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  video: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reminderIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  reminderText: {
    fontSize: 16,
    color: 'white',
  },
});

export default App;
