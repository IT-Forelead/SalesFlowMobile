import clsx from 'clsx';
import {CheckIcon, XIcon} from 'lucide-react-native';
import React from 'react';
import {Pressable, PressableProps, Text, View} from 'react-native';

interface CheckboxProps extends PressableProps {
  title: string;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps): React.JSX.Element {
  return (
    <Pressable
      onPress={() => props.onCheckedChange(!props.isChecked)}
      {...props}>
      <View className="flex flex-row items-center">
        <View
          className={clsx(
            'rounded p-0.5 mr-2 w-5 h-5',
            props.isChecked ? 'bg-blue-600' : 'bg-gray-200',
          )}>
          {props.isChecked ? (
            <CheckIcon className="text-white" size={16} strokeWidth={4} />
          ) : (
            <XIcon className="text-gray-100" size={16} strokeWidth={4} />
          )}
        </View>
        <Text
          className={clsx(
            'text-base',
            props.disabled
              ? 'text-gray-700 dark:text-gray-400'
              : 'text-gray-900 dark:text-gray-200',
          )}>
          {props.title}
        </Text>
      </View>
    </Pressable>
  );
}
