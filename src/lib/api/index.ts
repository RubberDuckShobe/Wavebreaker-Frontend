import createClient from "openapi-fetch";
import type { paths } from "$lib/api/wavebreaker";

export const client = createClient<paths>({ baseUrl: "http://localhost:1338/api/" });