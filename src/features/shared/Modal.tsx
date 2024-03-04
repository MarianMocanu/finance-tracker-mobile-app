import { FC, PropsWithChildren } from 'react';
import { Modal, View, StyleSheet, DimensionValue, TouchableWithoutFeedback } from 'react-native';

interface Props extends PropsWithChildren {
  /**
   * Whether the modal is visible or not
   */
  visible: boolean;
  /**
   *
   * Function to close the modal
   */
  closeModal: () => void;
  /**
   * Width of the modal. Max width is 90% of the screen. Default is 90%
   */
  width?: DimensionValue;
  /**
   * Height of the modal. Max height is 90% of the screen.
   */
  height?: DimensionValue;
}

export const SimpleModal: FC<Props> = ({ visible, closeModal, children, height, width }) => {
  return (
    <Modal visible={visible} onRequestClose={closeModal} transparent={true}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { height, width: width ?? '90%' }]}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: 5,
    padding: 20,
  },
});
