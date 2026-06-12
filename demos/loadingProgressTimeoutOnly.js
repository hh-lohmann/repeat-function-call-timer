// @ts-check

import { repeatFunctionCallTimer } from '../index.js';

/** Show growing string of defined symbol for defined duration
 *  - E.g. as activity indicator
 *  - For demonstrating functionality, not for direct application
 * @example loadingProgressTimeoutOnly(document.getElementById('myOutput'))
 * @param targetEl - Existing DOM element to output to
 * @param [onEnd] - Optional: Callback getting (false,passedTime) as following step, default: none
 * @param [stepSymbol] - Optional: Symbol to show for passed step, default: '\u25A0' (black filled square)
 * @param [duration] - Optional: Timespan in milliseconds to run, default: 5000
 * @param [stepLength] - Optional: Timespan in milliseconds for step, default: 100
 * @returns no return
 * @type {(targetEl:Element,onEnd?:Function,stepSymbol?:string,duration?:number,stepLength?:number)=>void }
 */
export const loadingProgressTimeoutOnly = function(targetEl,onEnd=()=>{},stepSymbol='\u25A0',duration=3000,stepLength=100){
  const myLoadingProgress=document.createElement('span');
  myLoadingProgress.innerText=stepSymbol;
  const myFunc = function(){
    myLoadingProgress.innerText+=stepSymbol;
  }
  const myAsync=repeatFunctionCallTimer(myFunc,'',duration,stepLength);
  targetEl.innerHTML=`Asynchronous output = together with start of progress bar at ${new Date().toLocaleTimeString()}<br>`;
  targetEl.appendChild(myLoadingProgress);
  myAsync
  .then(res=>{
    targetEl.innerHTML+=`<br>Synchronous output = after progress bar finished at ${new Date().toLocaleTimeString()}`;
    return res;
  })
  if(onEnd){myAsync.then(res=>onEnd(res));}
}
