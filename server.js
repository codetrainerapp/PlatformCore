 const path = require("path");

var mysql = require("mysql");

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

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function (request, reply) {
  reply.view("/src/pages/index.html");
});

fastify.get("/en-US/landing", function (request, reply) {
  reply.view("/src/pages/en-US/landing.html");
});

fastify.get("/de-DE/landing", function (request, reply) {
  // request.query.paramName <-- a querystring example
  let params = {
    lu: false
  };
  reply.view("/src/pages/de-DE/landing.html", params);
});

fastify.get("/en-US/explore", function (request, reply) {
  reply.view("/src/pages/en-US/explore.html");
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
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
