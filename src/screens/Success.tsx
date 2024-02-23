import React from 'react';
import {Text, View} from 'react-native';
import Button from '../components/Button';

type SuccessProps = {
  button?: {
    onClick: () => void;
    title: string;
  };
};

export default function Success({button}: SuccessProps): React.JSX.Element {
  return (
    <View className="flex items-center justify-center min-h-full">
      <Text className="text-4xl dark:text-white">Product added</Text>
      {button ? (
        <Button
          title={button.title}
          onPress={button.onClick}
          className="w-[50%]"
        />
      ) : null}
    </View>
  );
}
