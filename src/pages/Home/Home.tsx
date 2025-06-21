import { useEffect, useState } from "react";
import { getDiscountCodes } from "../../services/discountService/discountService";
import { H1 } from "../../components/common/headings/H1";
import type { DiscountCodePagedQueryResponse } from "../../services/discountService/types";
import "./HomeStyles.scss";

export default function HomePage() {
  const [discountData, setDiscountData] = useState<DiscountCodePagedQueryResponse>();

  useEffect(() => {
    const getDiscountData = async () => {
      const data = await getDiscountCodes();
      if (data) setDiscountData(data);
    };
    getDiscountData();
  }, []);

  const promoCodes = discountData?.results.map((discount, index) => {
    const {
      code: promoCode,
      isActive,
      description: { en: engDescription },
    } = discount;
    return (
      <tr key={promoCode}>
        <td data-label="№">{index + 1}</td>
        <td data-label="Code">{promoCode}</td>
        <td data-label="Description">{engDescription || "No description available"}</td>
        <td data-label="Active">{isActive ? "✅" : "❌"}</td>
      </tr>
    );
  });

  return (
    <div className="main-page-container">
      <H1
        className="main-promo-message"
        text="Hello our dear customer! 🤗 We prepared for you sweet promo codes with discounts 😊 Go to the catalog page, choose our best products and don't forget to apply promocode on the basket page 🤩 "
      />
      <div className="promo-list">
        <table className="promo-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Code</th>
              <th>Description</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>{promoCodes}</tbody>
        </table>
      </div>
    </div>
  );
}
