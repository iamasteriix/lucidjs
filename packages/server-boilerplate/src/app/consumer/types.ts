import type { Request } from "express";


export type ReqQueryVerifyToken = Request<{}, {}, {}, { token: string; }>;
