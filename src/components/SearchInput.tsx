import {SearchIcon} from 'lucide-react-native';
import clsx from 'clsx';
import React from 'react';
import {Pressable, TextInput, TextInputProps, View} from 'react-native';

interface SearchInputProps extends TextInputProps {
  icon?: {
    component: React.JSX.Element;
    onClick: () => void;
  };
}

export default function SearchInput(
  props: SearchInputProps,
): React.JSX.Element {
  return (
    <View className="my-2">
      <View className="relative">
        <SearchIcon
          className="text-gray-400 absolute z-10 left-3 top-4"
          size={24}
        />

        <TextInput
          className={clsx(
            'border rounded-full p-4 pl-11 bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600 placeholder-red-500 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-base',
            props.className,
          )}
          maxLength={255}
          {...props}
        />

        {props.icon ? (
          <Pressable
            className="py-1 absolute top-3 right-3 w-8"
            onPress={props.icon.onClick}>
            {props.icon.component}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
