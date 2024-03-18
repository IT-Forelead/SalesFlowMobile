import clsx from 'clsx';
import {MinusIcon, PlusIcon, ScanBarcodeIcon} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Button from '@/components/Button';
import SearchInput from '@/components/SearchInput';
import {createOrder} from '@/lib/products';
import {Order, OrderItem} from '@/models/orders';
import {Product} from '@/models/products';

type SaleProps = {
  products: OrderItem[];
  scannedProducts: Product[];
  clearScannedProducts: () => void;
  onScanClick: () => void;
  addOrderItem: (p: Product) => void;
  orderItemChangeAmount: (productId: string, amount: number) => void;
};

type ItemProps = {
  title: string;
  price: number;
  amount: number;
  maxAmount: number;
  productId: string;
  changeAmount: (productId: string, amount: number) => void;
};

function Item(props: ItemProps) {
  return (
    <View className="border border-gray-500 p-4 rounded-xl my-1">
      <Text className="text-gray-800 dark:text-gray-200 text-2xl">
        {props.title}
      </Text>
      <View className="flex flex-row justify-between items-center mt-4">
        <View className="flex flex-row bg-gray-800 rounded-full overflow-hidden items-center px-1">
          <Pressable
            className="py-1.5 px-1"
            onPress={() =>
              props.changeAmount(props.productId, props.amount - 1)
            }>
            <MinusIcon className="text-gray-400" size={24} />
          </Pressable>
          <Text className="text-gray-800 dark:text-gray-200 text-lg px-3 border-x border-gray-700">
            {props.amount}
          </Text>
          <Pressable
            className="py-1.5 px-1"
            disabled={props.amount >= props.maxAmount}
            onPress={() =>
              props.changeAmount(props.productId, props.amount + 1)
            }>
            <PlusIcon className="text-gray-400" size={24} />
          </Pressable>
        </View>
        <Text className="text-gray-800 dark:text-gray-200 text-2xl">
          {props.price * props.amount} UZS
        </Text>
      </View>
      {props.maxAmount - props.amount <= 10 ? (
        <Text className="text-gray-700 dark:text-gray-300 text-lg mt-2">
          Left on sale:{' '}
          <Text className="text-red-500 dark:text-red-600">
            {props.maxAmount - props.amount}
          </Text>
        </Text>
      ) : null}
    </View>
  );
}

export default function Sale(props: SaleProps): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    setModalVisible(props.scannedProducts.length > 1);
  }, [props.scannedProducts, setModalVisible]);

  function selectBarcode(p?: Product) {
    if (p) {
      props.addOrderItem(p);
    }
    props.clearScannedProducts();
  }

  function sell() {
    const order: Order = {
      items: props.products.map(p => ({
        productId: p.productId,
        amount: p.amount,
      })),
      paymentReceived: props.products
        .map(item => item.amount * item.price)
        .reduce((previous, current) => previous + current),
    };
    setCreatingOrder(true);
    createOrder(order)
      .then(() => {
        console.log('order created');
      })
      .catch(error => {
        Alert.alert('Error', error.response?.data, undefined, {
          cancelable: true,
        });
      })
      .finally(() => {
        setCreatingOrder(false);
      });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="pt-4 px-6 min-h-full">
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
        <View className="flex max-h-screen pb-8">
          <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              selectBarcode();
            }}
            visible={modalVisible}>
            <View className="w-full h-full p-4 rounded-xl bg-white dark:bg-gray-950 pt-5">
              <Text className="text-4xl text-center text-gray-900 dark:text-gray-200 mb-4">
                Select product
              </Text>
              {props.scannedProducts.map(p => (
                <Pressable
                  disabled={p.quantity <= 0}
                  key={p.id}
                  className={clsx(
                    'bg-gray-300 dark:bg-gray-800 p-4 my-2 rounded-xl',
                    p.quantity === 0 && 'opacity-80',
                  )}
                  onPress={() => selectBarcode(p)}>
                  <Text className="text-xl text-gray-900 dark:text-gray-200">
                    {p.name} - {p.packaging}
                  </Text>
                  {p.quantity === 0 ? (
                    <Text className="text-xl mt-2 text-red-500 dark:text-red-600">
                      Unavailable
                    </Text>
                  ) : p.quantity <= 10 ? (
                    <Text className="text-xl mt-2 text-gray-700 dark:text-gray-400">
                      Left {p.quantity} on sale
                    </Text>
                  ) : null}
                </Pressable>
              ))}
              <Pressable
                className="bg-gray-300 dark:bg-gray-800 p-4 mt-8 rounded-xl"
                onPress={() => selectBarcode()}>
                <Text className="text-xl text-gray-900 dark:text-gray-200">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </Modal>

          <SearchInput
            placeholder="Search product"
            icon={{
              onClick: props.onScanClick,
              component: (
                <ScanBarcodeIcon className="text-gray-400" size={24} />
              ),
            }}
          />

          <ScrollView>
            {props.products.map(product => (
              <Item
                title={product.title}
                amount={product.amount}
                maxAmount={product.maxAmount}
                price={product.price}
                productId={product.productId}
                key={product.productId}
                changeAmount={props.orderItemChangeAmount}
              />
            ))}
          </ScrollView>

          {props.products.length > 0 ? (
            <Button
              title="Sell"
              onPress={sell}
              loading={isCreatingOrder}
              disabled={isCreatingOrder}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
