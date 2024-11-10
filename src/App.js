import React from "react";
import Grid from "./Grid";
import "./App.css";

function App() {
  return (
    <div className="app-container dark-mode">
      <h1 className="center-text no-select">Interactive Grid</h1>
      <Grid />
    </div>
  );
}

export default App;
