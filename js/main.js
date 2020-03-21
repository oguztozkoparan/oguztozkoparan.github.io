//getting projects from json file using vue
fetch("/json/projects.json")
  .then(response => {
    return response.json();
  })
  .then(projectsJson => {
    new Vue({
      el: "#projects",
      computed: {
        projects: function() {
          return projectsJson;
        }
      },
      methods: {
        redirect: function(url) {
          location.href = url;
        }
      }
    });
  });
//getting projects from json file using vue

//scrolling
function scrolling(e) {
  var selector;
  if (String(e.className) === "navbar-links-about") {
    selector = ".aboutsection";
  } else if (String(e.className) === "navbar-links-projects") {
    selector = ".projectssection";
  } else if (String(e.className) === "navbar-links-team") {
    selector = ".teamsection";
  } else {
    selector = ".contactsection";
  }
  document.querySelector(selector).scrollIntoView({ behavior: "smooth" });
  document.querySelector(".navbar-menu").classList.remove("navbar-menu-open");
  document
    .querySelector(".navbar-hamburger")
    .classList.remove("navbar-hamburger-open");
}
document.querySelector(".navbar-title").addEventListener("click", function(e) {
  document
    .querySelector(".startsection")
    .scrollIntoView({ behavior: "smooth" });
});
//scrolling

//scrolling Arrows
document
  .getElementsByClassName("startsection-scroll")[0]
  .addEventListener("click", function(e) {
    document
      .querySelector(".aboutsection")
      .scrollIntoView({ behavior: "smooth" });
  });
document.getElementsByClassName(
  "aboutsection-container-scroll"
)[0].onclick = function() {
  document
    .querySelector(".projectssection")
    .scrollIntoView({ behavior: "smooth" });
};

document.getElementsByClassName(
  "projectssection-container-scroll"
)[0].onclick = function() {
  document.querySelector(".teamsection").scrollIntoView({ behavior: "smooth" });
};
//scrolling Arrows

//team buttons section
var teambuttons = document.getElementsByClassName(
  "teamsection-container-teamprop-socialui"
);
teambuttons[0].addEventListener("click", function(e) {
  location.href = "https://github.com/hummingbirdscyber";
});
teambuttons[1].onclick = function() {
  location.href = "https://twitter.com/hbscyber";
};
teambuttons[2].onclick = function() {
  location.href = "https://www.instagram.com/hummingbirdscyber/";
};
teambuttons[3].onclick = function() {
  location.href = "https://www.linkedin.com/company/hummingbirds-cyber-team/";
};
//team buttons section

//social buttons section
var socialbuttons = document.getElementsByClassName(
  "contactsection-container-social"
);
socialbuttons[0].onclick = function() {
  location.href = "https://www.github.com/oguztozkoparan";
};
socialbuttons[1].onclick = function() {
  location.href = "https://twitter.com/Dustbreaker0";
};
socialbuttons[2].onclick = function() {
  location.href = "https://www.instagram.com/oguztozkoparan/";
};
socialbuttons[3].onclick = function() {
  location.href = "https://www.linkedin.com/in/oguz-tozkoparan-4a4443153/";
};
//social buttons section

//toggle hamburger menu
document
  .getElementsByClassName("navbar-hamburger")[0]
  .addEventListener("click", function(e) {
    this.classList.toggle("navbar-hamburger-open");
    document.querySelector(".navbar-menu").classList.toggle("navbar-menu-open");
  });
//toggle hamburger menu
