import React, { Component } from "react";
import {Link} from "react-router-dom";
const mdparse = require("@textlint/markdown-to-ast").parse;

import InfoPanel from "./InfoPanel";

import {setWorkBackground, getWorkMetadata} from "./WorkPage";
import {getSerial} from "./SerialPage";
import MarkdownLine from "./MarkdownLine";


function getDocMetadata({work, docType, docName}) {
  return work[docType].filter(doc => doc.slug === docName)[0];
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

    document.title = docMetadata.title + " | " + work.details.title + " | Storyweb";

    this.setState({docMetadata, prevStory: something.prevStory, nextStory: something.nextStory})

    fetch("/w/" + work.slug + (docType === 'stories' ? "/s/" : "/a/") + docName + ".md")
      .then(response => response.text())
      .then(text => this.setState({ast: mdparse(text)}));
  }

  render() {
    let work = getWorkMetadata(this.props);
    let serial = getSerial({work, serialName: this.props.serialName});
    let {docMetadata, prevStory, nextStory, ast: {children}} = this.state;
    let {docType} = this.props;

    let lines = [];
    for (let i in children) {
      if (children[i].type === "Header" && children[i].depth === 1) {
        lines = children.slice(i-0+1);
        break;
      }
    }
    if (lines.length === 0) {
      return null;
    }

    let firstSectionLines;
    if (docType === "articles") {
      firstSectionLines = lines;
      lines = [];
      for (let i in firstSectionLines) {
        if (firstSectionLines[i].type === "Header" && firstSectionLines[i].depth === 2) {
          lines = firstSectionLines.slice(i-0);
          firstSectionLines = firstSectionLines.slice(0, i-0);
          break;
        }
      }
    }

    let docTypeClasses = {
      "articles": "articleFrame",
      "stories": "storyFrame"
    }

    let articleTypeDescriptors = {
      person: "A character in ",
      location: "A location in ",
      item: "An item in "
    };

    return (
      <div className={"container textBg " + docTypeClasses[docType]}>
        <div className={"row"}>
          <div className={"col-12"}>
            <h1>{docMetadata.title}</h1>

            <p className={"byline"}>
              {docType === "stories" ?
                "Part of "
                :
                articleTypeDescriptors[docMetadata.type] || "In "
              }
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

            {docType === "articles" ?
            <div className={"row"}>
              <div className={"col-6 col-sm-7 col-md-8"}>
                {firstSectionLines.map((line, i) =>
                  <MarkdownLine {...{work, line}} key={i}/>
                )}
              </div>
              <div className={"col-6 col-sm-5 col-md-4"}>
                <InfoPanel article={docMetadata} work={work}/>
              </div>
            </div>
            : null}

            {lines.map((line, i) =>
              <MarkdownLine {...{work, line}} key={i}/>
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
