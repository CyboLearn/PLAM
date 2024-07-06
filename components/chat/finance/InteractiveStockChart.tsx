"use client";

import React, { type FC, useMemo } from "react";

import {
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
	ResponsiveContainer,
} from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface InteractiveStockChartProps {
	chartData: any[];
	ticker: string;
}

const chartConfig = {
	priceData: {
		label: "Price Data",
	},
	high: {
		label: "High",
		color: "hsl(var(--chart-3))",
	},
	close: {
		label: "Close",
		color: "hsl(var(--chart-2))",
	},
	low: {
		label: "Low",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export const InteractiveStockChart: FC<InteractiveStockChartProps> = ({
	chartData,
	ticker,
}: {
	readonly chartData: any[];
	readonly ticker: string;
}) => {
	const formattedData = useMemo(
		() =>
			chartData
				.map((item) => ({
					...item,
					dateTime: new Date(item.date).getTime(),
				}))
				.filter((item) => !Number.isNaN(item.dateTime))
				.sort((a, b) => a.dateTime - b.dateTime),
		[chartData],
	);

	const minValue = useMemo(
		() =>
			Math.min(...formattedData.map((item) => Math.min(item.open, item.close))),
		[formattedData],
	);
	const maxValue = useMemo(
		() =>
			Math.max(...formattedData.map((item) => Math.max(item.open, item.close))),
		[formattedData],
	);

	return (
		<div className="aspect-auto h-[400px] w-full">
			<ChartContainer
				config={chartConfig}
				className="aspect-auto h-[400px] w-full"
			>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={formattedData}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 10,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<YAxis
							domain={[minValue * 0.9, maxValue * 1.1]}
							tickFormatter={(value) => `$${value.toFixed(2)}`}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
								/>
							}
						/>
						<Line
							type="monotone"
							dataKey="high"
							stroke={chartConfig.high.color}
							strokeWidth={2}
							dot={false}
						/>
						<Line
							type="monotone"
							dataKey="close"
							stroke={chartConfig.close.color}
							strokeWidth={2}
							dot={false}
						/>
						<Line
							type="monotone"
							dataKey="low"
							stroke={chartConfig.low.color}
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</ChartContainer>
		</div>
	);
};
