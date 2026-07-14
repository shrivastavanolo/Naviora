import { createSwaggerSpec } from "next-swagger-doc";
import { AUTH_COOKIE } from "@/src/lib/constants";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Naviora API",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: AUTH_COOKIE,
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              email: {
                type: "string",
                format: "email",
              },
            },
          },
          Trip: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              title: {
                type: "string",
              },
              description: {
                type: "string",
                nullable: true,
              },
              startDate: {
                type: "string",
                format: "date-time",
                nullable: true,
              },
              endDate: {
                type: "string",
                format: "date-time",
                nullable: true,
              },
              ownerId: {
                type: "string",
              },
            },
          },
          Place: {
            type: "object",

            properties: {
              id: {
                type: "string",
              },

              name: {
                type: "string",
              },

              address: {
                type: "string",
                nullable: true,
              },

              latitude: {
                type: "number",
                example: 28.6139,
              },

              longitude: {
                type: "number",
                example: 77.209,
              },

              notes: {
                type: "string",
                nullable: true,
              },

              estimatedDuration: {
                type: "integer",
                nullable: true,
                example: 90,
              },

              visitOrder: {
                type: "integer",
                nullable: true,
                example: 2,
              },

              tripId: {
                type: "string",
              },
            },
          },
          Error: {
            type: "object",

            properties: {
              success: {
                type: "boolean",
                example: false,
              },

              error: {
                type: "string",
                example: "Validation failed",
              },
            },
          },
          UpdateTripInput: {
            type: "object",
            properties: {
              title: {
                type: "string",
              },
              description: {
                type: "string",
              },
              startDate: {
                type: "string",
                format: "date",
                nullable: true,
              },
              endDate: {
                type: "string",
                format: "date",
                nullable: true,
              },
            },
          },
          CreateTripInput: {
            type: "object",
            required: ["title"],
            properties: {
              title: {
                type: "string",
                example: "Japan 2027",
              },
              description: {
                type: "string",
                nullable: true,
                example: "Cherry blossom trip with friends",
              },
              startDate: {
                type: "string",
                format: "date",
                nullable: true,
                example: "2027-03-28",
              },
              endDate: {
                type: "string",
                format: "date",
                nullable: true,
                example: "2027-04-08",
              },
            },
          },
          CreatePlaceInput: {
            type: "object",
            required: ["name", "latitude", "longitude"],
            properties: {
              name: {
                type: "string",
                example: "Tokyo Tower",
              },
              address: {
                type: "string",
                nullable: true,
                example: "4 Chome-2-8 Shibakoen, Minato City, Tokyo",
              },
              latitude: {
                type: "number",
                format: "double",
                example: 35.6586,
              },
              longitude: {
                type: "number",
                format: "double",
                example: 139.7454,
              },
              notes: {
                type: "string",
                nullable: true,
                example: "Best visited around sunset.",
              },
              estimatedDuration: {
                type: "integer",
                nullable: true,
                example: 90,
              },
              visitOrder: {
                type: "integer",
                nullable: true,
                example: 1,
              },
            },
          },
          UpdatePlaceInput: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "Tokyo Skytree",
              },
              address: {
                type: "string",
                nullable: true,
                example: "1 Chome-1-2 Oshiage, Sumida City, Tokyo",
              },
              latitude: {
                type: "number",
                format: "double",
                example: 35.7101,
              },
              longitude: {
                type: "number",
                format: "double",
                example: 139.8107,
              },
              notes: {
                type: "string",
                nullable: true,
                example: "Buy tickets online beforehand.",
              },
              estimatedDuration: {
                type: "integer",
                nullable: true,
                example: 120,
              },
              visitOrder: {
                type: "integer",
                nullable: true,
                example: 2,
              },
            },
          },
        },
        responses: {
          Unauthorized: {
            description: "Authentication required",
          },

          NotFound: {
            description: "Resource not found",
          },

          BadRequest: {
            description: "Validation failed",
          },

          InternalServerError: {
            description: "Internal server error",
          },
        },
      },
      security: [],
      tags: [
        {
          name: "Authentication",
          description: "Authentication endpoints",
        },
        {
          name: "Trips",
          description: "Trip management",
        },
        {
          name: "Places",
          description: "Place management",
        },
      ],
    },
  });
  return spec;
};
