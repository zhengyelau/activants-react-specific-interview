import React, { useState, useEffect, Fragment } from "react";
import SushiContainer from "./containers/SushiContainer";
import Table from "./containers/Table";
import Input from "./components/Input";

// Endpoint!
const API = "http://localhost:3000/sushis";

const startState = {
  allSushis: [],
  startIndex: 0,
  bank: 106,
  eatenSushi: [],
};

export const App = () => {
  const [sushis, setSushis] = useState(startState);

  // store topup wallet input
  const [topupAmount, setTopupAmount] = useState(0);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((allSushis) => setSushis({ ...sushis, allSushis: allSushis }));
  }, []);

  // function to topup wallet
  const topUpWallet = (e) => {
    e.preventDefault();
    if (topupAmount) {
      setSushis({ ...sushis, bank: sushis.bank + parseFloat(topupAmount) });
      // clear input value after successfully topup
      setTopupAmount(0);
      e.target.reset();
      alert("topup successful");
    }
  };

  const activePageContent = () => {
    /*Please come up with a logic to display 4 sushis at a time */

    // if currentIndex plus another 4 is larger than size of total sushi
    // set start index to 0
    if (
      sushis.allSushis.length &&
      sushis.startIndex + 4 > sushis.allSushis.length
    ) {
      setSushis({ ...sushis, startIndex: 0 });
      return sushis.allSushis.slice(0, 4);
    }

    // return next 4
    return sushis.allSushis.slice(sushis.startIndex, sushis.startIndex + 4);
  };

  const moreSushis = () => {
    /*Please come up with a logic to allow users to see the next 4 sushis */
    setSushis({ ...sushis, startIndex: sushis.startIndex + 4 });
  };

  const goBack = () => {
    /*Please come up with a logic to allow users to see the previous 4 sushis */
    if (sushis.startIndex > 4)
      setSushis({ ...sushis, startIndex: sushis.startIndex - 4 });
  };

  const updateSushis = (id, price) => {
    /*Please come up with a logic prompt users on the following:

      1) If sushi has already been eaten, display an alert that shows "Sushi has been eaten!"
      2) If user's bank balance is less than the price of the sushi selected, display an alert that shows "Insufficient funds!"
      3) Only when the above 2 conditions are satisfied, allow users to eat the sushi. When the sushi is eaten, the sushi will only show
          an empty plate in its original place and there will be an additional empty plate on the table. Please refer to the gif for 
          described behaviour.    
    */

    // check is already eaten or not
    if (sushis.eatenSushi.includes(id)) {
      alert("Sushi has been eaten!");
      return;
    } else {
      sushis.eatenSushi.push(id);
    }

    if (sushis.bank < price) {
      alert("Insufficient funds!");
    } else {
      // push the id of sushi to eatenSushi
      setSushis({ ...sushis, bank: sushis.bank - price });
    }
  };

  return (
    <div className="app">
      <SushiContainer
        sushis={activePageContent()}
        moreSushis={moreSushis}
        goBack={goBack}
        eatSushi={updateSushis}
      />
      <Table sushiPlate={sushis.eatenSushi} bank={sushis.bank} />

      {/* topup wallet input */}
      <Fragment>
        <form onSubmit={topUpWallet}>
          <Input
            label="Topup Wallet:"
            name="topup_amount"
            type="number"
            onChange={(e) => setTopupAmount(e.target.value)}
          />
          <Input type="submit" />
        </form>
      </Fragment>
    </div>
  );
};

export default App;
