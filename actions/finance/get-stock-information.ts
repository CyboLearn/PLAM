"use server";

import { makeAlpacaApiRequest } from "./alpaca-api";

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
    return {
      error,
      stock: null,
    };
  }

  return {
    error: null,
    stock: data,
  };
}
