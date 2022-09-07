import React from "react";

const Button = (props) => {
  return <button onClick={() => props.moreSushis()}>{props.buttonText}</button>;
};

export default Button;
