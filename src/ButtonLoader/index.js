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

    //Faking API call here
    setTimeout(() => {
      this.setState({ loading: false, data: "Test" });
    }, 2000);
  };

  render() {
    const { loading } = this.state;

    return (
      <div style={{ marginTop: "60px" }}>
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
