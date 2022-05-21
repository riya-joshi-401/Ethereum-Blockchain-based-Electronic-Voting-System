import React from "react";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Switch } from "react-router-dom";
import Voting from "./Voting";

export default function App() {
  if (!navigator.onLine) return "offline";
  return (
    <Switch>
      <Route path="/" exact component={Voting} />
      <Redirect to="/" />
    </Switch>
  );
}
