import clsx from 'clsx';
import React from 'react';
import {Pressable, Text, TextInput, TextInputProps, View} from 'react-native';

interface InputProps extends TextInputProps {
  title: string;
  required?: boolean;
  errorMessage?: string;
  icon?: React.JSX.Element;
  onIconClick?: () => void;
}

export default function Input(props: InputProps): React.JSX.Element {
  return (
    <View className="my-2">
      <Text className="mb-2 block text-base font-semibold text-gray-900 dark:text-gray-200">
        {props.title}
        {props.required ? <Text className="text-red-600"> *</Text> : null}
      </Text>
      <View className="relative">
        <TextInput
          {...props}
          className={clsx(
            'border rounded-lg p-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500',
            props.className,
          )}
          maxLength={255}
        />

        {props.icon ? (
          <Pressable
            className="py-1 absolute top-[7px] right-1 w-8"
            onPress={props.onIconClick}>
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              {props.icon}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Text className="text-red-600 text-sm">{props.errorMessage}</Text>
    </View>
  );
}
