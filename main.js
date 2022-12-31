
// #region core

import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { GUI } from './libs/lil-gui.module.min.js';
import { CSS2DRenderer, CSS2DObject } from './libs/CSS2DRenderer.js';

THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

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

const testGroup = new THREE.Group();
scene.add(testGroup);

camera.position.set(6, 6, 6);
camera.lookAt(0, 0, 0);

const axesGroup = new THREE.Group();
addAxes(axesGroup);
testGroup.add(axesGroup);

const gui = new GUI({title: 'Postavke'});
gui.add(axesGroup, 'visible').name('Prikaži osi');

init(testGroup);

function animate() {
    requestAnimationFrame(animate);

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
};

animate();







// #endregion

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

function buildPlane(group) {

    const geometry = new THREE.BufferGeometry();

    const width = 1;
    const height = 1;
    const widthSegments = 1;
    const heightSegments = 1;

    const width_half = width / 2;
    const height_half = height / 2;

    const gridX = Math.floor( widthSegments );
    const gridY = Math.floor( heightSegments );

    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;

    const segment_width = width / gridX;
    const segment_height = height / gridY;

    //

    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    for ( let iy = 0; iy < gridY1; iy ++ ) {

        const y = iy * segment_height - height_half;

        for ( let ix = 0; ix < gridX1; ix ++ ) {

            const x = ix * segment_width - width_half;

            vertices.push( x, - y, 0 );

            normals.push( 0, 0, 1 );

            uvs.push( ix / gridX );
            uvs.push( 1 - ( iy / gridY ) );

        }

    }

    for ( let iy = 0; iy < gridY; iy ++ ) {

        for ( let ix = 0; ix < gridX; ix ++ ) {

            const a = ix + gridX1 * iy;
            const b = ix + gridX1 * ( iy + 1 );
            const c = ( ix + 1 ) + gridX1 * ( iy + 1 );
            const d = ( ix + 1 ) + gridX1 * iy;

            indices.push( a, b, d );
            indices.push( b, c, d );

        }

    }

    console.log(uvs);

    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    //geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
   // geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: false} );
    const plane = new THREE.Mesh( geometry, material );
    group.add( plane );

}

function init(group) {


    let light = new THREE.AmbientLight(0xFFFFFF, 0.4);
    light.position.set(30, 10, 10);
    group.add(light);

   //group.add(new THREE.PointLight(0xFFFFFF, 0.5));

    let geometry = new THREE.BoxGeometry( 1, 1, 1, 100, 100, 100 );
    let material = new THREE.MeshPhongMaterial( { color: 0x0000ff} );
    let cube = new THREE.Mesh( geometry, material );
    cube.position.set(0.5, 0.5, 0.5);
    group.add(cube);

    //buildPlane(group);


}




function josipFunkcijaHEHEHE() {


    
}








