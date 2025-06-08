import { TokenService } from "../../../services/TokenService";
import { updateCustomer, changePassword, signIn } from "../../../services/customerService/customerService";
import { AuthService } from "../../../services/AuthService";
import type { ActionFunctionArgs } from "react-router-dom";

interface UpdateParams {
  customerId: string | null;
  customerVersion: string | null;
  formData: FormData;
}

async function handlePersonalDataForm({ customerId, customerVersion, formData }: UpdateParams) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  try {
    const customerData = await updateCustomer({ customerId, customerVersion, firstName, lastName, email, dateOfBirth });
    return customerData;
  } catch (error) {
    return error;
  }
}

async function handlePasswordDataForm({ customerId, customerVersion, formData }: UpdateParams) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  try {
    const changedCustomerData = await changePassword({
      id: customerId,
      version: customerVersion,
      currentPassword,
      newPassword,
    });
    const { email } = changedCustomerData;
    await AuthService.authenticate(email, newPassword);
    const customerData = await signIn(email, newPassword);
    return customerData;
  } catch (error) {
    return error;
  }
}

async function handleAddressDataForm({ customerId, customerVersion, formData }: UpdateParams) {
  const actionType = formData.get("actionType");

  const changeAddressId = formData.get("addressId") as string;
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const postalCode = formData.get("postalCode") as string;
  const country = formData.get("country") as string;
  const isDefaultBillingAddress = formData.get("isDefaultBillingAddress") as string;
  const isDefaultShippingAddress = formData.get("isDefaultShippingAddress") as string;

  const address = { streetName: street, city: city, postalCode: postalCode, country: country };

  try {
    if (
      actionType === "changeAddress" ||
      actionType === "changeBillingAddress" ||
      actionType === "changeShippingAddress"
    ) {
      const customerData = await updateCustomer({
        customerId,
        customerVersion,
        changeAddressId,
        changedAddress: address,
        defaultBillingAddressId:
          isDefaultBillingAddress === "default" &&
          (actionType === "changeAddress" || actionType === "changeBillingAddress")
            ? changeAddressId
            : undefined,
        defaultShippingAddressId:
          isDefaultShippingAddress === "default" &&
          (actionType === "changeAddress" || actionType === "changeShippingAddress")
            ? changeAddressId
            : undefined,
      });
      return customerData;
    }

    const customerData = await updateCustomer({
      customerId,
      customerVersion,
      address,
    });
    const { addresses, version } = customerData;

    const newAddressId = addresses.at(-1)?.id;

    const data = await updateCustomer({
      customerId,
      customerVersion: version.toString(),
      billingAddressId: actionType === "addBillingAddress" ? newAddressId : undefined,
      shippingAddressId: actionType === "addShippingAddress" ? newAddressId : undefined,
      defaultBillingAddressId:
        isDefaultBillingAddress === "default" && (actionType === "addAddress" || actionType === "addBillingAddress")
          ? newAddressId
          : undefined,
      defaultShippingAddressId:
        isDefaultShippingAddress === "default" && (actionType === "addAddress" || actionType === "addShippingAddress")
          ? newAddressId
          : undefined,
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function actionCustomerData({ request }: ActionFunctionArgs) {
  const customerId = TokenService.getCustomerId();
  const customerVersion = TokenService.getCustomerVersion();

  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "changePersonal") {
    return handlePersonalDataForm({ customerId, customerVersion, formData });
  } else if (actionType === "changePassword") {
    return handlePasswordDataForm({ customerId, customerVersion, formData });
  } else {
    return handleAddressDataForm({ customerId, customerVersion, formData });
  }
}
