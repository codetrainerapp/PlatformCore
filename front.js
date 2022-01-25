var discordbtn = document.getElementById("discordbtn");

function apologizeEn(page) {
  alert("We're sorry. The " + page + " page has not yet been created. Follow updates on our discord, or at https://codetrainer.42web.io/ to see when it will come out!");
}

function apologizeDe(page) {
  alert("Es tut uns leid. Der " + page + " Seite wurde noch nicht erstellt. Folgen Sie Updates auf unserem Discord oder auf https://codetrainer.42web.io/, um zu sehen, wann es herauskommt!");
}

function openDiscord() {
  document.getElementById("discordbtn").click();
}