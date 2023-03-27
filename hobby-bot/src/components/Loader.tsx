type Props = {
  size: "sm" | "md" | "lg";
};
const Loader = ({ size }: Props) => {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-12 w-12 ",
    lg: "h-24 w-24",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeMap[size]} border-t-2 border-b-2 border-teal-900 dark:border-teal-50`}
      ></div>
    </div>
  );
};

export default Loader;
