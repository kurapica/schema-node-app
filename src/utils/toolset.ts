import { _L, type ILocaleString } from "./locale"

/**
 * format string
 */
export function sformat(template: string | ILocaleString, ...args: any[]) {
  return `${_L(template)}`.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== 'undefined' ? _L(args[index]) : match;
  });
}