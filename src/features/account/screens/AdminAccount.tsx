import { User } from '@models';
import { useUsers } from '@queries/Users';
import Button from '@shared/Button';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { logOut } from 'src/features/auth/authSlice';
import { colors } from '@globals/style';
import { SimpleModal } from '@shared/Modal';
import { useDeleteUser } from 'src/mutations/Users';
import Toast from 'react-native-toast-message';

const AdminAccount: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  function handleLogout(): void {
    dispatch(logOut());
  }

  const { data: users, isLoading, refetch } = useUsers();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const {
    isLoading: isDeleting,
    mutate: deleteUser,
    isSuccess: isDeleteSuccess,
    error: deleteError,
  } = useDeleteUser(selectedUser?.id ? selectedUser.id : 0);

  useEffect(() => {
    if (isDeleteSuccess && !isDeleting) {
      refetch();
      setSelectedUser(null);
      setIsModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'User deleted successfully',
      });
    } else if (deleteError && !isDeleting) {
      Toast.show({
        type: 'error',
        text1: 'User deletion error',
      });
      setIsModalVisible(false);
    }
  }, [isDeleteSuccess, isDeleting]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Profile screen</Text>
      <Text style={{ marginVertical: 10 }}>User List</Text>
      {isLoading && (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )}
      {!isLoading && users && (
        <>
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.scrollContent}
            data={users.filter((user: User) => user.role !== 'admin')}
            keyExtractor={(user: User) => `entry-${user.id.toString()}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                key={item.id}
                onPress={() => {
                  setSelectedUser(item);
                  setIsModalVisible(true);
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 4 }}>
                    {item.email}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: colors.text.light }}
                  >{`Role: ${item.role}`}</Text>
                </View>
                <Ionicons name="trash-outline" size={24} color={colors.blue.base} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.centeredContainer}>
                <Text style={styles.text}>No users yet</Text>
              </View>
            }
          />
        </>
      )}

      <Button text="Logout" onPress={handleLogout} primary style={styles.button} />
      <SimpleModal visible={isModalVisible} closeModal={() => isDeleteSuccess}>
        <View style={styles.modalContentWrapper}>
          <View style={styles.modalContentHeader}>
            <Text style={styles.header}>Delete user</Text>
            <Ionicons name="warning" size={32} color={colors.text.light} />
          </View>
          <Text>
            {isDeleting && <ActivityIndicator size="large" />}
            {selectedUser && !isDeleting && (
              <>
                Are you sure you want to delete user
                <Text style={{ fontWeight: '600' }}> {selectedUser?.email.toLowerCase()} </Text>?
                This change is non-reversible.
              </>
            )}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              gap: 8,
              marginTop: 16,
            }}
          >
            <Button
              text="Cancel"
              disabled={isDeleting}
              secondary
              onPress={() => {
                setIsModalVisible(false);
                setSelectedUser(null);
              }}
            />
            <Button
              text="Delete"
              disabled={isDeleting}
              primary
              onPress={() => {
                deleteUser(selectedUser?.id);
              }}
            />
          </View>
        </View>
      </SimpleModal>
      <Toast />
    </View>
  );
};

export default AdminAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  text: {
    fontSize: 18,
    lineHeight: 22,
  },
  button: {
    width: '100%',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
  list: {
    padding: 0,
    width: '100%',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingVertical: 8,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.text.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.grey.dark,
    borderRadius: 8,
  },
  modalContentWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentHeader: {
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
  },
});
