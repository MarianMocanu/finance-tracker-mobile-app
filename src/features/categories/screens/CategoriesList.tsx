import React, { FC } from 'react';
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
import { useCategories } from '@queries/Categories';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CategoriesStackParamList } from '../CategoriesStackNavigator';
import Button from '@shared/Button';

const CategoriesList: FC = () => {
  const navigation = useNavigation<NavigationProp<CategoriesStackParamList, 'categories-list'>>();
  const { data: categories, isLoading } = useCategories();

  function navigateToDetailedView(id: number): void {
    navigation.navigate('view-category', { id });
  }

  function navigateToAddForm(): void {
    navigation.navigate('add-category');
  }

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.blue.dark} style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Button style={styles.addButton} onPress={() => navigateToAddForm()}>
        <Ionicons name="add-circle" size={40} color={colors.blue.base} />
      </Button>
      <FlatList
        style={styles.list}
        contentContainerStyle={{ flex: 1 }}
        data={categories}
        keyExtractor={item => `category-${item.id.toString()}`}
        renderItem={({ item }) => (
          <Button
            style={{ ...styles.card, borderColor: item.color }}
            onPress={() => navigateToDetailedView(item.id)}
            text={item.name.toUpperCase()}
          />
        )}
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text style={styles.text}>No categories yet</Text>
          </View>
        }
      />
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
