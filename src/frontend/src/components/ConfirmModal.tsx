import { Button, Modal } from "@mantine/core";

export type ConfirmModalProps = {
  opened: boolean;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: "red" | "blue" | "green" | "yellow" | "gray";
  confirmed: () => void;
  cancelled: () => void;
};

export default function ConfirmModal({
  title = "Are you sure?",
  description = "",
  opened,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmColor = "red",
  confirmed,
  cancelled,
}: ConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={cancelled} title={title} centered>
      <p>{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="default" onClick={cancelled}>
          {cancelText}
        </Button>
        <Button variant="filled" color={confirmColor} onClick={confirmed}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
