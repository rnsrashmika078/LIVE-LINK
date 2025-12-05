import React from "react";
import { RxReload } from "react-icons/rx";

const Spinner = React.memo(({ condition }: { condition: boolean }) => {
  return (
    <div>
      {condition ? (
        <RxReload className="animate-spin mx-auto mt-3" size={30} />
      ) : null}
    </div>
  );
});

Spinner.displayName = "Spinner";
export default Spinner;
