/**
 * @interface IDatabaseConnector
 */
export interface IDatabaseConnector {
  connect(url?: string): void;
  disconnect(): void;
}
