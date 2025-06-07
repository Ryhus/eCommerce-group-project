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

  const customerData = await updateCustomer(customerId, customerVersion, firstName, lastName, email, dateOfBirth);
  return customerData;
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

export async function actionCustomerData({ request }: ActionFunctionArgs) {
  const customerId = TokenService.getCustomerId();
  const customerVersion = TokenService.getCustomerVersion();

  const formData = await request.formData();
  const actionType = formData.get("actionType");
  console.log(actionType);
  if (actionType === "changePersonal") {
    return handlePersonalDataForm({ customerId, customerVersion, formData });
  } else if (actionType === "changePassword") {
    return handlePasswordDataForm({ customerId, customerVersion, formData });
  }
}
