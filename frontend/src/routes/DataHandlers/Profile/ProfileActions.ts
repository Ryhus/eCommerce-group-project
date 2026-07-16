import type { ActionFunctionArgs } from "react-router-dom";
import { changePassword, updateCustomer } from "../../../services/customerService/customerService";

export async function actionCustomerData({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  try {
    if (actionType === "changePersonal") {
      return await updateCustomer({
        firstName: String(formData.get("firstName")),
        lastName: String(formData.get("lastName")),
        email: String(formData.get("email")),
        dateOfBirth: String(formData.get("dateOfBirth")),
      });
    }
    if (actionType === "changePassword") {
      return await changePassword({
        currentPassword: String(formData.get("currentPassword")),
        newPassword: String(formData.get("newPassword")),
      });
    }

    const addressId = String(formData.get("addressId") ?? "");
    const address = {
      streetName: String(formData.get("street")),
      city: String(formData.get("city")),
      postalCode: String(formData.get("postalCode")),
      country: String(formData.get("country")),
    };
    const isDefaultBilling = formData.get("isDefaultBillingAddress") === "default";
    const isDefaultShipping = formData.get("isDefaultShippingAddress") === "default";
    if (String(actionType).startsWith("change")) {
      return await updateCustomer({
        changeAddressId: addressId,
        changedAddress: address,
        defaultBillingAddressId: isDefaultBilling ? addressId : undefined,
        defaultShippingAddressId: isDefaultShipping ? addressId : undefined,
      });
    }

    const created = await updateCustomer({
      address: {
        ...address,
        isBilling: actionType === "addAddress" || actionType === "addBillingAddress",
        isShipping: actionType === "addAddress" || actionType === "addShippingAddress",
        isDefaultBilling,
        isDefaultShipping,
      },
    });
    return created;
  } catch (error) {
    return error;
  }
}
