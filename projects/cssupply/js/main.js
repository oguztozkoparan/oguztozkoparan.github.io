//create items to see design
var item = `<div class="item">
<div class="item-title">
  <p class="item-title-title">Karambit - Doppler Sapphire</p>
  <p class="item-title-condition factory-new">Factory New</p>
</div>
<img class="item-image" src="/image/knife.png" alt="item" />
<p class="item-value">$2838.07</p>
<p class="item-count">x1</p>
</div>
</div>`;

var siteinventory = document.querySelector(".trade-siteinventory-items");
var clientinventory = document.querySelector(".trade-clientinventory-items");
for (let i = 0; i < 25; i++) {
  siteinventory.innerHTML += item;
  clientinventory.innerHTML += item;
}

//shows logged in style
document.querySelector(".navbarsignin").addEventListener("click", function(e) {
  if (this.children[1].innerText == "Sign in through Steam") {
    this.children[0].src = "../image/profile.png";
    this.children[1].innerText = "Dustbreaker";
  } else {
    this.children[0].src = "../image/steam.png";
    this.children[1].innerText = "Sign in through Steam";
  }
});

//scroll animations
document.querySelector(".navbarabout").addEventListener("click", function(e) {
  document
    .querySelector(".information-about")
    .scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".navbarfaq").addEventListener("click", function(e) {
  document
    .querySelector(".information-faq")
    .scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".navbarcontact").addEventListener("click", function(e) {
  document
    .querySelector(".information-contact")
    .scrollIntoView({ behavior: "smooth" });
});

//scroll for responmenu
function responScroll(e) {
  var selector;
  if (String(e.className) === "responmenu-about")
    selector = ".information-about";
  else if (String(e.className) === "responmenu-faq")
    selector = ".information-faq";
  else selector = ".information-contact";
  document.querySelector(selector).scrollIntoView({ behavior: "smooth" });
  document.querySelector(".responmenu").classList.remove("responmenu-open");
}

//navbar responsive menu opening
document.querySelector(".navbarmenu").addEventListener("click", function(e) {
  this.classList.toggle("navbarmenu-open");
  document.querySelector(".responmenu").classList.toggle("responmenu-open");
});
