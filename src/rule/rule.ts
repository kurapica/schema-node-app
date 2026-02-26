export abstract class Rule {
  /**
   * The node type
   */
  type: string = "";

  /**
   * The default value
   */
  default?: any;

  /**
   * Invisible
   */
  invisible?: boolean;

  /**
   * Disable the node
   */
  disable?: boolean;

  /**
   * Validation failed
   */
  error?: boolean;

  /**
   * The display text
   */
  display?: string;

  /**
   * The description of the node
   */
  desc?: string;

  /**
   * Already actived
   */
  _actived?: boolean;

  /**
   * The active pushes
   */
  _activePushes?: (() => void)[];
}
