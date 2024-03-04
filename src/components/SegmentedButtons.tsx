import clsx from 'clsx';
import React from 'react';
import {Pressable, PressableProps, Text, View} from 'react-native';

interface SegmentProps extends PressableProps {
  title: string;
  checked: boolean;
}

interface SegmentedButtonsProps {
  values: {
    key: string;
    label: string;
  }[];
  onSelect: (value: string) => void;
  selected: string | undefined;
}

function Segment(props: SegmentProps): React.JSX.Element {
  return (
    <Pressable
      className={clsx(
        props.checked ? 'bg-blue-600' : 'bg-inherit',
        'border-blue-500 flex-auto py-1',
      )}
      android_ripple={{color: '#3b82f6'}} // tw blue-500
      {...props}>
      <Text className="text-center text-lg text-white">{props.title}</Text>
    </Pressable>
  );
}

export default function SegmentedButtons(
  props: SegmentedButtonsProps,
): React.JSX.Element {
  return (
    <View className="flex flex-row justify-evenly my-4 divide-x border border-blue-500 rounded-full overflow-hidden">
      {props.values.map(value => (
        <Segment
          title={value.label}
          checked={props.selected === value.key}
          onPress={() => props.onSelect(value.key)}
          key={value.key}
        />
      ))}
    </View>
  );
}
