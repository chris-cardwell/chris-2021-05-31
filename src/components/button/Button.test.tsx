import { fireEvent, render } from "@testing-library/react";
import React from "react";
import Button, { ButtonProps, ButtonType } from "./Button";

describe("Button", () => {
  const defaultProps: ButtonProps = {
    type: ButtonType.Primary,
    onClick: () => {},
    children: "Button Text",
  };

  it("renders", () => {
    const { getByText } = render(<Button {...defaultProps} />);
    const element = getByText("Button Text");
    expect(element).toBeInTheDocument();
  });

  let count = 0;
  it("calls it's onClick", () => {
    const { getByText } = render(
      <Button {...defaultProps} onClick={() => count++} />
    );
    const element = getByText("Button Text");
    fireEvent.click(element);
    expect(count).toBe(1);
  });

  it("displays it's children", () => {
    const { getByText } = render(<Button {...defaultProps}>Display Me</Button>);
    const element = getByText("Display Me");
    expect(element).toBeInTheDocument();
  });

  it("uses the primary style when passed ButtonType.Primary", () => {
    const { getByText } = render(
      <Button {...defaultProps} type={ButtonType.Primary} />
    );
    const element = getByText("Button Text");
    expect(element).toHaveClass("primary");
  });

  it("uses the secondary style when passed ButtonType.Primary", () => {
    const { getByText } = render(
      <Button {...defaultProps} type={ButtonType.Secondary} />
    );
    const element = getByText("Button Text");
    expect(element).toHaveClass("secondary");
  });

  it("uses the danger style when passed ButtonType.Primary", () => {
    const { getByText } = render(
      <Button {...defaultProps} type={ButtonType.Danger} />
    );
    const element = getByText("Button Text");
    expect(element).toHaveClass("danger");
  });
});
