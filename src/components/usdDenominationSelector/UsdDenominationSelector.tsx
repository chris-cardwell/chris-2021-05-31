import React from "react";
import { ChangeEvent, ReactNode } from "react";
import { UsdDenomination } from "../../types";
import styles from "./UsdDenominationSelector.module.css";

export function UsdDenominationSelector({
  value,
  onChange,
  children,
}: UsdDenominationSelectorProps) {
  function onChangeLocal(event: ChangeEvent<HTMLSelectElement>) {
    onChange(Number(event.target.value));
  }

  return (
    <select
      value={value}
      onChange={onChangeLocal}
      className={styles.groupSelect}
    >
      {children}
    </select>
  );
}

function UsdDenominationSelectorOption({
  value,
  children,
}: UsdDenominationSelectorOptionProps) {
  return <option value={value}>{children}</option>;
}

UsdDenominationSelector.Option = React.memo(UsdDenominationSelectorOption);

export type UsdDenominationSelectorOptionProps = {
  value: UsdDenomination;
  children: ReactNode;
};

export type UsdDenominationSelectorProps = {
  value: UsdDenomination;
  onChange: (usdDenomination: UsdDenomination) => void;
  children: ReactNode;
};
