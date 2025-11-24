export interface DiscountModalProps {
  isOpen: boolean;
  onToggle(): void;
  actionRequest(): void;
  isPending: boolean;
}
