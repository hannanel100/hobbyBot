type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const Button = ({ children, onClick, disabled = false }: ButtonProps) => {
  return (
    <button
      className="mx-auto flex cursor-pointer items-center justify-center gap-2 rounded bg-teal-500 py-2 px-4 font-bold text-teal-900 shadow-md hover:bg-teal-700 hover:text-teal-50 hover:shadow-xl"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
