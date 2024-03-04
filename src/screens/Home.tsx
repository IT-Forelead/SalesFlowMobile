import React, {useEffect, useState} from 'react';
import {Pressable, Text, View, useColorScheme} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getStats} from '@/lib/products';
import {getUser} from '@/lib/user';
import {Stats} from '@/models/products';

type CardProps = {
  title: string;
  count: number;
  onClick: () => void;
};

type HomeProps = {
  onPageSelect: (value: string) => void;
  onLogout?: () => void;
};

function Card(props: CardProps): React.JSX.Element {
  const colorScheme = useColorScheme();

  return (
    <View className="bg-blue-100/50 dark:bg-gray-800 rounded-lg py-4 px-6 my-2">
      <Text className="dark:text-white text-2xl">{props.title}</Text>
      <View className="flex flex-row justify-between mt-4">
        {/* DO NOT REMOVE THE SPACE AFTER COUNT!!! IT IS HERE FOR A REASON. */}
        <Text className="dark:text-white text-4xl">{props.count} </Text>
        <Pressable
          className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full"
          onPress={props.onClick}>
          <Svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <Path d="M5 12h14" />
            <Path d="M12 5v14" />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

export default function Home(props: HomeProps): React.JSX.Element {
  const [stats, setStats] = useState<Stats>();

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const user = getUser();

  return (
    <View className="p-4 min-h-full">
      <View className="flex flex-row justify-between my-4">
        <Text className="text-2xl dark:text-white">
          {user?.firstname} {user?.lastname}
        </Text>
        {props.onLogout ? (
          <Pressable className="p-1" onPress={props.onLogout}>
            <Text className="text-gray-500 dark:text-gray-400">
              <Icon name="logout" size={24} />
            </Text>
          </Pressable>
        ) : null}
      </View>
      {user?.privileges.includes('create_product') ? (
        <Card
          title="Products"
          count={stats?.products ?? 0}
          onClick={() => props.onPageSelect('add_product')}
        />
      ) : null}
      {user?.privileges.includes('create_barcode') ? (
        <Card
          title="Barcodes"
          count={stats?.barcodes ?? 0}
          onClick={() => props.onPageSelect('add_barcode')}
        />
      ) : null}
    </View>
  );
}