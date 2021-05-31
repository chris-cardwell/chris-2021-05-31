import { render } from "@testing-library/react";
import { FallbackProps } from "react-error-boundary";
import { ErrorFallback } from "./ErrorFallback";

describe("ErrorFallback", () => {
  const defaultProps: FallbackProps = {
    error: Error("test error message"),
    resetErrorBoundary: () => {}, //is this the best way to populate a noop function
  };

  it("renders", () => {
    const { getByRole } = render(<ErrorFallback {...defaultProps} />);
    const element = getByRole("alert");
    expect(element).toBeInTheDocument();
  });

  it("displays the message from the caught error", () => {
    const { getByText } = render(<ErrorFallback {...defaultProps} />);
    const element = getByText("test error message");
    expect(element).toBeInTheDocument();
  });
});
