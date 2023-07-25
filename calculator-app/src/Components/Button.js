import React from "react";

function Button({ label, onClick }) {
  return (
    <div>
      <button className="button" onClick={() => onClick(label)}>
        {label}
      </button>
    </div>
  );
}

export default Button;
