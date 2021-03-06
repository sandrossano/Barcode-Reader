import React, { Component } from "react";
import config from "./config.json";
import Quagga from "quagga";
import css from "../styles.module.css";

class Scanner extends Component {
  componentDidMount() {
    Quagga.init(config, function (err) {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
    });
    Quagga.onDetected(this._onDetected);
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected);
  }

  _onDetected = (result) => {
    this.props.onDetected(result);
  };

  render() {
    return (
      <div
        id="interactive"
        className="viewport"
        style={{ minHeight: "200px", maxHeight: "650px" }}
      />
    );
  }
}
export default Scanner;
