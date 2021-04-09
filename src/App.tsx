import React from "react";
import "./styles/bootstrap-italia-custom.scss";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import Activities from "./components/Activities";

function App() {
  return (
    <div className="container">
      <div className="row variable-gutters">
        <div className="col-7 offset-1">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi, quam
            minus magni distinctio amet nobis esse! Debitis neque voluptatum a
            provident modi excepturi sunt, eos voluptatem iste, delectus
            asperiores quibusdam?
          </p>
        </div>
        <div className="col-3">
          <Activities />
        </div>
      </div>
    </div>
  );
}

export default App;
