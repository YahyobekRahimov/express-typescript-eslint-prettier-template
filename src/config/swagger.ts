import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Express API with Swagger",
      version: "1.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // Your API base url
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", description: "The user ID" },
            username: {
              type: "string",
              description: "A unique username",
            },
          },
        },
        CreateUserDto: {
          type: "object",
          required: ["name", "email"],
          properties: {
            username: {
              type: "string",
              description: "A unique username",
            },
          },
        },
      },
    },
  },
  // Path to the API docs
  // Note that this path is relative to the root of the project
  apis: ["./src/modules/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
