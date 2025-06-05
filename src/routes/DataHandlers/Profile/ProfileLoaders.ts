import { TokenService } from "../../../services/TokenService";
import { getCustomer } from "../../../services/customerService/customerService";

export async function loadCutomerData() {
  const customerId = TokenService.getCustomerId();
  const customerData = await getCustomer(customerId);
  return customerData;
}
