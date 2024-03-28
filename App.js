import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as React from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

// EXPO GO : 810856399394-e4voptjeq24ep7pg5iv4evm2ctla52c6.apps.googleusercontent.com
// ANDROID : 810856399394-miqr1n2eu781525mt0lb073r6hn2n5se.apps.googleusercontent.com
// IOS : 810856399394-tvc0ctgrqn2lnbdbukk15vasqssnpucp.apps.googleusercontent.com
// WEB : 810856399394-q03iom71pcme45430o6g2uq132he9i5j.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();
export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 
      "810856399394-e4voptjeq24ep7pg5iv4evm2ctla52c6.apps.googleusercontent.com",
    androidClientId: 
      "810856399394-miqr1n2eu781525mt0lb073r6hn2n5se.apps.googleusercontent.com",
    iosClientId: 
      "810856399394-tvc0ctgrqn2lnbdbukk15vasqssnpucp.apps.googleusercontent.com",
    webClientId: 
      "810856399394-q03iom71pcme45430o6g2uq132he9i5j.apps.googleusercontent.com",
    scopes: ["profile","email"],
  });

  const [userInfo, setUserInfo] = React.useState(null);

  React.useEffect(() => {
    handleEffect();
  }, [response]);

  async function handleEffect() {
    const user = await getLocalUser();
    if (!user) {
      getUserInfo(response.authentication.accessToken);
    } else {
      setUserInfo(user);
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;

    try {
      const response = await fetch (
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      { !userInfo ? (
        <Button
          title="Login With Google"
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <View>
          <Image style={styles.image} source={{ uri: userInfo?.picture }} />
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          <Text style={styles.text}>Full Name: {userInfo.name}</Text>

          <Button
            title="Remove AsyncStorage Value"
            onPress={ async () => {
              await AsyncStorage.removeItem("@user");
              setUserInfo(null);
            }}
          />
        </View>
      )}
      <StatusBar style="auto" />
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
  text: {
    fontSize: 25,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
  }
});

