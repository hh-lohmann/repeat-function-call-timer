// @ts-check

import { assert, suite, test } from 'node-test-bootstrap';

import { repeatFunctionCallTimer } from '../index.js';


// repeatFunctionCallTimer()
// repeatFunctionCallTimer(()=>{},'',1000,100,'')

suite('Fail on invalid arguments',()=>{
  suite('Number of arguments',()=>{
    test('Not enough arguments',()=>{
      assert.throws(
        // @ts-ignore
        ()=>repeatFunctionCallTimer(()=>{},'',200),
        /repeatFunctionCallTimer: not enough/
      )
    });
    test('Too many arguments',()=>{
      assert.throws(
        // @ts-ignore
        ()=>repeatFunctionCallTimer(()=>{},'',200,100,()=>{},'xyz'),
        /repeatFunctionCallTimer: too many/
      )
    });
  });
  suite('functionToCall',()=>{
    test('Function to call is not a function',()=>{
      assert.throws(
        // @ts-ignore
        ()=>repeatFunctionCallTimer('()=>{}','',1000,100),
        /repeatFunctionCallTimer:/
      )
    });
    test('Function to call returns a Promise',()=>{
      assert.throws(
        // @ts-ignore
        ()=>repeatFunctionCallTimer(()=>new Promise(()=>{}),'',1000,100),
        /repeatFunctionCallTimer:/
      )
    });
  });
  test('expectedValue is not a primitive value except Symbol',()=>{
    assert.throws(
      // @ts-ignore
      ()=>repeatFunctionCallTimer(()=>{},[],1000,100),
      /repeatFunctionCallTimer:/
    );
  })
  test('Timeout is not a number',()=>{
    assert.throws(
      // @ts-ignore
      ()=>repeatFunctionCallTimer(()=>{},'','1000',100),
      /repeatFunctionCallTimer:/
    )
  });
  suite('interval',()=>{
    test('Interval is not a number',()=>{
      assert.throws(
        // @ts-ignore
        ()=>repeatFunctionCallTimer(()=>{},'',1000,'100'),
        /repeatFunctionCallTimer:/
      )
    });
    test('Interval is equal to timeout',()=>{
      assert.throws(
        ()=>repeatFunctionCallTimer(()=>{},'',100,100),
        /repeatFunctionCallTimer:/
      )
    });
    test('Interval is greater than timeout',()=>{
      assert.throws(
        ()=>repeatFunctionCallTimer(()=>{},'',100,1000),
        /repeatFunctionCallTimer:/
      )
    });
  });
  test('whenInterval is not a function',()=>{
    assert.throws(
      // @ts-ignore
      ()=>repeatFunctionCallTimer(()=>{},'',1000,100,''),
      /repeatFunctionCallTimer:/
    )
  });
});
