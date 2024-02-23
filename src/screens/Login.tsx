import React from 'react';
import {useState} from 'react';
import {Text, View} from 'react-native';
import {login} from '../lib/auth';
import {LoginData} from '../models/auth';
import Button from '../components/Button';
import Input from '../components/Input';

type LoginProps = {
  setLoggedIn: (value: boolean) => void;
};

export default function Login({setLoggedIn}: LoginProps): React.JSX.Element {
  const [loginData, setLoginData] = useState<LoginData>({
    password: '',
    login: '',
  });

  return (
    <View className="pt-40 px-4">
      <Text className="text-6xl text-center text-gray-900 dark:text-gray-200 mb-8">
        Login
      </Text>

      <Input
        title="Username"
        placeholder="Enter your username"
        enterKeyHint="next"
        autoCapitalize="none"
        autoComplete="username"
        onChangeText={value => {
          setLoginData({login: value, password: loginData?.password});
        }}
        className="mb-2"
      />

      <Input
        title="Password"
        placeholder="Enter your password"
        enterKeyHint="enter"
        autoComplete="password"
        onChangeText={value => {
          setLoginData({login: loginData?.login, password: value});
        }}
        className="mb-2"
        secureTextEntry
      />

      <Button title="Login" onPress={() => login(loginData, setLoggedIn)} />
    </View>
  );
}
