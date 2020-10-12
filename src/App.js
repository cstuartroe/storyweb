import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import ReactDOM from "react-dom";

import "../static/scss/main.scss";
import "../static/scss/fonts.scss";

import MainPage from "./MainPage";
import WorkPage from "./WorkPage";
import DocumentPage from "./DocumentPage";
import SerialPage from "./SerialPage";

const defaultStyles = {
  theme: "light",
  linkColor: "deep-blue",
  highlightColor: "gold",
  blockColor: "gray",
  font: "Arial"
};

const defaultBackdropParams = {
  className: "bg-gray"
}

class App extends Component {
  state = {
    worksMetadata: null,
    topLevelClasses: [],
    backdropParams: defaultBackdropParams
  }

  componentDidMount() {
    fetch("/works_metadata.json")
      .then(response => response.json())
      .then(data => {
        this.setState({worksMetadata: data});
      });
  }

  styleSetter(styles, workName=null) {
    const topLevelClasses = [];
    Object.keys(defaultStyles).forEach(styleParam => {
      topLevelClasses.push(styleParam + "-" + (styles[styleParam] || defaultStyles[styleParam]));
    });
    this.setState({topLevelClasses: topLevelClasses});

    let backdropParams;
    if ('background' in styles) {
      let bg = styles.background;
      if (bg.includes(".")) {
        backdropParams = {
          style: {
            backgroundImage: "url(\"/w/" + workName + "/image/" + bg + "\")"
          }
        };
      } else {
        backdropParams = {
          className: "bg-" + bg
        };
      }
    } else {
      backdropParams = defaultBackdropParams;
    }
    this.setState({backdropParams})
  }

  render() {
    let {worksMetadata, topLevelClasses, backdropParams} = this.state;

    if (worksMetadata === null) {
      return null;
    }

    return (
      <div className={"storyweb-app"}>
        <div id={"backdrop"} {...backdropParams}/>
        <div id={"style-wrapper"} className={topLevelClasses.join(" ")}>
          <Router>
            <Switch>
              <Route exact={true} path="/">
                <MainPage worksMetadata={worksMetadata}
                          styleSetter={this.styleSetter.bind(this)}/>
              </Route>
              <Route path="/w/:workName" exact={true} render={({match}) =>
                <WorkPage {...match.params} worksMetadata={worksMetadata}
                          styleSetter={this.styleSetter.bind(this)}/>
              }/>
              <Route path="/w/:workName/s/:docName" render={({match}) =>
                <DocumentPage {...match.params} docType={"stories"} worksMetadata={worksMetadata}
                              styleSetter={this.styleSetter.bind(this)} serialName={null}/>
              }/>
              <Route path="/w/:workName/a/:docName" render={({match}) =>
                <DocumentPage {...match.params} docType={"articles"} worksMetadata={worksMetadata}
                              styleSetter={this.styleSetter.bind(this)} serialName={null}/>
              }/>
              <Route path="/w/:workName/:serialName/:docName" render={({match}) =>
                <DocumentPage {...match.params} docType={"stories"} worksMetadata={worksMetadata}
                              styleSetter={this.styleSetter.bind(this)}/>
              }/>
              <Route path="/w/:workName/:serialName" render={({match}) =>
                <SerialPage {...match.params} worksMetadata={worksMetadata}
                              styleSetter={this.styleSetter.bind(this)}/>
              }/>
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
