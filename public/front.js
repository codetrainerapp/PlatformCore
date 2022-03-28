var discordbtn = document.getElementById("discordbtn");

function apologizeEn(page) {
  alert(
    "We're sorry. The " +
      page +
      " page has not yet been created. Follow updates on our discord, or at https://codetrainer.42web.io/ to see when it will come out!"
  );
}

function apologizeDe(page) {
  alert(
    "Es tut uns leid. Der " +
      page +
      " Seite wurde noch nicht erstellt. Folgen Sie Updates auf unserem Discord oder auf https://codetrainer.42web.io/, um zu sehen, wann es herauskommt!"
  );
}

function openDiscord() {
  document.getElementById("discordbtn").click();
}

if (location.protocol !== "https:") {
  location.replace(
    `https:${location.href.substring(location.protocol.length)}`
  );
}
function loggedIn() {
  if (getCookie("username") != "") {
    document.getElementById("login").firstElementChild.firstElementChild.innerHTML = '&nbsp;Log Out&nbsp;';
    document.getElementById("login").href = "/#";
    document.getElementById("login").onclick = function () {
      document.cookie =
        "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "usercoursedata=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload();
    };
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function delete_cookie(name, path, domain) {
  if (getCookie(name)) {
    document.cookie =
      name +
      "=" +
      (path ? ";path=" + path : "") +
      (domain ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}
