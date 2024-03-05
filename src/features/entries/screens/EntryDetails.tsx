import { colors } from '@globals/style';
import { useEntry } from '@queries/Entries';
import { RouteProp, useRoute } from '@react-navigation/native';
import { FC } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { EntriesStackParamList } from '../EntriesStackNavigator';

const EntryDetails: FC = () => {
  const route = useRoute<RouteProp<EntriesStackParamList, 'view-entry'>>();
  const { data: entry, isLoading } = useEntry(route.params.id);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.blue.dark} />
      </View>
    );
  }

  if (!isLoading && !entry) {
    return (
      <View style={styles.container}>
        <Text>No data for this entry found</Text>
      </View>
    );
  }

  if (entry) {
    console.log(entry);
    return (
      <View style={styles.container}>
        <View style={styles.propertyWrapper}>
          <Text>ID</Text>
          <Text>{entry.id}</Text>
        </View>
        <View style={styles.propertyWrapper}>
          <Text>Name</Text>
          <Text>{entry.name}</Text>
        </View>
        <View style={styles.propertyWrapper}>
          <Text>Amount</Text>
          <Text>
            {entry.amount} {entry.currency}
          </Text>
        </View>
        <View style={styles.propertyWrapper}>
          <Text>Date</Text>
          <Text>{entry.date}</Text>
        </View>
        <View style={styles.propertyWrapper}>
          <Text>Comment</Text>
          <Text>{entry.comment}</Text>
        </View>
      </View>
    );
  }
};

export default EntryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

  propertyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: colors.border,
  },
});
