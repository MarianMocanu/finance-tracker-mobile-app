import { colors } from '@globals/style';
import { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Button from '@shared/Button';
import { SimpleModal } from '@shared/Modal';
import { Picker } from '@shared/Picker';
import { useAddEntry } from 'src/mutations/Entries';
import { Entry } from '@models';
import Input from '@shared/Input';
import Toast from 'react-native-toast-message';
import { useCategories } from '@queries/Categories';
import { ImagePicker } from '@shared/ImagePicker';
import axios from 'axios';

const EntryAddForm: FC = () => {
  // date set to any to resolve issue caused by dayjs format

  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [formData, setFormData] = useState<Omit<Entry, 'id'>>({
    name: '',
    amount: 0,
    currency: 'DKK',
    date: new Date().toISOString(),
    comment: '',
    categoryId: undefined,
    images: [],
  });
  const { isLoading, mutate, isSuccess, isError } = useAddEntry(formData);
  const { data: categories, isLoading: areCategoriesLoading } = useCategories();
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [operationType, setOperationType] = useState<'Income' | 'Expense'>('Income');
  const operationTypes = ['Income', 'Expense'];

  const numRegex = /^-?\d+(\.\d+)?$/;

  const submitForm = () => {
    if (formData.images[0]) {
      1;
      axios
        .post(
          `https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5&source=${formData.images[0]}&format=json`,
        )
        .then(response => console.log(JSON.stringify(response, null, 2)))
        .catch(error => console.log('errrrrrror', error));
    }
    // invalidFields.length === 0 && !isLoading
    //   ? mutate(formData)
    //   : Toast.show({
    //       type: 'error',
    //       text1: 'Invalid fields.',
    //     });
  };

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        name: '',
        amount: 0,
        currency: 'DKK',
        date: new Date().toISOString(),
        comment: '',
        categoryId: undefined,
        images: [],
      });
      Toast.show({
        type: 'success',
        text1: 'Entry added successfully',
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Query submission error.',
      });
    }
  }, [isError]);

  const setters = {
    name: (value: string) => {
      setFormData(prevState => ({
        ...prevState,
        name: value,
      }));
    },
    amount: (value: number, type: string) => {
      if (!numRegex.test(value.toString())) {
        setFormData(prevState => ({
          ...prevState,
          amount: 0,
        }));
      } else {
        let convertedValue: number;
        if ((type === 'Expense' && value > 0) || (type === 'Income' && value < 0)) {
          convertedValue = value * -1;
        } else {
          convertedValue = value;
        }
        setFormData(prevState => ({
          ...prevState,
          amount: convertedValue,
        }));
      }
    },
    currency: (value: string) => {
      setFormData(prevState => ({
        ...prevState,
        currency: value,
      }));
    },
    date: (value: string) => {
      if (value) {
        const convertedValue = new Date(value);
        setFormData(prevState => ({
          ...prevState,
          date: convertedValue.toISOString(),
        }));
      }
    },
    category: (value: string) => {
      setFormData(prevState => ({
        ...prevState,
        categoryId:
          value === 'No Category'
            ? undefined
            : categories?.find(category => category.name === value)?.id,
      }));
    },
    comment: (value: string) => {
      setFormData(prevState => ({
        ...prevState,
        comment: value,
      }));
    },
    images: (values: string[]) => {
      setFormData(prevState => ({
        ...prevState,
        images: values,
      }));
    },
  };

  const validators = {
    name: (value: string) => {
      if (value.length < 3) {
        if (!invalidFields.includes('name')) {
          setInvalidFields([...invalidFields, 'name']);
          Toast.show({
            type: 'error',
            text1: 'Name has to be at least 3 characters.',
          });
        }
      } else {
        setInvalidFields([...invalidFields.filter(field => field !== 'name')]);
      }
    },
    amount: (value: number) => {
      if (!numRegex.test(value.toString()) || value == 0) {
        if (!invalidFields.includes('amount')) {
          setInvalidFields([...invalidFields, 'amount']);
          Toast.show({
            type: 'error',
            text1: 'Amount cannot be equal to 0',
          });
        }
      } else if (value > 0 || value < 0) {
        setInvalidFields([...invalidFields.filter(field => field !== 'amount')]);
      }
    },
  };

  if (isLoading && areCategoriesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.blue.dark} />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        automaticallyAdjustKeyboardInsets
      >
        <SimpleModal visible={isDateModalVisible} closeModal={() => setIsDateModalVisible(false)}>
          <Text style={styles.modalHeader}>Select date</Text>
          <Calendar
            onDayPress={value => setters.date(value.dateString)}
            markedDates={{
              [new Date(formData.date).toISOString().slice(0, 10)]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
            theme={{
              selectedDayBackgroundColor: colors.blue.base,
              selectedDotColor: colors.blue.base,
              todayTextColor: colors.blue.base,
              arrowColor: colors.blue.base,
            }}
          />
          <Button
            primary
            text="Confirm"
            onPress={() => setIsDateModalVisible(false)}
            style={styles.modalButton}
          />
        </SimpleModal>

        {/* NAME INPUT */}
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Entry name</Text>
          <Input
            keyboardType="default"
            placeholder="Entry name"
            style={invalidFields.includes('name') ? styles.invalid : styles.valid}
            value={formData.name}
            onChangeText={value => {
              setters.name(value);
            }}
            onBlur={() => {
              setters.name(formData.name.trim());
              validators.name(formData.name);
            }}
          />
        </View>
        {/* AMOUNT INPUT */}
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Amount</Text>
          <Input
            keyboardType="number-pad"
            placeholder="Amount"
            style={invalidFields.includes('amount') ? styles.invalid : styles.valid}
            value={formData.amount.toString()}
            onChangeText={value => {
              setters.amount(parseInt(value), operationType);
            }}
            onBlur={() => validators.amount(formData.amount)}
          />
        </View>
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Operation type</Text>
          <Picker
            data={operationTypes}
            onChange={value => {
              setOperationType(value);
              setters.amount(formData.amount, value);
            }}
            initialSelectedIndex={0}
            placeholder="Operation type"
            containerStyle={styles.inputField}
          />
        </View>
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Currency</Text>
          <Picker
            data={['DKK', 'USD', 'EUR']}
            onChange={setters.currency}
            initialSelectedIndex={0}
            placeholder="Currency"
            containerStyle={styles.inputField}
          />
        </View>
        {/* DATE INPUT and MODAL HANDLER */}
        <Pressable onPress={() => setIsDateModalVisible(true)}>
          <View style={styles.formFieldWrapper} pointerEvents="none">
            <Text style={styles.inputLabel}>Date</Text>
            {/* maybe you don't need a text input for the date, and just a simple Text component wrapped in a View styled as an inputFiled, check the Picker above for example */}
            <Input
              placeholder="Date"
              style={styles.inputField}
              value={formData.date.slice(0, 10)}
              editable={false}
            />
          </View>
        </Pressable>
        {/* CATEGORY PICKER */}
        {categories ? (
          <View style={styles.formFieldWrapper}>
            <Text style={styles.inputLabel}>Category</Text>
            <Picker
              data={[{ name: 'No Category', color: '#ffffff' }]
                .concat(
                  categories.map(category => ({
                    ...category,
                    color: category.color || '#FFFFFF',
                  })),
                )
                .map(category => category.name)}
              onChange={setters.category}
              initialSelectedIndex={0}
              placeholder="Category"
              containerStyle={styles.inputField}
            />
          </View>
        ) : (
          <ActivityIndicator size="small" color={colors.blue.dark} />
        )}
        {/* COMMENT INPUT */}
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Comment</Text>
          <Input
            keyboardType="default"
            placeholder="Comment"
            multiline
            numberOfLines={4}
            onChangeText={value => {
              setters.comment(value);
            }}
            style={[styles.inputTextArea]}
            value={formData.comment}
            onBlur={() => {
              formData.comment && setters.comment(formData.comment?.trim());
            }}
          />
        </View>
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Pictures</Text>
          <ImagePicker images={formData.images} setImages={setters.images} />
        </View>
        <Button
          primary
          text="Add new entry"
          onPress={() => submitForm()}
          style={styles.addButtonWrapper}
        />
      </ScrollView>
      <Toast />
    </>
  );
};

export default EntryAddForm;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
    paddingTop: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  text: {
    fontSize: 18,
    lineHeight: 22,
  },

  formFieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  inputField: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.dark,
    backgroundColor: '#fff',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlignVertical: 'center',
    height: 48,
    width: '100%',
  },
  inputTextArea: {
    height: 128,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.light,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'center',
  },
  modalButton: {
    marginTop: 8,
  },
  addButtonWrapper: {
    marginTop: 24,
  },
  invalid: {
    borderColor: 'red',
  },
  valid: {
    borderColor: colors.border,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
});
