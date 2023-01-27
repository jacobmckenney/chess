import type { ReactElement } from "react";
import React from "react";

interface Props {
  label: ReactElement | string;
  register: () => any;
  defaultValue?: string;
}

const FormInput: React.FC<Props> = ({ defaultValue, label, register }) => {
  return (
    <div className="flex w-full justify-between gap-x-8">
      <div>{label}</div>
      <input {...register()} className="w-1/3 text-black" />
    </div>
  );
};

export default FormInput;
