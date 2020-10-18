import React from "react";
import {Link} from "react-router-dom";



function makeMarkdownChildren(children, work) {
  return children.map((child, i) => <MarkdownText content={child} work={work} key={i}/>);
}


function markdownTable({table, work}) {
  return <table className={"inlineTable"}><tbody>
    {table.children.map((tr, i) =>
    tr.type === "TableRow" ?
      <tr key={i}>
        {tr.children.map((td, j) =>
        td.type === "TableCell" ?
          <td key={j} style={{textAlign: table.align[j]}}>
            {makeMarkdownChildren(td.children, work)}
          </td>
          : JSON.stringify(td))}
      </tr>
      : JSON.stringify(tr)
    )}
  </tbody></table>;
}


function MarkdownText({content, work}) {
  switch (content.type) {
    case "Str": return content.value;

    case "Emphasis": return <span style={{fontStyle: "italic"}}>
      {makeMarkdownChildren(content.children, work)}
    </span>;

    case "Strong": return <span style={{fontWeight: 800}}>
      {makeMarkdownChildren(content.children, work)}
    </span>;

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
  switch (line.type) {
    case "Header": return React.createElement("h" + line.depth, {}, makeMarkdownChildren(line.children, work));
    case "Paragraph": return <p>{makeMarkdownChildren(line.children, work)}</p>;
    case "HorizontalRule": return <hr/>;
    case "Table": return markdownTable({table: line, work});
    default: return <p>{JSON.stringify(line)}</p>;
  }
}

export default MarkdownLine;