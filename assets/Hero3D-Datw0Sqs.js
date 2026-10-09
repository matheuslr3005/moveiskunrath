import{c as e,f as t,g as n,l as r,n as i,p as a,t as o,y as s}from"./index-CxT0MfuO.js";import{A as c,F as l,I as u,N as d,P as f,_ as p,n as m,t as h,v as g,w as _,x as v,y}from"./SceneCanvas-DyR7zUO-.js";import{t as b}from"./Furniture-BcToUObI.js";var x=parseInt(`180`.replace(/\D+/g,``)),S=s(n()),C=class extends c{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${x>=154?`colorspace_fragment`:`encodings_fragment`}>
        }
      `})}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(e){this.uniforms.pixelRatio.value=e}},w=e=>e&&e.constructor===Float32Array,T=e=>[e.r,e.g,e.b],E=e=>e instanceof d||e instanceof f||e instanceof l,D=e=>Array.isArray(e)?e:E(e)?e.toArray():[e,e,e];function O(e,t,n){return S.useMemo(()=>{if(t!==void 0){if(w(t))return t;if(t instanceof v){let n=Array.from({length:e*3},()=>T(t)).flat();return Float32Array.from(n)}if(E(t)||Array.isArray(t)){let n=Array.from({length:e*3},()=>D(t)).flat();return Float32Array.from(n)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},n)},[t])}var k=S.forwardRef(({noise:e=1,count:t=100,speed:n=1,opacity:r=1,scale:i=1,size:a,color:o,children:s,...c},l)=>{S.useMemo(()=>p({SparklesImplMaterial:C}),[]);let d=S.useRef(null),f=y(e=>e.viewport.dpr),m=D(i),h=S.useMemo(()=>Float32Array.from(Array.from({length:t},()=>m.map(_.randFloatSpread)).flat()),[t,...m]),b=O(t,a,Math.random),x=O(t,r),T=O(t,n),E=O(t*3,e),k=O(o===void 0?t*3:t,w(o)?o:new v(o),()=>1);return g(e=>{d.current&&d.current.material&&(d.current.material.time=e.clock.elapsedTime)}),S.useImperativeHandle(l,()=>d.current,[]),S.createElement(`points`,u({key:`particle-${t}-${JSON.stringify(i)}`},c,{ref:d}),S.createElement(`bufferGeometry`,null,S.createElement(`bufferAttribute`,{attach:`attributes-position`,args:[h,3]}),S.createElement(`bufferAttribute`,{attach:`attributes-size`,args:[b,1]}),S.createElement(`bufferAttribute`,{attach:`attributes-opacity`,args:[x,1]}),S.createElement(`bufferAttribute`,{attach:`attributes-speed`,args:[T,1]}),S.createElement(`bufferAttribute`,{attach:`attributes-color`,args:[k,3]}),S.createElement(`bufferAttribute`,{attach:`attributes-noise`,args:[E,3]})),s||S.createElement(`sparklesImplMaterial`,{transparent:!0,pixelRatio:f,depthWrite:!1}))}),A=a(),j={kind:`cozinha`,widthCm:420,finish:`nogueira`,handle:`embutido`,led:!0},M=({reducedMotion:e})=>{let t=(0,S.useRef)(+!!e),n=(0,S.useMemo)(()=>new f,[]),r=(0,S.useMemo)(()=>new f,[]),{size:i}=y();return g((a,s)=>{t.current=o.opened?_.damp(t.current,1,1.1,s):0;let c=i.width/i.height,l=c<1.1?1+(1.1-c)*1.15:1,u=Math.min(window.scrollY/window.innerHeight,1),d=+!e,f=1-t.current;n.set((3.1+a.pointer.x*1.1*d+f*2.8)*l,1.75+a.pointer.y*.35*d+u*.4+f*.6,(6.7+u*1.6+f*3)*l),a.camera.position.lerp(n,1-Math.exp(-s*3.2)),r.set(.15,1.15+u*.15,.7),a.camera.lookAt(r)}),null},N=()=>{let e=(0,S.useRef)(0);return g(()=>{e.current+=1,e.current===10&&i(`scene`)}),null},P=()=>{let n=r(),i=t();return(0,A.jsxs)(h,{className:`absolute inset-0`,camera:{position:[6,2.3,10],fov:36},fallback:(0,A.jsx)(e,{}),signalReady:!0,label:`Cozinha sob medida em 3D. Clique nas portas e gavetas para abrir.`,children:[(0,A.jsx)(m,{}),(0,A.jsx)(b,{config:j,open:n}),!i&&(0,A.jsx)(k,{count:45,scale:[9,4,7],position:[0,2,1.5],size:2.2,speed:.25,opacity:.55,color:`#ffd98a`}),(0,A.jsx)(M,{reducedMotion:i}),(0,A.jsx)(N,{})]})};export{P as Hero3D};