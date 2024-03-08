import { colors } from '@globals/style';
import { useCategory } from '@queries/Categories';
import { useEntriesForCategory } from '@queries/Entries';
import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { FC, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '@shared/Button';
import { SimpleModal } from '@shared/Modal';
import { CategoriesStackParamList } from '../CategoriesStackNavigator';
import { useDeleteCategory } from 'src/mutations/Categories';
import { EntriesStackParamList } from 'src/features/entries/EntriesStackNavigator';
import contrastChecker from '@globals/ContrastChecker';

const CategoryDetails: FC = () => {
  const route = useRoute<RouteProp<CategoriesStackParamList, 'view-category'>>();
  const navigation = useNavigation<NavigationProp<EntriesStackParamList>>();

  const { data: category, isLoading } = useCategory(route.params.id);
  const { data: categoryEntries, isLoading: isLoadingEntries } = useEntriesForCategory(
    route.params.id,
  );

  const {
    isLoading: isDeleting,
    mutate: deleteCategory,
    isSuccess: isDeleteSuccess,
  } = useDeleteCategory(route.params.id);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  function navigateToDetailedView(id: number): void {
    navigation.navigate('view-entry', { id });
  }

  function navigateToList(): void {
    navigation.navigate('categories-list');
  }

  function navigateToEditView(id: number): void {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'edit-category',
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
        {/* DELETE MODAL */}
        <SimpleModal
          visible={isDeleteModalVisible}
          closeModal={() => (isDeleteSuccess ? navigateToList() : setIsDeleteModalVisible(false))}
        >
          {/* DELETION IN PROGRESS */}
          {isDeleting && (
            <View style={styles.modalContentWrapper}>
              <Text style={styles.modalText}>DELETING...</Text>
              <ActivityIndicator size="small" color={colors.blue.dark} />
            </View>
          )}
          {/* WARNING PROMPT */}
          {!isDeleteSuccess && (
            <View>
              <View style={styles.modalHeaderWrapper}>
                <Text style={styles.modalHeader}>Delete category</Text>
                <Ionicons name="warning" size={42} color={colors.text.light} />
              </View>
              <Text style={styles.modalText}>Are you sure you want to delete this category?</Text>
              <View style={styles.modalButtonWrapper}>
                <Button
                  primary
                  text="Cancel"
                  onPress={() => setIsDeleteModalVisible(false)}
                ></Button>
                <Button
                  secondary
                  text="Delete"
                  onPress={() => deleteCategory(route.params.id)}
                ></Button>
              </View>
            </View>
          )}
          {/* DELETION SUCCESSFUL */}
          {isDeleteSuccess && (
            <View style={styles.modalContentWrapper}>
              <Text style={[styles.header, { marginBottom: 20 }]}>
                CATEGORY DELETED SUCCESSFULLY
              </Text>
              <Button primary text="Back to list view" onPress={() => navigateToList()}></Button>
            </View>
          )}
        </SimpleModal>
        {/* HEADER */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setIsDeleteModalVisible(true)}
          >
            <Ionicons name="trash-outline" size={24} color={colors.blue.base} />
          </TouchableOpacity>
          <Text
            style={[
              styles.header,
              {
                backgroundColor: category.color,
                color: category.color
                  ? contrastChecker(category.color)
                    ? colors.text.black
                    : colors.text.white
                  : colors.text.black,
                paddingHorizontal: 10,
                paddingVertical: 2,
                paddingBottom: 4,
                borderRadius: 40,
              },
            ]}
          >
            {category.name}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigateToEditView(category.id)}
          >
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
  modalHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },

  modalHeader: {
    fontSize: 20,
    fontWeight: '600',
  },

  modalText: {
    alignSelf: 'center',
    marginBottom: 24,
  },

  modalButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 24,
    width: '100%',
    justifyContent: 'space-between',
  },

  modalContentWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
