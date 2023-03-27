import { SetStateAction } from "react";

type Props = {
  label: string;
  value: number;
  setValue: (value: SetStateAction<number>) => void;
  max: number;
};
const NumberInput = ({ label, value, setValue, max }: Props) => {
  const bg = "bg-teal-500";
  const border = "border-teal-500 dark:border-teal-500";

  return (
    <div className="flex flex-col items-center">
      <label className="mb-2 text-sm font-bold text-gray-700">{label}</label>
      <input
        type="number"
        min={1}
        max={max}
        className={`w-48 px-3 py-2 ${border} rounded-md shadow-sm focus:border-teal-500 focus:outline-none focus:ring focus:ring-teal-200 focus:ring-opacity-50 ${bg}`}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
};

export default NumberInput;
