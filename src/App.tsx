import React from 'react';
import {useEffect, useState} from 'react';
import {Alert, BackHandler, SafeAreaView, Text} from 'react-native';
import {check as check_auth, logout} from '@/lib/auth';
import {getByBarcode, getProducts} from '@/lib/products';
import {OrderItem} from '@/models/orders';
import {Product, ProductAddData, ProductBarcode} from '@/models/products';
import BarcodeAdd from '@/screens/BarcodeAdd';
import Loading from '@/screens/Loading';
import Login from '@/screens/Login';
import Home from '@/screens/Home';
import ProductAdd from '@/screens/ProductAdd';
import Sale from '@/screens/Sale';
import Scanner from '@/screens/Scanner';
import Success from '@/screens/Success';

type Page =
  | 'loading'
  | 'login'
  | 'home'
  | 'scanner'
  | 'product-add'
  | 'barcode-add'
  | 'sale'
  | 'success';

export default function App(): React.JSX.Element {
  const [page, setPage] = useState<Page>(check_auth() ? 'home' : 'login');
  const [productAddData, setProductAddData] = useState<ProductAddData>({});
  const [scanNext, setScanNext] = useState<string | undefined>(undefined);
  const [productBarcodes, setProductBarcodes] = useState<ProductBarcode[]>([]);
  const [scannedOrderProducts, setScannedOrderProducts] = useState<Product[]>(
    [],
  );
  const [scannedBarcode, setScannedBarcode] = useState<number | undefined>();
  const [orderProducts, setOrderProducts] = useState<OrderItem[]>([]);

  useEffect(() => {
    const backAction = () => {
      if (page === 'product-add' || page === 'barcode-add') {
        setScannedBarcode(undefined);
        setProductAddData({});
        setPage('home');
        return true;
      } else if (page === 'scanner') {
        setPage('home');
        setScanNext(undefined);
        return true;
      } else if (page === 'sale') {
        setScanNext(undefined);
        setOrderProducts([]);
        setScannedOrderProducts([]);
        setPage('home');
        return true;
      } else if (page !== 'home') {
        setPage('home');
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
    setScannedBarcode(+value);
    if (scanNext === 'add_product') {
      getByBarcode(value)
        .then(data => {
          setProductBarcodes(data);
          setPage('product-add');
        })
        .catch(() => {
          console.log('rejected');
        });
    } else if (scanNext === 'add_barcode') {
      getByBarcode(value).then(response => {
        if (response.length > 0) {
          Alert.alert('Error', 'Already added', undefined, {cancelable: true});
        }
      });
      setProductAddData({barcode: +value});
      setPage('barcode-add');
    } else if (scanNext === 'sale') {
      getProducts({barcode: +value}).then(response => {
        if (response.data.length === 1) {
          addOrderItem(response.data[0]);
        }
        setScannedOrderProducts(response.data);
      });
      setPage('sale');
    }
  }

  function addOrderItem(product: Product) {
    const filtered = orderProducts.filter(p => p.productId === product.id);
    if (filtered.length > 0) {
      orderItemChangeAmount(product.id, filtered[0].amount + 1);
    } else {
      setOrderProducts([
        ...orderProducts,
        {
          productId: product.id,
          title: product.name + ' - ' + product.packaging,
          price: product.price,
          amount: 1,
          maxAmount: product.quantity,
        },
      ]);
    }
  }

  function orderItemChangeAmount(productId: string, amount: number) {
    if (amount <= 0) {
      setOrderProducts(orderProducts.filter(p => p.productId !== productId));
      return;
    }
    setOrderProducts(
      orderProducts.map(p => {
        if (p.productId === productId && p.maxAmount > amount) {
          return {...p, amount: amount};
        }
        return p;
      }),
    );
  }

  function onAdded() {
    setPage('success');
  }

  function onPageSelect(value: string) {
    if (value === 'sale') {
      setPage('sale');
    } else if (value === 'add_product_without_barcode') {
      setProductBarcodes([]);
      setPage('product-add');
    } else {
      setScanNext(value);
      setPage('scanner');
    }
  }

  function onLogout() {
    Alert.alert(
      'Confirm',
      'Do you want to logout?',
      [
        {
          text: 'Logout',
          onPress: () => {
            logout().finally(() => {
              setPage('login');
            });
          },
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }

  return (
    <SafeAreaView className="min-h-full bg-white dark:bg-gray-950">
      {page === 'loading' ? (
        <Loading />
      ) : page === 'success' ? (
        <Success button={{title: 'Scan', onClick: () => setPage('scanner')}} />
      ) : page === 'login' ? (
        <Login onLoggedIn={() => setPage('home')} />
      ) : page === 'home' ? (
        <Home onPageSelect={onPageSelect} onLogout={onLogout} />
      ) : page === 'scanner' ? (
        <Scanner onScanned={onScanned} />
      ) : page === 'product-add' ? (
        <ProductAdd
          barcode={scannedBarcode}
          productBarcodes={productBarcodes}
          onProductAdded={onAdded}
          goBack={() => setPage('home')}
        />
      ) : page === 'barcode-add' ? (
        <BarcodeAdd barcode={productAddData.barcode!} onAdded={onAdded} />
      ) : page === 'sale' ? (
        <Sale
          onScanClick={() => {
            setScanNext('sale');
            setPage('scanner');
          }}
          products={orderProducts}
          scannedProducts={scannedOrderProducts}
          clearScannedProducts={() => setScannedOrderProducts([])}
          addOrderItem={addOrderItem}
          orderItemChangeAmount={orderItemChangeAmount}
          onOrderCreated={() => setPage('home')}
        />
      ) : (
        <Text className="text-gray-900 dark:text-white">Unknown page</Text>
      )}
    </SafeAreaView>
  );
}
