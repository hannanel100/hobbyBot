"use client";

import { useState } from "react";

const Hobby = ({ hobby }: { hobby: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group">
      <h1>{hobby.split("-")[0]} - </h1>
      <p className="ml-4 hidden group-hover:block">{hobby.split("-")[1]}</p>
    </div>
  );
};

export default Hobby;
