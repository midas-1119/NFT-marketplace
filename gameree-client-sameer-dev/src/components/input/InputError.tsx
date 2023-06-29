import React from "react";

function InputError({ error }: any) {
  return (
    <>
      {error && (
        <p className="text-red-500 mt-1 absolute top-full">
          {error instanceof Object ? error.message : error}
        </p>
      )}
    </>
  );
}
export default InputError;
