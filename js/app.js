var example = (function() {
  'use strict';

  var scene = new THREE.Scene();
  var light = new THREE.AmbientLight(0xffffff);
  var renderer, camera, box;

  // Fallback to canvas renderer if WebGL isn't available.
  if (window.WebGLRenderingContext) {
    try {
      renderer = new THREE.WebGLRenderer();
    } catch (err) {
      console.error(error);
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
  }

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
    camera.position.z = 10;;

    // BOX
    box = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, 20),
      new THREE.MeshBasicMaterial({color: 0xFF0000})
    );
    box.name = 'box';

    // Scene setup.
    scene.add(light);
    scene.add(camera);
    scene.add(box);
  }

  // Infinite recursive loop.
  function render() {
    renderer.render(scene, camera);

    window.requestAnimationFrame(render);
  }
})();