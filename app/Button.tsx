type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      className="mx-auto flex items-center justify-center gap-2 rounded bg-teal-500 py-2 px-4 font-bold text-teal-900 shadow-md hover:bg-teal-700 hover:text-teal-50 hover:shadow-xl"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
