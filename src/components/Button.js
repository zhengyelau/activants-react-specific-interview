import React from "react";

const Button = (props) => {

  const { firstPage } = props;

  return <button onClick={() => props.moreSushis()} style={{ visibility: firstPage ? "hidden" : "visible" }}>{props.buttonText}</button>;
};

export default Button;
