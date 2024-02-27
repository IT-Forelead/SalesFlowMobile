import React from 'react';
import {useState, useEffect} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {addProductBarcode} from '../lib/products';
import {
  ProductBarcodeAddForm,
  ProductBarcodeAdd as ProductBarcodeAddType,
} from '../models/products';
import Button from '../components/Button';
import Input from '../components/Input';
import SegmentedButtons from '../components/SegmentedButtons';

type BarcodeAddProps = {
  barcode: number;
  onAdded: () => void;
};

type FormErrors = {
  barcode?: string;
  trademark?: string;
  packaging?: string;
};

export default function BarcodeAdd({
  barcode,
  onAdded,
}: BarcodeAddProps): React.JSX.Element {
  const [product, setProduct] = useState<ProductBarcodeAddForm>({
    barcode: barcode.toString(),
    packaging: '',
    trademark: '',
  });
  const [formValidity, setFormValidity] = useState(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

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
    setFormValidity(valid_);
    setErrors(errors_);
  }, [product]);

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
