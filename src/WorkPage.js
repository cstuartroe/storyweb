import React, { Component } from "react";
import { Link } from "react-router-dom";

import ArticleSection from "./ArticleSection";
import StoryTable from "./StoryTable";

function getWorkMetadata(props) {
  let {worksMetadata, workName} = props;
  let work = worksMetadata[workName];
  if (work !== null) {
    work.slug = workName;
  }
  return work;
}

function setWorkBackground(props) {
  props.styleSetter(getWorkMetadata(props).details.styles, props.workName);
}

function SerialTile({serial, work}) {
  return (
    <div className={"row serialTile"}>
      <div className={"col-3 col-md-2"}>
        <div className={"serialTileImage"} style={{
          backgroundImage: "url(\"/w/" + work.slug + "/image/" + serial.image + "\")"
        }}>
        </div>
      </div>
      <div className={"col-9 col-md-10"}>
        <h3><Link to={"/w/" + work.slug + "/" + serial.slug}>{serial.title}</Link></h3>
        <p className={"byline"}>{serial.description}</p>
      </div>
    </div>
  );
}


class WorkPage extends Component {
  componentDidMount() {
    setWorkBackground(this.props);
    document.title = getWorkMetadata(this.props).details.title + " | Storyweb";
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (getWorkMetadata(prevProps).details.styles !== getWorkMetadata(this.props).details.styles) {
      setWorkBackground(this.props);
    }
  }

  render() {
    let {workName} = this.props;
    const work = getWorkMetadata(this.props);

    if (work === null) {
      return <p>No such work.</p>;
    }

    return (
      <div className={"container textBg"}>
        <div className={"row"}>
          <div className={"col-12"}>
            <h1>{work.details.title}</h1>
            <p className={"byline"}>by {work.details.author}</p>
            <p>{work.details.description}</p>
            <hr/>
            {work.details.serials.length > 0 ? <h2>Serials</h2> : null}
            {work.details.serials.map(serial =>
              <SerialTile {...{work, serial}} key={serial.slug}/>
            )}
            <hr/>
            <StoryTable stories={work.stories} workName={workName} serials={work.details.serials}/>
            <hr/>
            <ArticleSection articles={work.articles} workName={workName}/>
          </div>
        </div>
      </div>
    );
  }
}

export {getWorkMetadata, setWorkBackground};
export default WorkPage;
