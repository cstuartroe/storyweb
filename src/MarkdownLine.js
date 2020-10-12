import React from "react";
import {Link} from "react-router-dom";



function makeMarkdownChildren(children, work) {
  return children.map((child, i) => <MarkdownText content={child} work={work} key={i}/>);
}


function MarkdownText({content, work}) {
  switch (content.type) {
    case "Str": return content.value;

    case "Link":
      if (content.url === "") {
        if (content.children.length !== 0) {
          let articles = work.articles.filter(article => article.title === content.children[0].value);
          if (articles.length === 0) {
            return <a className={"broken"} href={"/w/" + work.slug + "/a/" + content.children[0].value}>
              {content.children[0].value.replace("_", " ")}
            </a>;
          } else {
            let article = articles[0];
            return <Link to={"/w/" + work.slug + "/a/" + article.slug}>{article.title}</Link>
          }
        } else {
          return <a href={""}>{makeMarkdownChildren(content.children, work)}</a>;
        }
      } else {
        if (!content.url.includes("/")) {
          return <Link to={"/w/" + work.slug + "/a/" + content.url}>{makeMarkdownChildren(content.children)}</Link>;
        } else if (content.url.startsWith("s/")) {
          return <Link to={"/w/" + work.slug + "/" + content.url}>{makeMarkdownChildren(content.children)}</Link>;
        } else {
          return <Link to={content.url}>{makeMarkdownChildren(content.children, work)}</Link>;
        }
      }

    default: return JSON.stringify(content);
  }
}


function MarkdownLine({work, line}) {
  if (line.type === "Header") {
    return React.createElement("h" + line.depth, {}, makeMarkdownChildren(line.children, work));
  } else if (line.type === "Paragraph") {
    return <p>{makeMarkdownChildren(line.children, work)}</p>;
  } else if (line.type === "HorizontalRule") {
    return <hr/>
  } else {
    return <p>{JSON.stringify(line)}</p>
  }
}

export default MarkdownLine;