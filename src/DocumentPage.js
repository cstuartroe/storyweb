import React, { Component } from "react";
import {Link} from "react-router-dom";
const mdparse = require("@textlint/markdown-to-ast").parse;

import {setWorkBackground, getWorkMetadata} from "./WorkPage";


function getDocMetadata({work, docType, docName}) {
  return work[docType].filter(doc => doc.slug === docName)[0];
}

function getSerial({work, serialName}) {
  return serialName ? work.details.serials.filter(serial => serial.slug === serialName)[0] : null;
}


function getAdjacentStories({work, docName, serialName}) {
  let out = {prevStory: null, nextStory: null};
  if (serialName !== null) {
    let {stories} = getSerial({work, serialName});
    stories.forEach((storyName, i) => {
      if (storyName === docName) {
        out = {
          prevStory: (i-0) === 0 ? null : getDocMetadata({work, docType: "stories", docName: stories[i-1]}),
          nextStory: (i - 0 + 1 === stories.length) ? null : getDocMetadata({work, docType: "stories", docName: stories[i+1]})
        };
      }
    });
  }
  return out;
}


function MarkdownText({content}) {
  if (content.type === "Str") {
    return content.value;
  } else {
    return JSON.stringify(content);
  }
}


function MarkdownLine({line}) {
  if (line.type === "Header") {
    return React.createElement("h" + line.depth, {},
      line.children.map((child, i) => <MarkdownText content={child} key={i}/>));
  } else if (line.type === "Paragraph") {
    return React.createElement("p", {},
      line.children.map((child, i) => <MarkdownText content={child} key={i}/>));
  } else if (line.type === "HorizontalRule") {
    return <hr/>
  } else {
    return <p>{JSON.stringify(line)}</p>
  }
}

class DocumentPage extends Component {
  state = {
    ast: {children: []},
    docMetadata: {},
    prevStory: null,
    nextStory: null
  }

  componentDidMount() {
    setWorkBackground(this.props);
    this.fillDocument();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (getWorkMetadata(prevProps).details.styles !== getWorkMetadata(this.props).details.styles) {
      setWorkBackground(this.props);
    }
    if (prevProps.docName !== this.props.docName) {
      this.fillDocument();
    }
  }

  fillDocument() {
    let {docName, docType, serialName} = this.props;
    let work = getWorkMetadata(this.props);
    let docMetadata = getDocMetadata({work, docName, docType});
    let something = getAdjacentStories({work, docName, serialName});

    document.title = docMetadata.title + " - Storyweb";

    this.setState({docMetadata, prevStory: something.prevStory, nextStory: something.nextStory})

    fetch("/w/" + work.slug + (docType === 'stories' ? "/s/" : "/a/") + docName + ".md")
      .then(response => response.text())
      .then(text => this.setState({ast: mdparse(text)}));
  }

  render() {
    let work = getWorkMetadata(this.props);
    let serial = getSerial({work, serialName: this.props.serialName});
    let {prevStory, nextStory, ast: {children}} = this.state;

    let lines = null;
    for (let i in children) {
      if (children[i].type === "Header") {
        lines = children.slice(i-0+1);
        break;
      }
    }
    if (lines === null) {
      return null;
    }

    return (
      <div className={"container textBg"}>
        <div className={"row"}>
          <div className={"col-12"}>
            <h1>{this.state.docMetadata.title}</h1>
            <p className={"byline"}>
              {"Part of "}
              {serial ?
                <span>
                  {"the serial "}
                  <Link to={"/w/" + work.slug + "/" + serial.slug}>{serial.title}</Link>
                  {" in the work "}
                </span>
                : null
              }
              <Link to={"/w/" + work.slug}>{work.details.title}</Link>
              {" by "}
              {work.details.author}
            </p>
            {prevStory ?
              <p className={"taCenter"}>
                {"Previous story: "}
                <Link to={"/w/" + work.slug + "/" + (serial.slug || "s") + "/" + prevStory.slug}>{prevStory.title}</Link>
              </p>
            : null
            }
            <hr/>
            {lines.map((line, i) =>
              <MarkdownLine line={line} key={i}/>
            )}
            {nextStory ?
              <div>
                <hr/>
                <p className={"taCenter"}>
                  {"Next story: "}
                  <Link to={"/w/" + work.slug + "/" + (serial.slug || "s") + "/" + nextStory.slug}>{nextStory.title}</Link>
                </p>
              </div>
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default DocumentPage;
