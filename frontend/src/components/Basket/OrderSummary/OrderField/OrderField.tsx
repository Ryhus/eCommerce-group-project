import Paragraph from "../../../common/paragraph/paragraph";

interface OrderFieldProps {
  className?: string;
  fieldName?: string;
  price?: string;
}

export default function OrderField({ fieldName, price, className }: OrderFieldProps) {
  return (
    <div className={className}>
      <Paragraph className="order-field-name" text={fieldName ? fieldName : ""} />
      <Paragraph className="order-field-price" text={price ? price : ""} />
    </div>
  );
}
