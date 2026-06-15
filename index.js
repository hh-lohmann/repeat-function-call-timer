// @ts-check

/** @import { _ChkArgsRepeatFunctionCallTimer, RepeatFunctionCallTimer, _RepeatFunctionCallTimer } from './types.d.ts' */

/** @type { _ChkArgsRepeatFunctionCallTimer }
 */
 const _chkArgsRepeatFunctionCallTimer=function(functionToCall,expectedValue,timeout,interval,whenInterval=undefined){
  const myPrefix='repeatFunctionCallTimer: ';
  if(arguments.length<4) throw TypeError(`${myPrefix}not enough arguments`);
  if(arguments.length>5) throw TypeError(`${myPrefix}too many arguments`);
  if(typeof functionToCall !== 'function') throw TypeError(`${myPrefix}first parameter must be a function`);
  (function _checkFuncReturnsPromise(){
    const mySample=functionToCall();
    if(!mySample) return;
    if(!mySample.constructor) return;
    if(!mySample.constructor.name) return;
    if(mySample.constructor.name!=='Promise') return;
    throw TypeError(`${myPrefix}functionToCall must not return a Promise - Promises do not work well with timers`);
  })();
  (function _checkExpectedValueIsPrimitive(){
    if(expectedValue===null) return;
    const myTypes=['bigint','boolean','number','string','undefined'];
    if(myTypes.includes(typeof expectedValue)) return;
    throw TypeError(`${myPrefix}expectedValue can only be null or of type ${myTypes.join(' / ')}`);
  })()
  if(typeof timeout!=='number') throw TypeError(`${myPrefix}timeout must be a number`);
  if(typeof interval!=='number') throw TypeError(`${myPrefix}interval must be a number`);
  if(!(interval<timeout)) throw TypeError(`${myPrefix}interval must be smaller than timeout (given: interval ${interval}, timeout ${timeout})`);
  if(typeof whenInterval !== 'undefined' && typeof whenInterval !== 'function') throw TypeError(`${myPrefix} whenInterval must be a function`);
}

let _passedTime=0;

/** @type { RepeatFunctionCallTimer }
 */
export const repeatFunctionCallTimer=function(functionToCall,expectedValue,timeout,interval,whenInterval=undefined){
  if(_passedTime===0) _chkArgsRepeatFunctionCallTimer(...arguments);
  return new Promise((resolve)=>{
    /** @type { _RepeatFunctionCallTimer }
     */
    const _repeatFunctionCallTimer=function(_functionToCall,_expectedValue,_timeout,_interval,_whenInterval=undefined){
      if(_passedTime>=_timeout){
        resolve({match:false,passedTime:_passedTime});
        _passedTime=0;
        return false;
      }
      if(_functionToCall()===_expectedValue){
        resolve({match:true,passedTime:_passedTime});
        _passedTime=0;
        return true;
      }
      if(_whenInterval) _whenInterval(_passedTime);
      _passedTime+=_interval;
      setTimeout(()=>_repeatFunctionCallTimer(_functionToCall,_expectedValue,_timeout,_interval,_whenInterval),_interval);
    }
    _repeatFunctionCallTimer(functionToCall,expectedValue,timeout,interval,whenInterval);
  })
}
