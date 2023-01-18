
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

let input = {

    left: false,
    right: false,
    space: false,

    spacePressed: false,

    isSpacePressed: () => {
        if(input.space && !input.spacePressed) {
            input.spacePressed = true;
            return true;
        }
        return false;
    }

};

window.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'KeyA':
            input.left = true;
            break;
        case 'KeyD':
            input.right = true;
            break;
        case 'Space':
            input.space = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'KeyA':
            input.left = false;
            break;
        case 'KeyD':
            input.right = false;
            break;
        case 'Space':
            input.space = false;
            input.spacePressed = false;
            break;
    }
});

// #endregion

class DisplayMode {
    static wireframe = 0;
    static surface = 1;
    static texture = 2;
}

let options = {
    rotate: true,
    rotationSpeed: 1,
};

// #region Cylinder

class Cylinder {

    constructor() {

        let name = 'Wood052';

        this.textureMap1 = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_Color.jpg',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.set(4, 1);
            }
        );

        this.normalMap1 = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_NormalGL.jpg',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.set(4, 1);
            }
        );

        this.roughnessMap1 = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_Roughness.jpg',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.set(4, 1);
            }
        );

        this.textureMap2 = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_Color.jpg'
        );

        this.normalMap2 = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_NormalGL.jpg'
        );

        this.roughnessMap2 = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_Roughness.jpg'
        );
        
    }

    build(displayMode) {

        this.group = new THREE.Group();

        let radialSegments;
        let heightSegments;

        switch(displayMode) {
            case DisplayMode.texture:
                radialSegments = 64;
                heightSegments = 64;
                break;
            default:
                radialSegments = 32;
                heightSegments = 1;
                break;
        }

        this.geometry = new THREE.CylinderGeometry(0.8, 0.8, 2, radialSegments, heightSegments);

        const color = 0xff00ff;

        switch(displayMode) {
            case DisplayMode.wireframe:
                this.material = new THREE.MeshBasicMaterial({
                    color: color,
                    wireframe: true,
                });
                break;
            case DisplayMode.surface:
                this.material = new THREE.MeshLambertMaterial({
                    color: color,
                });
                break;
            case DisplayMode.texture:
                this.material = [
                    new THREE.MeshStandardMaterial({
                        map: this.textureMap1,
                        normalMap: this.normalMap1,
                        roughnessMap: this.roughnessMap1,
                        roughness: 0.5,
                    }),
                    new THREE.MeshStandardMaterial({
                        map: this.textureMap2,
                        normalMap: this.normalMap2,
                        roughnessMap: this.roughnessMap2,
                        roughness: 0.5,
                    }),
                    new THREE.MeshStandardMaterial({
                        map: this.textureMap2,
                        normalMap: this.normalMap2,
                        roughnessMap: this.roughnessMap2,
                        roughness: 0.5,
                    }),
                ];
                break;
        }
    
        this.object = new THREE.Mesh(this.geometry, this.material);
        this.object.position.set(0, 1, 0);

        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(1, 1, 1);

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);

        this.group.add(this.light);
        this.group.add(this.object);
        this.group.add(this.ambientLight);

        scene.add(this.group);
        
        this.guiElements = [];
        this.guiElements.push(gui.add(this.object.position, 'x', -5, 5, 0.1));
        this.guiElements.push(gui.add(this.object.position, 'y', -5, 5, 0.1));
        this.guiElements.push(gui.add(this.object.position, 'z', -5, 5, 0.1));
        this.guiElements.push(gui.add(options, 'rotate').name('Rotiraj'));
        this.guiElements.push(gui.add(options, 'rotationSpeed', -5, 5, 0.1).name('Brzina'));
        
    }

    update(dt) {
        controls.target.set(this.object.position.x, this.object.position.y, this.object.position.z);
        if(options.rotate) {
            this.object.rotation.y += options.rotationSpeed * dt;
            this.object.rotation.x += options.rotationSpeed * dt;
        }
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

        let name = 'Marble023';

        this.textureMap = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_Color.jpg'
        );

        this.normalMap = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_NormalGL.jpg'
        );

        this.roughnessMap = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_Roughness.jpg'
        );

    }

    build(displayMode) {

        this.group = new THREE.Group();

        let radialSegments;
        let heightSegments;
 
        switch(displayMode) {
            case DisplayMode.texture:
                radialSegments = 32;
                heightSegments = 32;
                break;
            default:
                radialSegments = 32;
                heightSegments = 1;
                break;
        }

        this.geometry = new THREE.ConeGeometry(1, 2, radialSegments, heightSegments);

        const color = 0xff00ff;

        switch(displayMode) {
            case DisplayMode.wireframe:
                this.material = new THREE.MeshBasicMaterial({
                    color: color,
                    wireframe: true,
                });
                break;
            case DisplayMode.surface:
                this.material = new THREE.MeshLambertMaterial({
                    color: color,
                });
                break;
            case DisplayMode.texture:
                this.material = new THREE.MeshStandardMaterial({
                    map: this.textureMap,
                    normalMap: this.normalMap,
                    roughnessMap: this.roughnessMap,
                    roughness: 0.5,
                });
                break;
        }
    
        this.object = new THREE.Mesh(this.geometry, this.material);
        this.object.position.set(0, 1, 0);

        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(1, 1, 1);

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.02);

        this.group.add(this.light);
        this.group.add(this.object);
        this.group.add(this.ambientLight);

        scene.add(this.group);
        
        this.guiElements = [];
        this.guiElements.push(gui.add(this.object.position, 'x', -5, 5, 0.1));
        this.guiElements.push(gui.add(this.object.position, 'y', -5, 5, 0.1));
        this.guiElements.push(gui.add(this.object.position, 'z', -5, 5, 0.1));
        this.guiElements.push(gui.add(options, 'rotate').name('Rotiraj'));
        this.guiElements.push(gui.add(options, 'rotationSpeed', -5, 5, 0.1).name('Brzina'));
        
        
    }

    update(dt) {
        controls.target.set(this.object.position.x, this.object.position.y, this.object.position.z);
        if(options.rotate) {
            this.object.rotation.x += options.rotationSpeed * dt;
            this.object.rotation.z += options.rotationSpeed * dt;
        }
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

        let name = 'Fabric057';

        this.textureMap = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_Color.jpg'
        );

        this.normalMap = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_NormalGL.jpg'
        );

        this.displacementMap = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_Displacement.jpg'
        );

        this.roughnessMap = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_Roughness.jpg'
        );

        this.aoMap = new THREE.TextureLoader().load(
            'assets/' + name + '_1K-JPG/' + name + '_1K_AmbientOcclusion.jpg'
        );

    }

    build(displayMode) {

        this.group = new THREE.Group();

        let segments;
        switch(displayMode) {
            case DisplayMode.wireframe:
                segments = 20; break;
            default:
                segments = 50; break;
        }

        this.geometry = new THREE.SphereGeometry(1, segments, segments);

        const color = 0x76ff03;

        switch(displayMode) {
            case DisplayMode.wireframe:
                this.material = new THREE.MeshBasicMaterial({
                    color: color,
                    wireframe: true,
                });
                break;
            case DisplayMode.surface:
                this.material = new THREE.MeshLambertMaterial({
                    color: color,
                });
                break;
            case DisplayMode.texture:
                this.material = new THREE.MeshStandardMaterial({
                    map: this.textureMap,
                    normalMap: this.normalMap,
                    displacementMap: this.displacementMap,
                    displacementScale: 0.02,
                    roughnessMap: this.roughnessMap,
                    roughness: 0.5,
                    aoMap: this.aoMap,
                });
                break;  
        }

        this.object = new THREE.Mesh(this.geometry, this.material);
        this.object.position.set(0, 1, 0);

        this.light = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.light.position.set(1, 1, 1);

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.02);

        this.group.add(this.object);
        this.group.add(this.light);
        this.group.add(this.ambientLight);

        scene.add(this.group);
        
        this.guiElements = [];
        this.guiElements.push(gui.add(this.object.position, 'x', -5, 5, 0.1));
        this.guiElements.push(gui.add(this.object.position, 'y', -5, 5, 0.1));
        this.guiElements.push(gui.add(this.object.position, 'z', -5, 5, 0.1));
        this.guiElements.push(gui.add(options, 'rotate').name('Rotiraj'));
        this.guiElements.push(gui.add(options, 'rotationSpeed', -5, 5, 0.1).name('Brzina'));
        
    }

    update(dt) {
        controls.target.set(this.object.position.x, this.object.position.y, this.object.position.z);
        if(options.rotate) {
            this.object.rotation.y += options.rotationSpeed * dt;
            this.object.rotation.z += options.rotationSpeed * dt;
        }
    }

    cleanUp() {
        scene.remove(this.group);
        for(let i = 0; i < this.guiElements.length; i++) this.guiElements[i].destroy();
    }

}

// #endregion

// #region Earth

function rad(deg) {
    return (deg / 180) * Math.PI;
}

class Earth {

    constructor() {

        this.textureMap = new THREE.TextureLoader().load(
            'assets/Earth/2k_earth_daymap.jpg'
        );

        this.normalMap = new THREE.TextureLoader().load(
            'assets/Earth/2k_earth_normal_map.png'
        );

        this.specularMap = new THREE.TextureLoader().load(
            'assets/Earth/2k_earth_specular_map.png'
        );

        this.mountHeight = 1.4;
        this.earthRadius = 2;
        this.carrierOffset = 0.3;
        this.carrierWidth = 0.2;

        this.carrierRadius1 = this.earthRadius + this.carrierOffset;
        this.carrierRadius2 = this.carrierRadius1 + this.carrierWidth;
        this.carrierRadius3 = 0.03;
        

        this.earthTilt = rad(-23.5);

        this.autoRotating = false;
        this.rotation = 2;
        
    }

    build(displayMode) {

        this.group = new THREE.Group();

        camera.position.set(7, 7, 7);
        controls.target.set(0, 3, 0);

        this.earth = new THREE.Mesh(
            new THREE.SphereGeometry(this.earthRadius, 50, 50),
            new THREE.MeshLambertMaterial({
                map: this.textureMap,
                normalMap: this.normalMap,
                specularMap: this.specularMap,
            })
        );
        this.earth.position.set(0, 0, 0);

        let mount = new THREE.Mesh(
            new THREE.CylinderGeometry(
                1, 2,
                this.mountHeight,
                24, 1,
            ),
            new THREE.MeshPhongMaterial({
                color: 0x424242,
                flatShading: true,
            }),
        );
        mount.position.set(0, this.mountHeight / 2, 0);


        let fullGlobe = new THREE.Group();
        let globe = new THREE.Group();

        this.buildGlobeCarrier(globe);

        globe.add(this.earth);
        globe.position.set(0, this.mountHeight + this.carrierRadius2 - 0.08, 0);
        globe.rotation.set(this.earthTilt, 0, 0);

        fullGlobe.add(mount);
        fullGlobe.add(globe);
        fullGlobe.rotation.set(0, rad(-45), 0);

        this.light = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.light.position.set(1, 1, 1);

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.04);

        this.group.add(this.light);
        this.group.add(fullGlobe);
        this.group.add(this.ambientLight);

        scene.add(this.group);

        this.guiElements = [];
        
    }

    buildGlobeCarrier(group) {

        let thetaStart = rad(-94);
        let thetaLength = rad(188);

        let material = new THREE.MeshPhongMaterial({
            color: 0x424242,
            side: THREE.DoubleSide,
        });

        let segments = 60;

        let c1 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.carrierRadius1, this.carrierRadius1,
                this.carrierWidth,
                segments, 1, true,
                thetaStart, thetaLength
            ),
            material
        );

        let c2 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.carrierRadius2, this.carrierRadius2,
                this.carrierWidth,
                segments, 1, true,
                thetaStart, thetaLength
            ),
            material,
        );

        let r1 = new THREE.Mesh(
            new THREE.RingGeometry(
                this.carrierRadius1,
                this.carrierRadius2,
                segments, 1,
                thetaStart, thetaLength
            ),
            material
        );

        let r2 = new THREE.Mesh(
            new THREE.RingGeometry(
                this.carrierRadius1,
                this.carrierRadius2,
                segments, 1,
                thetaStart, thetaLength
            ),
            material
        );

        let p1 = new THREE.Mesh(
            new THREE.PlaneGeometry(
                this.carrierWidth,
                this.carrierWidth,
            ),
            material,
        );

        let p2 = new THREE.Mesh(
            new THREE.PlaneGeometry(
                this.carrierWidth,
                this.carrierWidth,
            ),
            material,
        );

        let c3 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.carrierRadius3, this.carrierRadius3,
                this.carrierOffset,
                segments, 1,
            ),
            material,
        );

        let c4 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.carrierRadius3, this.carrierRadius3,
                this.carrierOffset,
                segments, 1,
            ),
            material,
        );

        

        c1.position.set(0, 0, 0);
        c1.rotation.set(0, rad(180), rad(90));
        
        c2.position.set(0, 0, 0);
        c2.rotation.set(0, rad(180), rad(90));

        r1.position.set(this.carrierWidth / 2, 0)
        r1.rotation.set(0, rad(90), 0);

        r2.position.set(-this.carrierWidth / 2, 0)
        r2.rotation.set(0, rad(90), 0);

        let cr = (this.carrierRadius2 + this.carrierRadius1) / 2;

        p1.position.set(0, 0 + cr * Math.sin(thetaStart), cr * -Math.cos(thetaStart));
        p1.rotation.set(Math.PI / 2 + thetaStart, 0, 0);

        p2.position.set(0, 0 + cr * Math.sin(thetaStart + thetaLength), cr * -Math.cos(thetaStart + thetaLength));
        p2.rotation.set(Math.PI / 2 + thetaStart + thetaLength, 0, 0);

        c3.position.set(0, 0 - this.carrierRadius1 + this.carrierOffset / 2, 0);
        c4.position.set(0, 0 + this.carrierRadius1 - this.carrierOffset / 2, 0);


        group.add(c1);
        group.add(c2);
        group.add(r1);
        group.add(r2);
        group.add(p1);
        group.add(p2);
        group.add(c3);
        group.add(c4);

    }

    update(dt) {

        if(input.isSpacePressed()) {
            this.autoRotating = !this.autoRotating;
        }

        if(this.autoRotating) {
            this.earth.rotation.y += this.rotation * dt;
        }else{
            if(input.left) this.earth.rotation.y -= this.rotation * dt;
            else if(input.right) this.earth.rotation.y += this.rotation * dt;
        }

        
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
let showAxes = false;

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
                scenes[currentScene].build(displayMode);
                this.updateSceneControls();
            });
        }

        this.displayModeButtons.push(document.querySelector('#btn-mode-wireframe'));
        this.displayModeButtons.push(document.querySelector('#btn-mode-surface'));
        this.displayModeButtons.push(document.querySelector('#btn-mode-texture'));

        for(let i = 0; i < this.displayModeButtons.length; i++) {
            this.displayModeButtons[i].addEventListener('click', (e) => {
                if(currentScene == 3) return;
                displayMode = i;
                scenes[currentScene].cleanUp();
                scenes[currentScene].build(displayMode);
                this.updateSceneControls();
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
    scenes.push(new Earth());

    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);

    addAxes(axesGroup);
    scene.add(axesGroup);

    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    scenes[currentScene].build(displayMode);

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
