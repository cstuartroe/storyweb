import React from "react";
import {Link} from "react-router-dom";

function LocationInfo({article, work}) {
  return (
    <table>
      <tbody>
      {article.coordinates ?
        <tr><td>Coordinates:</td><td>{article.coordinates}</td></tr>
        : null}
      </tbody>
    </table>
  );
}

function CharacterInfo({article, work}) {
  return (
    <table>
      <tbody>
      {article.born ?
        <tr><td>Born:</td><td>{article.born}</td></tr>
        : null}
      {article.died ?
        <tr><td>Died:</td><td>{article.died}</td></tr>
        : null}
      </tbody>
    </table>
  );
}

function InfoPanel({article, work}) {
  return (
    <div className={"infoPanel"}>
      <p className={"infoPanelTitle"}>{article.title}</p>
      {article.image ? <img src={"/w/" + work.slug + "/image/" + article.image} alt={article.title}/> : null }

      {article.type === "location" ? <LocationInfo {...{article, work}}/> : null}
      {article.type === "person" ? <CharacterInfo {...{article, work}}/> : null}
    </div>
  );
}


export default InfoPanel;