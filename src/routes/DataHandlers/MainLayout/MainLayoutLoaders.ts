import { TokenService } from "../../../services/TokenService";
import { AuthService } from "../../../services/AuthService";
import { createCart } from "../../../services/cartService/cartService";

export async function loadMainData() {
  if (!TokenService.getAccessToken() || !TokenService.getCartId()) {
    const anonymousSessionData = await AuthService.anonymousAuthenticate();
    const anonymousId = anonymousSessionData?.scope.split(" ").at(-1)?.split(":").at(-1) as string;
    TokenService.setAnonSessionId(anonymousId);

    const anonymousCartData = await createCart({ currency: "EUR", anonymousId: anonymousId });
    const { id } = anonymousCartData;
    TokenService.setCartId(id);
    return anonymousCartData;
  }
  return null;
}
