import { colors } from '@globals/style';
import { useEntry } from '@queries/Entries';

import { RouteProp, useRoute } from '@react-navigation/native';
import { FC } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useCategories } from '@queries/Categories';
import { CommonActions, NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FC, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs';
import { SimpleModal } from '@shared/Modal';
import Button from '@shared/Button';
import { useDeleteEntry } from 'src/mutations/Entries';
import { EntriesStackParamList } from '../EntriesStackNavigator';

const EntryDetails: FC = () => {
  const route = useRoute<RouteProp<EntriesStackParamList, 'view-entry'>>();
  const navigation = useNavigation<NavigationProp<EntriesStackParamList, 'view-entry'>>();
  
  const { data: entry, isLoading } = useEntry(route.params.id);
  const { data: categories } = useCategories();
  const { isLoading: isDeleting, mutate: deleteEntry, isSuccess: isDeleteSuccess } = useDeleteEntry(route.params.id);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  function navigateToListView(): void {
    navigation.navigate('entries-list');
  }

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
    return (
      <View style={styles.container}>
        {/* DELETE MODAL */}
        <SimpleModal
          visible={isDeleteModalVisible}
          closeModal={() => (isDeleteSuccess ? navigateToListView() : setIsDeleteModalVisible(false))}
        >
          {/* DELETION IN PROGRESS */}
          {isDeleting && (
            <View style={styles.modalContentWrapper}>
              <Text style={styles.modalText}>DELETING...</Text>
            </View>
          )}
          {/* WARNING PROMPT */}
          {!isDeleteSuccess && (
            <View>
              <View style={styles.modalHeaderWrapper}>
                <Text style={styles.modalHeader}>Delete entry</Text>
                <Ionicons name="warning" size={42} color={colors.text.light} />
              </View>
              <Text style={styles.modalText}>Are you sure you want to delete this entry?</Text>
              <View style={styles.modalButtonWrapper}>
                <Button primary text="Cancel" onPress={() => setIsDeleteModalVisible(false)}></Button>
                <Button secondary text="Delete" onPress={() => deleteEntry(route.params.id)}></Button>
              </View>
            </View>
          )}
          {/* DELETION SUCCESSFUL */}
          {isDeleteSuccess && (
            <View style={styles.modalContentWrapper}>
              <Text style={styles.modalText}>DELETED SUCCESSFULLY</Text>
              <Button primary text="Back to list view" onPress={() => navigateToListView()}></Button>
            </View>
          )}
        </SimpleModal>
        {/* HEADER */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.deleteButton} onPress={() => setIsDeleteModalVisible(true)}>
            <Ionicons name="trash-outline" size={24} color={colors.blue.base} />
          </TouchableOpacity>
          <Text style={styles.header}>Entry Details</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => console.log('test')}>
            <Ionicons name="create-outline" size={24} color={colors.blue.base} />
          </TouchableOpacity>
        </View>
        {/* DETAIL LIST */}
        <View style={styles.propertyWrapper}>
          <Text style={styles.propertyHeader}>ID</Text>
          <Text>{entry.id}</Text>
        </View>
        <View style={styles.propertyWrapper}>
          <Text style={styles.propertyHeader}>Name</Text>
          <Text>{entry.name}</Text>
        </View>
        <View style={styles.propertyWrapper}>
          <Text style={styles.propertyHeader}>Amount</Text>
          <Text>
            {entry.amount} {entry.currency}
          </Text>
        </View>
        <View style={styles.propertyWrapper}>
          <Text style={styles.propertyHeader}>Date</Text>
          <Text>{dayjs(entry.date).format('DD/MM/YYYY')}</Text>
        </View>
        <View style={styles.propertyWrapper}>
          <Text style={styles.propertyHeader}>Comment</Text>
          <Text>{entry.comment}</Text>
        </View>
        {entry.categoryId && (
          <View style={styles.propertyWrapper}>
            <Text style={styles.propertyHeader}>Category</Text>
            <Text>{categories?.find(category => category.id === entry.categoryId)?.name}</Text>
          </View>
        )}
      </View>
    );
  }
};

export default EntryDetails;

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
