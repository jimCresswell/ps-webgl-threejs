/**
 * This is partly from the Earth in WebGL tutorial here
 * http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
 */

(function() {
  'use strict';

  var scene = new THREE.Scene();
  var ambientLight = new THREE.AmbientLight(0xf0f0f0);
  var sunLight = new THREE.DirectionalLight(0x202020);
  var renderer, camera, globe;

  // Fallback to canvas renderer if WebGL isn't available.
  if (window.WebGLRenderingContext) {
    try {
      renderer = new THREE.WebGLRenderer();
    } catch (error) {
      console.warning(error);
      renderer = new THREE.CanvasRenderer();
    }
  } else {
    renderer = new THREE.CanvasRenderer();
  }

  // Make it go!
  function go() {
    initScene();
    render();
  }

  if (window.loaded) {
    go();
  } else {
    window.addEventListener('load', go);
  }


  // Expose the scene object for debugging.
  return {
    scene: scene
  };


  /**
   * Functions.
   */

  /**
   * Scene setup
   * @return {undefined}
   */
  function initScene() {
    var width = window.innerWidth;
    var height = window.innerHeight;



    // RENDERER SETUP.
    renderer.setSize(width, height);

    document.getElementById('webgl-container').appendChild(renderer.domElement);

    // CAMERA
    // Camera default pointing down -z axis.
    // FOV deg, aspect ratio, near clipping plane, far clipping plane.
    camera = new THREE.PerspectiveCamera(
      35,
      width/height,
      1,
      1000
    );
    camera.position.z = 100;

    var geometry = new THREE.SphereGeometry(20, 32, 32);

    var material = new THREE.MeshPhongMaterial();

    // Ambient texture.
    material.map = THREE.ImageUtils.loadTexture('../textures/earth/earthmap1k.jpg');

    // Bump map.
    material.bumpMap = THREE.ImageUtils.loadTexture('../textures/earth/earthbump1k.jpg');
    material.bumpScale = 0.2;

    // Specular map.
    material.specularMap = THREE.ImageUtils.loadTexture('../textures/earth/earthspec1k.jpg');
    material.specular = new THREE.Color('grey');

    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);


    scene.add(ambientLight);

    // Directional light.
    sunLight.position.set(-15, 15, 60);
    scene.add(sunLight);

    scene.add(camera);
  }

  // Infinite recursive loop.
  function render() {
    renderer.render(scene, camera);

    if (globe) {
      globe.rotation.y += 0.005;
    }

    window.requestAnimationFrame(render);
  }
})();
