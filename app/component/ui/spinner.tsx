import React from "react";
import { RxReload } from "react-icons/rx";

const Spinner = React.memo(
  ({ condition, heading }: { condition: boolean; heading?: string }) => {
    return (
      <div>
        {condition ? (
          <div className="flex flex-col w-fit mx-auto">
            <RxReload className="animate-spin mx-auto mt-3" size={30} />
            <h1>{heading}</h1>
          </div>
        ) : null}
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
export default Spinner;
