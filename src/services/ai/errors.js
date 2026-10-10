export class AiServiceError extends Error {
  /** @param {string} message @param {{code?: 'network'|'rate_limited'|'invalid_input'|'model_unavailable'|'unknown', retryable?: boolean}} [opts] */
  constructor(message, { code = 'unknown', retryable = true } = {}) {
    super(message);
    this.name = 'AiServiceError';
    this.code = code;
    this.retryable = retryable;
  }
}
