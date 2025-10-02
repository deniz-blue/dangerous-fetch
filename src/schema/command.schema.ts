import { z } from "zod";

export const ReferrerPolicy = z.enum([
    "",
    "no-referrer",
    "no-referrer-when-downgrade",
    "origin",
    "origin-when-cross-origin",
    "same-origin",
    "strict-origin",
    "strict-origin-when-cross-origin",
    "unsafe-url",
]);

export const HeadersInit = z.union([
    z.tuple([z.string(), z.string()]).array(),
    z.record(z.string(), z.string()),
]);

export const ExtensionFetchRequestData = z.object({
    id: z.string().nullish(),
    url: z.string(),
    method: z.string().optional(),
    headers: HeadersInit.optional(),
    referrer: z.string().optional(),
    referrerPolicy: ReferrerPolicy.optional(),
});

export type ExtensionResponseData = z.infer<typeof ExtensionResponseData>;
export const ExtensionResponseData = z.object({
    id: z.string(),
    url: z.string(),
    ok: z.boolean(),
    redirected: z.boolean(),
    status: z.number(),
    statusText: z.string(),
    headers: z.record(z.string(), z.string()),
    type: z.enum([
        "default",
        "basic",
        "cors",
        "error",
        "opaque",
        "opaqueredirect",
    ]),
    body: z.number().array().optional(),
});

export const ExtensionMessage = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("request"),
        data: ExtensionFetchRequestData,
    }),
    z.object({
        type: z.literal("abort"),
        data: z.object({
            id: z.string(),
            reason: z.any().optional(),
        }),
    }),
    z.object({
        type: z.literal("error"),
        data: z.discriminatedUnion("kind", [
            z.object({
                id: z.string(),
                kind: z.literal("DOMException"),
                name: z.string(),
                message: z.string(),
            }),
            z.object({
                id: z.string(),
                kind: z.literal("TypeError"),
                message: z.string(),
            }),
            z.object({
                id: z.string(),
                kind: z.literal("unknown"),
                message: z.string(),
            }),
        ]),
    }),
    z.object({
        type: z.literal("response"),
        data: ExtensionResponseData,
    }),
]);
