import React from 'react';
import {ActivityIndicator, View} from 'react-native';

export default function Loading(): React.JSX.Element {
  return (
    <View className="flex justify-center items-center h-full">
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
