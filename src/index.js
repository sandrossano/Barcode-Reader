import React, { Component } from "react";
import ReactDOM from "react-dom";
//import Spinner from "react-native-loading-spinner-overlay";
//import Scanner from "./Scanner";
//import Result from "./Result";
import Result from "./components/Result";
import Scanner from "./components/Scanner";
import css from "./styles.module.css";
import Quagga from "quagga";
//import { RingLoader, BounceLoader, HashLoader } from "react-spinners";
import ButtonLoader from "./ButtonLoader/index";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

class App extends Component {
  state = {
    scanning: false,
    loading: true,
    results: []
  };

  _scan = () => {
    this.setState({ scanning: !this.state.scanning });
  };

  _changeEnabled(value) {
    if (value === "disabled") {
      document.getElementById("fieldEn").disabled = true;
    } else {
      document.getElementById("fieldEn").disabled = false;
    }
  }

  _onDetected = (result) => {
    //this.setState({ results: this.state.results.concat([result]) })
    //this.setState({ results: this.state.results.concat([result]) });
    //this.setState({ results: [result] });
    document.querySelector("#text-input").value = result.codeResult.code;
    this.setState({ scanning: false });
  };

  componentDidMount() {
    this._changeEnabled("disabled");
    document
      .querySelector("#inputId")
      .addEventListener("change", this.handleFileSelect, false);
  }

  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    //loaderHandler.showLoader("Loading"); // Show indicator with message 'Loading'
    //loaderHandler.showLoader("Loading More"); // Show indicator with message 'Loading More'

    //loaderHandler.hideLoader();  // Hide the loader
    var tmpImgURL = URL.createObjectURL(files[0]);

    Quagga.decodeSingle(
      {
        src: tmpImgURL,
        numOfWorkers: 2, // Needs to be 0 when used within node
        locate: true,
        inputStream: {
          size: 800 // restrict input-size to be 800px in width (long-side)
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader"
          ]
        }
      },
      function (result) {
        console.log(result);
        if (result) {
          if (result.codeResult != null) {
            document.querySelector("#text-input").value =
              result.codeResult.code;
            console.log("result", result.codeResult.code);
          } else {
            alert("not detected");
            document.querySelector("#text-input").value = "";
          }
        } else {
          alert("not detected");
          document.querySelector("#text-input").value = "";
        }
      }
    );
  }

  render() {
    return (
      <div align="center" style={{ marginTop: "10px", paddingTop: "10px" }}>
        <fieldset id="fieldEn" className={css.fieldset}>
          <span class={css.TestoTestata}>Inserisci Barcode</span>
          <br />
          <br />
          <div style={{ marginTop: "5px" }}>
            <div className={css.card2}>
              <p style={style}>
                <span className={css.Label}>Da Fotocamera</span>
                <img
                  className={css.ImageLabel}
                  width="40px"
                  alt="Icona Cam"
                  src="fotocam.ico"
                />
                <button onClick={this._scan} className={css.button}>
                  {this.state.scanning ? "Chiudi" : "Apri"}
                </button>
              </p>
              <ul className="results">
                {this.state.results.map((result, i) => (
                  <Result key={result.codeResult.code + i} result={result} />
                ))}
              </ul>
              <div align="center">
                {this.state.scanning ? (
                  <Scanner onDetected={this._onDetected} />
                ) : null}
              </div>
              <span className={css.Label}>Da Libreria</span>
              <input
                id="inputId"
                name="file"
                className={css.button}
                type="file"
                accept="image/*"
              />
              <br />
            </div>
            <br />
            <label>Barcode: </label>
            <input type="text" id="text-input" />
          </div>
        </fieldset>
        <ButtonLoader />
      </div>
    );
  }
}

const app = new App();

export default app;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
