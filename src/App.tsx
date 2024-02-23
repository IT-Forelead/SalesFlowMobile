import React from 'react';
import {useEffect, useState} from 'react';
import {BackHandler, SafeAreaView, Text} from 'react-native';
import Loading from './screens/Loading';
import Login from './screens/Login';
import ProductAdd from './screens/ProductAdd';
import Scanner from './screens/Scanner';
import Success from './screens/Success';
import {check as check_auth} from './lib/auth';
import {getByBarcode} from './lib/products';
import {ProductAddData} from './models/products';

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
    <SafeAreaView className="min-h-full bg-white dark:bg-gray-950">
      {page === 'loading' ? (
        <Loading />
      ) : page === 'success' ? (
        <Success button={{title: 'Scan', onClick: () => setPage('scanner')}} />
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
        <Text className="text-gray-900 dark:text-white">Unknown page</Text>
      )}
    </SafeAreaView>
  );
}
