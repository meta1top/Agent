/** biome-ignore-all lint/suspicious/noExplicitAny: bullmq job type */
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";

import { AGENT_TASK_NAME, APP_TASK_QUEUE_NAME } from "@meta-1/agent-shared";
import { AgentService } from "../service";

@Processor(APP_TASK_QUEUE_NAME, {
  concurrency: 5, // 允许同时处理5个任务
})
export class AgentProcessor extends WorkerHost {
  private readonly logger = new Logger(AgentProcessor.name);

  constructor(private readonly agentService: AgentService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const currentAttempt = job.attemptsMade + 1;
    const maxAttempts = job.opts.attempts ?? 1;
    this.logger.log(`[START] Processing job ${job.id} (${job.name}), attempt ${currentAttempt}/${maxAttempts}`);

    if (job.name === AGENT_TASK_NAME) {
      this.logger.log(job.data);
      const { sessionId, message } = job.data;
      this.agentService.streamToRedis(sessionId, message);

      this.logger.log(`[END] Job ${job.id} processing completed`);
    }
  }

  @OnWorkerEvent("completed")
  async onCompleted(job: Job<any, any, string>) {
    if (job.name === AGENT_TASK_NAME) {
      const totalAttempts = job.attemptsMade;

      this.logger.log(`Job ${job.id} completed after ${totalAttempts} attempt${totalAttempts > 1 ? "s" : ""}`);
    }
  }

  @OnWorkerEvent("failed")
  async onFailed(job: Job<any, any, string>, error: Error) {
    if (job.name === AGENT_TASK_NAME) {
      const maxAttempts = job.opts.attempts ?? 1;
      const currentAttempt = job.attemptsMade;
      const isFinalFailure = currentAttempt >= maxAttempts;

      if (isFinalFailure) {
        this.logger.error(
          `Job ${job.id} finally failed after ${currentAttempt} attempt${currentAttempt > 1 ? "s" : ""} (max ${maxAttempts}) - 错误: ${error.message}`,
        );
      } else {
        // 非最终失败,保持"处理中"状态,等待重试
        this.logger.warn(`Job ${job.id} failed on attempt ${currentAttempt}/${maxAttempts} - 错误: ${error.message}`);
      }
    }
  }
}
