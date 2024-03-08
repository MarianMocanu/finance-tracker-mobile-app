import { colors } from '@globals/style';
import { FC, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '@shared/Button';
import { useUpdateCategory } from 'src/mutations/Categories';
import { Category } from '@models';
import Input from '@shared/Input';
import Toast from 'react-native-toast-message';
import { useCategory } from '@queries/Categories';
const CategoryEditForm: FC = (dispatch: any) => {
  const {
    data: category,
    isLoading: isCategoryDataLoading,
    refetch,
  } = useCategory(dispatch.route.params.id);

  const [formData, setFormData] = useState<Category>({
    id: 0,
    name: '',
    color: '',
  });
  const { isLoading, mutate, isSuccess, isError } = useUpdateCategory(formData);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  useEffect(() => {
    if (!isLoading && category) {
      setFormData(category);
    }
  }, [isLoading, category]);

  const submitForm = () => {
    if (
      invalidFields.length === 0 &&
      !isLoading &&
      formData.color &&
      hexColorRegex.test(formData.color) &&
      formData.name.length > 2
    ) {
      mutate(formData);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid data: check the fields.',
      });
    }
  };

  useEffect(() => {
    if (isSuccess && invalidFields.length === 0) {
      Toast.show({
        type: 'success',
        text1: 'Category updated successfully',
      });
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Query submission error.',
      });
    }
  }, [isError]);

  const setters = {
    name: (value: string) => {
      setFormData(prevState => ({
        ...prevState,
        name: value,
      }));
    },
    color: (value: string) => {
      setFormData(prevState => ({
        ...prevState,
        color: value,
      }));
    },
  };

  const validators = {
    name: (value: string) => {
      if (value.length < 3) {
        if (!invalidFields.includes('name')) {
          setInvalidFields([...invalidFields, 'name']);
          Toast.show({
            type: 'error',
            text1: 'Name has to be at least 3 characters.',
          });
        }
      } else {
        setInvalidFields([...invalidFields.filter(field => field !== 'name')]);
      }
    },
    color: (value: string) => {
      if (!hexColorRegex.test(value)) {
        if (!invalidFields.includes('color')) {
          setInvalidFields([...invalidFields, 'color']);
          Toast.show({
            type: 'error',
            text1: 'Color has to be a valid hexcode.',
          });
        }
      } else {
        setInvalidFields([...invalidFields.filter(field => field !== 'color')]);
      }
    },
  };

  if (isLoading || isCategoryDataLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.blue.dark} />
      </View>
    );
  }

  if (category)
    return (
      <>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          automaticallyAdjustKeyboardInsets
        >
          <View style={styles.container}>
            {/* NAME INPUT */}
            <View style={styles.formFieldWrapper}>
              <Text style={styles.inputLabel}>Category name</Text>
              <Input
                keyboardType="default"
                placeholder="Category name"
                style={invalidFields.includes('name') ? styles.invalid : styles.valid}
                value={formData.name}
                onChangeText={value => {
                  setters.name(value);
                }}
                onBlur={() => {
                  setters.name(formData.name.trim());
                  validators.name(formData.name);
                }}
              />
            </View>
            {/* COLOR PICKER */}
            <View style={styles.formFieldWrapper}>
              <Text style={styles.inputLabel}>Category color</Text>
              <Input
                keyboardType="default"
                placeholder="Category color"
                style={invalidFields.includes('color') ? styles.invalid : styles.valid}
                value={formData.color}
                onChangeText={value => {
                  setters.color(value);
                }}
                onBlur={() => {
                  setters.color(formData.color ?? colors.grey.base);
                  validators.color(formData.color ?? colors.grey.base);
                }}
              />
            </View>
            <Button
              primary
              text="Save changes"
              onPress={() => submitForm()}
              style={styles.addButtonWrapper} // use this style prop to style the button instead of wrapping it in a view
            />
          </View>
        </ScrollView>
        <Toast />
      </>
    );
};

export default CategoryEditForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 12,
    paddingTop: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
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

  formFieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  inputField: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.dark,
    backgroundColor: '#fff',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlignVertical: 'center',
    height: 48,
    width: '100%',
  },
  inputTextArea: {
    height: 'auto',
    minHeight: 128,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.light,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'center',
  },
  modalButton: {
    marginTop: 8,
  },
  addButtonWrapper: {
    marginTop: 24,
  },
  invalid: {
    borderColor: 'red',
  },
  valid: {
    borderColor: colors.border,
  },
});
