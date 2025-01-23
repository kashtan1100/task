import{x as j,r as E,aj as d,s as g,N as P,ak as $,a7 as C,A as F}from"./index-BhM-hwZ3.js";function A(e,t=_("injectSelf")){const{provides:n}=t;if(n&&e in n)return n[e]}function _(e,t){const n=F();if(!n)throw new Error(`[Bvn] ${e} must be called from inside a setup function`);return n}const O=(e="")=>e.replace(/[^a-z]/gi,"-").replace(/\B([A-Z])/g,"-$1").toLowerCase(),w=e=>e!==null&&typeof e=="object"&&!Array.isArray(e);function y(e={},t={},n){const r={};for(const s in e)r[s]=e[s];for(const s in t){const c=e[s],u=t[s];if(w(c)&&w(u)){r[s]=y(c,u);continue}r[s]=u}return r}const B=(e,t)=>{var n,r;return typeof((n=e.props)==null?void 0:n[t])<"u"||typeof((r=e.props)==null?void 0:r[O(t)])<"u"};function S(e={},t){const n=j(d,E({})),r=_("useDefaults");if(t=t??r.type.name??r.type.__name,!t)throw new Error("[Bvn] Could not determine component name");const s=g(()=>{var o;return(o=n.value)==null?void 0:o[e._as??t]}),c=new Proxy(e,{get(o,a){var p,h,v,m;const f=Reflect.get(o,a);return a==="class"||a==="style"?[(p=s.value)==null?void 0:p[a],f].filter(D=>D!=null):typeof a=="string"&&!B(r.vnode,a)?((h=s.value)==null?void 0:h[a])??((m=(v=n.value)==null?void 0:v.global)==null?void 0:m[a])??f:f}}),u=P();$(()=>{if(s.value){const o=Object.entries(s.value).filter(([a])=>a.startsWith(a[0].toUpperCase()));u.value=o.length?Object.fromEntries(o):void 0}else u.value=void 0});function b(){const o=A(d,r);C(d,g(()=>u.value?y((o==null?void 0:o.value)??{},u.value):o==null?void 0:o.value))}return{props:c,provideSubDefaults:b}}function U(e,t){const{props:n,provideSubDefaults:r}=S(e,t);return r(),n}var T=Object.defineProperty,x=(e,t,n)=>t in e?T(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,l=(e,t,n)=>x(e,typeof t!="symbol"?t+"":t,n);class i{constructor(t,n={}){if(l(this,"cancelable",!0),l(this,"componentId",null),l(this,"_defaultPrevented",!1),l(this,"eventType",""),l(this,"nativeEvent",null),l(this,"_preventDefault"),l(this,"relatedTarget",null),l(this,"target",null),!t)throw new TypeError(`Failed to construct '${this.constructor.name}'. 1 argument required, ${arguments.length} given.`);Object.assign(this,i.Defaults,n,{eventType:t}),this._preventDefault=function(){this.cancelable&&(this.defaultPrevented=!0)}}get defaultPrevented(){return this._defaultPrevented}set defaultPrevented(t){this._defaultPrevented=t}get preventDefault(){return this._preventDefault}set preventDefault(t){this._preventDefault=t}static get Defaults(){return{cancelable:!0,componentId:null,eventType:"",nativeEvent:null,relatedTarget:null,target:null}}}class K extends i{constructor(t,n={}){super(t,n),l(this,"trigger",null),Object.assign(this,i.Defaults,n,{eventType:t})}static get Defaults(){return{...super.Defaults,trigger:null}}}const N=(e=[])=>{const{activeElement:t}=document;return t&&!(e!=null&&e.some(n=>n===t))?t:null},R=e=>((e==null?void 0:e())??[]).length===0,k=async e=>{const t=await fetch(`https://jsonplaceholder.typicode.com/${e}`);if(!t.ok)throw new Error(`Failed to fetch ${e}`);return t.json()},q=async()=>{const e=await fetch("https://jsonplaceholder.typicode.com/users");if(!e.ok)throw new Error("Failed to fetch users");return e.json()},z=async e=>{const t=await fetch(`https://jsonplaceholder.typicode.com/posts/${e}/comments`);if(!t.ok)throw new Error(`Failed to fetch comments for post ${e}`);return t.json()},L=async()=>{try{const e=await fetch("https://jsonplaceholder.typicode.com/todos");if(!e.ok)throw new Error("Failed to fetch todos");return await e.json()}catch(e){throw console.error("An error occurred while fetching todos:",e),e}};export{K as B,q as a,z as b,L as c,i as d,k as f,N as g,R as i,U as u};
