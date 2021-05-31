import { act, fireEvent, render } from "@testing-library/react";
import { Server } from "mock-socket";
import { OrderBook } from "./OrderBook";

let mockServer: Server;

describe("OrderBook", () => {
  afterEach(() => {
    mockServer?.close();
  });

  it("renders", () => {
    mockServer = new Server("wss://www.cryptofacilities.com/ws/v1");
    const { getByText } = render(<OrderBook />);

    act(() => {
      mockServer.emit(
        "message",
        JSON.stringify({
          numLevels: 25,
          feed: "book_ui_1_snapshot",
          bids: [
            [34275.5, 2835.0],
            [34299.0, 1000.0],
          ],
          asks: [
            [34292.5, 11223.0],
            [37292.5, 1000.0],
          ],
          product_id: "PI_XBTUSD",
        })
      );
    });

    const bidPriceCell = getByText("34,275.50");
    expect(bidPriceCell).toBeInTheDocument();

    const bidPriceCell2 = getByText("34,299.00");
    expect(bidPriceCell2).toBeInTheDocument();

    const bidHighestTotalCell = getByText("3,835");
    expect(bidHighestTotalCell).toBeInTheDocument();

    const askPriceCell = getByText("34,292.50");
    expect(askPriceCell).toBeInTheDocument();

    const askPriceCell2 = getByText("37,292.50");
    expect(askPriceCell2).toBeInTheDocument();

    const askHighestTotalCell = getByText("12,223");
    expect(askHighestTotalCell).toBeInTheDocument();
  });

  it("toggle feed button changes subscription header", () => {
    const { getByText, queryByText } = render(<OrderBook />);
    const toggleFeedButton = getByText("Toggle Feed");

    expect(getByText("Order Book | PI_XBTUSD")).toBeInTheDocument();
    expect(queryByText("Order Book | PI_ETHUSD")).toBeNull();

    act(() => {
      fireEvent.click(toggleFeedButton);
    });

    expect(getByText("Order Book | PI_ETHUSD")).toBeInTheDocument();
    expect(queryByText("Order Book | PI_XBTUSD")).toBeNull();
  });

  it("toggle feed button changes grouping options", () => {
    const { getByText, queryByText } = render(<OrderBook />);
    const toggleFeedButton = getByText("Toggle Feed");

    expect(getByText("Group 0.50")).toBeInTheDocument();
    expect(getByText("Group 1.00")).toBeInTheDocument();
    expect(getByText("Group 2.50")).toBeInTheDocument();
    expect(queryByText("Group 0.05")).toBeNull();
    expect(queryByText("Group 0.10")).toBeNull();
    expect(queryByText("Group 0.25")).toBeNull();

    act(() => {
      fireEvent.click(toggleFeedButton);
    });

    expect(getByText("Group 0.05")).toBeInTheDocument();
    expect(getByText("Group 0.10")).toBeInTheDocument();
    expect(getByText("Group 0.25")).toBeInTheDocument();
    expect(queryByText("Group 0.50")).toBeNull();
    expect(queryByText("Group 1.00")).toBeNull();
    expect(queryByText("Group 2.50")).toBeNull();
  });

  it("Reset button is rendered when OrderBook is in error state", () => {
    new Server("wss://www.cryptofacilities.com/ws/v1");

    const { getByText, queryByText } = render(<OrderBook />);

    const killFeedButton = getByText("Kill Feed");

    act(() => {
      fireEvent.click(killFeedButton);
    });

    const resetButton = getByText("Reset Feed");

    expect(resetButton).toBeInTheDocument();

    const missingKillFeedButton = queryByText("Kill Feed");
    expect(missingKillFeedButton).toBeNull();
  });
});
