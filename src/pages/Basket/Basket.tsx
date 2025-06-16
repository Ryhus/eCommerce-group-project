import { useLoaderData } from "react-router-dom";

export default function BasketPage() {
  const customer = useLoaderData();
  console.log(customer);
  return (
    <div>
      <h1>Welcome to the Basket Page</h1>
    </div>
  );
}
