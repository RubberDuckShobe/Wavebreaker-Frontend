import createClient from "openapi-fetch";
import type { paths } from "$lib/api/wavebreaker";

const client = createClient<paths>({ baseUrl: "http://localhost:1338/api/" });
export default client;