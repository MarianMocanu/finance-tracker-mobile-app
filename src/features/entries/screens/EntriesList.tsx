import { FC } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { colors } from '@globals/style';
import { useEntries } from '@queries/Entries';

const EntriesList: FC = () => {
  const navigation = useNavigation();
  const { data: entries, isLoading } = useEntries();

  function navigateToDetailedView(id: number): void {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'view-entry',
        params: { id },
      }),
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.blue.dark} />
      </View>
    );
  }

  return entries?.length ? (
    <FlatList
      data={entries}
      keyExtractor={item => `entry-${item.id.toString()}`}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigateToDetailedView(item.id)}>
          <Text>{item.name}</Text>
          <Text>{item.amount}</Text>
        </TouchableOpacity>
      )}
    />
  ) : (
    <View style={styles.center}>
      <Text style={styles.text}>No entries yet</Text>
    </View>
  );
};

export default EntriesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  text: {
    fontSize: 18,
    lineHeight: 22,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
