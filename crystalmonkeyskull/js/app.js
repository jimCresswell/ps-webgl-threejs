(function() {
  'use strict';

  var scene = new THREE.Scene();
  var light1 = new THREE.AmbientLight(0x202020);
  var light2 = new THREE.PointLight(0xff2020, 0.5, 50);
  var light3 = new THREE.DirectionalLight(0x20ff20, 1);
  var light4 = new THREE.SpotLight(0x2020ff, 1);
  var renderer, camera, crystalMonkeySkull;

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

    var tjsLoader = new THREE.JSONLoader();
    tjsLoader.load('../models/monkeyHead.json', function(geometry, materials) {
      var texture = THREE.ImageUtils.loadTexture('../textures/glass_rain_small.jpg', {}, function() {
        var material = new THREE.MeshPhongMaterial({
          ambient: 0xffffff,
          specular: 0xffffff,
          shininess: 100,
          transparent: true,
          opacity: 0.80,
          side: THREE.DoubleSide,
          map: texture
        });

        crystalMonkeySkull = new THREE.Mesh(geometry, material);

        assignUVs(crystalMonkeySkull.geometry);

        crystalMonkeySkull.rotation.set(-Math.PI/15, 0, 0);
        crystalMonkeySkull.scale.set(12, 12, 12);

        scene.add(crystalMonkeySkull);
      });
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });

    // Ambient light (grey).
    scene.add(light1);

    // Point light (red).
    light2.position.set(30, 30, 30);
    scene.add(light2);

    // Directional light (green).
    light3.position.set(-60, 80, -60);
    scene.add(light3);

    // Spot light (blue).
    light4.position.set(20, -15, 50);
    scene.add(light4);

    scene.add(camera);
  }

  // Infinite recursive loop.
  function render() {
    renderer.render(scene, camera);

    if (crystalMonkeySkull) {
      crystalMonkeySkull.rotation.y += 0.01;
    }

    window.requestAnimationFrame(render);
  }
})();

function assignUVs(geometry) {

    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function(face) {

        var components = ['x', 'y', 'z'].sort(function(a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);

    });

    geometry.uvsNeedUpdate = true;
}