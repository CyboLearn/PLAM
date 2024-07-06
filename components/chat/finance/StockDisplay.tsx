"use client";

import { Strong, Text } from "@/components/ui/text";

export function StockDisplay({
	symbol,
	data,
}: {
	readonly symbol: string;
	readonly data: any;
}) {
	const quote = data?.stock?.quotes?.[symbol];

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
