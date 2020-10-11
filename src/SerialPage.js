import React, { Component } from "react";
import {Link} from "react-router-dom";

import {setWorkBackground, getWorkMetadata} from "./WorkPage";
import StoryTable from "./StoryTable";


class SerialPage extends Component {
  componentDidMount() {
    setWorkBackground(this.props);
  }

  render() {
    let {serialName, workName} = this.props;
    let workMetadata = getWorkMetadata(this.props);
    let serial = workMetadata.details.serials.filter(serial => serial.slug === serialName)[0];
    let stories = serial.stories.map(storyName => workMetadata.stories.filter(story => story.slug === storyName)[0]);

    return (
      <div className={"container textBg"}>
        <div className={"row"}>
          <div className={"col-12"}>
            <h1>{serial.title}</h1>
            <p className={"byline"}>
              A serial of stories in
              {" "}<Link to={"/w/" + workMetadata.slug}>{workMetadata.details.title}</Link>{" "}
              by {workMetadata.details.author}
            </p>
            <p>{serial.description}</p>
            <hr/>
            <StoryTable {...{stories, serialName, workName}} dontSort={true}/>
          </div>
        </div>
      </div>
    );
  }
}

export default SerialPage;
