###### npm package

# Repeat function-call timer

Repeat or retry a function call until it returns a specific value or a timeout is reached.

Possibly also helpful for awaiting the resolution of an asynchronous function / Promise when a "real" [await](#mdn-await) is not possible (see also [Caveats](#caveats)).

*[hh lohmann &lt;hh.lohmann@gmail.com&gt;](mailto:hh.lohmann@gmail.com?subject=repeat-function-call-timer)*

<!--????
  Switch to Pages version for better UI
  - Styles are respected in Pages view, but ignored in repo, so this is only visible in repo view
  - Delete if irrelevant
-->
<p align="center" aria-description="Hint on GitHub repo view to switch to GitHub Pages view" style="display:none;">
  <b><i>This page may be displayed less optimal in repo view - you may switch to <a href="https://hh-lohmann.github.io/repeat-function-call-timer/">the GitHub Pages view</a> instead</i></b>
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
  * Not possible: Promises or functions returning a promise: promises are hard to time (see [Caveats](#caveats))

### expectedValue
Value to compare with return of **[functionToCall](#functiontocall)** to exit repetition
  * Use an intentionally unmatchable value to exit on **[timeout](#timeout)** only

### timeout
Timespan in milliseconds to repeat **[functionToCall](#functiontocall)** to match **[expectedValue](#expectedvalue)** before giving up
  * Use no or an intentionally unmatchable return of **[functionToCall](#functiontocall)** or an intentionally unmatchable value to exit on **[timeout](#timeout)** only

### interval
Timespan in milliseconds to wait before next repetition

### whenInterval
optional: Callback on start of new **[interval](#interval)**
  * passing `(passedTime)`
  * Note: Does not allow to manipulate active parameters


## Returns

  * [Promise](#mdn-using-promises) that resolves to an object with properties "match" and passedTime" => see [Examples](#examples)


## Examples

* Log current time's seconds while doing something else
  ```js
    repeatFunctionCallTimer( ()=>console.log(new Date().getSeconds()), '', 3000, 1000 );
    // ... meanhwile something else ...
  ```

* Log current time's seconds before doing something else
  ```js
    await repeatFunctionCallTimer( ()=>console.log(new Date().getSeconds()), '', 3000, 1000 );
    // ... afterwards something else ...
  ```

* Do something only if e.g. another asynchronous process set a value
  ```js
    function checkIfValueSetByAnotherAsynchronousProcess(){
      // ... code ...
      if(valueToBeSetByAnotherProcess) return true;
      return false;
    }
    const res = await repeatFunctionCallTimer( checkIfValueSetByAnotherAsynchronousProcess, true, 2000, 100 )
    if(res.match){ // ... something only if value was set in given time }
  ```

* Do different things depending if another asynchronous process set a value

  ```js
    function checkIfValueSetByAnotherAsynchronousProcess(){
      // ... code ...
      if(valueToBeSetByAnotherProcess) return true;
      return false;
    }
    const res = await repeatFunctionCallTimer( checkIfValueSetByAnotherAsynchronousProcess, true, 2000, 100 )
    .then(res=>{
      if(res.match){ // ... something only if value was set in given time }
      else{ // ... something if value was no set in given time }
    })
  ```

* See also [Demos](#demos)


## Demos

<!--???? Interactive use case(s) for exposed function(s) / executable(s) -->

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

* **Be aware that timers in JavaScript are not exact**, depending e.g. on the current [Call stack](#mdn-call-stack). They are reliable for "normal" checking and ordering, but not for high precision orchestration which is clearly not the scope here. 

* The **[functionToCall](#functiontocall)** can not be an asynchronous function / Promise or a function returning  an asynchronous function / Promise since this would obviously collide with the synchronous nature of intervals and timeouts. Of course this does not mean that you can not wait for an output of an asynchronous function / Promise.


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

  * Implemented as a [recursion](#mdn-recursion) of [setTimeout](#mdn-settimeout) calls that is terminated by **[timeout](#timeout)** or matching **[expectedValue](#expectedvalue)**


## References

##### MDN: await
  * [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

##### MDN: Call Stack
  * [https://developer.mozilla.org/en-US/docs/Glossary/Call_stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack)

##### MDN: Recursion
  * [https://developer.mozilla.org/en-US/docs/Glossary/Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)

##### MDN: setTimeout
  * [https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)

##### MDN: thenables
  * [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#thenables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#thenables)

##### MDN: Using promises
  * [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

##### MDN: Working with asynchronous functions
  * [https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#working_with_asynchronous_functions](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#working_with_asynchronous_functions)
