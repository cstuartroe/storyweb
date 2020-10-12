import React from "react";
import {Link} from "react-router-dom";

function LocationInfo({location, work}) {
  return (
    <table>
      <tbody>
      {location.coordinates ?
        <tr><td>Coordinates:</td><td>{location.coordinates}</td></tr>
        : null}
      </tbody>
    </table>
  );
}

function placeLink(placeName, work) {
  if (!placeName) { return null; }

  let places = work.articles.filter(article => article.type === "location" && article.title === placeName);
  if (places.length === 0) {
    return <a href={"/w/" + work.slug + "/a/" + placeName.replace(" ", "_")} className={"broken"}>{placeName}</a>;
  } else {
    let place = places[0];
    return <Link to={"/w/" + work.slug + "/a/" + place.slug}>{place.title}</Link>;
  }
}

function CharacterInfo({person, work}) {
  return (
    <table>
      <tbody>
      {(person.born || person.hometown) ?
        <tr>
          <td>Born:</td>
          <td>{person.born}<br/>{placeLink(person.hometown, work)}</td>
        </tr>
        : null}
      {(person.died || person.deathsite) ?
        <tr>
          <td>Died:</td>
          <td>{person.died}<br/>{placeLink(person.deathsite, work)}</td>
        </tr>
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

      {article.type === "location" ? <LocationInfo location={article} work={work}/> : null}
      {article.type === "person" ? <CharacterInfo person={article} work={work}/> : null}
    </div>
  );
}


export default InfoPanel;