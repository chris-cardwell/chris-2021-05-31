import { render } from "@testing-library/react";
import AsksTable from "./AsksTable";

describe("Asks Table", () => {
  const asksWithTotals = [{ price: 35000.5, size: 9326, total: 104104 }];

  it("renders", () => {
    const { getByLabelText } = render(
      <AsksTable asksWithTotals={asksWithTotals} />
    );

    const orderTable = getByLabelText("order data table");
    expect(orderTable).toBeInTheDocument();
  });

  it("price text color is red", () => {
    const { getByText } = render(<AsksTable asksWithTotals={asksWithTotals} />);

    const priceCell = getByText("35,000.50");
    expect(priceCell).toBeInTheDocument();
    expect(priceCell).toHaveStyle({
      color: "red",
    });
  });

  it("has numbers formatted correctly", () => {
    const { getByLabelText, getByText } = render(
      <AsksTable asksWithTotals={asksWithTotals} />
    );

    const orderTable = getByLabelText("order data table");
    expect(orderTable).toBeInTheDocument();

    const formattedPrice = getByText("35,000.50");
    expect(formattedPrice).toBeInTheDocument();

    const formattedSize = getByText("9,326");
    expect(formattedSize).toBeInTheDocument();

    const formattedTotal = getByText("104,104");
    expect(formattedTotal).toBeInTheDocument();
  });

  it("depth bar color is red, anchored left, and has the correct width", () => {
    const { getByLabelText, getByRole } = render(
      <AsksTable asksWithTotals={asksWithTotals} />
    );

    const orderTable = getByLabelText("order data table");
    expect(orderTable).toBeInTheDocument();

    const depthBarCell = getByRole("cell", { name: "" });
    expect(depthBarCell).toBeInTheDocument();
    expect(depthBarCell).toHaveStyle({
      backgroundColor: "rgba(255, 0, 0, 0.2)",
      left: 0,
      width: "100%",
    });
  });

  it("depth bars have the correct width when there are multiple", () => {
    const multiAsksWithTotals = [
      { price: 1, size: 100, total: 100 },
      { price: 2, size: 200, total: 300 },
      { price: 3, size: 300, total: 600 },
    ];
    const { getAllByRole } = render(
      <AsksTable asksWithTotals={multiAsksWithTotals} />
    );

    const depthBarCells = getAllByRole("cell", { name: "" });

    depthBarCells.forEach((depthBarCell) => {
      expect(depthBarCell).toBeInTheDocument();
    });

    expect(depthBarCells[0]).toHaveStyle({
      width: `${(100 / 600) * 100}%`,
    });

    expect(depthBarCells[1]).toHaveStyle({
      width: `${(300 / 600) * 100}%`,
    });

    expect(depthBarCells[2]).toHaveStyle({
      width: `${(600 / 600) * 100}%`,
    });
  });
});
