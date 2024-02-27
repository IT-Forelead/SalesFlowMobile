import React from 'react';
import {useEffect, useState} from 'react';
import {Alert, BackHandler, SafeAreaView, Text} from 'react-native';
import BarcodeAdd from './screens/BarcodeAdd';
import Loading from './screens/Loading';
import Login from './screens/Login';
import Home from './screens/Home';
import ProductAdd from './screens/ProductAdd';
import Scanner from './screens/Scanner';
import Success from './screens/Success';
import {check as check_auth} from './lib/auth';
import {getByBarcode, getProducts} from './lib/products';
import {ProductAddData} from './models/products';

type Page =
  | 'loading'
  | 'login'
  | 'home'
  | 'scanner'
  | 'product-add'
  | 'barcode-add'
  | 'success';

export default function App(): React.JSX.Element {
  const [page, setPage] = useState<Page>(check_auth() ? 'home' : 'login');
  const [productAddData, setProductAddData] = useState<ProductAddData>({});
  const [scanNext, setScanNext] = useState<string | undefined>(undefined);

  useEffect(() => {
    const backAction = () => {
      if (page === 'product-add' || page === 'barcode-add') {
        setPage('scanner');
        return true;
      } else if (page === 'scanner') {
        setPage('home');
        setScanNext(undefined);
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
    setPage('loading');
    if (scanNext === 'add_product') {
      getByBarcode(value)
        .then(data => {
          data
            ? setProductAddData({
                barcode: data.barcode,
                name: data.trademark,
                packaging: data.packaging,
              })
            : setProductAddData({barcode: +value});
          getProducts({barcode: +value}).then(response => {
            if (response.data.total > 0) {
              Alert.alert('Error', 'Already added', undefined, {
                cancelable: true,
              });
            }
          });
          setPage('product-add');
        })
        .catch(() => {
          console.log('rejected');
        });
    } else if (scanNext === 'add_barcode') {
      getByBarcode(value).then(response => {
        if (response) {
          Alert.alert('Error', 'Already added', undefined, {cancelable: true});
        }
      });
      setProductAddData({barcode: +value});
      setPage('barcode-add');
    }
  }

  function onAdded() {
    setPage('success');
  }

  function onPageSelect(value: string) {
    setScanNext(value);
    setPage('scanner');
  }

  return (
    <SafeAreaView className="min-h-full bg-white dark:bg-gray-950">
      {page === 'loading' ? (
        <Loading />
      ) : page === 'success' ? (
        <Success button={{title: 'Scan', onClick: () => setPage('scanner')}} />
      ) : page === 'login' ? (
        <Login setLoggedIn={() => setPage('home')} />
      ) : page === 'home' ? (
        <Home onPageSelect={onPageSelect} />
      ) : page === 'scanner' ? (
        <Scanner onScanned={onScanned} />
      ) : page === 'product-add' ? (
        <ProductAdd productAddData={productAddData} onProductAdded={onAdded} />
      ) : page === 'barcode-add' ? (
        <BarcodeAdd barcode={productAddData.barcode!} onAdded={onAdded} />
      ) : (
        <Text className="text-gray-900 dark:text-white">Unknown page</Text>
      )}
    </SafeAreaView>
  );
}
