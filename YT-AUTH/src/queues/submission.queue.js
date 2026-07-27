// src/queues/submission.queue.js  (rename from judge.queue.js, or just fix the string inside it)
import { Queue } from "bullmq";
import connection from "../config/redis.js";

export const submissionQueue = new Queue("submission-queue", { connection });