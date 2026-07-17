import { getCustomer } from "../../../services/customerService/customerService";

export async function loadCutomerData() {
  return getCustomer();
}
