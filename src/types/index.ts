export interface ModalProps {
  isOpen: boolean;
  onToggle(): void;
  actionRequest(): void;
  isPending: boolean;
}
