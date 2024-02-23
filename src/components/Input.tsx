import clsx from 'clsx';
import React from 'react';
import {Text, TextInput, TextInputProps, View} from 'react-native';

interface InputProps extends TextInputProps {
  title: string;
}

export default function Input(props: InputProps): React.JSX.Element {
  return (
    <View className="my-2">
      <Text className="mb-2 block text-base font-semibold text-gray-900 dark:text-gray-200">
        {props.title}
      </Text>
      <TextInput
        {...props}
        className={clsx(
          'border rounded-lg p-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500',
          props.className,
        )}
      />
    </View>
  );
}
