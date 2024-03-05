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
    currency: 'DKK',
    date: dayjs().toISOString().slice(0, 19),
    comment: '',
    categoryId: undefined,
  });
  const { isLoading, mutate, isSuccess, isError } = useUpdateEntry(formData);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [markedDate, setMarkedDate] = useState('');

  const currencies = ['DKK', 'USD', 'EUR'];

  const numRegex = /^(0|[1-9][0-9]*)$/;

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
    mutate(formData);
    if (isSuccess && !isLoading) {
      refetch();
    }
  };

  //   useEffect(() => {
  //     if (isSuccess) {
  //       setFormData({
  //         name: '',
  //         amount: 0,
  //         currency: 'DKK',
  //         date: dayjs().toISOString().slice(0, 10),
  //         comment: '',
  //         categoryId: undefined,
  //       });
  //       Toast.show({
  //         type: 'success',
  //         text1: 'Entry added successfully',
  //       });
  //     }
  //   }, [isSuccess]);

  //   useEffect(() => {
  //     if (isError) {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Query submission error.',
  //       });
  //     }
  //   }, [isError]);

  const setters = {
    name: (value: string) => {
      setFormData(prevState => ({
        ...prevState,
        name: value,
      }));
    },
    amount: (value: string) => {
      if (value.length === 0) {
        setFormData(prevState => ({
          ...prevState,
          amount: 0,
        }));
      } else {
        setFormData(prevState => ({
          ...prevState,
          amount: parseInt(value),
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
            text1: 'Amount has to be a number greater than 0',
          });
        }
      } else if (value > 0) {
        setInvalidFields([...invalidFields.filter(field => field !== 'amount')]);
      }
    },
  };

  if (isLoading || isEntryDataLoading) {
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
          contentContainerStyle={{ flexGrow: 1 }}
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
                  setters.amount(value);
                }}
                onBlur={() => validators.amount(formData.amount)}
              />
            </View>
            <View style={styles.formFieldWrapper}>
              <Text style={styles.inputLabel}>Currency</Text>
              <Picker
                data={currencies}
                onChange={setters.currency}
                initialSelectedIndex={currencies.indexOf(entry.currency)}
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
                  value={dayjs(formData.date).format('YYYY-MM-DD')}
                  editable={false}
                />
              </View>
            </Pressable>
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
    marginTop: 'auto',
  },
  addButton: {
    backgroundColor: colors.blue.base,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  invalid: {
    borderColor: 'red',
  },
  valid: {
    borderColor: colors.border,
  },
});
