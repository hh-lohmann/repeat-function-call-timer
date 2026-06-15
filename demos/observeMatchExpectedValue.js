// @ts-check

import { repeatFunctionCallTimer } from '../index.js';

/** Observe process that matches expected value
 *  - ! Demo to *match* an expected value
 *    - cf. observeMissExpectedValue.js = Demo to *miss* an expected value
 *  - For demonstrating functionality, not for direct application
 * @example observeMatchExpectedValue(document.getElementById('myOutput'))
 * @param targetEl - Existing DOM element to output to
 * @param [onEnd] - Optional: Callback getting (false,passedTime) as following step, default: none
 * @param [duration] - Optional: Timespan in milliseconds to run, default: 5000
 * @param [stepLength] - Optional: Timespan in milliseconds for step, default: 100
 * @returns no return
 * @type {(targetEl:Element,onEnd?:Function,duration?:number,stepLength?:number)=>void }
 */
export const observeMatchExpectedValue = function(targetEl,onEnd=()=>{},duration=3000,stepLength=100){
  const myCurrentState=document.createElement('span');
  myCurrentState.innerText='0';

  /** @type {boolean|undefined} */
  let observedProcessFulfilled=undefined;
  const observedProcess = function(){
    setTimeout(()=>observedProcessFulfilled=true,1200);
  }
  const observerFunction = function(){
    if(observedProcessFulfilled) {
      myCurrentState.innerText=`Process finished.`;
      return true;
    }
    myCurrentState.innerText=`Process running ...`;
    return false;
  }

  targetEl.innerHTML=`<b>Waiting for process to fulfill</b><br>`;
  observedProcess();
  const myAsync=repeatFunctionCallTimer(observerFunction,true,duration,stepLength);
  targetEl.innerHTML+=`Asynchronous output = together with start of observed process at ${new Date().toLocaleTimeString()}<br>`;
  targetEl.appendChild(myCurrentState);
  myAsync
  .then(res=>{
    targetEl.innerHTML+=`<br>Synchronous output = after observing finished at ${new Date().toLocaleTimeString()}`;
    return res;
  })
  myAsync.then(res=>{
    const myResult=res.match?'fulfilled':'did not fulfill before timeout';
    targetEl.innerHTML+=`<br><b>Process ${myResult} after ${res.passedTime} milliseconds</b> (note that timing in JavaScript may not be exact)`;
    return res;
  });
  if(onEnd){myAsync.then(res=>onEnd(res));}
}
