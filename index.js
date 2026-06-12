// @ts-check

/** @import { RepeatFunctionCallTimer, _RepeatFunctionCallTimer } from './types.d.ts' */

let passedTime=0;

/** @type { RepeatFunctionCallTimer }
 */
export const repeatFunctionCallTimer=function(functionToCall,expectedValue,timeout,interval,whenInterval=undefined){
  if(passedTime===0){
    const myPrefix='repeatFunctionCallTimer: ';
    if(arguments.length<4) throw TypeError(`${myPrefix}not enough arguments`);
    if(arguments.length>5) throw TypeError(`${myPrefix}too many arguments`);
    if(typeof functionToCall !== 'function') throw TypeError(`${myPrefix}first parameter must be a function`);
    (function checkFuncReturnsPromise(){
      const mySample=functionToCall();
      if(!mySample) return;
      if(!mySample.constructor) return;
      if(!mySample.constructor.name) return;
      if(mySample.constructor.name==='Promise') throw TypeError(`${myPrefix}Function to call must not return a Promise - Promises do not work well with timers`);
    })();
    if(typeof timeout!=='number') throw TypeError(`${myPrefix}timeout must be a number`);
    if(typeof interval!=='number') throw TypeError(`${myPrefix}interval must be a number`);
    if(!(interval<timeout)) throw TypeError(`${myPrefix}interval must be smaller than timeout (given: interval ${interval}, timeout ${timeout})`);
    if(typeof whenInterval !== 'undefined' && typeof whenInterval !== 'function') throw TypeError(`${myPrefix} whenInterval must be a function`);
  }
  return new Promise((resolve)=>{
    /** @type { _RepeatFunctionCallTimer }
     */
    const _repeatFunctionCallTimer=function(functionToCall,expectedValue,timeout,interval,whenInterval=undefined){
      if(passedTime>=timeout){
        resolve({match:false,passed:passedTime});
        passedTime=0;
        return false;
      }
      if(functionToCall()===expectedValue){
        resolve({match:true,passed:passedTime});
        passedTime=0;
        return true;
      }
      if(whenInterval) whenInterval(passedTime);
      passedTime+=interval;
      setTimeout(()=>_repeatFunctionCallTimer(functionToCall,expectedValue,timeout,interval,whenInterval),interval);
    }
    _repeatFunctionCallTimer(functionToCall,expectedValue,timeout,interval,whenInterval);
  })
}
