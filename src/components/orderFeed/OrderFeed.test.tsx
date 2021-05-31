import { act, render } from "@testing-library/react";
import { Server } from "mock-socket";
import { UsdDenomination, Product } from "../../types";
import { OrderFeed } from "./OrderFeed";

//required by the mock-socket to give time for the component to
//send a message and the mock-socket to run the callback function
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const xbtSubscribeMessage =
  '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}';
const xbtUnsubscribeMessage =
  '{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}';
const ethSubscribeMessage =
  '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}';

let mockServer: Server;

describe("OrderFeed", () => {
  beforeEach(() => {
    mockServer = new Server("wss://www.cryptofacilities.com/ws/v1");
  });

  afterEach(() => {
    mockServer.close();
  });

  it("renders", () => {
    const { getByText } = render(<OrderFeed />);

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

  it("sends correct subscription message on mount", async () => {
    let messageToWebsocket!: string;

    mockServer.on("connection", (socket) => {
      socket.on("message", (data) => {
        messageToWebsocket = data as string;
      });
    });

    render(<OrderFeed />);

    await sleep(50);

    expect(messageToWebsocket).toBeTruthy();
    expect(messageToWebsocket).toBe(xbtSubscribeMessage);
  });

  it("unsubscribes and re-subscribes when subscription prop changes", async () => {
    const messages: string[] = [];

    mockServer.on("connection", (socket) => {
      socket.on("message", (data) => {
        messages.push(data as string);
      });
    });

    const { rerender } = render(
      <OrderFeed productFeedSubscription={Product.XBTUSD} />
    );

    await sleep(20);

    act(() => {
      rerender(<OrderFeed productFeedSubscription={Product.ETHUSD} />);
    });

    await sleep(20);

    expect(messages[0]).toBe(xbtSubscribeMessage);
    expect(messages[1]).toBe(xbtUnsubscribeMessage);
    expect(messages[2]).toBe(ethSubscribeMessage);
  });

  it("contrived force error flag throws an error", async () => {
    const { rerender } = render(<OrderFeed />);
    expect(() => rerender(<OrderFeed forceErrorFlag={true} />)).toThrow();
  });

  it("renders with proper groupings", () => {
    const { getByText, queryByText } = render(
      <OrderFeed grouping={UsdDenomination.TwoPointFiveDollars} />
    );

    act(() => {
      mockServer.emit(
        "message",
        JSON.stringify({
          numLevels: 25,
          feed: "book_ui_1_snapshot",
          bids: [
            [5000.0, 100.0],
            [5001.0, 100.0],
            [5002.0, 100.0],
            [5003.0, 100.0],
            [5006.0, 101.0],
          ],
          asks: [
            [2999.0, 701.0],
            [3000.0, 700.0],
            [3001.0, 700.0],
            [3002.0, 700.0],
            [3003.0, 700.0],
          ],
          product_id: "PI_XBTUSD",
        })
      );
    });

    const groupedBidPriceCell = getByText("5,000.00");
    expect(groupedBidPriceCell).toBeInTheDocument();

    const missingBidCell = queryByText("5,001.00");
    expect(missingBidCell).toBeNull();

    const bidGroupedSize = getByText("300");
    expect(bidGroupedSize).toBeInTheDocument();

    const bidSecondGroupCell = getByText("5,002.50");
    expect(bidSecondGroupCell).toBeInTheDocument();

    const bidSecondGroupSize = getByText("100");
    expect(bidSecondGroupSize).toBeInTheDocument();

    const groupedAskPriceCell = getByText("3,000.00");
    expect(groupedAskPriceCell).toBeInTheDocument();

    const missingAskCell = queryByText("3,001.00");
    expect(missingAskCell).toBeNull();

    const askGroupedTotal = getByText("2,100");
    expect(askGroupedTotal).toBeInTheDocument();

    const askSecondGroupCell = getByText("3,002.50");
    expect(askSecondGroupCell).toBeInTheDocument();

    const askSecondGroupTotal = getByText("700");
    expect(askSecondGroupTotal).toBeInTheDocument();
  });

  it("rerenders with proper groupings", () => {
    const { getByText, queryByText, rerender } = render(
      <OrderFeed grouping={UsdDenomination.TwoPointFiveDollars} />
    );

    act(() => {
      mockServer.emit(
        "message",
        JSON.stringify({
          numLevels: 25,
          feed: "book_ui_1_snapshot",
          bids: [
            [5000.0, 100.0],
            [5001.0, 100.0],
            [5002.0, 100.0],
            [5003.0, 100.0],
            [5006.0, 101.0],
          ],
          asks: [
            [2999.0, 701.0],
            [3000.0, 700.0],
            [3001.0, 700.0],
            [3002.0, 700.0],
            [3003.0, 700.0],
          ],
          product_id: "PI_XBTUSD",
        })
      );
    });

    const groupedBidPriceCell = getByText("5,000.00");
    expect(groupedBidPriceCell).toBeInTheDocument();

    const missingBidCell = queryByText("5,001.00");
    expect(missingBidCell).toBeNull();

    const bidGroupedSize = getByText("300");
    expect(bidGroupedSize).toBeInTheDocument();

    const bidSecondGroupCell = getByText("5,002.50");
    expect(bidSecondGroupCell).toBeInTheDocument();

    const bidSecondGroupSize = getByText("100");
    expect(bidSecondGroupSize).toBeInTheDocument();

    const groupedAskPriceCell = getByText("3,000.00");
    expect(groupedAskPriceCell).toBeInTheDocument();

    const missingAskCell = queryByText("3,001.00");
    expect(missingAskCell).toBeNull();

    const askGroupedTotal = getByText("2,100");
    expect(askGroupedTotal).toBeInTheDocument();

    const askSecondGroupCell = getByText("3,002.50");
    expect(askSecondGroupCell).toBeInTheDocument();

    const askSecondGroupTotal = getByText("700");
    expect(askSecondGroupTotal).toBeInTheDocument();

    rerender(<OrderFeed grouping={UsdDenomination.FiftyCents} />);

    const postRerenderBidPrices = [
      "5,000.00",
      "5,001.00",
      "5,002.00",
      "5,003.00",
      "5,006.00",
    ];
    const postRerenderAskPrices = [
      "2,999.00",
      "3,000.00",
      "3,001.00",
      "3,002.00",
      "3,003.00",
    ];

    postRerenderBidPrices.forEach((postRerenderBidPrice) => {
      const cell = getByText(postRerenderBidPrice);
      expect(cell).toBeInTheDocument();
    });

    postRerenderAskPrices.forEach((postRerenderAskPrice) => {
      const cell = getByText(postRerenderAskPrice);
      expect(cell).toBeInTheDocument();
    });
  });
});
