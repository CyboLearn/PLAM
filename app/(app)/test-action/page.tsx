"use client";

import { getStockPricing } from "@/actions/finance/get-stock-information";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TestAction() {
  const [stockData, setStockData] = useState(null);

  return (
    <main>
      <Button
        onClick={async () => {
          await getStockPricing({ stocks: "TSLA" }).then((res) => {
            setStockData(res.stock);
          });
        }}
      >
        Get sample TSLA stock data
      </Button>
      <pre>{JSON.stringify(stockData, null, 2)}</pre>
    </main>
  );
}
