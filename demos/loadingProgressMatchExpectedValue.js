// @ts-check

import { repeatFunctionCallTimer } from '../index.js';

/** Count from 0 to n for defined duration
 *  - ! Demo to *match* an expected value
 *    - cf. loadingProgressMissExpectedValue.js = Demo to *miss* an expected value
 *  - For demonstrating functionality, not for direct application
 * @example loadingProgressMatchExpectedValue(document.getElementById('myOutput'))
 * @param targetEl - Existing DOM element to output to
 * @param [onEnd] - Optional: Callback getting (false,passedTime) as following step, default: none
 * @param [stepSymbol] - Optional: Symbol to show for passed step, default: '\u25A0' (black filled square)
 * @param [duration] - Optional: Timespan in milliseconds to run, default: 5000
 * @param [stepLength] - Optional: Timespan in milliseconds for step, default: 100
 * @returns no return
 * @type {(targetEl:Element,onEnd?:Function,stepSymbol?:string,duration?:number,stepLength?:number)=>void }
 */
export const loadingProgressMatchExpectedValue = function(targetEl,onEnd=()=>{},stepSymbol='\u25A0',duration=3000,stepLength=100){
  const myLoadingProgress=document.createElement('span');
  myLoadingProgress.innerText=stepSymbol;
  const myFunc = function(){
    myTimePassed+=stepLength;
    if((myTimeAtStart+myTimePassed)>=(myTimeAtStart+myTimeToRun)) return true;
    myLoadingProgress.innerText+=stepSymbol;
  }
  const myTimeAtStart=new Date().valueOf();
  let myTimePassed=0;
  const myTimeToRun=2000;
  targetEl.innerHTML=`<b>Expectation: time has moved by ${myTimeToRun/1000} seconds</b><br>`;
  const myAsync=repeatFunctionCallTimer(myFunc,true,duration,stepLength);
  targetEl.innerHTML+=`Asynchronous output = together with start of progress bar at ${new Date().toLocaleTimeString()}<br>`;
  targetEl.appendChild(myLoadingProgress);
  myAsync
  .then(res=>{
    targetEl.innerHTML+=`<br>Synchronous output = after progress bar finished at ${new Date().toLocaleTimeString()}`;
    return res;
  })
  myAsync.then(res=>{
    const myResult=res.match?'matched':'did not match before timeout';
    targetEl.innerHTML+=`<br><b>Expectation ${myResult} after ${res.passed} milliseconds</b> (note that timing in JavaScript may not be exact)`;
    return res;
  });
  if(onEnd){myAsync.then(res=>onEnd(res));}
}
