import { TokenService } from "../../../services/TokenService";
import { AuthService } from "../../../services/AuthService";
import { createCart } from "../../../services/cartService/cartService";
export async function loadCatalogData() {
  if (!TokenService.getAccessToken()) {
    const anonymousSessionData = await AuthService.anonymousAuthenticate(); // create an anonymous session
    const anonymousId = anonymousSessionData?.scope.split(" ").at(-1)?.split(":").at(-1); // get an anonymous session id
    // create cart for the anonymous session
    const anonymousCartData = await createCart({ currency: "EUR", anonymousId: anonymousId });
    console.log(anonymousCartData);
    return anonymousCartData;
  }
  return null;
}
