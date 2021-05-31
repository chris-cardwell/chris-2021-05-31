import { render } from "@testing-library/react";
import React from "react";
import { OrderTable } from "./OrderTable";

describe("Order Table", () => {
  it("renders", () => {
    const { getByLabelText, getByText } = render(
      <OrderTable headers={["Total", "Size", "Price"]}>
        <OrderTable.Row>
          <OrderTable.Data>100</OrderTable.Data>
          <OrderTable.Data>222</OrderTable.Data>
          <OrderTable.Data>3.50</OrderTable.Data>
        </OrderTable.Row>
      </OrderTable>
    );

    const orderTable = getByLabelText("order data table");
    expect(orderTable).toBeInTheDocument();

    const totalHeader = getByText("Total");
    expect(totalHeader).toBeInTheDocument();

    const sizeHeader = getByText("Size");
    expect(sizeHeader).toBeInTheDocument();

    const priceHeader = getByText("Price");
    expect(priceHeader).toBeInTheDocument();

    const totalData = getByText("100");
    expect(totalData).toBeInTheDocument();

    const sizeData = getByText("222");
    expect(sizeData).toBeInTheDocument();

    const priceData = getByText("3.50");
    expect(priceData).toBeInTheDocument();
  });

  it("colors the text properly when specified", () => {
    const { getByText } = render(
      <OrderTable headers={["Total", "Size", "Price"]}>
        <OrderTable.Row>
          <OrderTable.Data textColor="blue">100</OrderTable.Data>
          <OrderTable.Data textColor="purple">222</OrderTable.Data>
          <OrderTable.Data textColor="yellow">3.50</OrderTable.Data>
        </OrderTable.Row>
      </OrderTable>
    );

    const totalData = getByText("100");
    expect(totalData).toHaveStyle({
      color: "blue",
    });

    const sizeData = getByText("222");
    expect(sizeData).toHaveStyle({
      color: "purple",
    });

    const priceData = getByText("3.50");
    expect(priceData).toHaveStyle({
      color: "yellow",
    });
  });
});
