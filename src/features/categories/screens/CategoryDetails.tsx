import { colors } from '@globals/style';
import { useCategory } from '@queries/Categories';
import { useEntriesForCategory } from '@queries/Entries';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { FC } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const CategoryDetails: FC = (dispatch: any) => {
  const { data: category, isLoading } = useCategory(dispatch.route.params.id);
  const { data: categoryEntries, isLoading: isLoadingEntries } = useEntriesForCategory(
    dispatch.route.params.id,
  );
  const navigation = useNavigation();

  function navigateToDetailedView(id: number): void {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'view-entry',
        params: { id },
      }),
    );
  }

  if (isLoading && isLoadingEntries) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.blue.dark} />
      </View>
    );
  }

  if (!isLoading && !categoryEntries) {
    return (
      <View style={styles.container}>
        <Text>No data for this category found</Text>
      </View>
    );
  }

  if (category) {
    return (
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity disabled style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color={colors.grey.dark} />
          </TouchableOpacity>
          <Text style={styles.header}>{category.name}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => console.log('test')}>
            <Ionicons name="create-outline" size={24} color={colors.blue.base} />
          </TouchableOpacity>
        </View>
        {categoryEntries && categoryEntries?.length > 0 && (
          <FlatList
            style={styles.list}
            data={
              categoryEntries && categoryEntries.filter(entry => entry.categoryId === category.id)
            }
            keyExtractor={item => `entry-${item.id.toString()}`}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => navigateToDetailedView(item.id)}>
                <Text>{item.name}</Text>
                <Text>{item.amount}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }
};

export default CategoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
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
    borderBottomWidth: 1,
    borderColor: colors.grey.base,
    width: '100%',
    marginBottom: 12,
    paddingVertical: 2,
  },

  propertyHeader: {
    fontWeight: '600',
    color: colors.text.light,
  },

  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  editButton: {
    position: 'absolute',
    right: 0,
    zIndex: 50,
  },

  deleteButton: {
    position: 'absolute',
    left: 0,
    zIndex: 50,
  },

  header: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
  list: {
    padding: 12,
    paddingTop: 8,
    width: '100%',
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
});
