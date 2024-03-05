import React, { FC } from 'react';
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
import { useCategories } from '@queries/Categories';
import Ionicons from '@expo/vector-icons/Ionicons';

const CategoriesList: FC = () => {
  const navigation = useNavigation();
  const { data: categories, isLoading } = useCategories();

  function navigateToDetailedView(id: number): void {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Back to all categories',
        params: { id },
      }),
    );
  }

  function navigateToAddForm(): void {
    navigation.dispatch(CommonActions.navigate({ name: 'add-category' }));
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.blue.dark} />
      </View>
    );
  }

  return categories?.length ? (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigateToAddForm()}>
        <Ionicons name="add-circle" size={40} color={colors.blue.base} />
      </TouchableOpacity>
      <FlatList
        style={styles.list}
        data={categories}
        keyExtractor={item => `category-${item.id.toString()}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderColor: item.color }]}
            onPress={() => navigateToDetailedView(item.id)}
          >
            <Text style={{ textTransform: 'capitalize' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  ) : (
    <View style={styles.center}>
      <Text style={styles.text}>No Categories yet</Text>
    </View>
  );
};

export default CategoriesList;

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
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  list: {
    padding: 12,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
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
