import { fireEvent, render } from "@testing-library/react";
import { UsdDenomination } from "../../types";
import {
  UsdDenominationSelector,
  UsdDenominationSelectorProps,
} from "./UsdDenominationSelector";

describe("Price Group Selector", () => {
  const defaultProps: UsdDenominationSelectorProps = {
    value: UsdDenomination.FiftyCents,
    onChange: () => {},
    children: "Child",
  };

  it("renders", () => {
    const { container } = render(<UsdDenominationSelector {...defaultProps} />);
    const element = container.querySelector("select");
    expect(element).toBeInTheDocument();
  });

  it("renders it's children", () => {
    const { container } = render(
      <UsdDenominationSelector {...defaultProps}>
        <UsdDenominationSelector.Option value={UsdDenomination.FiftyCents}>
          Option 1
        </UsdDenominationSelector.Option>
        <UsdDenominationSelector.Option value={UsdDenomination.OneDollar}>
          Option 2
        </UsdDenominationSelector.Option>
      </UsdDenominationSelector>
    );
    const elements = container.querySelectorAll("option");
    expect(elements.length).toBe(2);
  });

  let usdDenomination = UsdDenomination.TwoPointFiveDollars;
  it("selects it's children", () => {
    const { container } = render(
      <UsdDenominationSelector
        {...defaultProps}
        onChange={(newDenomination) => (usdDenomination = newDenomination)}
      >
        <UsdDenominationSelector.Option value={UsdDenomination.FiftyCents}>
          Option 1
        </UsdDenominationSelector.Option>
        <UsdDenominationSelector.Option value={UsdDenomination.OneDollar}>
          Option 2
        </UsdDenominationSelector.Option>
      </UsdDenominationSelector>
    );
    const select = container.querySelector("select")!;

    expect(usdDenomination).toBe(UsdDenomination.TwoPointFiveDollars);
    fireEvent.change(select, { target: { value: UsdDenomination.FiftyCents } });
    expect(usdDenomination).toBe(UsdDenomination.FiftyCents);

    const options = container.querySelectorAll("option")!;
    expect(options[0].selected).toBeTruthy();
    expect(options[1].selected).toBeFalsy();
  });
});
