import React  from "react";
import {Link} from "react-router-dom";

function StoryRow({story, workName, serials, serialName}) {
  let containingSerials = serials.filter(serial => (serial.stories.includes(story.slug)));
  let serialsText = [];

  containingSerials.forEach((serial, i) => {
      serialsText.push(
        <Link to={"/w/" + workName + "/" + serial.slug} key={serial.slug}>{serial.title}</Link>
      );
      i + 1 < containingSerials.length ? serialsText.push(", ") : null;
    }
  );

  return (
    <tr>
      <td>
        <Link to={"/w/" + workName + "/" + (serialName || "s") + "/" + story.slug}>{story.title}</Link>
      </td>
      <td>{story.location}</td>
      <td>{story.date}</td>
      <td>{story.word_count}</td>
      {serials.length === 0 ? null :
        <td>
          {serialsText}
        </td>
      }
    </tr>
  );
}

function StoryTable({stories, workName, serials=[], dontSort=false, serialName=null}) {
  if (!dontSort) {
    stories.sort((s1, s2) => s1.date.localeCompare(s2.date));
  }

  return (
    <div className={"storiesSection"}>
      <h2>Stories</h2>
      <table className={"doctable"}>
        <thead>
        <tr>
          <th>Title</th>
          <th>Location</th>
          <th>Date</th>
          <th>Word Count</th>
          {serials.length === 0 ? null : <th>Part of the serial(s)</th>}
        </tr>
        </thead>
        <tbody>
        {stories.map(story =>
          <StoryRow {...{story, workName, serials, serialName}} key={story.slug}/>
        )}
        </tbody>
      </table>
    </div>
  );
}

export default StoryTable;