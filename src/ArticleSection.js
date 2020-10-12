import React  from "react";
import {Link} from "react-router-dom";

function ArticleTable({articles, workName, articleType}) {
  let articlesOfType = articles.filter(article => (article.type || null) === articleType);
  articlesOfType.sort((a1, a2) => a1.title.localeCompare(a2.title));

  return (
    <div className={"row articleTable"}>
      {articlesOfType.map(article =>
        <div className={"col-6 col-sm-4 col-md-3"} key={article.slug}>
          <p><Link to={"/w/" + workName + "/a/" + article.slug}>{article.title}</Link></p>
        </div>
      )}
    </div>
  );
}

function ArticleSection({articles, workName}) {
  return (
    <div className={"articleSection"}>
      <h2>Articles</h2>
      <h3>Characters</h3>
      <ArticleTable {...{articles, workName}} articleType={"person"}/>
      <h3>Locations</h3>
      <ArticleTable {...{articles, workName}} articleType={"location"}/>
      <h3>Items</h3>
      <ArticleTable {...{articles, workName}} articleType={"item"}/>
      <h3>Other</h3>
      <ArticleTable {...{articles, workName}} articleType={null}/>
    </div>
  )
}

export default ArticleSection;