import {LogOutIcon, PlusIcon, ScanBarcodeIcon} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {getStats} from '@/lib/products';
import {getUser} from '@/lib/user';
import {Stats} from '@/models/products';

type CardProps = {
  title: string;
  count: number;
  onClick: () => void;
  additionalIcon?: React.JSX.Element;
  onAdditionalClick?: () => void;
};

type HomeProps = {
  onPageSelect: (value: string) => void;
  onLogout?: () => void;
};

function Card(props: CardProps): React.JSX.Element {
  return (
    <View className="bg-blue-100/50 dark:bg-gray-800 rounded-lg py-4 px-6 my-2">
      <Text className="dark:text-white text-2xl">{props.title}</Text>
      <View className="flex flex-row justify-between mt-4">
        {/* DO NOT REMOVE THE SPACE AFTER COUNT!!! IT IS HERE FOR A REASON. */}
        <Text className="dark:text-white text-4xl">{props.count} </Text>
        <View className="flex flex-row space-x-3">
          {props.additionalIcon ? (
            <Pressable
              className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full"
              onPress={props.onAdditionalClick}>
              {props.additionalIcon}
            </Pressable>
          ) : null}
          <Pressable
            className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full"
            onPress={props.onClick}>
            <ScanBarcodeIcon
              className="text-gray-400"
              strokeWidth={1}
              size={32}
            />
          </Pressable>
        </View>
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
            <LogOutIcon className="text-gray-400" />
          </Pressable>
        ) : null}
      </View>
      {user?.privileges.includes('create_product') ? (
        <Card
          title="Products"
          count={stats?.products ?? 0}
          onClick={() => props.onPageSelect('add_product')}
          additionalIcon={
            <PlusIcon className="text-gray-400" strokeWidth={1} size={32} />
          }
          onAdditionalClick={() =>
            props.onPageSelect('add_product_without_barcode')
          }
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
