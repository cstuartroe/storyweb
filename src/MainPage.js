import React, { Component } from "react";
import { Link } from "react-router-dom";

class MainPage extends Component {
  componentDidMount() {
    this.props.styleSetter({});
    document.title = "Storyweb";
  }

  render() {
    let {worksMetadata} = this.props;

    return (
      <div className={"container textBg"}>
        <div className={"row"}>
          <div className={"col-2 col-md-0"}/>
          <div className={"col-8 col-md-12"}>
            <h1>Storyweb</h1>
            {Object.entries(worksMetadata).map(([workName, work], i) =>
              <Link to={"/w/" + workName} key={i}>{work.details.title}</Link>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MainPage;
