import { colors } from '@globals/style';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import Button from '@shared/Button';
import { SimpleModal } from '@shared/Modal';
import { Picker } from '@shared/Picker';

const EntryAddForm: FC = () => {
  // date set to any to resolve issue caused by dayjs format
  const [date, setDate] = useState<any>(dayjs());
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [currency, setCurrency] = useState('DKK');

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
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Amount"
            style={styles.inputField}
            value={'123'}
          />
        </View>
        {/* CURRENCY INPUT WILL BE CHANGED TO DROPDOWN OF DKK/EUR/USD */}
        {/* <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Currency</Text>
          <TextInput keyboardType="default" placeholder="Currency" style={styles.inputField} />
        </View> */}
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
            style={[styles.inputField, styles.inputTextArea]}
          />
        </View>
        {/* <View style={styles.addButtonWrapper}> */}
        <Button
          primary
          text="Add new entry"
          onPress={() => console.log('submitForm')}
          style={styles.addButtonWrapper} // use this style prop to style the button instead of wrapping it in a view
        />
        {/* </View> */}
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
    gap: 16,
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
