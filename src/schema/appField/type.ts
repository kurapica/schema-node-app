/** The application field schema */
export interface AppFieldSchema {
  /** The application name */
  app: string;

  /** The name of the field */
  name: string;

  /** The type of the field */
  type: string;

  /** The error message of the field */
  error?: string;
}
