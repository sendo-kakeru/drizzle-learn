import type { HttpResponseBody } from "@repo/shared/request";
import type { TypedResponse } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export type HttpRespondReturn<T = null> = Response &
	TypedResponse<HttpResponseBody<T>, ContentfulStatusCode, "json">;
