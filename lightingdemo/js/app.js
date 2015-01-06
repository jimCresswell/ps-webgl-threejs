(function() {
  'use strict';

  var scene = new THREE.Scene();
  var light1 = new THREE.AmbientLight(0xffffff);
  var light2 = new THREE.PointLight(0xa00000, 2, 100);
  var light3 = new THREE.DirectionalLight(0x00a000, 1);
  var light4 = new THREE.SpotLight(0x0000ff, 1);
  var renderer, camera, box1, box2;

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
    renderer.shadowMapEnabled = true;

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

    // BOX
    box1 = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, 20),
      new THREE.MeshLambertMaterial({
        color: 0xffffff,
        ambient: 0xa00000,
        emissive: 0x00a000
      })
    );
    box1.position.x = -10;
    box1.position.y = 10;
    box1.castShadow = true;

    box2 = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, 20),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        ambient: 0xa00000,
        emissive: 0x00a000,
        specular: 0xffffff,
        shininess: 100
      })
    );
    box2.position.x = 15;
    box2.position.y = -10;
    box2.receiveShadow = true;

    // Ambient light (grey).
    scene.add(light1);

    // Point light (red).
    light2.position.set(30, 30, 30);
    scene.add(light2);

    // Directional light (green, casts shadow).
    light3.position.set(-60, 80, -60);
    light3.castShadow = true;
    light3.shadowMapWidth = 2048;
    light3.shadowMapHeight = 2048;
    scene.add(light3);

    // Spot light (blue).
    light4.position.set(20, -15, 50);
    scene.add(light4);

    // Camera.
    scene.add(camera);

    // Add built in box geometry example.
    scene.add(box1);
    scene.add(box2);
  }

  // Infinite recursive loop.
  function render() {
    renderer.render(scene, camera);

    box1.rotation.y += 0.012;
    box1.rotation.x += 0.02;
    box1.rotation.z += 0.015;

    box2.rotation.y += -0.012;
    box2.rotation.x += -0.02;
    box2.rotation.z += -0.015;

    window.requestAnimationFrame(render);
  }
})();
