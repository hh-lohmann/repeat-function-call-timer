###### npm package

# Repeat function-call timer

Repeat or retry a function call until it returns a specific value or a timeout is reached.

Created for handling / observing intermediate or final states of asynchronous processes (see [Details](#details)), but also helpful for other things (see [Examples](#examples)).

*[hh lohmann &lt;hh.lohmann@gmail.com&gt;](mailto:hh.lohmann@gmail.com?subject=repeat-function-call-timer)*


<!-- see https://hh-lohmann.github.io/github-readme-pages-switch -->
<p align="center" id="github_readme_pages_switch" style="display:none;">
  <b><i>This page may be displayed more optimal in its
  <a href="https://hh-lohmann.github.io/repeat-function-call-timer/">GitHub Pages view</a>
  </i></b>
</p>


## Synopsis

```js
  import { repeatFunctionCallTimer } from 'repeat-function-call-timer'

  repeatFunctionCallTimer( functionToCall, expectedValue, timeout, interval )

  await repeatFunctionCallTimer( functionToCall, expectedValue, timeout, interval )

  const res = await repeatFunctionCallTimer( functionToCall, expectedValue, timeout, interval )
  if(res.match) ...

  repeatFunctionCallTimer( functionToCall, expectedValue, timeout, interval )
  .then(res=>{
    if(res.match){ ... }
    else{ ... }
  })

  repeatFunctionCallTimer( functionToCall, expectedValue, timeout, interval, whenInterval )
```


## Parameters

### functionToCall
Function to repeat
  * Returning a target value that allows matching **[expectedValue](#expectedvalue)** to exit repetition
    * Use no or an intentionally unmatchable return to exit on **[timeout](#timeout)** only
  * Intentionally left to be defined in detail by individual use cases to gain maximum flexibility
  * Intentionally no parameters
    * Parameters may introduce complexity that might not be easy to control
    * You may use **[whenInterval](#wheninterval)** to manipulate an external environment at runtime to be listened to by **functionToCall**
  * Can not be an asynchronous function / Promise or a function returning an asynchronous function / Promise since it runs synchronously to points in time resulting from defined **[interval](#interval)**, but is intended to be usable as an observer for asynchronous functions / Promises (see [Details](#details) / [Examples](#examples))

### expectedValue
Value to compare with return of **[functionToCall](#functiontocall)** to exit repetition
  * Can only be a [Primitive Type](#mdn-primitive-types-javascript) (except Symbol), i.e. *null* or of type *bigint* / *boolean* / *number* / *string* / *undefined*
    * For working with Arrays, Errors, Functions, Objects, Maps or RegExps you would use a wrapper **[functionToCall](#functiontocall)** with an own comparison method returning true or false
  * Use an intentionally unmatchable value to exit on **[timeout](#timeout)** only

### timeout
Timespan in milliseconds to repeat **[functionToCall](#functiontocall)** to match **[expectedValue](#expectedvalue)** before giving up
  * Use no or an intentionally unmatchable return of **[functionToCall](#functiontocall)** or an intentionally unmatchable value to exit on **[timeout](#timeout)** only

### interval
Timespan in milliseconds to wait before next repetition

### whenInterval
optional: Callback on start of new **[interval](#interval)**
  * Hook for injecting actions
  * Parameter: `passedTime`: The time passed since start. May be used for analyses.
  * Note: Does not allow to manipulate internal parameters at runtime, but you may manipulate an external environment to be listened to by **[functionToCall](#functiontocall)**


## Returns

  * [Promise](#mdn-using-promises) that resolves to an object with properties "match" and passedTime" => see [Examples](#examples)


## Examples

### As observer

* Do something only if an observed process set a value
  ```js
    function observerFunction(){
      // ... code to check if observed value has been set by observed process ...
      if(observedValueHasBeenSet) return true;
      return false;
    }
    const res = await repeatFunctionCallTimer( observerFunction, true, 2000, 100 )
    if(res.match){ // ... something only if value was set in given time }
  ```

* Do different things depending if another asynchronous process set a value
  ```js
    function observerFunction(){
      // ... code to check if observed value has been set by observed process ...
      if(observedValueHasBeenSet) return true;
      return false;
    }
    repeatFunctionCallTimer( observerFunction, true, 2000, 100 )
    .then(res=>{
      if(res.match){ // ... something only if value was set in given time }
      else{ // ... something if value was no set in given time }
    })
  ```

* Tracking an observed process that sets trackable values
  ```js
    function observerFunction(){
      // ... code to check current values set by observed process ...
      if(observedValue==='reading') return console.log('Reading data...');
      if(observedValue==='processing') return console.log('Processing data...');
      if(observedValue==='writing') return console.log('Writing data...');
      if(observedValue==='fail') return 'finished';
      if(observedValue==='success') return 'finished';
      return 'unknown';
    }
    const res = await repeatFunctionCallTimer( observerFunction, 'finished', 2000, 100 )
    .then(res=>{
      if(res.match){ console.log(`Process XY finished - see XY's own output for details`) }
      else{ console.log(`Process XY did not finish in expected time`) }
    })
  ```


### For plain repetition

* Log current time's seconds while doing something else
  ```js
    repeatFunctionCallTimer( ()=>console.log(new Date().getSeconds()), '', 3000, 1000 );
    // ... meanwhile something else ...
  ```

* Log current time's seconds before doing something else
  ```js
    await repeatFunctionCallTimer( ()=>console.log(new Date().getSeconds()), '', 3000, 1000 );
    // ... afterwards something else ...
  ```


## Demos

<!-- ! HTML demo: dev vs. release switch
  * GitHub repo view does not render HTML, so a GitHub Pages view is linked
    * NB: GitHub Pages allows to maintain a single instance of the HTML demo file in the repo
  * In dev a GitHub Pages view would require a Pages build for any change to check instead of live reloading, so JavaScript is utilized here to detect a dev environment and reroute the link to the local repo instance
    * NB: JavaScript is stripped off in GitHub repo view
    * "dev environment" is defined by using "localhost" or a numerical ID as hostname
      * NB RegEx: `.replace( /\d/g, '' ).replaceAll( '.', '' )` instead of `location.hostname.replace( /[\d\.]/g, '' )` to avoid `[]` which may mislead Markdown parsers to read it as link syntax
  * Unfortunately GitHub repo view displays "<script>" tags and their contents as literal content (for security), so the JavaScript here has to be pressed into an "onclick"
-->
See <a aria-description="Release vs. Dev switch = GitHub Pages vs. local file" href="https://hh-lohmann.github.io/repeat-function-call-timer/demos/" onclick="if( location.hostname.replace( /\d/g, '' ).replaceAll( '.', '' ) === '' || location.hostname === 'localhost' ){ this.href='./demos/'; alert( 'Dev environment detected - switching to local version' ); }">demos</a><span style="display:none;"> on GitHub Pages for this repo</span>


## Caveats

* **Be aware that timers in JavaScript are not exact**, depending e.g. on the current [Call stack](#mdn-call-stack). They are reliable for "normal" checking and ordering, but not for high precision orchestration which is clearly not the scope here

* The **[functionToCall](#functiontocall)** itself can not be an asynchronous function / Promise or a function returning an asynchronous function / Promise since it runs synchronously to points in time resulting from defined **[interval](#interval)**, but is intended to be usable as an observer for asynchronous functions / Promises (see [Examples](#examples))


## Installation


Pick for your preferred package manager:

```shell
  npm i repeat-function-call-timer
```

```shell
  pnpm i repeat-function-call-timer
```

```shell
  bun i repeat-function-call-timer
```

```shell
  # For Yarn you should double check docs for your and / or
  # current Yarn version, newer versions do not treat `i package_name`
  # as an alias for `add ...` and exclude global installations
  yarn add repeat-function-call-timer
```


## Details

  * Created primarily for handling / observing intermediate or final states of asynchronous processes, especially when there is no [resolving](#mdn-resolve) to be handled with [await](#mdn-await) or [.then()](#mdn-thenables), but the possibility to write to a variable that can be observed by a simple **[functionToCall](#functiontocall)**. If `then()` / `await` is available, the defined **[timeout](#timeout)** can intercept if a `then()` / `await` that would set the observed variable takes too long. Using separatetly started processes communicating via an observed variable instead of e.g. one process starting another process for observing it should guarantee simplicity, flexibility and robustness.
   
  * Besides observing other processes (see above) also usable for plain repetition of an arbitrary function until an arbitrary [expectedValue](#expectedvalue) is matched

  * Intentionally no parameter for "number of tries" / "maximum number of tries": Such parameters are dangerous without a timeout, otherwise you might wait forever (or until a system timeout) for a try without an answer, but you can always model a number of e.g. 10 tries by setting **[timeout](#timeout)** as the 10th of **[interval](#interval)**

  * Implemented as a [recursion](#mdn-recursion) of [setTimeout](#mdn-settimeout) calls that is terminated by **[timeout](#timeout)** or matching **[expectedValue](#expectedvalue)**


## References

##### MDN: await
  * <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await>

##### MDN: Call Stack
  * <https://developer.mozilla.org/en-US/docs/Glossary/Call_stack>

##### MDN: Primitive Types (JavaScript)
  * <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures#primitive_values>

##### MDN: Recursion
  * <https://developer.mozilla.org/en-US/docs/Glossary/Recursion>

##### MDN: resolve
  * <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve>

##### MDN: setTimeout
  * <https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout>

##### MDN: thenables
  * <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#thenables>

##### MDN: Using promises
  * <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises>

##### MDN: Working with asynchronous functions
  * <https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#working_with_asynchronous_functions>
