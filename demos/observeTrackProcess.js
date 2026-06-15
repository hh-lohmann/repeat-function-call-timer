// @ts-check

import { repeatFunctionCallTimer } from '../index.js';

/** Track process that sets progress values
 *  - For demonstrating functionality, not for direct application
 * @example observeTrackProcess(document.getElementById('myOutput'))
 * @param targetEl - Existing DOM element to output to
 * @param [onEnd] - Optional: Callback getting (false,passedTime) as following step, default: none
 * @param [duration] - Optional: Timespan in milliseconds to run, default: 5000
 * @param [stepLength] - Optional: Timespan in milliseconds for step, default: 100
 * @returns no return
 * @type {(targetEl:Element,onEnd?:Function,duration?:number,stepLength?:number)=>void }
 */
export const observeTrackProcess = function(targetEl,onEnd=()=>{},duration=3000,stepLength=100){
  const myCurrentState=document.createElement('span');
  myCurrentState.innerText='0';

  let observedProcessState='';
  const observedProcess = function(){
    setTimeout(()=>observedProcessState='reading',400);
    setTimeout(()=>observedProcessState='processing',1200);
    setTimeout(()=>observedProcessState='writing',2000);
    setTimeout(()=>observedProcessState='success',2800);
  }
  const observerFunction = function(){
    if(observedProcessState==='success') {
      myCurrentState.innerText='Finished';
      return 'finished';
    }
    let msg='';
    if(observedProcessState=='reading') msg='Reading data ...';
    if(observedProcessState=='processing') msg='Processing data ...';
    if(observedProcessState=='writing') msg='Writing data ...';
    myCurrentState.innerText=msg;
    return '';
  }

  targetEl.innerHTML=`<b>Waiting for process to fulfill</b><br>`;
  observedProcess();
  const myAsync=repeatFunctionCallTimer(observerFunction,'finished',duration,stepLength);
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
