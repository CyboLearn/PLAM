"use client";

import { Strong, Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { getStockPricing } from "@/actions/finance/get-stock-information";

interface StockPriceProps extends Record<string, any> {
	readonly symbol: string;
}

interface StockData {
	quotes: {
		[key: string]: {
			ap: number;
			bp: number;
		};
	};
}

export function StockPrice({ symbol, ...props }: StockPriceProps) {
	const [data, setData] = useState<StockData | null>(null);
	const [status, setStatus] = useState<"loading" | "error" | "success">(
		"loading",
	);

	useEffect(() => {
		async function getStockPrice() {
			const { stock, error } = await getStockPricing({ stocks: symbol });

			if (error) {
				console.error(error);
				setStatus("error");
				return;
			}

			setData(stock);
			setStatus("success");
		}

		getStockPrice();
	}, [symbol]);

	const quote = data?.quotes?.[symbol];

	if (status === "loading") {
		return <Text>Loading...</Text>;
	}

	if (!quote) {
		return (
			<div>
				<Text>
					No data available for stock symbol: <Strong> {symbol}</Strong>
				</Text>
			</div>
		);
	}

	return (
		<div>
			<Text>
				Ticker: <Strong> {symbol}</Strong>
			</Text>
			<Text>
				Ask price: <Strong>${quote.ap.toFixed(2)}</Strong>
				<br />
				Bid price: <Strong>${quote.bp.toFixed(2)}</Strong>
			</Text>
		</div>
	);
}
