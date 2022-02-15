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

fastify.get("/en-US/:page", function (request, reply) {
  let params = {
    req: request,
  };
  reply.view("/src/pages/en-US/landing.html", params);
});

fastify.get("/de-DE/landing", function (request, reply) {
  // request.query.paramName <-- a querystring example
  let params = {
    lu: false
  };
  reply.view("/src/pages/de-DE/landing.html", params);
});

fastify.get("/ga-IE/landing", function (request, reply) {
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/ga-IE/landing.html");
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
