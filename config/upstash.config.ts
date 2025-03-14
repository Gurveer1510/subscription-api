import { Client as WorkflowClient } from "@upstash/workflow";

export const workflowClient = new WorkflowClient({
    baseUrl: Bun.env.QSTASH_URL,
    token: Bun.env.QSTASH_TOKEN
})