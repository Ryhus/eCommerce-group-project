import { TokenService } from "../../../services/TokenService";
import { updateCustomer } from "../../../services/customerService/customerService";
import type { ActionFunctionArgs } from "react-router-dom";

export async function actionCustomerData({ request }: ActionFunctionArgs) {
  const customerId = TokenService.getCustomerId();
  const customerVersion = TokenService.getCustomerVersion();

  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;

  const customerData = await updateCustomer(customerId, customerVersion, firstName, lastName, email, dateOfBirth);
  return customerData;
}
