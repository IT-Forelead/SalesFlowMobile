import React from 'react';
import {useState} from 'react';
import {Alert, Text, View} from 'react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {login} from '@/lib/auth';

type LoginProps = {
  onLoggedIn: () => void;
};

export default function Login({onLoggedIn}: LoginProps): React.JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function logIn() {
    setLoading(true);
    login({login: username, password: password})
      .then(() => {
        onLoggedIn();
      })
      .catch(() => {
        Alert.alert(
          'Incorrect login details',
          'Username or password is incorrect',
          undefined,
          {cancelable: true},
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

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
        onChangeText={setUsername}
        value={username}
        className="mb-2"
      />

      <Input
        title="Password"
        placeholder="Enter your password"
        enterKeyHint="enter"
        autoCapitalize="none"
        autoComplete="password"
        onChangeText={setPassword}
        value={password}
        className="mb-2"
        secureTextEntry
      />

      <Button
        title="Login"
        onPress={logIn}
        loading={loading}
        disabled={loading || username === '' || password === ''}
      />
    </View>
  );
}
