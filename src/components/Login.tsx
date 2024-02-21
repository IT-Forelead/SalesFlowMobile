import React from 'react';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {LoginData} from '../models/auth';
import {login} from '../lib/auth';

type LoginProps = {
  setLoggedIn: (value: boolean) => void;
};

export default function Login({setLoggedIn}: LoginProps): React.JSX.Element {
  const [loginData, setLoginData] = useState<LoginData>({
    password: '',
    login: '',
  });

  return (
    <View style={styles.view}>
      <Text variant="displayLarge" style={styles.text}>
        Login
      </Text>
      <TextInput
        label="Login"
        mode="outlined"
        enterKeyHint="next"
        style={styles.input}
        onChangeText={value => {
          setLoginData({login: value, password: loginData?.password});
        }}
      />
      <TextInput
        label="Password"
        mode="outlined"
        enterKeyHint="done"
        style={styles.input}
        onChangeText={value => {
          setLoginData({login: loginData?.login, password: value});
        }}
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => login(loginData, setLoggedIn)}>
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    paddingTop: 100,
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
});
