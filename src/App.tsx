import React from 'react';
import {useEffect, useState} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, Text} from 'react-native';
import Login from './components/Login';
import Scanner from './components/Scanner';
import ProductAdd from './components/ProductAdd';
import {getByBarcode} from './lib/products';
import {ProductAddData} from './models/products';
import Loading from './components/Loading';
import {check as check_auth} from './lib/auth';
import Success from './components/Success';

type Page = 'loading' | 'login' | 'scanner' | 'product-add' | 'success';

export default function App(): React.JSX.Element {
  // TODO: change default page
  const [page, setPage] = useState<Page>(check_auth() ? 'scanner' : 'login');
  const [productAddData, setProductAddData] = useState<ProductAddData>({});

  useEffect(() => {
    const backAction = () => {
      if (page === 'product-add') {
        setPage('scanner');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [page]);

  function onScanned(value: string) {
    console.log('scanned. data is', value);
    setPage('loading');
    getByBarcode(value)
      .then(data => {
        data
          ? setProductAddData({
              barcode: data.barcode,
              name: data.trademark,
              packaging: data.packaging,
            })
          : setProductAddData({barcode: +value});
        setPage('product-add');
      })
      .catch(() => {
        console.log('rejected');
      });
  }

  function onProductAdded() {
    setPage('success');
  }

  return (
    <SafeAreaView style={styles.view}>
      {page === 'loading' ? (
        <Loading />
      ) : page === 'success' ? (
        <Success onClick={() => setPage('scanner')} />
      ) : page === 'login' ? (
        <Login setLoggedIn={() => setPage('scanner')} />
      ) : page === 'scanner' ? (
        <Scanner onScanned={onScanned} />
      ) : page === 'product-add' ? (
        <ProductAdd
          productAddData={productAddData}
          onProductAdded={onProductAdded}
        />
      ) : (
        <Text>Unknown page</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    height: '100%',
  },
});
