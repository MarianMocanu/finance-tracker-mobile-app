import { colors } from '@globals/style';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import Button from '@shared/Button';
import { SimpleModal } from '@shared/Modal';
import { Picker } from '@shared/Picker';
import { useAddEntry } from 'src/mutations/Entries';
import { Entry } from '@models';

const EntryAddForm: FC = () => {
  // date set to any to resolve issue caused by dayjs format

  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('DKK');
  const [date, setDate] = useState<any>(dayjs());
  const [comment, setComment] = useState('');
  const [formData, setFormData] = useState<Omit<Entry, 'id'>>();
  const { isLoading, mutate, isSuccess } = useAddEntry(formData);

  const submitForm = () => {
    console.log('name:', name);
    console.log('amount:', amount);
    console.log('currency:', currency);
    console.log('date:', date);
    console.log('comment:', comment);

    setFormData({
      name: name,
      amount: amount,
      currency: currency,
      date: date,
      comment: comment,
      categoryId: 1,
    });

    useAddEntry(formData);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      scrollEnabled={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <SimpleModal visible={isDateModalVisible} closeModal={() => setIsDateModalVisible(false)}>
        <Text style={styles.modalHeader}>Select date</Text>
        <DateTimePicker mode="single" date={date} onChange={params => setDate(params.date)} />
        <Button
          primary
          text="Confirm"
          onPress={() => setIsDateModalVisible(false)}
          style={styles.modalButton}
        />
      </SimpleModal>

      <View style={styles.container}>
        {/* AMOUNT INPUT */}
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Entry name</Text>
          <TextInput
            keyboardType="default"
            placeholder="Entry name"
            style={styles.inputField}
            value={name}
            onChangeText={value => {
              setName(value);
            }}
          />
        </View>
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Amount"
            style={styles.inputField}
            value={amount.toString()}
            onChangeText={value => {
              if (value.length === 0) {
                setAmount(0);
              } else setAmount(parseInt(value));
            }}
          />
        </View>
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Date</Text>
          <Picker
            data={['DKK', 'USD', 'EUR']}
            onChange={setCurrency}
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
            <TextInput
              placeholder="Date"
              style={styles.inputField}
              value={date?.format('DD/MM/YYYY')}
              editable={false}
            />
          </View>
        </Pressable>
        {/* COMMENT INPUT */}
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Comment</Text>
          <TextInput
            keyboardType="default"
            placeholder="Comment"
            multiline
            numberOfLines={4}
            onChangeText={value => {
              setComment(value);
            }}
            style={[styles.inputField, styles.inputTextArea]}
          />
        </View>
        <Button
          primary
          text="Add new entry"
          onPress={() => submitForm()}
          style={styles.addButtonWrapper} // use this style prop to style the button instead of wrapping it in a view
        />
      </View>
    </ScrollView>
  );
};

export default EntryAddForm;

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

  formFieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  inputField: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    fontSize: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
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
});
