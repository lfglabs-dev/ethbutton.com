import { useEffect, useState } from "react";

export default function getPriceValue() {
  const [price, setPrice] = useState<string | undefined>();

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Coingecko API Data:", data);
        const total = parseInt(
          (parseFloat(data?.ethereum?.usd) * 5).toFixed(0)
        );
        setPrice(`$${total.toLocaleString("en-US")}`);
      })
      .catch((err) => console.log("Coingecko API Error:", err));
  }, []);

  return price;
}
