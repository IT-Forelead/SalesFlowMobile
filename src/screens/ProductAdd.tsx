import React from 'react';
import {useState} from 'react';
import {ScrollView, Text} from 'react-native';
import {addProduct} from '../lib/products';
import {
  ProductAddData,
  ProductAddForm,
  ProductAdd as ProductAddType,
} from '../models/products';
import Button from '../components/Button';
import Input from '../components/Input';
import SegmentedButtons from '../components/SegmentedButtons';

type ProductAddProps = {
  productAddData: ProductAddData;
  onProductAdded: () => void;
};

export default function ProductAdd({
  productAddData,
  onProductAdded,
}: ProductAddProps): React.JSX.Element {
  const [product, setProduct] = useState<ProductAddForm>(productAddData);
  const [adding, setAdding] = useState<boolean>(false);

  function sendData() {
    setAdding(true);
    const data: ProductAddType = {
      barcode: product.barcode!,
      name: product.name!,
      packaging: product.packaging!,
      price: product.price!,
      quantity: product.quantity!,
      saleType: product.saleType!,
    };

    addProduct(data).then(() => {
      onProductAdded();
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
    <ScrollView className="pt-24 px-4">
      <Text className=" text-gray-900 dark:text-gray-200 text-5xl text-center mb-5">
        Add Product
      </Text>

      <Input
        title="Barcode"
        value={product.barcode?.toString()}
        editable={false}
        className="text-gray-400"
      />

      <Input
        title="Name"
        placeholder="Name of product"
        enterKeyHint="next"
        defaultValue={product.name}
        onChangeText={value => setProduct({...product, name: value})}
      />

      <Input
        title="Packaging"
        placeholder="Packaging of product"
        enterKeyHint="next"
        defaultValue={product.packaging}
        onChangeText={value => setProduct({...product, packaging: value})}
      />

      <Input
        title="Quantity"
        placeholder="Quantity of product"
        enterKeyHint="next"
        keyboardType="numeric"
        defaultValue={product.quantity ? product.quantity.toString() : ''}
        onChangeText={value => setProduct({...product, quantity: +value})}
      />

      <Input
        title="Price"
        placeholder="Price of product"
        enterKeyHint="done"
        keyboardType="numeric"
        defaultValue={product.price ? product.price.toString() : ''}
        onChangeText={value => setProduct({...product, price: +value})}
      />

      <SegmentedButtons
        values={saleTypes}
        selected={product.saleType}
        onSelect={value => setProduct({...product, saleType: value})}
      />

      <Button title="Add product" onPress={sendData} disabled={adding} />
    </ScrollView>
  );
}
