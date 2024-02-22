import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Button} from 'react-native-paper';

type SuccessProps = {
  onClick?: () => void;
};

export default function Success({onClick}: SuccessProps): React.JSX.Element {
  return (
    <View style={styles.view}>
      <Text variant="displayMedium">Product added</Text>
      {onClick ? (
        <Button onPress={onClick} mode="contained" style={styles.button}>
          Scan
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 24,
  },
});
