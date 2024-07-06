"use server";

import { makeAlpacaApiRequest } from "@/apis/alpaca-api";

export async function getStockPricing({
  stocks = "",
}: {
  readonly stocks: string;
}) {
  const { data, error } = await makeAlpacaApiRequest({
    endpoint: "data",
    resource: `stocks/quotes/latest?symbols=${stocks}`,
  });

  if (error) {
    console.error("Error fetching stock data", error);
    return {
      error: true,
      stock: null,
    };
  }

  return {
    error: false,
    stock: data,
  };
}
