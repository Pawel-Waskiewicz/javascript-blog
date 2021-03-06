const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML), 
  authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML), 
};
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector =  '.post-tags .list',
  optArticleAuthorSelector = '.post-author',    
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors.list';

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* [DONE]get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}; 

function generateTitleLinks(customSelector = ''){
  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* [DONE] for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(articles);
  let html = '';
  for (let article of articles) {
  
    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');
    /* [DONE] find the title element */ /* [DONE] get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
  
    /* [DONE] create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* [DONE] insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);
  
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();
  
function calculateTagsParams(tags){
  const params = { min: 999999, max: 0};
  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    else if(tags[tag] < params.min){
      params.min = tags[tag];}
  }
  return params;
}

function calculateTagsClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

  return optCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
  /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector); 
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray){
    /* generate HTML of the link */
    const linkHTMLData = {id: tag, tag: tag};
    const linkHTML = templates.tagLink(linkHTMLData);
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
      //console.log(linkHTML);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html; 
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */  
    //allTagsHTML +=  '<li class="'+ calculateTagsClass(allTags[tag], tagsParams) + '"> <a href="#tag-' + tag + '"> ' + tag + ' </a></li>';
    allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagsClass(allTags[tag], tagsParams)
      });
      
    /* [NEW] END LOOP: for each tag in allTags: */
  }
  /*[NEW] add from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData)
}
    
generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks){
  /* remove class active */
    activeTagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagHrefLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let tagHrefLink of tagHrefLinks){
  /* add class active */
    tagHrefLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const linkTag = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let linkTags of linkTag){
  /* add tagClickHandler as event listener for that link */
    linkTags.addEventListener('click',tagClickHandler);
  /* END LOOP: for each link */
  }
} 
  
addClickListenersToTags(); 

function generateAuthors(){
  /* [NEW] create a new variable with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article */
  for (let article of articles){
    /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get authors from data-authors attribute */
    const tagAuthor = article.getAttribute('data-author');
    /* generate html of the link */
    const linkHTMLData = { id: tagAuthor, title: tagAuthor };
    const linkHTML = templates.authorLink(linkHTMLData);
    //const linkHTML = '<a href="#author-' + author + '">' + author + '</a>';
    /* add generated code to html variable */
    html = html + linkHTML;
    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors[tagAuthor]){
    /* [NEW] add tag to allTags object */
      allAuthors[tagAuthor] = 1;
    } else {
      allAuthors[tagAuthor]++;
    }
    /* insert html to author wrappper */
    authorWrapper.innerHTML = linkHTML;
    /* END LOOP: for every article */
  }
  /* [NEW] find list of tags in right column */
  const authorsList = document.querySelector(optAuthorsListSelector);
  /* [NEW] create variable for all links HTML code */
  const authorsParams = calculateTagsParams(allAuthors);
  console.log('authorsParams:', authorsParams);
  //let allAuthorsHTML = '';

  const allAuthorsData = {authors: []};
  /* [NEW] START LOOP: for each author in allTags: */
  for (let author in allAuthors){
  /* [NEW] generate code of a link and add it to allAuthorsHTML */ 
   // allAuthorsHTML += '<li class="'+ calculateTagsClass(allAuthors[author], authorsParams) + '" ><a href="#author-' + author + '">' + author + '(' + allAuthors[author] + ')</a></li>';
   allAuthorsData.tags.push({
    author: author,
    count: allAuthors[author],
    
  });
  }
  /*[NEW] add from allTagsHTML to tagList */
  //authorsList.innerHTML = allAuthorsHTML;
  authorList.innerHTML = templates.authorListLink(allAuthorData);
}
generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make new constant "href" and read the artibute href of clickedElement */
  const href = clickedElement.getAttribute('href');
  /* make new constant "author" and extract tag from constant "href" */
  const author = href.replace('#author-', '');
  /* find all author links with class acive */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active author link */
  for (let acitveAuthorLink of activeAuthorLinks) {
    /* remove class active */
    acitveAuthorLink.classList.remove('active');
    /* END LOOP: for each active author link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found author link */
  for (let authorTagLink of authorTagLinks) {
    /* add class active */
    authorTagLink.classList.add('active');
    /* END LOOP: for each found author link */
  }
  /* execute function "generateTitleLinks" with article selecor as argument*/
  generateTitleLinks('[data-author="' + author + '"]');
}


function addClickListenersToAuthors(){
/* find all links to authors */
  const authorLinks = document.querySelectorAll('a[href^="#author"]');
  /* START LOOP: for each link */
  for (let authorLink of authorLinks){
    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click',authorClickHandler);
  }
}
addClickListenersToAuthors();

