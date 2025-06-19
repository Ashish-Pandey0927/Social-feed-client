import React, { useState } from "react";
import SearchCelebs from "./SearchCelebs";

const Parent = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        {children}
      </div>
      {showModal && <SearchCelebs onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Parent;
