/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Home from "@/app/(marketing)/page";
import RootLayout from "@/app/layout";

describe("Home", () => {
	it("renders a heading", () => {
		render(
			<RootLayout>
				<Home />
			</RootLayout>,
		);

		const heading = screen.getByRole("heading", { level: 1 });

		expect(heading).toBeInTheDocument();
	});
});
