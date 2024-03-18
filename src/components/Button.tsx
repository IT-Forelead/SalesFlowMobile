import clsx from 'clsx';
import React from 'react';
import {ActivityIndicator, Pressable, PressableProps, Text} from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  loading?: boolean;
  titleClassName?: string;
}

export default function Button(props: ButtonProps): React.JSX.Element {
  return (
    <Pressable
      className={clsx(
        props.disabled ? 'bg-gray-600' : 'bg-blue-600',
        'p-2 my-4 rounded-lg',
        props.className,
      )}
      android_ripple={{color: '#3b82f6'}} // tw blue-500
      {...props}>
      {props.loading ? (
        <ActivityIndicator size={28} color="#3b82f6" />
      ) : (
        <Text
          className={clsx(
            props.disabled ? 'text-gray-300' : 'text-white',
            'text-center text-lg',
            props.titleClassName,
          )}>
          {props.title}
        </Text>
      )}
    </Pressable>
  );
}
