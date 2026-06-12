/** Repeat or retry a function call until it returns a specific value or a timeout is reached
 *    - Optionally with specified callback functions for the two possible
 *      outcomes "return matched" and "timeout reached"
 * @example repeatFunctionCallTimer( ()=>crypto.randomUUID()[3], 'e', 5000,
 *            100, (state,passedTime)=>console.log(`UUID with pos 3 = "e"
 *            ${state} after ${passedTime}ms`), (state)=>console.log(`UUID
 *            tries ${state} after ${passedTime}ms`), (passedTime)=>console.log(`Next repetition after ${passedTime}ms ...`) );
 * @param functionToCall - Function to call - must not return a Promise (for timing)
 * @param timeout - Maximum timespan in milliseconds before giving up
 * @param interval - Timespan in milliseconds to wait before next repetition
 * @param [whenInterval] - optional: Callback on start of new interval
 *          - passing `(passedTime)`
 *          - Note: Does not allow to manipulate active parameters
 * @returns Promise resolving to an object "{match: true|false,passed: milliseconds passed}""
 */
export type RepeatFunctionCallTimer =
  (
    functionToCall:Function,
    expectedValue:any,
    timeout:number,
    interval:number,
    whenInterval?:Function
  )
  => Promise<{match:boolean,passed:number}>;
export const repeatFunctionCallTimer:RepeatFunctionCallTimer;

/** => Internal non-Promise version of {@link RepeatFunctionCallTimer}
 *  - For usage inside of Promise version
 *  - Differs only in return type (= exists only for Type checking ...)
 * @returns `false` on timeout reached, `true on return matched
 */
export type _RepeatFunctionCallTimer =
  (
    functionToCall:Function,
    expectedValue:any,
    timeout:number,
    interval:number,
    whenInterval?:Function
  )
  => boolean|void;
export const _repeatFunctionCallTimer:RepeatFunctionCallTimer;
