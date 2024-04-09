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
import {addProductBarcode} from '@/lib/products';
import {
  ProductBarcode,
  ProductBarcodeAddForm,
  ProductBarcodeAdd as ProductBarcodeAddType,
} from '@/models/products';

type BarcodeAddProps = {
  barcode: number;
  productBarcodes: ProductBarcode[];
  onAdded: () => void;
  goBack: () => void;
};

type FormErrors = {
  barcode?: string;
  trademark?: string;
  packaging?: string;
};

export default function BarcodeAdd({
  barcode,
  productBarcodes,
  onAdded,
  goBack,
}: BarcodeAddProps): React.JSX.Element {
  const [product, setProduct] = useState<ProductBarcodeAddForm>({
    barcode: barcode.toString(),
    packaging: productBarcodes.length === 1 ? productBarcodes[0].packaging : '',
    trademark: productBarcodes.length === 1 ? productBarcodes[0].trademark : '',
  });
  const [formValidity, setFormValidity] = useState(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [modalVisible, setModalVisible] = useState(productBarcodes.length > 1);

  useEffect(() => {
    const errors_: FormErrors = {};
    let valid_ = true;

    if (+product.barcode < 80000000) {
      errors_.barcode = 'Invalid barcode';
      valid_ = false;
    }
    if (product.trademark.length < 1) {
      errors_.trademark = 'Invalid';
      valid_ = false;
    }
    if (product.packaging.length < 1) {
      errors_.packaging = 'Invalid';
      valid_ = false;
    }

    if (productBarcodes.filter(p => p.trademark === product.trademark).length) {
      errors_.trademark = 'Already exists';
      valid_ = false;
    }

    setFormValidity(valid_);
    setErrors(errors_);
  }, [product, productBarcodes]);

  function sendData() {
    setAdding(true);
    const data: ProductBarcodeAddType = {
      barcode: +product.barcode,
      trademark: product.trademark,
      packaging: product.packaging,
      saleType: product.saleType,
    };

    addProductBarcode(data)
      .then(() => {
        onAdded();
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
        trademark: pb.trademark,
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
            onRequestClose={goBack}>
            <View className="w-full h-full p-4 rounded-xl bg-white dark:bg-gray-950 pt-5">
              <Text className="text-4xl text-center text-gray-900 dark:text-gray-200 mb-4">
                Select barcode
              </Text>

              {productBarcodes.map(pb => (
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
            Add Barcode
          </Text>

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

          <Input
            title="Trademark"
            placeholder="Trademark of product"
            enterKeyHint="next"
            defaultValue={product.trademark}
            onChangeText={value => setProduct({...product, trademark: value})}
            errorMessage={errors.trademark}
            required
          />

          <Input
            title="Packaging"
            placeholder="Packaging of product"
            enterKeyHint="next"
            defaultValue={product.packaging}
            onChangeText={value => setProduct({...product, packaging: value})}
            errorMessage={errors.packaging}
            required
          />

          <SegmentedButtons
            values={saleTypes}
            selected={product.saleType}
            onSelect={value => setProduct({...product, saleType: value})}
          />

          <Button
            title="Add product barcode"
            onPress={sendData}
            disabled={adding || !formValidity}
            loading={adding}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
