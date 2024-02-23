import React from 'react';
import {useState} from 'react';
import {
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
import {storage} from '../lib/storage';

type BarcodeAddProps = {
  barcode: number;
  onAdded: () => void;
};

export default function BarcodeAdd({
  barcode,
  onAdded,
}: BarcodeAddProps): React.JSX.Element {
  const [product, setProduct] = useState<ProductBarcodeAddForm>({
    barcode: barcode,
  });
  const [adding, setAdding] = useState<boolean>(false);

  function sendData() {
    setAdding(true);
    const data: ProductBarcodeAddType = {
      barcode: product.barcode!,
      trademark: product.trademark!,
      packaging: product.packaging!,
      saleType: product.saleType,
    };

    addProductBarcode(data).then(() => {
      onAdded();
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
            value={product.barcode?.toString()}
            editable={false}
            className="text-gray-400"
          />

          <Input
            title="Trademark"
            placeholder="Trademark of product"
            enterKeyHint="next"
            defaultValue={product.trademark}
            onChangeText={value => setProduct({...product, trademark: value})}
          />

          <Input
            title="Packaging"
            placeholder="Packaging of product"
            enterKeyHint="next"
            defaultValue={product.packaging}
            onChangeText={value => setProduct({...product, packaging: value})}
          />

          <SegmentedButtons
            values={saleTypes}
            selected={product.saleType}
            onSelect={value => setProduct({...product, saleType: value})}
          />

          <Button
            title="Add product barcode"
            onPress={sendData}
            disabled={adding}
            loading={adding}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
