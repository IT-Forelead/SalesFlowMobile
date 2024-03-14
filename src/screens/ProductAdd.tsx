import React from 'react';
import {useState, useEffect} from 'react';
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
import Input from '@/components/Input';
import SegmentedButtons from '@/components/SegmentedButtons';
import {addProduct} from '@/lib/products';
import {
  ProductAddForm,
  ProductAdd as ProductAddType,
  ProductBarcode,
} from '@/models/products';

type ProductAddProps = {
  productBarcodes: ProductBarcode[];
  onProductAdded: () => void;
  goBack: () => void;
};

type FormErrors = {
  barcode?: string;
  name?: string;
  packaging?: string;
  quantity?: string;
  price?: string;
  saleType?: string;
};

export default function ProductAdd(props: ProductAddProps): React.JSX.Element {
  const [product, setProduct] = useState<ProductAddForm>({
    barcode: '',
    name: '',
    packaging: '',
    quantity: '',
    price: '',
    saleType: '',
  });
  const [adding, setAdding] = useState<boolean>(false);
  const [formValidity, setFormValidity] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [modalVisible, setModalVisible] = useState(
    props.productBarcodes.length > 1,
  );

  useEffect(() => {
    const errors_: FormErrors = {};
    let valid_ = true;

    if (product.barcode !== '' && +product.barcode < 80000000) {
      errors_.barcode = 'Invalid barcode';
      valid_ = false;
    }
    if (product.name.length < 1) {
      errors_.name = 'Invalid';
      valid_ = false;
    }
    if (product.packaging.length < 1) {
      errors_.packaging = 'Invalid';
      valid_ = false;
    }
    if (isNaN(+product.quantity) || +product.quantity < 1) {
      errors_.quantity = 'Invalid';
      valid_ = false;
    }
    if (isNaN(+product.price) || +product.price < 1) {
      errors_.price = 'Invalid';
      valid_ = false;
    }
    if (product.saleType === '') {
      errors_.saleType = 'Invalid';
      valid_ = false;
    }
    setFormValidity(valid_);
    setErrors(errors_);
  }, [product]);

  function sendData() {
    setAdding(true);
    const data: ProductAddType = {
      barcode: product.barcode === '' ? undefined : +product.barcode,
      name: product.name,
      packaging: product.packaging,
      price: +product.price,
      quantity: +product.quantity,
      saleType: product.saleType,
    };

    addProduct(data)
      .then(() => {
        props.onProductAdded();
      })
      .catch(error => {
        setAdding(false);
        Alert.alert('Error', error.response.data, undefined, {
          cancelable: true,
        });
      });
  }

  function selectBarcode(pb?: ProductBarcode) {
    if (pb) {
      setProduct({
        ...product,
        name: pb.trademark,
        packaging: pb.packaging,
      });
    }
    setModalVisible(false);
  }

  const saleTypes = [
    {key: 'amount', label: 'Dona'},
    {key: 'g', label: 'g'},
    {key: 'kg', label: 'kg'},
    {key: 'l', label: 'l'},
    {key: 'ml', label: 'ml'},
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="pt-24 px-4">
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={props.goBack}>
            <View className="w-full h-full p-4 rounded-xl bg-white dark:bg-gray-950 pt-5">
              <Text className="text-4xl text-center text-gray-900 dark:text-gray-200 mb-4">
                Select product
              </Text>
              {props.productBarcodes.map(pb => (
                <Pressable
                  key={pb.id}
                  className="bg-gray-300 dark:bg-gray-800 p-4 my-2 rounded-xl"
                  onPress={() => selectBarcode(pb)}>
                  <Text className="text-xl text-gray-900 dark:text-gray-200">
                    {pb.trademark} - {pb.packaging}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                className="bg-gray-300 dark:bg-gray-800 p-4 mt-8 rounded-xl"
                onPress={() => selectBarcode()}>
                <Text className="text-xl text-gray-900 dark:text-gray-200">
                  Fill manually
                </Text>
              </Pressable>
            </View>
          </Modal>

          <Text className=" text-gray-900 dark:text-gray-200 text-5xl text-center mb-5">
            Add Product
          </Text>

          {product.barcode !== '' ? (
            <Input
              title="Barcode"
              value={product.barcode}
              onChangeText={value => setProduct({...product, barcode: value})}
              editable={false}
              keyboardType="numeric"
              className="text-gray-400"
              required
              errorMessage={errors.barcode}
            />
          ) : null}

          <Input
            title="Name"
            placeholder="Name of product"
            enterKeyHint="next"
            defaultValue={product.name}
            onChangeText={value => setProduct({...product, name: value})}
            required
            errorMessage={errors.name}
          />

          <Input
            title="Packaging"
            placeholder="Packaging of product"
            enterKeyHint="next"
            defaultValue={product.packaging}
            onChangeText={value => setProduct({...product, packaging: value})}
            required
            errorMessage={errors.packaging}
          />

          <Input
            title="Quantity"
            placeholder="Quantity of product"
            enterKeyHint="next"
            keyboardType="numeric"
            defaultValue={product.quantity ? product.quantity.toString() : ''}
            onChangeText={value => setProduct({...product, quantity: value})}
            required
            errorMessage={errors.quantity}
          />

          <Input
            title="Price"
            placeholder="Price of product"
            enterKeyHint="done"
            keyboardType="numeric"
            defaultValue={product.price ? product.price.toString() : ''}
            onChangeText={value => setProduct({...product, price: value})}
            required
            errorMessage={errors.price}
          />

          <SegmentedButtons
            values={saleTypes}
            selected={product.saleType}
            onSelect={value => setProduct({...product, saleType: value})}
          />

          <Button
            title="Add product"
            onPress={sendData}
            disabled={adding || !formValidity}
            loading={adding}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
