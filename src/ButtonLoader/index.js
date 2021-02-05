import React, { Component } from "react";
import css from "../styles.module.css";
import App from "../index.js";
export default class ButtonLoader extends Component {
  state = {
    data: "Test",
    loading: false
  };

  fetchData = () => {
    this.setState({ loading: true, data: "Loading" });

    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        that.setState({ loading: false, data: this.responseText });
      } else {
        if (this.readyState === 4 && this.status !== 200)
          that.setState({ loading: false });
      }
    };
    xhttp.open(
      "GET",
      "https://services.odata.org/V4/(S(nav3gc15n4kgx5riao0euln0))/TripPinServiceRW/Airports('KSFO')/Name/$value",
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
          {loading && <span>Loading Data from Server</span>}
          {!loading && <span>Fetch Data from Server</span>}
        </button>
        <p>{this.state.data}</p>
      </div>
    );
  }
}
