import React from "react";

const Input = ({ name, label, type = "text", handleChange, ...rest }) => {
  return (
    <div className="form-floating mb-3">
      <input
        className="form-control"
        type={type}
        name={name}
        placeholder=" "
        onChange={handleChange}
        {...rest}
      />
      <label>{label}</label>
    </div>
  );
};

export default Input;
