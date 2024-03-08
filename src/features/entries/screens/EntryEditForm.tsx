import { colors } from '@globals/style';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Button from '@shared/Button';
import { SimpleModal } from '@shared/Modal';
import { Picker } from '@shared/Picker';
import { useUpdateEntry } from 'src/mutations/Entries';
import { Entry } from '@models';
import Input from '@shared/Input';
import Toast from 'react-native-toast-message';
import { useEntry } from '@queries/Entries';
import { useCategories } from '@queries/Categories';
const EntryEditForm: FC = (dispatch: any) => {
  const {
    data: entry,
    isLoading: isEntryDataLoading,
    refetch,
  } = useEntry(dispatch.route.params.id);

  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [formData, setFormData] = useState<Entry>({
    id: 0,
    name: '',
    amount: 0,
    currency: entry ? entry?.currency : 'DKK',
    date: dayjs().toISOString().slice(0, 19),
    comment: '',
    categoryId: undefined,
  });
  const { isLoading, mutate, isSuccess, isError } = useUpdateEntry(formData);
  const { data: categories, isLoading: areCategoriesLoading } = useCategories();
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [operationType, setOperationType] = useState<'Income' | 'Expense'>(
    formData.amount > 0 ? 'Income' : 'Expense',
  );

  const currencies = ['DKK', 'USD', 'EUR'];
  const operationTypes = ['Income', 'Expense'];

  const numRegex = /^-?\d+(\.\d+)?$/;

  const processDate = (date: string) => {
    const MyDate = new Date(date);
    // returns date converted to a format 'edible by calendar marker (ISO TIMEZONE SHENANIGANS)'
    return `${MyDate.getFullYear()}-${('0' + (MyDate.getMonth() + 1)).slice(-2)}-${(
      '0' + MyDate.getDate()
    ).slice(-2)}`;
  };

  useEffect(() => {
    if (!isLoading && entry) {
      setFormData(entry);
    }
  }, [isLoading, entry]);

  const submitForm = () => {
    // validate here
    if (invalidFields.length === 0 && !isLoading) {
      mutate(formData);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid fields.',
      });
    }
  };

  useEffect(() => {
    if (isSuccess && invalidFields.length === 0) {
      Toast.show({
        type: 'success',
        text1: 'Entry updated successfully',
      });
      refetch();
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
        setFormData(prevState => ({
          ...prevState,
          date: new Date(value).toISOString().slice(0, 19),
        }));
      }
    },
    category: (value: string) => {
      setFormData(prevState => ({
        ...prevState,
        categoryId:
          value === 'No Category'
            ? null
            : categories?.find(category => category.name === value)?.id,
      }));
    },
    comment: (value: string) => {
      setFormData(prevState => ({
        ...prevState,
        comment: value,
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
      } else if (value !== 0) {
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

  if (entry)
    return (
      <>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          automaticallyAdjustKeyboardInsets
        >
          <SimpleModal visible={isDateModalVisible} closeModal={() => setIsDateModalVisible(false)}>
            <Text style={styles.modalHeader}>Select date</Text>
            <Calendar
              onDayPress={value => {
                setters.date(value.dateString);
              }}
              markedDates={{
                [processDate(formData.date)]: {
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

          <View style={styles.container}>
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
                initialSelectedIndex={operationTypes.indexOf(operationType)}
                placeholder="Operation type"
                containerStyle={styles.inputField}
              />
            </View>
            <View style={styles.formFieldWrapper}>
              <Text style={styles.inputLabel}>Currency</Text>
              <Picker
                data={currencies}
                onChange={setters.currency}
                initialSelectedIndex={
                  entry && !isEntryDataLoading ? currencies.indexOf(formData.currency) : 0
                }
                placeholder="Currency"
                containerStyle={styles.inputField}
              />
            </View>
            {/* DATE INPUT and MODAL HANDLER */}
            <Pressable onPress={() => setIsDateModalVisible(true)}>
              <View style={styles.formFieldWrapper} pointerEvents="none">
                <Text style={styles.inputLabel}>Date</Text>
                <Input
                  placeholder="Date"
                  style={styles.inputField}
                  value={dayjs(formData.date).format('YYYY-MM-DD')}
                  editable={false}
                />
              </View>
            </Pressable>
            {/* CATEGORY PICKER */}
            {categories ? (
              <View style={styles.formFieldWrapper}>
                <Text style={styles.inputLabel}>Category</Text>
                <Picker
                  data={[{ id: 0, name: 'No Category', color: '#ffffff' }]
                    .concat(
                      categories.map(category => ({
                        ...category,
                        color: category.color || '#FFFFFF',
                      })),
                    )
                    .map(category => category.name)}
                  onChange={setters.category}
                  initialSelectedIndex={
                    entry?.categoryId
                      ? [{ id: 0, name: 'No Category', color: '#ffffff' }]
                          .concat(
                            categories.map(category => ({
                              ...category,
                              color: category.color || '#FFFFFF',
                            })),
                          )
                          .findIndex(category => category.id === entry.categoryId)
                      : 0
                  }
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
            <Button
              primary
              text="Save changes"
              onPress={() => submitForm()}
              style={styles.addButtonWrapper} // use this style prop to style the button instead of wrapping it in a view
            />
          </View>
        </ScrollView>
        <Toast />
      </>
    );
};

export default EntryEditForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 'auto',
    minHeight: 128,
    paddingBottom: 12,
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
    marginTop: 8,
  },
  invalid: {
    borderColor: 'red',
  },
  valid: {
    borderColor: colors.border,
  },
});
