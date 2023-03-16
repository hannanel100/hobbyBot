type CardProps = {
  children: React.ReactNode;
};

const Card = ({ children }: CardProps) => {
  return (
    <div className="rounded-lg border border-cyan-900 p-4 shadow-xl dark:border-cyan-50">
      {children}
    </div>
  );
};

export default Card;
