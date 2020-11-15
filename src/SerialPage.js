import React, { Component } from "react";
import {Link} from "react-router-dom";

import {setWorkBackground, getWorkMetadata} from "./WorkPage";
import StoryTable from "./StoryTable";

function getSerial({work, serialName}) {
  return serialName ? work.details.serials.filter(serial => serial.slug === serialName)[0] : null;
}


class SerialPage extends Component {
  componentDidMount() {
    setWorkBackground(this.props);

    let {serialName} = this.props;
    let work = getWorkMetadata(this.props);
    let serial = getSerial({work, serialName});
    document.title = serial.title + " | " + work.details.title + " | Storyweb";
  }

  render() {
    let {serialName, workName} = this.props;
    let work = getWorkMetadata(this.props);
    let serial = work.details.serials.filter(serial => serial.slug === serialName)[0];
    let stories = serial.stories.map(storyName => work.stories.filter(story => story.slug === storyName)[0]);
    let wordCount = stories.map(s => s.word_count).reduce((a, b) => a+b, 0)

    return (
      <div className={"container textBg"}>
        <div className={"row"}>
          <div className={"col-12"}>
            <h1>{serial.title}</h1>
            <p className={"byline"}>
              A serial of stories in
              {" "}<Link to={"/w/" + work.slug}>{work.details.title}</Link>{" "}
              by {work.details.author}
            </p>
            {serial.image ?
              <img src={"/w/" + work.slug + "/image/" + serial.image} alt={serial.image} className={"serialTopImage"}/>
            : null}
            <p>{serial.description}</p>
            <p>Word count: {wordCount}</p>
            <hr/>
            <StoryTable {...{stories, serialName, workName}} dontSort={true}/>
          </div>
        </div>
      </div>
    );
  }
}

export {getSerial};
export default SerialPage;
