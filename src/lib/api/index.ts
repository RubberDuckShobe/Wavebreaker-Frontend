import createClient from "openapi-fetch";
import type { paths } from "$lib/api/wavebreaker";

const client = createClient<paths>({ baseUrl: "https://wavebreaker.rs/api/" });
export default client;