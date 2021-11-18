import React from "react";

const Input = ({
  name,
  label,
  type = "text",
  handleChange,
  input = "input",
  ...rest
}) => {
  switch (input) {
    case "textarea":
      return (
        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            type={type}
            name={name}
            placeholder=" "
            onChange={handleChange}
            rows="5"
            {...rest}
          />
          <label>{label}</label>
        </div>
      );
    default:
      return (
        <div className={`form-${type === "file" ? "group" : "floating"} mb-3`}>
          {type === "file" && <label className="form-label">{label}</label>}
          <input
            className="form-control"
            type={type}
            name={name}
            placeholder=" "
            onChange={handleChange}
            {...rest}
          />
          {type != "file" && <label>{label}</label>}
        </div>
      );
  }
};

export default Input;
