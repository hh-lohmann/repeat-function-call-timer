// @ts-check

import { repeatFunctionCallTimer } from '../index.js';

/** Count from 0 to n for defined duration
 *  - E.g. as visualized timer
 *  - For demonstrating functionality, not for direct application
 * @example counterTimeoutOnly(document.getElementById('myOutput'))
 * @param targetEl - Existing DOM element to output to
 * @param [onEnd] - Optional: Callback getting (false,passedTime) as following step, default: none
 * @param [duration] - Optional: Timespan in milliseconds to run, default: 5000
 * @param [stepLength] - Optional: Timespan in milliseconds for step, default: 100
 * @returns no return
 * @type {(targetEl:Element,onEnd?:Function,duration?:number,stepLength?:number)=>void }
 */
export const counterTimeoutOnly = function(targetEl,onEnd=()=>{},duration=3000,stepLength=100){
  const myCounter=document.createElement('span');
  myCounter.innerText='0';
  const myFunc = function(){
    myCounter.innerText=(parseInt(myCounter.innerText)+1).toString();
  }
  const myAsync=repeatFunctionCallTimer(myFunc,'',duration,stepLength);
  targetEl.innerHTML=`Asynchronous output = together with start of progress bar at ${new Date().toLocaleTimeString()}<br>`;
  targetEl.appendChild(myCounter);
  myAsync
  .then(res=>{
    targetEl.innerHTML+=`<br>Synchronous output = after progress bar finished at ${new Date().toLocaleTimeString()}`;
    return res;
  })
  if(onEnd){myAsync.then(res=>onEnd(res));}
}
