import { Component } from "react";

class Result extends Component {
  render() {
    const result = this.props.result;

    if (!result) {
      return null;
    }

    return result.codeResult.code;
    /*<li>
        {" "}
        {result.codeResult.code} [{result.codeResult.format}]{" "}
      </li>*/
  }
}

export default Result;
