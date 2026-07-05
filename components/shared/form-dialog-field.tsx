import {
  FORM_FIELD,
  FORM_FIELD_CONTROL,
  FORM_FIELD_GRID_ITEM,
  FORM_FIELD_IN_GRID,
  FORM_FIELD_LABEL,
} from "@/config/form-dialog";
import { cn } from "@/lib/utils";

interface FormDialogFieldProps {
  label: string;
  htmlFor?: string;
  className?: string;
  gridItem?: boolean;
  children: React.ReactNode;
}

export function FormDialogField({
  label,
  htmlFor,
  className,
  gridItem = false,
  children,
}: FormDialogFieldProps) {
  return (
    <div
      className={cn(
        gridItem ? FORM_FIELD_GRID_ITEM : FORM_FIELD,
        className,
      )}
    >
      <label className={FORM_FIELD_LABEL} htmlFor={htmlFor}>
        {label}
      </label>
      <div className={gridItem ? FORM_FIELD_IN_GRID : FORM_FIELD_CONTROL}>
        {children}
      </div>
    </div>
  );
}
