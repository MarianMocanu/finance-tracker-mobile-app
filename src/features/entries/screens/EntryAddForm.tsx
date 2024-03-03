import { colors } from '@globals/style';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '@shared/Button';

const EntryAddForm: FC = () => {
  // date set to any to resolve issue caused by dayjs format
  const [date, setDate] = useState<any>(dayjs());
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      scrollEnabled={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={[styles.modalWrapper, isDateModalVisible ? styles.visible : styles.hidden]}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setIsDateModalVisible(false)}
          >
            <Ionicons name="close-circle" size={32} color={colors.border} />
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Select date</Text>
          <DateTimePicker mode="single" date={date} onChange={params => setDate(params.date)} />
          <Button text="Confirm" onPress={() => setIsDateModalVisible(false)}></Button>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Amount"
            style={styles.inputField}
            value={'123'}
          ></TextInput>
        </View>
        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Currency</Text>
          <TextInput
            keyboardType="default"
            placeholder="Currency"
            style={styles.inputField}
          ></TextInput>
        </View>
        <Pressable onPress={() => setIsDateModalVisible(true)}>
          <View style={styles.formFieldWrapper} pointerEvents="none">
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              placeholder="Date"
              style={styles.inputField}
              value={date?.format('DD/MM/YYYY')}
              editable={false}
            ></TextInput>
          </View>
        </Pressable>
        {/*  */}

        <View style={styles.formFieldWrapper}>
          <Text style={styles.inputLabel}>Comment</Text>
          <TextInput
            keyboardType="default"
            placeholder="Comment"
            multiline
            numberOfLines={4}
            style={[styles.inputField, styles.inputTextArea]}
          ></TextInput>
        </View>
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
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
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

  modalWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,025,0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  modalContent: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  closeModalButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  visible: {
    display: 'flex',
  },
  hidden: {
    display: 'none',
  },
});
