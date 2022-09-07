import React, { Fragment } from "react";
import Button from "../components/Button";
import Sushi from "../components/Sushi";

const SushiContainer = (props) => {
  return (
    <Fragment>
      <div className="belt">
        <Button moreSushis={props.goBack} buttonText="Go back!" />
        {props.sushis.map((sushi, index) => (
          <Sushi displaySushi={sushi} eatSushi={props.eatSushi} key={index} />
        ))}
        <Button moreSushis={props.moreSushis} buttonText="More sushi!" />
      </div>
    </Fragment>
  );
};

export default SushiContainer;
