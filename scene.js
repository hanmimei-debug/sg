import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {sections,allSeats,armEnds,pads,members,memberPositions} from './data.js?v=sg2';

const cream=0xf2e4d3;
function material(color,opts={}){return new THREE.MeshStandardMaterial({color,roughness:.75,...opts});}
function box(parent,x,y,z,w,h,d,mat){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);parent.add(o);return o;}
function sphere(parent,x,y,z,r,mat,sx=1,sy=1,sz=1){const o=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
function beam(parent,a,b,r,mat){const v=new THREE.Vector3().subVectors(b,a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),6),mat);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());parent.add(o);return o;}
const vec=(x,y,z)=>new THREE.Vector3(x,y,z);
function textureCanvas(width,height,draw){const c=document.createElement('canvas');c.width=width;c.height=height;draw(c.getContext('2d'),width,height);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function labelSprite(text,color='#e9d3ff',size=5){const map=textureCanvas(256,64,(c,w,h)=>{c.font='500 33px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(text,w/2,h/2);});const o=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,depthTest:false}));o.scale.set(size,size/4,1);return o;}
function buildFigure(info){
 const group=new THREE.Group(),skin=material(0xe9bfa8),outfit=material(cream),dark=material(0x211e26),hair=material(info.hair),silver=material(0xd4d2d7,{metalness:.85,roughness:.25}),tan=material(0xc0a080),shoe=material(0xeadfd1);
 const marble=textureCanvas(128,128,(ctx,w,h)=>{ctx.fillStyle='#f1e4d4';ctx.fillRect(0,0,w,h);for(let i=0;i<18;i++){const x=(Math.sin(i*83.1)*.5+.5)*w,y=(Math.cos(i*19.7)*.5+.5)*h;const g=ctx.createRadialGradient(x,y,0,x,y,9+i%10);g.addColorStop(0,'#b6947266');g.addColorStop(.35,'#d2b89933');g.addColorStop(1,'#eee4d800');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}});outfit.map=marble;
 // Warm ivory outfit, articulated silhouette and distinct accessories.
 const legL=box(group,-.135,.44,0,.22,.78,.25,outfit),legR=box(group,.135,.44,0,.22,.78,.25,outfit);legL.rotation.z=-.035;legR.rotation.z=.04;
 box(group,-.14,.065,.075,.25,.13,.42,shoe);box(group,.14,.065,.075,.25,.13,.42,shoe);
 const torso=box(group,0,1.06,0,.59,.65,.34,outfit);torso.rotation.z=-.025;
 sphere(group,0,1.57,.01,.245,skin,1,1.14,.95);
 sphere(group,0,1.71,-.035,.247,hair,1.03,.65,1.02);
 for(let i=0;i<7;i++){const o=sphere(group,(i-3)*.058,1.74-(i%3)*.03,.095,.075,hair,.85,1.5,.8);o.rotation.z=(i-3)*.18;}
 sphere(group,-.24,1.57,.015,.043,skin);sphere(group,.24,1.57,.015,.043,skin);
 sphere(group,-.085,1.59,.234,.016,dark);sphere(group,.085,1.59,.234,.016,dark);
 const mouth=box(group,0,1.48,.239,.066,.012,.01,tan);
 const sleeve=info.style==='sleeveless'?skin:outfit;
 const la=beam(group,vec(-.36,1.25,0),vec(-.40,.80,.09),.095,sleeve),ra=beam(group,vec(.35,1.25,0),vec(.43,.88,.12),.095,sleeve);
 sphere(group,-.405,.77,.1,.084,skin);sphere(group,.44,.85,.13,.084,skin);
 // V-shaped lapels, necklace and waist chain.
 beam(group,vec(-.15,1.35,.18),vec(0,1.04,.20),.028,silver);beam(group,vec(0,1.04,.20),vec(.15,1.35,.18),.028,silver);
 const chain=new THREE.Mesh(new THREE.TorusGeometry(.16,.013,5,16,Math.PI),silver);chain.rotation.z=Math.PI;chain.position.set(.11,.84,.18);group.add(chain);
 if(['suit','biker','sleeveless'].includes(info.style)){box(group,-.10,1.615,.239,.18,.082,.075,dark);box(group,.10,1.615,.239,.18,.082,.075,dark);box(group,0,1.61,.27,.055,.018,.02,silver);}
 if(info.style==='fur'){for(let i=0;i<26;i++){const a=i/26*Math.PI*2; sphere(group,Math.cos(a)*.32,1.05+Math.sin(a)*.30,Math.sin(i*7)*.13,.13,outfit,1,1.1,1);}sphere(group,.10,1.69,-.15,.14,hair,1,1.2,1);}
 if(info.style==='long'){box(group,-.22,.70,-.06,.20,.62,.35,outfit);box(group,.22,.70,-.06,.20,.62,.35,outfit);sphere(group,-.23,1.58,-.10,.13,hair,.75,1.7,1);sphere(group,.23,1.58,-.10,.13,hair,.75,1.7,1);}
 if(info.style==='biker'){box(group,0,1.07,.182,.16,.48,.014,dark);beam(group,vec(.21,1.30,.20),vec(-.06,.77,.20),.017,silver);}
 if(info.style==='silk'){box(group,0,1.30,.16,.13,.28,.05,outfit);}
 if(info.style==='jacket'){box(group,0,1.06,.19,.19,.46,.02,material(0x8e8b8c));}
 group.userData={leftArm:la,rightArm:ra,info};return group;
}

export class StadiumScene{
 constructor(container,{onSeat,onReady,onError}){
  this.container=container;this.onSeat=onSeat;this.mode='orbit';this.song='center';this.phase=0;this.focus=0;this.dream=true;this.confettiOn=true;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.selected=null;this.disposed=false;
  try{this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});}catch(e){onError(e);return;}
  const r=this.renderer;r.setPixelRatio(Math.min(devicePixelRatio,1.7));r.setClearColor(0x100a1d,0);r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.25;container.appendChild(r.domElement);
  this.scene=new THREE.Scene();this.scene.fog=new THREE.FogExp2(0x160d25,.0035);
  this.camera=new THREE.PerspectiveCamera(43,1,.1,650);this.camera.position.set(110,100,155);
  this.controls=new OrbitControls(this.camera,r.domElement);this.controls.target.set(0,2,0);this.controls.enableDamping=true;this.controls.dampingFactor=.08;this.controls.minDistance=5;this.controls.maxDistance=340;this.controls.maxPolarAngle=Math.PI*.48;this.controls.enablePan=false;
  this.scene.add(new THREE.HemisphereLight(0xbfb3e1,0x30213d,1.45));const key=new THREE.DirectionalLight(0xf4dfcf,2.6);key.position.set(12,55,45);this.scene.add(key);const purple=new THREE.DirectionalLight(0xa776ff,2.1);purple.position.set(-50,20,-35);this.scene.add(purple);
  this.buildGround();this.buildBowl();this.buildStage();this.buildPeople();this.buildAtmosphere();this.buildScreen();
  this.selectionGroup=new THREE.Group();this.scene.add(this.selectionGroup);const ring=new THREE.Mesh(new THREE.TorusGeometry(.9,.07,6,40),new THREE.MeshBasicMaterial({color:0xf0ccff}));ring.rotation.x=Math.PI/2;this.selectionGroup.add(ring);const stem=beam(this.selectionGroup,vec(0,.1,0),vec(0,4,0),.035,new THREE.MeshBasicMaterial({color:0xe8b6ff}));this.seatLabel=labelSprite('YOU','#f3dcff',4.5);this.seatLabel.position.y=4.7;this.selectionGroup.add(this.seatLabel);
  r.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onError(new Error('WebGL context lost'));});
  this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();let start=null;
  r.domElement.addEventListener('pointerdown',e=>start={x:e.clientX,y:e.clientY});r.domElement.addEventListener('pointerup',e=>{if(!start||Math.hypot(start.x-e.clientX,start.y-e.clientY)>5||this.mode==='seat')return;const rect=r.domElement.getBoundingClientRect();this.pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.raycaster.setFromCamera(this.pointer,this.camera);const hit=this.raycaster.intersectObject(this.seatMesh)[0];if(hit&&hit.instanceId!==undefined)this.onSeat(allSeats[hit.instanceId]);});
  container.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){e.preventDefault();if(e.key==='+'||e.key==='-')this.zoom(e.key==='+'?.86:1.16);else{const delta=e.key==='ArrowLeft'?.12:e.key==='ArrowRight'?-.12:0;const v=this.camera.position.clone().sub(this.controls.target);v.applyAxisAngle(vec(0,1,0),delta);if(e.key==='ArrowUp')v.y+=5;if(e.key==='ArrowDown')v.y-=5;this.camera.position.copy(this.controls.target).add(v);}}});
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);this.resize();this.setSong('center',0);this.animate= this.animate.bind(this);this.frame=requestAnimationFrame(this.animate);onReady();
 }
 buildGround(){
  const ground=new THREE.Mesh(new THREE.CircleGeometry(180,96),material(0x171120,{roughness:.95}));ground.rotation.x=-Math.PI/2;ground.position.y=-.16;this.scene.add(ground);
  const field=new THREE.Mesh(new THREE.CircleGeometry(1,96),material(0x22172d));field.rotation.x=-Math.PI/2;field.scale.set(58,40,1);field.position.y=-.1;this.scene.add(field);

 }
 buildBowl(){
  const seatGeo=new THREE.BoxGeometry(.40,.28,.34),seatMat=material(0x7a538a,{roughness:.8});this.seatMesh=new THREE.InstancedMesh(seatGeo,seatMat,allSeats.length);const dummy=new THREE.Object3D(),col=new THREE.Color();
  allSeats.forEach((s,i)=>{dummy.position.set(s.x,s.y+.31,s.z);dummy.rotation.set(0,Math.atan2(-s.x,-s.z),0);dummy.updateMatrix();this.seatMesh.setMatrixAt(i,dummy.matrix);col.set(s.sectionId.startsWith('floor:')?0x84609b:0x624273);col.multiplyScalar(.62+((i*37)%100)/170);this.seatMesh.setColorAt(i,col);});this.seatMesh.instanceMatrix.needsUpdate=true;this.scene.add(this.seatMesh);
  // Low-detail crowd instances preserve a sense of scale in seat views.
  const crowdCount=Math.ceil(allSeats.length/2),heads=new THREE.InstancedMesh(new THREE.SphereGeometry(.16,6,4),material(0x403246),crowdCount),bodies=new THREE.InstancedMesh(new THREE.BoxGeometry(.36,.52,.26),material(0x251d30),crowdCount);
  let ci=0;allSeats.forEach((s,i)=>{if(i%2)return;dummy.rotation.set(0,Math.atan2(-s.x,-s.z),0);dummy.position.set(s.x,s.y+.86,s.z);dummy.updateMatrix();bodies.setMatrixAt(ci,dummy.matrix);dummy.position.y=s.y+1.20;dummy.updateMatrix();heads.setMatrixAt(ci,dummy.matrix);col.set(i%13===0?0x9c818d:i%5===0?0x615269:0x34273e);heads.setColorAt(ci,col);ci++;});this.scene.add(heads,bodies);this.crowdHeads=heads;this.crowdBodies=bodies;
  const tierMat=material(0x36283f),aisleMat=new THREE.LineBasicMaterial({color:0x785987,transparent:true,opacity:.46});
  for(const s of sections){
   if(s.type==='floor'){const shape=new THREE.Shape();s.poly.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const m=new THREE.Mesh(new THREE.ShapeGeometry(shape),material(0x3c294e,{roughness:.9,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.y=.015;this.scene.add(m);continue;}
   // Narrow terrace strips follow each imported row, including irregular corners.
   const positions=[],indices=[];
   for(const row of s.rowSeats){if(row.length<2)continue;const sorted=[...row];for(let j=0;j<sorted.length-1;j++){const a=sorted[j],b=sorted[j+1];if(Math.hypot(a.x-b.x,a.z-b.z)>2.8)continue;const dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz)||1,ox=-dz/l*.29,oz=dx/l*.29,k=positions.length/3;positions.push(a.x-ox,a.y-.1,a.z-oz,b.x-ox,b.y-.1,b.z-oz,a.x+ox,a.y-.1,a.z+oz,b.x+ox,b.y-.1,b.z+oz);indices.push(k,k+1,k+2,k+2,k+1,k+3);}}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,tierMat);mesh.material.side=THREE.DoubleSide;this.scene.add(mesh);
  }
  // Singapore-inspired oval dome edge with an open western side.
  const roofmat=material(0x625271,{metalness:.5,roughness:.55}),roofPts=[];
  for(let i=0;i<=120;i++){const t=(-65+310*i/120)*Math.PI/180,x=108*Math.sin(t),z=-80*Math.cos(t);roofPts.push(vec(x,42,z));if(i%4===0){beam(this.scene,vec(x,39,z),vec(x*.83,49,z*.83),.09,roofmat);}}
  this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(roofPts),new THREE.LineBasicMaterial({color:0xc5a0df,transparent:true,opacity:.7})));
  for(const [text,x,z]of [['S',0,29],['N',0,-29],['W',-59,0],['E',59,0]]){const label=labelSprite(text,'#d8b4ef',5);label.position.set(x,1,z);this.scene.add(label);}
  for(const x of [-55,55])for(const z of [-6,6]){box(this.scene,x,1.1,z,3,2.2,5,material(0x151019));const label=labelSprite('FOH','#af91c0',3);label.position.set(x,3,z);this.scene.add(label);}

 }

 buildStage(){
  this.stage=new THREE.Group();this.scene.add(this.stage);const top=material(0x363041,{metalness:.35,roughness:.45}),edge=new THREE.MeshBasicMaterial({color:0xd3a3ff}),hot=new THREE.MeshBasicMaterial({color:0xffffff});
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(10,10,1.7,72),top);disc.position.y=1.05;this.stage.add(disc);
  for(const rad of [9.95,7.3]){const ring=new THREE.Mesh(new THREE.TorusGeometry(rad,.065,6,100),edge);ring.rotation.x=Math.PI/2;ring.position.y=1.93;this.stage.add(ring);}
  for(const [x,z]of armEnds){const length=Math.hypot(x,z),angle=Math.atan2(x,z);const runway=box(this.stage,x/2,1.05,z/2,3.2,1.7,length,top);runway.rotation.y=angle;for(const side of [-1,1]){const light=box(this.stage,x/2+Math.cos(angle)*1.63*side,1.96,z/2-Math.sin(angle)*1.63*side,.08,.09,length,edge);light.rotation.y=angle;}}
  for(const [x,z]of Object.values(pads)){const pad=box(this.stage,x,1.05,z,7,1.7,6.5,top);const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(7, .04,6.5)),new THREE.LineBasicMaterial({color:0xddb5ff}));outline.position.set(x,1.94,z);this.stage.add(outline);}
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const p1=vec(Math.sin(a)*2,1.925,Math.cos(a)*2),p2=vec(Math.sin(a)*7.2,1.925,Math.cos(a)*7.2);this.stage.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1,p2]),new THREE.LineBasicMaterial({color:0x806a91})));}
  const truss=material(0x655c74,{metalness:.65,roughness:.45});for(const x of [-31,31])for(const z of [-24,24]){
   for(const dx of [-.32,.32])for(const dz of [-.32,.32])beam(this.scene,vec(x+dx,0,z+dz),vec(x+dx,27,z+dz),.058,truss);
   for(let y=0;y<27;y+=1.4){beam(this.scene,vec(x-.32,y,z-.32),vec(x+.32,y+1.4,z-.32),.035,truss);beam(this.scene,vec(x+.32,y,z+.32),vec(x-.32,y+1.4,z+.32),.035,truss);beam(this.scene,vec(x-.32,y,z-.32),vec(x-.32,y+1.4,z+.32),.035,truss);}
   box(this.scene,x,27,z,1.3,.2,1.3,truss);
  }
  for(const z of [-24,24])beam(this.scene,vec(-31,26.5,z),vec(31,26.5,z),.12,truss);
  for(const x of [-31,31])beam(this.scene,vec(x,26.5,-24),vec(x,26.5,24),.12,truss);
  const shineMap=textureCanvas(64,64,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'#ffffff');g.addColorStop(.12,'#ddb5ff');g.addColorStop(.3,'#be73ff55');g.addColorStop(1,'#bb66ff00');c.fillStyle=g;c.fillRect(0,0,w,h);});
  for(let i=0;i<32;i++){const a=i/32*Math.PI*2,x=Math.cos(a)*10.5,z=Math.sin(a)*10.5;const bulb=sphere(this.scene,x,1.7,z,.13,hot);const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:shineMap,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));glow.position.set(x,1.7,z);glow.scale.set(2.4,2.4,1);this.scene.add(glow);}
  this.beams=new THREE.Group();this.scene.add(this.beams);const hazeMat=new THREE.ShaderMaterial({uniforms:{color:{value:new THREE.Color(0xb27dff)}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform vec3 color;varying vec2 vUv;void main(){float fade=pow(vUv.y,2.0)*0.035;gl_FragColor=vec4(color,fade);}',transparent:true,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2,x=Math.cos(a)*15,z=Math.sin(a)*15;const cone=new THREE.Mesh(new THREE.ConeGeometry(6,36,20,1,true),hazeMat);cone.position.set(x*1.6,18,z*1.6);cone.quaternion.setFromUnitVectors(vec(0,1,0),vec(-x*.7,-36,-z*.7).normalize());this.beams.add(cone);}
 }
 buildPeople(){this.figures={};this.halos={};this.names={};for(const info of members){const g=buildFigure(info);this.scene.add(g);this.figures[info.id]=g;const label=labelSprite(`${info.id}  ${info.name}`,info.color,3.3);label.position.y=2.7;g.add(label);this.names[info.id]=label;const halo=new THREE.Mesh(new THREE.RingGeometry(.70,.78,40),new THREE.MeshBasicMaterial({color:info.color,transparent:true,opacity:.9,side:THREE.DoubleSide}));halo.rotation.x=-Math.PI/2;halo.position.y=.02;g.add(halo);this.halos[info.id]=halo;}}
 buildAtmosphere(){
  const glows=[],colors=[],c=new THREE.Color();allSeats.forEach((s,i)=>{if(i%2===0){glows.push(s.x+Math.sin(i)*.12,s.y+1.2,s.z);c.set(i%11===0?0xf4c9ef:i%7===0?0xe4ddff:0x985aff);colors.push(c.r,c.g,c.b);}});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(glows,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  const glowMap=textureCanvas(32,32,(ctx,w,h)=>{const gr=ctx.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'#fff');gr.addColorStop(.22,'#fffd');gr.addColorStop(.45,'#fff4');gr.addColorStop(1,'#fff0');ctx.fillStyle=gr;ctx.fillRect(0,0,w,h);});
  this.ocean=new THREE.Points(g,new THREE.PointsMaterial({size:.46,map:glowMap,vertexColors:true,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));this.scene.add(this.ocean);
  const stars=[],starColors=[];for(let i=0;i<1300;i++){const rnd=n=>{const v=Math.sin((i+1)*n)*43758.5453;return v-Math.floor(v);};stars.push((rnd(12.9898)-.5)*280,18+rnd(78.233)*110,(rnd(45.133)-.5)*230);starColors.push(.7+rnd(7)*.3,.5+rnd(8)*.4,1);}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));sg.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));this.stars=new THREE.Points(sg,new THREE.PointsMaterial({size:.24,map:glowMap,vertexColors:true,transparent:true,opacity:.65,depthWrite:false}));this.scene.add(this.stars);
  const conf=[];for(let i=0;i<420;i++)conf.push(Math.sin(i*18.3)*65,5+(Math.sin(i*21.71)*.5+.5)*42,Math.cos(i*14.65)*42);const cg=new THREE.BufferGeometry();cg.setAttribute('position',new THREE.Float32BufferAttribute(conf,3));this.paper=new THREE.Points(cg,new THREE.PointsMaterial({color:0xf3d4ff,size:.18,transparent:true,opacity:.65,depthWrite:false}));this.scene.add(this.paper);
 }
 buildScreen(){
  const portraitScene=new THREE.Scene();portraitScene.background=new THREE.Color(0x211135);portraitScene.add(new THREE.HemisphereLight(0xffeee1,0x7b439c,3));const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(0,3,6);portraitScene.add(light);
  members.forEach((m,i)=>{const g=buildFigure(m);g.position.set((i-3)*1.28,-.70,0);g.scale.setScalar(1.55);g.rotation.y=(i-3)*-.05;portraitScene.add(g);});
  const cam=new THREE.OrthographicCamera(-5.4,5.4,1.45,-1.45,.1,30);cam.position.set(0,1,12);cam.lookAt(0,1,0);const target=new THREE.WebGLRenderTarget(1536,384);this.renderer.setRenderTarget(target);this.renderer.render(portraitScene,cam);this.renderer.setRenderTarget(null);this.screenTarget=target;
  const screenMat=new THREE.MeshBasicMaterial({map:target.texture,side:THREE.DoubleSide,toneMapped:false});const black=material(0x15101c);
  for(const z of [-24,24]){box(this.scene,0,21.7,z,62.5,9.5,.3,black);const screen=new THREE.Mesh(new THREE.PlaneGeometry(61.5,8.5),screenMat);screen.position.set(0,21.7,z+(z>0?.2:-.2));if(z<0)screen.rotation.y=Math.PI;this.scene.add(screen);}
  for(const x of [-31,31]){box(this.scene,x,21.7,0,.3,9.5,47.5,black);const screen=new THREE.Mesh(new THREE.PlaneGeometry(46.5,8.5),screenMat);screen.position.set(x+(x>0?.2:-.2),21.7,0);screen.rotation.y=x>0?Math.PI/2:-Math.PI/2;this.scene.add(screen);}
  const strip=new THREE.MeshBasicMaterial({color:0xe2b2ff});for(const z of [-24,24])box(this.scene,0,16.95,z,62.5,.08,.12,strip);for(const x of [-31,31])box(this.scene,x,16.95,0,.12,.08,48,strip);
 }
 resize(){if(!this.renderer)return;const {width,height}=this.container.getBoundingClientRect();this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();}
 setSeat(seat){this.selected=seat;if(!this.renderer)return;this.selectionGroup.position.set(seat.x,seat.y+.15,seat.z);this.selectionGroup.visible=this.mode!=='seat';if(this.mode==='seat')this.setMode('seat');}
 setSong(song,phase=0){this.song=song;this.phase=phase;if(!this.renderer)return;const positions=memberPositions(song,phase);for(const m of members){const p=positions[m.id],g=this.figures[m.id];g.position.set(p.x,p.y,p.z);g.rotation.y= p.quadrant==='center'?0:Math.atan2(p.x,p.z);this.names[m.id].visible=true;}this.updateFocus();}
 setFocus(id){this.focus=id;this.updateFocus();if(this.mode==='seat')this.setMode('seat');else if(id&&this.renderer){const p=this.figures[id].position;this.flyTo(vec(p.x+7,p.y+6,p.z+12),vec(p.x,p.y+1,p.z),false);}}
 updateFocus(){if(!this.renderer)return;for(const m of members){this.halos[m.id].material.opacity=this.focus&&this.focus!==m.id?.18:1;this.names[m.id].visible=this.focus===m.id;}}
 flyTo(position,target,locked=false){if(this.reduced){this.camera.position.copy(position);this.controls.target.copy(target);}else this.transition={from:this.camera.position.clone(),to:position,fromTarget:this.controls.target.clone(),toTarget:target,start:performance.now()};this.controls.enabled=!locked;}
 setMode(mode){this.mode=mode;if(!this.renderer)return;this.transition=null;this.camera.fov=mode==='seat'?62:43;this.camera.updateProjectionMatrix();this.controls.maxPolarAngle=mode==='seat'?Math.PI*.98:Math.PI*.49;this.controls.minDistance=mode==='seat'?.05:5;this.controls.maxDistance=mode==='seat'?1:340;this.controls.enableZoom=mode!=='seat';this.selectionGroup.visible=mode!=='seat';
  if(mode==='seat'&&this.selected){const s=this.selected,pos=vec(s.x,s.y+1.65,s.z);const focus=this.focus?this.figures[this.focus].position.clone().add(vec(0,1,0)):vec(0,3.5,0);const dir=focus.sub(pos).normalize();const target=pos.clone().add(dir.multiplyScalar(.2));this.transition=null;this.camera.position.copy(pos);this.controls.target.copy(target);this.controls.enabled=true;}
  else if(mode==='top'){this.flyTo(vec(0,225,.01),vec(0,0,0));}
  else{const narrow=this.container.clientWidth<950;this.flyTo(narrow?vec(100,110,165):vec(110,100,155),vec(0,2,0));}
 }
 zoom(factor){if(!this.renderer)return;if(this.mode==='seat'){this.camera.fov=THREE.MathUtils.clamp(this.camera.fov*factor,24,85);this.camera.updateProjectionMatrix();}else{const d=this.camera.position.clone().sub(this.controls.target).multiplyScalar(factor);d.clampLength(5,330);this.camera.position.copy(this.controls.target).add(d);}}
 setDream(value){this.dream=value;if(!this.renderer)return;this.beams.visible=value;this.ocean.material.opacity=value?.95:.33;this.stars.visible=value;this.renderer.toneMappingExposure=value?1.25:1.1;}
 setConfetti(value){this.confettiOn=value;if(this.paper)this.paper.visible=value;}
 capture(){return this.renderer?.domElement.toDataURL('image/png');}
 animate(now){if(this.disposed)return;this.frame=requestAnimationFrame(this.animate);if(document.hidden)return;if(this.transition){const t=Math.min(1,(now-this.transition.start)/1050),f=1-Math.pow(1-t,3);this.camera.position.lerpVectors(this.transition.from,this.transition.to,f);this.controls.target.lerpVectors(this.transition.fromTarget,this.transition.toTarget,f);if(t===1)this.transition=null;}
  this.controls.update();if(!this.reduced){if(this.confettiOn){const a=this.paper.geometry.attributes.position;for(let i=0;i<a.count;i++){let y=a.getY(i)-.018;if(y<2)y=46;a.setY(i,y);a.setX(i,a.getX(i)+Math.sin(now*.0004+i)*.007);}a.needsUpdate=true;}this.ocean.material.size=.43+Math.sin(now*.0006)*.035;for(const m of members){const g=this.figures[m.id];g.userData.leftArm.rotation.z+=Math.sin(now*.001+m.id)*.0005;}}
  this.renderer.render(this.scene,this.camera);
 }
 dispose(){this.disposed=true;cancelAnimationFrame(this.frame);this.resizeObserver?.disconnect();this.controls?.dispose();this.renderer?.dispose();}
}
