import './style.css';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import Stats from 'three/addons/libs/stats.module.js';

//import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/controls/OrbitControls.js';
//import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
// import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#parker"), antialias: true});
const loader = new GLTFLoader();
loader.load('PSP.glb', function(glb) {
    /*if( glb.scene.children == 'Hemi_001') {
        const hemi = glb.scene.children;
    }
    if(glb.scene.children == 'Hemi') {
        const hemi2 = glb.scene.children;
    }
    if(glb.scene.children == '_root') {
        const groot = glb.scene.children;
    }*/
    glb.scene.scale.set(5,5,5);
    scene.add(glb.scene);
    renderer.render(scene, camera);
}, undefined, function(error) {
    console.error(error);
});

//console.log(hemi, hemi2, groot);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2,2,5);
scene.add(light);
const lightAbove = new THREE.DirectionalLight(0xffffff, 1);
lightAbove.position.set(0,10,0);
scene.add(lightAbove);
const lightBelow = new THREE.HemisphereLight(0x040404,0xffffff, 1);
scene.add(lightBelow);
const finalLight = new THREE.DirectionalLight(0x040404, 1);
finalLight.position.set(3,0,-40);
scene.add(finalLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

camera.position.setZ(30);
camera.position.setX(0);
camera.position.setY(0);
renderer.render(scene, camera);
/*
let angle = 0;
let radius = 10;*/
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
/*screw three js react supremacy*/
let text = 'WISPR'
function animate() {
    requestAnimationFrame(animate);
    /*camera.position.x=radius*Math.cos(angle);
    camera.position.y=radius*Math.sin(angle);
    angle+=0.01*/
    controls.update();
    renderer.render(scene,camera);
}
animate();
