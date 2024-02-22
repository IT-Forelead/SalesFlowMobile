import React from 'react';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, SegmentedButtons, Text, TextInput} from 'react-native-paper';
import {
  ProductAddData,
  ProductAddForm,
  ProductAdd as ProductAddType,
} from '../models/products';
import {addProduct} from '../lib/products';

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

  return (
    <View style={styles.view}>
      <Text variant="displayLarge" style={styles.text}>
        Add Product
      </Text>

      <TextInput
        label="Barcode"
        mode="outlined"
        enterKeyHint="next"
        style={styles.input}
        value={product.barcode?.toString()}
        editable={false}
      />

      <TextInput
        label="Name"
        mode="outlined"
        enterKeyHint="next"
        style={styles.input}
        value={product.name}
        onChangeText={value => setProduct({...product, name: value})}
      />

      <TextInput
        label="Packaging"
        mode="outlined"
        enterKeyHint="next"
        style={styles.input}
        value={product.packaging}
        onChangeText={value => setProduct({...product, packaging: value})}
      />

      <TextInput
        label="Quantity"
        mode="outlined"
        enterKeyHint="next"
        style={styles.input}
        value={product.quantity ? product.quantity.toString() : ''}
        onChangeText={value => setProduct({...product, quantity: +value})}
      />

      <TextInput
        label="Price"
        mode="outlined"
        enterKeyHint="enter"
        style={styles.input}
        value={product.price ? product.price.toString() : ''}
        onChangeText={value => setProduct({...product, price: +value})}
      />

      <SegmentedButtons
        value={product.saleType!}
        onValueChange={value => setProduct({...product, saleType: value})}
        buttons={[
          {value: 'amount', label: 'Dona'},
          {value: 'g', label: 'g'},
          {value: 'kg', label: 'kg'},
          {value: 'l', label: 'l'},
          {value: 'ml', label: 'ml'},
        ]}
        style={styles.segmentedButtons}
      />

      <Button
        mode="contained"
        style={styles.button}
        onPress={sendData}
        loading={adding}
        disabled={adding}>
        Add
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  text: {
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    marginVertical: 4,
  },
  segmentedButtons: {
    marginTop: 12,
  },
  button: {
    marginTop: 16,
  },
});
