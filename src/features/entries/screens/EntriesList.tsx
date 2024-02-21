import { FC } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Card from "@shared/Card";
import { colors } from "@globals/style";

type Entry = {
  id: number;
  value: number;
  name: string;
};

const dummyEntries: Entry[] = [
  {
    id: 1,
    value: 200,
    name: "netflix",
  },
  {
    id: 2,
    value: 300,
    name: "hbo",
  },
  {
    id: 3,
    value: 150,
    name: "disney",
  },
];

type Props = {};

const EntriesList: FC = () => {
  const navigation = useNavigation();

  function navigateToDetailedView(id: number): void {
    navigation.dispatch(
      CommonActions.navigate({
        name: "view-entry",
        params: { id },
      })
    );
  }

  return (
    <View style={styles.container}>
      <Text>Here is the entries screen</Text>
      <FlatList
        data={dummyEntries}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigateToDetailedView(item.id)}>
            <Card borderColor="black">
              <Text>{item.name}</Text>
              <Text>{item.value}</Text>
            </Card>
          </TouchableOpacity>
        )}
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
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
});
