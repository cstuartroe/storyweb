import React  from "react";
import {Link} from "react-router-dom";

function ArticleRow({article, workName}) {
  return (
    <tr>
      <td>
        <Link to={"/w/" + workName + "/s/" + article.slug}>{article.title}</Link>
      </td>
    </tr>
  );
}

function ArticleTable({articles, workName}) {
  return (
    <div>
      <h2>Articles</h2>
      <table className={"doctable"}>
        <tbody>
        {articles.map(article =>
          <ArticleRow article={article} workName={workName} key={article.slug}/>
        )}
        </tbody>
      </table>
    </div>
  )
}

export default ArticleTable;