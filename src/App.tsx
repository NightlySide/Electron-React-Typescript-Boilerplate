import * as React from "react";
import * as ReactDOM from "react-dom";

import "./css/App.css";

function App() {
	return <h1 className="h1-title">Hello world! from react</h1>;
}

ReactDOM.render(<App />, document.getElementById("app"));
