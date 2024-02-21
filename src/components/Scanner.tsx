// TODO: updated inline styles
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {ReactNativeScannerView} from '@pushpendersingh/react-native-scanner';
import {Svg, Polygon, Rect} from 'react-native-svg';
import {checkCameraPermission} from '../lib/camera';
import {validateBarcode} from '../lib/products';

type ScannerProps = {
  onScanned: (value: string) => void;
};

export default function Scanner({onScanned}: ScannerProps): React.JSX.Element {
  function onQrScanned(event: any) {
    const barcode = event?.nativeEvent?.value;
    if (validateBarcode(barcode)) {
      onScanned(barcode);
    } else {
      // TODO: remove debugger
      console.warn('invalid scan');
    }
  }

  const {height, width} = useWindowDimensions();
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] =
    useState(false);

  useEffect(() => {
    checkCameraPermission(setIsCameraPermissionGranted);
  }, []);

  const SQUARE_SIZE = 250;

  if (isCameraPermissionGranted) {
    return (
      <View style={{flex: 1}}>
        <ReactNativeScannerView
          style={{height, width}}
          onQrScanned={onQrScanned}
        />
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Polygon
            points={`
              0, 0
              ${width}, 0
              ${width}, ${(height - SQUARE_SIZE) / 2}
              ${(width - SQUARE_SIZE) / 2}, ${(height - SQUARE_SIZE) / 2}
              ${(width - SQUARE_SIZE) / 2}, ${(height + SQUARE_SIZE) / 2}
              ${(width + SQUARE_SIZE) / 2}, ${(height + SQUARE_SIZE) / 2}
              ${(width + SQUARE_SIZE) / 2}, ${(height - SQUARE_SIZE) / 2}
              ${width}, ${(height - SQUARE_SIZE) / 2}
              ${width}, ${height}
              0, ${height}
            `}
            fill="black"
            fillOpacity="0.5"
          />
          <Rect
            x={(width - SQUARE_SIZE) / 2}
            y={(height - SQUARE_SIZE) / 2}
            width={SQUARE_SIZE}
            height={SQUARE_SIZE}
            fill="transparent"
            stroke="white"
          />
        </Svg>
      </View>
    );
  } else {
    return (
      // TODO: add better permission needed
      <Text style={{fontSize: 24, color: 'red'}}>
        You need to grant camera permission first
      </Text>
    );
  }
}
