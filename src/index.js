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
const styleLeft = {
  display: "flex",
  alignItems: "center"
};
///AWS CONFIG
var path = require("path");
const AWS = require("aws-sdk");
const fs = require("fs");
// Enter copied or downloaded access ID and secret key here
const ID = "AKIARQNSLORAPDGPDBOG";
const SECRET = "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";
// The name of the bucket that you have created
const BUCKET_NAME = "repodoc";
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});
////

class App extends Component {
  state = {
    scanning: false,
    loading: true,
    allegatiload: false,
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
    //this._changeEnabled("disabled");
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

  _uploadFile = () => {
    if (document.getElementById("fieldEn").disabled === true) {
      return;
    }
    this._changeEnabled("disabled");
    if (document.querySelector("#inputIdFile").value === "") {
      alert("Selezionare una immagine");
      this._changeEnabled("enabled");
    }

    var objurl = URL.createObjectURL(
      document.querySelector("#inputIdFile").files[0]
    );
  };

  render() {
    return (
      <div>
        <div
          className={css.card}
          align="center"
          style={{ marginTop: "10px", paddingTop: "10px" }}
        >
          <span className={css.TestoTestata}>Inserisci Barcode</span>
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
            <input
              type="text"
              id="text-input"
              style={{ marginTop: "20px", marginBottom: "15px" }}
            />
          </div>

          <ButtonLoader />
        </div>
        <div id="alleg" className={css.card} hidden="hidden">
          <fieldset id="fieldEn" className={css.fieldset}>
            <center>
              <span className={css.TestoTestata}>Allegati:</span>

              <div style={{ marginTop: "5px" }}>
                <div className={css.card2}>
                  <p style={styleLeft}>
                    <img
                      className={css.ImageLabel}
                      width="40px"
                      alt="Icona Fold"
                      src="folder.ico"
                    />
                    <span className={css.LabelFolder} id="listaEl"></span>
                  </p>
                  <ul id="item_list"></ul>
                </div>
              </div>
            </center>
            <div style={{ marginTop: "30px" }}>
              <center>
                <p className={css.TestoTestata}>Carica Allegato</p>
                <input
                  id="inputIdFile"
                  name="file"
                  className={css.button}
                  type="file"
                  accept="image/*"
                />
                <br />
                <button
                  type="submit"
                  onClick={this._uploadFile}
                  className={css.ButtonSubmit}
                >
                  <img
                    className={css.ImageUpload}
                    alt="Icona Upload"
                    src="upload.ico"
                    width="70px"
                  />
                </button>
              </center>
            </div>
          </fieldset>
        </div>
      </div>
    );
  }
}

const app = new App();

export default app;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
