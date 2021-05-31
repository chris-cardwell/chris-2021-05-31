import React from "react";
import { ReactNode } from "react";
import styles from "./Button.module.css";

export function Button({ type, onClick, children }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[type]}`} onClick={onClick}>
      {children}
    </button>
  );
}

const ButtonMemo = React.memo(Button);
export default ButtonMemo;

export enum ButtonType {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
}

export type ButtonProps = {
  type: ButtonType;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};
