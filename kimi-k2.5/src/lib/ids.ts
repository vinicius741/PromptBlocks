/**
 * ID generation utilities for PromptBlocks
 */

const ID_LENGTH = 12;
const ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a random ID string
 */
export function generateId(): string {
  let result = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    result += ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS.length));
  }
  return result;
}

/**
 * Generate a timestamp-based ID with random suffix
 */
export function generateTimestampId(): string {
  const timestamp = Date.now().toString(36);
  const random = generateId().slice(0, 6);
  return `${timestamp}-${random}`;
}