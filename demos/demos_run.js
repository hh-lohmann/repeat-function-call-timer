// @ts-check

/** type { string } */
import * as demos from './demos_list.js';

/** @type {(elem:Element,without:string)=>string} */
const getClassNameWithout = function(elem,without=''){
  const myExp=new RegExp(' *'+without+' *');
  return elem.className.replace(myExp,'').trim();
}

/** Disable buttons while one demo is running
 *  - I.e. make running demo exclusive
 *  - As a function of its own to act as callback
 * @param disable - disable: true or false
 * @param callingEl - Element that called function: to adapt tooltip
 * @type {(disable:boolean,callingEl:Element)=>any}
 */
const buttonsDisable = function(disable,callingEl){
  document.querySelectorAll('button').forEach((value)=>{
    value.disabled=disable;
    if(disable){
      let another=' another ';
      if(value==callingEl){
        another=' ';
      }
      value.style.cursor='wait';
      value.title=`Disabled while${another}demo is running`;
    }
    else{
      value.style.cursor='unset';
      value.title='';
    }
  });
  return true;
}

/** @type {(elem:Element,demo:string)=>void} */
const createDemo = function(elem,demo){
  const outputAreaId=demo+'Output';
  const elemOutputArea=createDemoOutput(outputAreaId);
  elem.replaceChildren(elemOutputArea,createDemoButtonStart(demo,elemOutputArea),createDemoButtonCode(demo));
}

/** @type {(demo:string)=>Element} */
const createDemoButtonCode = function(demo){
  const myEl=document.createElement('button');
  myEl.innerText='See Code';
  myEl.onclick=()=>document.location.href='./'+demo+'.js';
  return myEl;
}

/** @type {(demo:string,outputArea:Element)=>Element} */
const createDemoButtonStart = function(demo,outputArea){
  const myEl=document.createElement('button');
  myEl.innerText='Start Demo';
  myEl.onclick=()=>{
    buttonsDisable(true,myEl);
    // @ts-ignore
    demos[demo](outputArea,(res)=>buttonsDisable(false,myEl));
  }
  return myEl;
}

/** @type {(id:string)=>Element} */
const createDemoOutput = function(id){
  const myEl=document.createElement('div');
  const myPlaceholder=document.createElement('span');
  myPlaceholder.className='placeholder';
  myPlaceholder.innerText='Demo output goes here';
  myEl.appendChild(myPlaceholder);
  return myEl;
}

const hydrateDemosPage = function(){
  document.querySelectorAll('.demos>.group')
  .forEach((value)=>{
    const groupName=getClassNameWithout(value,'group');
    document.querySelectorAll('.'+groupName+'>.variant')
    .forEach((value)=>{
      const variantName=getClassNameWithout(value,'variant');
      const demoName=groupName+variantName.charAt(0).toUpperCase()+variantName.slice(1);
      const demoArea=document.querySelector('.'+groupName+'>.'+variantName+'>.demo');
      if(!demoArea) return;
      if(!Object.keys(demos).includes(demoName)){
        demoArea.innerHTML='demo not found';
        return;
      }
      createDemo(demoArea,demoName);
    })
  })
}

hydrateDemosPage();
