import { FC, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors } from '@globals/style';
import { SimpleModal } from './Modal';
import Button from './Button';

type Props<Type> = {
  data: Array<Type>;
  onChange: (arg: Type) => void;
  displayKey?: string;
  initialSelectedIndex?: number;
  placeholder?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export const Picker: FC<Props<any>> = ({
  data,
  onChange,
  displayKey,
  initialSelectedIndex,
  placeholder,
  containerStyle,
  textStyle,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!data || data.length === 0) {
    throw new Error('data must be a non-empty array');
  }
  const objectMode = typeof data[0] === 'object';
  if (objectMode && (!displayKey || !data[0].hasOwnProperty(displayKey))) {
    throw new Error('If passing an array of objects, displayKey must be set to a valid property');
  }
  if (
    initialSelectedIndex !== undefined &&
    (initialSelectedIndex < 0 || initialSelectedIndex >= data.length)
  ) {
    throw new Error('initialSelection out of bounds');
  }
  const initialItem = initialSelectedIndex !== undefined ? data[initialSelectedIndex] : undefined;
  const [selection, setSelection] = useState(initialItem);

  function handlePress(item: any) {
    setSelection(item);
    onChange(item);
    setModalOpen(false);
  }

  const renderItem = (item: any) => (
    <Button
      onPress={() => handlePress(item)}
      style={item == selection ? styles.optionSelected : styles.optionRegular}
    >
      <Text style={item == selection ? text.selected : text.regular}>
        {objectMode ? item[displayKey as string] : item}
      </Text>
    </Button>
  );

  return (
    <TouchableOpacity onPress={() => setModalOpen(true)} style={[styles.container, containerStyle]}>
      <Text numberOfLines={1} style={textStyle}>
        {selection
          ? objectMode
            ? selection[displayKey as string]
            : selection
          : placeholder
          ? placeholder
          : ''}
      </Text>
      <Entypo name="chevron-down" size={24} color={'#000'} style={{ lineHeight: 24 }} />
      <SimpleModal visible={modalOpen} closeModal={() => setModalOpen(false)} width={'80%'}>
        <FlatList
          data={data}
          keyExtractor={
            objectMode
              ? (item, index) => item[displayKey as string] + index.toString()
              : (item, index) => item + index.toString()
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => renderItem(item)}
          contentContainerStyle={{ width: '100%' }}
          style={{ width: '100%', backgroundColor: '#FFF' }}
          scrollEnabled={false}
        />
      </SimpleModal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
  },
  optionRegular: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: colors.blue.base,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const text = StyleSheet.create({
  regular: {
    fontSize: 16,
    lineHeight: 18,
    color: '#000',
    fontWeight: '500',
  },
  selected: {
    fontSize: 16,
    lineHeight: 18,
    color: '#FFF',
    fontWeight: '700',
  },
});
