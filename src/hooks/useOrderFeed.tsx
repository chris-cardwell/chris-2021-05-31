import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  OrderFeedActionType,
  OrderFeedMessage,
  OrderFeedType,
  WebSocketReadyState,
  Product,
  OrderFeedState,
  OrderFeedEvent,
  OrderData,
} from "../types";
import { useErrorHandler } from "react-error-boundary";
import { OrderFeedReducer } from "../components/orderbook/OrderBookReducer";
import { applyOrderDataDelta } from "../utils/utils";

const initialState: OrderFeedState = {
  bids: {},
  asks: {},
  productFeedSubscription: Product.XBTUSD,
};

type BufferData = {
  bids: OrderData;
  asks: OrderData;
};

/**
 * connects to a (currently hardcoded) WebSocket server. Upon established connection,
 * sends a (currently hardcoded) subscription message with a paramaterized product_id.
 *
 * incoming snapshot messages are dispatched immediately, but incoming delta messages
 * are reduced & stored into a ref buffer. the buffer is dispatched every (currently hardcoded)
 * 250ms.
 *
 * if the productFeedSubscription falls out of sync with the local state, useOrderFeed will
 * unsubscribe from the subscription in the local state, and subscribe to the product feed
 * from productFeedSubscription, and then dispatch an action to sync up the local state.
 *
 * closes the websocket connection when calling component is unmounted.
 *
 * @param productFeedSubscription desired product feed to subscribe to
 * @param forceErrorFlag contrived flag that forces an Error to be thrown when set
 * @returns
 */
export function useOrderFeed({
  productFeedSubscription = Product.XBTUSD,
  forceErrorFlag = false,
}: UseOrderFeedProps = {}): OrderFeedState {
  const [state, dispatch] = useReducer(OrderFeedReducer, {
    ...initialState,
    productFeedSubscription,
  });
  const webSocket = useRef<WebSocket | null>(null);
  const bufferedData = useRef<BufferData>({ bids: {}, asks: {} });
  const handleError = useErrorHandler();

  const onMessage = useCallback(
    (messageEvent: MessageEvent) => {
      const response = JSON.parse(messageEvent?.data) as OrderFeedMessage;
      switch (response?.feed) {
        case OrderFeedType.Delta:
          bufferedData.current.bids = applyOrderDataDelta(
            bufferedData.current.bids,
            response.bids
          );
          bufferedData.current.asks = applyOrderDataDelta(
            bufferedData.current.asks,
            response.asks
          );
          break;
        case OrderFeedType.Snapshot:
          bufferedData.current.bids = applyOrderDataDelta({}, response.bids);
          bufferedData.current.asks = applyOrderDataDelta({}, response.asks);
          dispatch({
            type: OrderFeedActionType.ApplyDelta,
            payload: {
              bids: bufferedData.current.bids,
              asks: bufferedData.current.asks,
            },
          });
          break;
      }
    },
    [dispatch]
  );

  /**
   *
   */
  useEffect(() => {
    const bufferInterval = setInterval(() => {
      dispatch({
        type: OrderFeedActionType.ApplyDelta,
        payload: {
          asks: bufferedData.current.asks,
          bids: bufferedData.current.bids,
        },
      });
    }, 250);

    return () => {
      clearInterval(bufferInterval);
      webSocket?.current?.close();
    };
  }, []);

  const onError = useCallback(
    (ev: Event) => {
      handleError(
        new Error(`WebSocket threw an error. Please reset the feed.`)
      );
    },
    [handleError]
  );

  const onOpen = useCallback(() => {
    subscribeToProductOrderFeed(state.productFeedSubscription);
  }, [state.productFeedSubscription]);

  useEffect(() => {
    if (forceErrorFlag) {
      throw new Error(
        "An error was forced from within the WebSocket handling code."
      );
    }

    if (
      !webSocket.current ||
      webSocket.current.readyState === WebSocketReadyState.CLOSING ||
      webSocket.current.readyState === WebSocketReadyState.CLOSED
    ) {
      webSocket.current = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
      webSocket.current.onopen = onOpen;
      webSocket.current.onmessage = onMessage;
      webSocket.current.onerror = onError;
    }
  }, [forceErrorFlag, onError, onMessage, onOpen]);

  useEffect(() => {
    if (
      webSocket.current &&
      webSocket.current.readyState === WebSocketReadyState.OPEN &&
      productFeedSubscription !== state.productFeedSubscription
    ) {
      unsubscribeFromProductOrderFeed(state.productFeedSubscription);
      subscribeToProductOrderFeed(productFeedSubscription);
      dispatch({
        type: OrderFeedActionType.ChangeSubscription,
        payload: {
          subscription: productFeedSubscription,
        },
      });
    }
  }, [productFeedSubscription, state.productFeedSubscription]);

  function subscribeToProductOrderFeed(subscription: Product) {
    webSocket?.current?.send(
      JSON.stringify({
        event: OrderFeedEvent.Subscribe,
        feed: OrderFeedType.Delta,
        product_ids: [subscription],
      })
    );
  }

  function unsubscribeFromProductOrderFeed(subscription: Product) {
    webSocket?.current?.send(
      JSON.stringify({
        event: OrderFeedEvent.Unsubscribe,
        feed: OrderFeedType.Delta,
        product_ids: [subscription],
      })
    );
  }

  return {
    ...state,
  };
}

export type UseOrderFeedProps = {
  productFeedSubscription?: Product;
  forceErrorFlag?: boolean;
};
