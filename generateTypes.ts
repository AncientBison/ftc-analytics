import { createClient } from "@hey-api/openapi-ts";

createClient({
    client: "@hey-api/client-fetch",
    input: "./swagger.json",
    output: "client",
});
