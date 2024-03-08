import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Entry } from '@models';
import { colors } from '@globals/style';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { FC } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs';

type Props = {
  entry: Entry;
};

const EntryListItem: FC<Props> = ({ entry }) => {
  const navigation = useNavigation();

  function navigateToDetailedView(id: number): void {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'view-entry',
        params: { id },
      }),
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigateToDetailedView(entry.id)}>
      <View style={styles.headerWrapper}>
        <Text style={styles.entryHeader}>
          {entry.name.length > 16 ? entry.name.substring(0, 16) + '...' : entry.name}
        </Text>
        <Text style={styles.entryDate}>{dayjs(entry.date).format('DD-MM-YYYY')}</Text>
      </View>

      <Text style={[styles.amount, entry.amount > 0 ? styles.income : styles.expense]}>
        {entry.amount} {entry.currency.toUpperCase()}
      </Text>
      <Ionicons name="chevron-forward" size={24} color={colors.border} />
    </TouchableOpacity>
  );
};

export default EntryListItem;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.grey.dark,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },

  headerWrapper: {
    width: '50%',
  },

  entryHeader: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 2,
  },

  entryDate: {
    color: colors.text.light,
    fontSize: 12,
  },

  amount: {
    display: 'flex',
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.grey.base,
  },

  income: {
    backgroundColor: colors.green.light,
  },

  expense: {
    backgroundColor: colors.red.light,
  },
});
