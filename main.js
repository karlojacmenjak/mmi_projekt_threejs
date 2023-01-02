
// #region core

import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { GUI } from './libs/lil-gui.module.min.js';
import { CSS2DRenderer, CSS2DObject } from './libs/CSS2DRenderer.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}, false);

const controls = new OrbitControls(camera, labelRenderer.domElement);
const gui = new GUI({title: 'Postavke'});
const clock = new THREE.Clock();

// #endregion

// #region Cylinder

class Cylinder {

    constructor() {
        
    }

    init() {

        this.group = new THREE.Group();

        // ....

        this.guiElements = [];
        
    }

    update(dt) {
        
    }

    onShowWireframe() {
        
    }

    onShowNormal() {
        
    }

    onShowTexture() {
        
    }

    cleanUp() {
        scene.remove(this.group);
        for(let i = 0; i < this.guiElements.length; i++) this.guiElements[i].destroy();
    }

}


// #endregion

// #region Cone

class Cone {

    constructor() {
        //Neka promjena
    }

    init() {

        this.group = new THREE.Group();

        // ....

        this.guiElements = [];
        
    }

    update(dt) {
        
    }

    onShowWireframe() {
        
    }

    onShowNormal() {
        
    }

    onShowTexture() {
        
    }

    cleanUp() {
        scene.remove(this.group);
        for(let i = 0; i < this.guiElements.length; i++) this.guiElements[i].destroy();
    }

}

// #endregion

// #region Sphere

class Sphere {

    constructor() {
        // NEKA PROMJENA
    }

    init() {

        this.group = new THREE.Group();

        this.geometry = new THREE.SphereGeometry(1, 10, 10);

        this.material = new THREE.MeshLambertMaterial({
            color: 0xFF00FF,
        });

        this.object = new THREE.Mesh(this.geometry, this.material);

        this.light = new THREE.DirectionalLight(0xffffff, 1.2);
        this.light.position.set(5, 0, 5);

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF);

        this.group.add(this.light);
        this.group.add(this.object);
        this.group.add(this.ambientLight);
        scene.add(this.group);
        
        this.args = {
            rotate: false,
            rotationSpeed: 1,
        };

        this.guiElements = [];
        this.guiElements.push(gui.add(this.object.position, 'x', -5, 5, 0.1));
        this.guiElements.push(gui.add(this.object.position, 'y', -5, 5, 0.1));
        this.guiElements.push(gui.add(this.object.position, 'z', -5, 5, 0.1));
        this.guiElements.push(gui.add(this.args, 'rotate').name('rotiraj'));
        this.guiElements.push(gui.add(this.args, 'rotationSpeed').name('brzina'));
        
    }

    update(dt) {
        controls.target.set(this.object.position.x, this.object.position.y, this.object.position.z);
        if(this.args.rotate) {
            this.object.rotation.y += this.args.rotationSpeed * dt;
            this.object.rotation.z += this.args.rotationSpeed * dt;
        }
    }

    onShowWireframe() {
        this.material.wireframe = true;
        this.ambientLight.intensity = 1;
    }

    onShowNormal() {
        this.material.wireframe = false;
        this.ambientLight.intensity = 0.08;
    }

    onShowTexture() {
        this.material.wireframe = false;
        this.ambientLight.intensity = 0.08;
       
    }

    cleanUp() {
        scene.remove(this.group);
        for(let i = 0; i < this.guiElements.length; i++) this.guiElements[i].destroy();
    }

}

// #endregion

// #region init

let scenes = [];
let currentScene = 0;
let displayMode = 0;
let showAxes = true;

class UiController {

    constructor() {
        
        this.sceneButtons = [];
        this.displayModeButtons = [];

        this.sceneButtons.push(document.querySelector('#btn-cylinder'));
        this.sceneButtons.push(document.querySelector('#btn-cone'));
        this.sceneButtons.push(document.querySelector('#btn-sphere'));
        this.sceneButtons.push(document.querySelector('#btn-earth'));

        for(let i = 0; i < this.sceneButtons.length; i++) {
            this.sceneButtons[i].addEventListener('click', (e) => {
                if(i == currentScene) return;
                scenes[currentScene].cleanUp();
                currentScene = i;
                displayMode = 0;
                scenes[currentScene].init();
                this.updateSceneControls();
                this.updateDisplayMode();
            });
        }

        this.displayModeButtons.push(document.querySelector('#btn-mode-wireframe'));
        this.displayModeButtons.push(document.querySelector('#btn-mode-surface'));
        this.displayModeButtons.push(document.querySelector('#btn-mode-texture'));

        for(let i = 0; i < this.displayModeButtons.length; i++) {
            this.displayModeButtons[i].addEventListener('click', (e) => {
                if(currentScene == 3) return;
                displayMode = i;
                this.updateSceneControls();
                this.updateDisplayMode();
            });
        }



        this.showAxesBtn = document.querySelector('#btn-axes');
        this.showAxesBtn.addEventListener('click', (e) => {
            showAxes = !showAxes;
            this.updateAxes();
        });

        document.querySelector('#btn-fs').addEventListener('click', (e) => {
            document.body.requestFullscreen();
        });

    }

    updateSceneControls() {

        for(let i = 0; i < this.sceneButtons.length; i++) {
            if(currentScene == i) this.sceneButtons[i].classList.add('selected');
            else this.sceneButtons[i].classList.remove('selected');
        }

        if(currentScene != 3) {
            for(let i = 0; i < this.displayModeButtons.length; i++) {
                this.displayModeButtons[i].style.display = 'block';
                if(displayMode == i) this.displayModeButtons[i].classList.add('selected');
                else this.displayModeButtons[i].classList.remove('selected');
            }
        }else{
            for(let i = 0; i < this.displayModeButtons.length; i++) {
                this.displayModeButtons[i].style.display = 'none';
            }
        }

    }

    updateDisplayMode() {
        switch(displayMode) {
            case 0: scenes[currentScene].onShowWireframe(); break;
            case 1: scenes[currentScene].onShowNormal(); break;
            case 2: scenes[currentScene].onShowTexture(); break;
        }
    }

    updateAxes() {
        if(showAxes) this.showAxesBtn.classList.add('selected');
        else this.showAxesBtn.classList.remove('selected');
        axesGroup.visible = showAxes;
        axesGroup.traverse((e) => {
            if(e.name == 'label') e.visible = showAxes;
        });
    }

}

const axesGroup = new THREE.Group();
const ui = new UiController();

function addLine(group, color, points) {
    const material = new THREE.LineBasicMaterial({color: color});
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    group.add(line);
}

function addLabel(group, data) {

    const div = document.createElement('div');
    div.className = 'label';
    div.style.color = data.color;
    div.textContent = data.text;

    const label = new CSS2DObject(div);
    label.position.set(data.pos.x, data.pos.y, data.pos.z);
    label.name = 'label';
    label.visible = false;
    group.add(label);

}

function addAxes(group, len = 4) {

    addLine(group, 0xFF0000, [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(len, 0, 0)
    ]);

    addLabel(group, {
        color: 'white',
        text: 'X',
        pos: new THREE.Vector3(len, 0, 0)
    });

    addLine(group, 0x00FF00, [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, len, 0)
    ]);

    addLabel(group, {
        color: 'white',
        text: 'Y',
        pos: new THREE.Vector3(0, len, 0)
    });

    addLine(group, 0x0000FF, [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, len)
    ]);

    addLabel(group, {
        color: 'white',
        text: 'Z',
        pos: new THREE.Vector3(0, 0, len)
    });

}

function init() {

    scenes.push(new Cylinder());
    scenes.push(new Cone());
    scenes.push(new Sphere());
    scenes.push(new Sphere());

    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    addAxes(axesGroup);
    scene.add(axesGroup);

    const args = {
        initCamera: () => {
            camera.position.set(5, 5, 5);
            camera.lookAt(0, 0, 0);
        }
    };

    gui.add(args, 'initCamera').name('Postavi kameru');

    scenes[currentScene].init();

    ui.updateDisplayMode();
    ui.updateSceneControls();
    ui.updateAxes();

}

function animate() {

    requestAnimationFrame(animate);

    
    scenes[currentScene].update(clock.getDelta());
    controls.update();

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);

};

init();
animate();

// #endregion
