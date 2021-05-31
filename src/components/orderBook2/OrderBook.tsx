import React, { useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Product, UsdDenomination } from "../../types";
import { ErrorFallback } from "../errorFallback/ErrorFallback";
import styles from "./OrderBook.module.css";
import { OrderFeed } from "../orderFeed/OrderFeed";
import ButtonMemo, { ButtonType } from "../button/Button";
import { UsdDenominationSelector } from "../usdDenominationSelector/UsdDenominationSelector";

function getDefaultGroupingForProduct(product: Product): UsdDenomination {
  switch (product) {
    case "PI_XBTUSD":
      return UsdDenomination.FiftyCents;
    case "PI_ETHUSD":
      return UsdDenomination.FiveCents;
    default:
      return UsdDenomination.FiftyCents;
  }
}

export function OrderBook() {
  const [productFeedSubscription, setSubscription] = useState(Product.XBTUSD);
  const [grouping, setGrouping] = useState(UsdDenomination.FiftyCents);
  const [resetKey, setResetKey] = useState(false);
  const [isInErrorState, setIsInErrorState] = useState(false);
  const [forceErrorFlag, setForceErrorFlag] = useState(false);

  const toggleSubscription = useCallback(() => {
    const nextSubscription =
      productFeedSubscription === Product.XBTUSD
        ? Product.ETHUSD
        : Product.XBTUSD;

    setSubscription(nextSubscription);
    setGrouping(getDefaultGroupingForProduct(nextSubscription));
  }, [productFeedSubscription]);

  function onResetKeysChange() {
    setForceErrorFlag(false);
    setIsInErrorState(false);
  }

  const killFeed = useCallback(() => setForceErrorFlag(true), []);
  const toggleResetKey = useCallback(() => setResetKey(!resetKey), [resetKey]);
  const onError = useCallback(() => setIsInErrorState(true), []);

  const xbtOptions = [
    UsdDenomination.FiftyCents,
    UsdDenomination.OneDollar,
    UsdDenomination.TwoPointFiveDollars,
  ];

  const ethOptions = [
    UsdDenomination.FiveCents,
    UsdDenomination.TenCents,
    UsdDenomination.TwentyFiveCents,
  ];

  const priceGroupSelectorOptions =
    productFeedSubscription === Product.XBTUSD ? xbtOptions : ethOptions;

  return (
    <div className={styles.orderBook}>
      <div className={styles.orderBookHeader}>
        <p className={styles.title}>Order Book | {productFeedSubscription}</p>

        <UsdDenominationSelector value={grouping} onChange={setGrouping}>
          {priceGroupSelectorOptions.map((option) => (
            <UsdDenominationSelector.Option key={option} value={option}>
              {`Group ${option.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </UsdDenominationSelector.Option>
          ))}
        </UsdDenominationSelector>
      </div>

      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onResetKeysChange={onResetKeysChange}
        onError={onError}
        resetKeys={[resetKey]}
      >
        <OrderFeed
          grouping={grouping}
          productFeedSubscription={productFeedSubscription}
          forceErrorFlag={forceErrorFlag}
        />
      </ErrorBoundary>

      <div className={styles.footer}>
        <ButtonMemo type={ButtonType.Primary} onClick={toggleSubscription}>
          Toggle Feed
        </ButtonMemo>

        {isInErrorState ? (
          <ButtonMemo type={ButtonType.Secondary} onClick={toggleResetKey}>
            Reset Feed
          </ButtonMemo>
        ) : (
          <ButtonMemo type={ButtonType.Danger} onClick={killFeed}>
            Kill Feed
          </ButtonMemo>
        )}
      </div>
    </div>
  );
}
