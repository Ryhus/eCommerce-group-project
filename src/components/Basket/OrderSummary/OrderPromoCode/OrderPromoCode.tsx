import { useState } from "react";
import { Form } from "react-router-dom";
import InputField from "../../../common/inputField/inputField";
import Button from "../../../common/button/button";
import { MdOutlineDiscount } from "react-icons/md";
import { useCart } from "../../../context/CartContext";

import "./OrderPromoCodeStyles.scss";

export default function () {
  const [promoCode, setPromococde] = useState("");

  const { cart, applyPromoCode } = useCart();

  const handleSubmit = () => {
    applyPromoCode(promoCode);
    console.log(cart);
  };

  const handleCodechange = (value: string) => {
    setPromococde(value);
  };

  return (
    <Form className="order-promo-form" onSubmit={handleSubmit}>
      <InputField
        value={promoCode}
        icon={<MdOutlineDiscount />}
        inputClassName="promo-input"
        onChange={handleCodechange}
        name="promoCode"
      />
      <Button className="promo-apply-button" type="submit" text="Apply" />
    </Form>
  );
}
