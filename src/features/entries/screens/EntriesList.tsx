import React, { FC } from 'react';
import EntryListItem from '../components/EntryListItem';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { colors } from '@globals/style';
import { useEntries } from '@queries/Entries';
import Ionicons from '@expo/vector-icons/Ionicons';
import { EntriesStackParamList } from '../EntriesStackNavigator';

const EntriesList: FC = () => {
  const navigation = useNavigation<NavigationProp<EntriesStackParamList, 'entries-list'>>();
  const { data: entries, isLoading } = useEntries();

  function navigateToAddForm(): void {
    navigation.navigate('add-entry');
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.blue.dark} />
      </View>
    );
  }

  return entries?.length ? (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigateToAddForm()}>
        <Ionicons name="add-circle" size={40} color={colors.blue.base} />
      </TouchableOpacity>
      <FlatList
        style={styles.list}
        data={entries}
        keyExtractor={item => `entry-${item.id.toString()}`}
        renderItem={({ item }) => <EntryListItem entry={item} />}
      />
    </View>
  ) : (
    <View style={styles.center}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigateToAddForm()}>
        <Ionicons name="add-circle" size={40} color={colors.blue.base} />
      </TouchableOpacity>
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
  list: {
    padding: 0,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    display: 'flex',
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
});
