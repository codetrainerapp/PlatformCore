 const path = require("path");

var mysql = require("mysql");

const axios = require("axios");

var userCourseData;

const { Client } = require("pg");

// Create a client using the connection information provided on bit.io.
const client = new Client({
  user: "CodeTrainer_demo_db_connection",
  host: "db.bit.io",
  database: "bitdotio",
  password: "3J6Aq_zgHd9USQbTExT9jh7uwBDKJ",
  port: 5432,
});
client.connect().catch((e) => {});
client.on("error", (e) => {});

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

fastify.get("/", function (request, reply) {
  reply.view("/src/pages/index.html", {client_id: process.env.Client_ID});
});

var access_token = "";

//Our callback route.
fastify.get("/github/callback", function (req, res) {
  const requestToken = req.query.code;

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${process.env.Client_ID}&client_secret=${process.env.Client_Secret}&code=${requestToken}`,
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    access_token = response.data.access_token;
    res.redirect("/success");
  });
});

fastify.get("/success", function (req, res) {
  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + access_token,
    },
  }).then((response) => {
    client.query(
      'SELECT courses FROM "CodeTrainer/codetrainermain"."userdata" WHERE EXISTS (SELECT username FROM "CodeTrainer/codetrainermain"."userdata" WHERE username=\'' +
        response.data.name +
        "');",
      (err, respo) => {
        if (respo == undefined || respo.rowCount == 0) {
          client.query(
            'INSERT INTO "CodeTrainer/codetrainermain"."userdata" (username, courses) VALUES (\'' +
              response.data.name +
              '\', \'{"html": 0}\');',
            (err, resp) => {});
        } else {
          userCourseData = respo.rows[0].courses;
          console.log(userCourseData);
        }
        userCourseData = JSON.stringify(userCourseData);
        console.log(userCourseData);
        res.view("src/pages/auth.html", {
          userData: response.data,
          userCourses: userCourseData != undefined ? JSON.stringify(userCourseData) : "{html: 0}",
        });
      }
    );
  });
});

fastify.get("/test/code/azh", function (request, reply) {
  reply.view("/src/pages/test.html", {client_id: process.env.Client_ID});
});

fastify.get("/en-US/landing", function (request, reply) {
  reply.view("/src/pages/en-US/landing.html", {client_id: process.env.Client_ID});
});

fastify.get("/de-DE/landing", function (request, reply) {
  // request.query.paramName <-- a querystring example
  let params = {
    lu: false
  };
  reply.view("/src/pages/de-DE/landing.html", params);
});

fastify.get("/en-US/explore", function (request, reply) {
  reply.view("/src/pages/en-US/explore.html", {client_id: process.env.Client_ID});
});

fastify.get("/en-US/courses/html", function (request, reply) {
  // request.query.paramName <-- a querystring example
  let params = {
    lessonname: ["What is HTML?", "The basics of tags"],
    lessondesc: ["Let's go over some use cases as well as what HTML means.", "How do tags work and what are attributes?"]
  };
  reply.view("/src/pages/en-US/course.html", params);
});

fastify.get("/ga-IE/landing", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/ga-IE/landing.html");
});

fastify.get("/auth", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/auth.html");
});

fastify.get("/license", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/license.html");
});

fastify.get("/certifications", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/certifications/certlanding.html");
});

fastify.get("/certifications/webdeveloper", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/certifications/webdevcert.html");
});

fastify.get("/about/terms", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/about/termsofservice.html");
});

fastify.get("/tempnav", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/navbardesign.html");
});

fastify.get("/trainercss", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("/trainer.css");
});

fastify.get("/trainercss/info", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("src/pages/trainercss.html");
});


fastify.get("/lu", function (request, reply) {
// request.query.paramName <-- a querystring example
  let params = {
    lu: true
  };
  reply.view("/src/pages/de-DE/landing.html", params);
});

fastify.setNotFoundHandler(function (request, reply) {
    reply.view("/src/pages/404.html");
})

fastify.register(function (instance, options, done) {
  instance.setNotFoundHandler(function (request, reply) {
    // Handle not found request without preValidation and preHandler hooks
    // to URLs that begin with '/v1'
  })
  done()
}, { prefix: '/v1' })

// A POST route to handle form submissions
fastify.post("/", function (request, reply) {
  let params = {
    greeting: "Hello Form!",
  };
  // request.body.paramName <-- a form post example
  reply.view("/src/pages/index.html", params);
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT, "0.0.0.0", function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
