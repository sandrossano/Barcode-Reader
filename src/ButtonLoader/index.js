import React, { Component } from "react";
import Convert from "xml-js";
import css from "../styles.module.css";
import App from "../index.js";
export default class ButtonLoader extends Component {
  state = {
    data: "",
    loading: false
  };

  fetchData = () => {
    this.setState({ loading: true, data: "Loading" });
    var that = this;
    var barcode = document.querySelector("#text-input").value;
    var url =
      "https://cors-casillo-sap.herokuapp.com/https://repodoc.s3.eu-west-3.amazonaws.com/?prefix=" +
      barcode;
    if (barcode === "") {
      //alert("Il campo barcode non può essere vuoto");
      that.setState({ loading: false, data: "Barcode Vuoto" });
      return;
    }
    var array = [];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var jsonText = Convert.xml2json(this.responseText);
        var obj = JSON.parse(jsonText);
        var elements = obj.elements[0].elements;
        const menu = document.querySelector("#item_list");
        menu.innerHTML = "";
        for (var i = 0; i < elements.length; i++) {
          if (elements[i].name === "Contents") {
            if (
              elements[i].elements[0].elements[0].text.includes(barcode + "/")
            ) {
              array.push(elements[i].elements[0].elements[0].text);
              if (!elements[i].elements[0].elements[0].text.endsWith("/")) {
                menu.appendChild(
                  that.createMenuItem(elements[i].elements[0].elements[0].text)
                );
              }
            }
          }
        }
        document.querySelector("#listaEl").innerHTML = barcode + "/";
        document.querySelector("#alleg").hidden = "";

        console.log(array);
        that.setState({ loading: false, data: "" });
        //App._changeEnabled("enabled");
      } else {
        if (this.readyState === 4 && this.status !== 200)
          that.setState({ loading: false });
      }
    };
    xhttp.open(
      "GET",
      url,
      //"https://services.odata.org/V4/(S(nav3gc15n4kgx5riao0euln0))/TripPinServiceRW/Airports('KSFO')/Name/$value",
      true
    );
    xhttp.send();
    /*
      setTimeout(() => {
    }, 500);*/
    //Faking API call here
    /*setTimeout(() => {
      this.setState({ loading: false, data: "Test" });
    }, 15000);*/
  };

  createMenuItem(name) {
    let li = document.createElement("li");
    var a = document.createElement("a");

    a.textContent = name;
    a.setAttribute(
      "href",
      "https://repodoc.s3.eu-west-3.amazonaws.com/" + name
    );
    a.setAttribute("target", "_blank");
    li.appendChild(a);
    return li;
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        <button
          className={css.button}
          onClick={this.fetchData}
          disabled={loading}
        >
          {loading && (
            <i
              className="fa fa-refresh fa-spin"
              style={{ marginRight: "5px" }}
            />
          )}
          {loading && <span>Caricamento</span>}
          {!loading && <span>Estrai Allegati</span>}
        </button>
        <p className={css.MessageFetch}>{this.state.data}</p>
      </div>
    );
  }
}
