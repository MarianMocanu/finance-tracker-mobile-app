import React, { FC } from 'react';
import EntryListItem from '../components/EntryListItem';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { colors } from '@globals/style';
import { useEntries } from '@queries/Entries';
import Ionicons from '@expo/vector-icons/Ionicons';
import { EntriesStackParamList } from '../EntriesStackNavigator';
import Button from '@shared/Button';

const EntriesList: FC = () => {
  const navigation = useNavigation<NavigationProp<EntriesStackParamList, 'entries-list'>>();
  const { data: entries, isLoading } = useEntries();

  function navigateToAddForm(): void {
    navigation.navigate('add-entry');
  }

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.blue.dark} style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Button style={styles.addButton} onPress={() => navigateToAddForm()}>
        <Ionicons name="add-circle" style={styles.icon} />
      </Button>
      <FlatList
        style={styles.list}
        contentContainerStyle={{ flex: 1 }}
        data={entries}
        keyExtractor={item => `entry-${item.id.toString()}`}
        renderItem={({ item }) => <EntryListItem entry={item} from="entries-list" />}
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text style={styles.text}>No entries yet</Text>
          </View>
        }
      />
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
  list: {
    padding: 0,
    paddingTop: 8,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    aspectRatio: 1 / 1,
    width: 48,
    borderRadius: 100,
    zIndex: 50,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  icon: {
    fontSize: 40,
    color: colors.blue.base,
    lineHeight: 40,
  },
});
