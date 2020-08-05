let data;

let photos = ["profile.png"]; //

fetch("assets/data.json")
  .then((resp) => resp.json())
  .then((d) => {
    console.log("loaded:", d);
    data = d;
    // determine what page to render
    let params = new URLSearchParams(window.location.search);
    if (params.get("project") == null) {
      renderMainPage(data);
    } else {
      let project = data.projects.find((d) => d.id === params.get("project"));
      renderProjectPage(project);
    }
  });

function renderNavbar(page, items) {
  return `
    <nav>
        <ul>
           ${
             page === "project"
               ? `<li>
                    <a href=".">Go Back</a>
                </li>`
               : items
                   .map(
                     (d) =>
                       `<li>
                    <a href="#${d}">${d.toUpperCase()}</a>
                </li>
                `
                   )
                   .join("")
           }
        </ul>
    </nav>`;
}

function renderMainPage(data) {
  document.querySelector(".container").innerHTML = `
        ${renderNavbar("main", Object.keys(data))}
        ${renderAbout(data.about)}
        ${renderNews(data.news)}
        ${renderProjects(data.projects)}
    `;
  addInteractions();
}
function renderAbout(about) {
  return `
    <section id="about">
        <h1 class="title">${about.name}</h1>
        <div class="row">
            <div class="col-6">
             
                <p>
                    <strong>${about.title}</strong><br>
                    ${about.email} <br>
                    ${about.address}<br>
                    <a href="${about.github}" target="_blank"><i class="fab fa-github"></i> Github </a><br>
                </p>
            </div>
            <div class="col-6">
                <p>
                ${about.desc}
                </p>
            </div>
            
        </div >    
    </section>`;
}

function renderMaterialIcon(type) {
  switch (type) {
    case "Paper":
      return '<i class="far fa-file-alt"></i>';
    case "Report":
      return '<i class="far fa-file-alt"></i>';
    case "Github":
      return '<i class="fab fa-github"></i>';
    case "Download-Poster":
      return '<i class="fas fa-file-download"></i>';
    case "Code":
      return '<i class="far fa-keyboard"></i>';
    case "Website":
      return '<i class="fas fa-chalkboard"></i>';
  }
}

function renderNews(news) {
  return `
    <section id="news">
        <h1 class="title">News</h1>
        <div class="search">
            <input type="text" name='news' placeholder="Search News...">
        </div>
        <div class="news-list">
            ${renderNewsItems(news)}
        </div>
    </section>
    `;
}
function renderNewsItems(news) {
  return news
    .slice(0, 6)
    .map(
      (d) => `
        <div class="row">
            <div class="col-8">
                ${d.title}
            </div>
            <div class="col-4">
                ${d.date}
            </div>
        </div>
    `
    )
    .join("");
}

function renderProjects(projects) {
  return `
    <section id="projects">
        <h1 class="title">Projects</h1>
        <div class="filter">
            <input type="radio" name="filter" value="all">
                All
            </label>
            <label>
                <input type="radio" name="filter" value="theory">
                Theory
            </label>
            <label>
                <input type="radio" name="filter" value="django">
                Django
            </label>
            <label>
                <input type="radio" name="filter" value="database">
                Database
            </label>
            <label>            
            <label>
                <input type="radio" name="filter" value="machine-learning">
                Machine Learning
            </label>
            <label>
                <input type="radio" name="filter" value="algorithms">
                Algorithms
            </label>
  
        </div>
        <div class="project-list">
            ${renderProjectItems(projects)}
        </div>
    </section>`;
}

function addInteractions() {
  let newsSearch = document.querySelector('.search input[name="news"');

  newsSearch.addEventListener("input", function (event) {
    // renderNews(allNews.filter(''))
    console.log("value", this.value);
    if (this.value != "") {
      let filtered = data.news.filter((d) => {
        let text = d.title + " " + d.date;
        return text.toLowerCase().includes(this.value.toLowerCase());
      });

      document.querySelector(".news-list").innerHTML = renderNewsItems(
        filtered
      );
    } else {
      document.querySelector(".news-list").innerHTML = renderNewsItems(
        data.news
      );
    }
  });

  let conds = document.querySelectorAll('.filter input[name="filter"]');
  console.log(typeof conds);
  conds.forEach((cond) =>
    cond.addEventListener("change", function (event) {
      let checked = event.target.value; //Array.from(conds).filter(d=>d.checked).map(d=>d.value);
      if (checked === "all") {
        document.querySelector(".project-list").innerHTML = renderProjectItems(
          data.projects
        );
      } else {
        let filtered = data.projects.filter((d) => {
          return d.tags.some((tag) => checked === tag.toLowerCase());
        });
        // console.log('filtered', filtered);

        document.querySelector(".project-list").innerHTML = renderProjectItems(
          filtered
        );
      }
    })
  );
}
function renderProjectItems(projects) {
  return projects
    .map(
      (d) => `
        <div class="row">
            <div class="col-6">
                <div class="project-title">
                    <a href="?project=${d.id}"><strong>${d.title}</strong></a>
                </div>
                <div class="project-authors">
                    ${d.authors}<br>
                </div>
                <div class="project-source">
                    <em>${d.source}</em>
                </div>
                <div class="project-tags">
                    ${d.tags
                      .map(
                        (tag) => `
                        <span class="tag ${tag.toLowerCase()}">
                            ${tag}
                        </span>
                    `
                      )
                      .join("")}
                </div>
                <div class="project-materials">
                    ${d.materials
                      .map(
                        (m) => `
                        <span>
                            <a href="${
                              m.path
                            }" target="_blank">${renderMaterialIcon(m.label)} 
                            ${m.label}
                            </a>
                        </span>
                    `
                      )
                      .join("")}
                    
                </div>
            </div> 
            <div class="col-6">
                <img src="${d.teaser}" width="100%">
            </div>
        </div>
    `
    )
    .join("");
}

function addInteractions() {
  let newsSearch = document.querySelector('.search input[name="news"');

  newsSearch.addEventListener("input", function (event) {
    // renderNews(allNews.filter(''))
    console.log("value", this.value);
    if (this.value != "") {
      let filtered = data.news.filter((d) => {
        let text = d.title + " " + d.date;
        return text.toLowerCase().includes(this.value.toLowerCase());
      });

      document.querySelector(".news-list").innerHTML = renderNewsItems(
        filtered
      );
    } else {
      document.querySelector(".news-list").innerHTML = renderNewsItems(
        data.news
      );
    }
  });

  let conds = document.querySelectorAll('.filter input[name="filter"]');
  console.log(typeof conds);
  conds.forEach((cond) =>
    cond.addEventListener("change", function (event) {
      let checked = event.target.value; //Array.from(conds).filter(d=>d.checked).map(d=>d.value);
      if (checked === "all") {
        document.querySelector(".project-list").innerHTML = renderProjectItems(
          data.projects
        );
      } else {
        let filtered = data.projects.filter((d) => {
          return d.tags.some((tag) => checked === tag.toLowerCase());
        });
        // console.log('filtered', filtered);

        document.querySelector(".project-list").innerHTML = renderProjectItems(
          filtered
        );
      }
    })
  );
}

function renderProjectPage(project) {
  document.querySelector(".container").innerHTML = `
        ${renderNavbar("project")}
        ${renderProjectDetail(project)}
    `;
}

function addInteractions() {
  let newsSearch = document.querySelector('.search input[name="news"');

  newsSearch.addEventListener("input", function (event) {
    // renderNews(allNews.filter(''))
    console.log("value", this.value);
    if (this.value != "") {
      let filtered = data.news.filter((d) => {
        let text = d.title + " " + d.date;
        return text.toLowerCase().includes(this.value.toLowerCase());
      });

      document.querySelector(".news-list").innerHTML = renderNewsItems(
        filtered
      );
    } else {
      document.querySelector(".news-list").innerHTML = renderNewsItems(
        data.news
      );
    }
  });

  let conds = document.querySelectorAll('.filter input[name="filter"]');
  console.log(typeof conds);
  conds.forEach((cond) =>
    cond.addEventListener("change", function (event) {
      let checked = event.target.value; //Array.from(conds).filter(d=>d.checked).map(d=>d.value);
      if (checked === "all") {
        document.querySelector(".project-list").innerHTML = renderProjectItems(
          data.projects
        );
      } else {
        let filtered = data.projects.filter((d) => {
          return d.tags.some((tag) => checked === tag.toLowerCase());
        });
        // console.log('filtered', filtered);

        document.querySelector(".project-list").innerHTML = renderProjectItems(
          filtered
        );
      }
    })
  );
}
function renderProjectDetail(d) {
  return `
    <section>
        <h1 class="title">${d.title}</h1>
        <img class="project-teaser" src="${d.teaser}" width="100%">
        <div class="project-authors">
            ${d.authors}
        </div>
        <div class="project-source">
            <em>${d.source}</em>
        </div>
        <div class="project-tags">
            ${d.tags
              .map(
                (tag) => `
                <span class="tag ${tag.toLowerCase()}">
                    ${tag}
                </span>
            `
              )
              .join("")}
        </div>
        <div class="project-desc">
            <p>
                ${d.desc}
            </p>
        </div>
        <div class="project-materials">
            ${d.materials
              .map(
                (m) => `
                <span>
                    <a href="${m.path}" target="_blank">${renderMaterialIcon(
                  m.label
                )} 
                    ${m.label}
                    </a>
                </span>
            `
              )
              .join("")}
        </div>
    </section>
    `;
}
