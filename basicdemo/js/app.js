(function() {
  'use strict';

  var scene = new THREE.Scene();
  var light = new THREE.AmbientLight(0xffffff);
  var renderer, camera, box, triangle, dummy, monkeyHead;

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

    // BOX
    box = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, 20),
      new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        vertexColors: THREE.FaceColors
      })
    );
    box.position.y = 10;
    box.scale.set(0.5, 0.5, 0.5);
    box.name = 'box';

    // HACK HACK HACK
    box.geometry.faces.forEach(function(face) {
      face.color.setRGB(Math.random(), Math.random(), Math.random());
    });

    // Scene setup.
    scene.add(light);
    scene.add(camera);

    // Add built in box geometry example.
    scene.add(box);

    // Add custom triangle gemetry example.
    triangle = getTriangleMesh();
    triangle.position.x = 25;
    triangle.position.y = 10;
    triangle.scale.set(5, 5, 5);
    scene.add(triangle);

    // Add loaded geometry example using the Collada DAE
    // file format via the Threejs Collada Loader.
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;

    var modelUrl = '../models/3DRT-test-character-model/test_Collada_DAE.DAE';
    loader.load(modelUrl, function(collada) {
      dummy = collada.scene;
      dummy.position.x = -20;
      dummy.position.y = -15;
      dummy.scale.set(2,2,2);
      scene.add(dummy);
    });

    // Load a model exported from Blender using
    // the build in Threejs file format
    var tjsLoader = new THREE.JSONLoader();
    tjsLoader.load('../models/monkeyHead.json', function(geometry, materials) {
      var material = new THREE.MeshBasicMaterial({
        color: 0xc0c0c0,
        wireframe: true
      });

      monkeyHead = new THREE.Mesh(geometry, material);

      monkeyHead.position.x = 15;
      monkeyHead.position.y = -10;
      monkeyHead.scale.set(8, 8, 8);

      scene.add(monkeyHead);
    });
  }

  // Infinite recursive loop.
  function render() {
    renderer.render(scene, camera);

    box.rotation.y += 0.012;
    box.rotation.x += 0.02;
    box.rotation.z += 0.015;

    if (triangle) {
      triangle.rotation.x += 0.01;
    }
    if (dummy) {
      dummy.rotation.y += -0.012;
    }

    if (monkeyHead) {
      monkeyHead.rotation.y += 0.012;
    }

    window.requestAnimationFrame(render);
  }
})();

/**
 * Manual geometry and material example.
 */
function getTriangleMesh() {
  'use strict';

  var manualMaterial = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide
  });
  var triangleGeometry = new THREE.Geometry();
  triangleGeometry.vertices.push (new THREE.Vector3(0.0, 1.0, 0.0));
  triangleGeometry.vertices.push (new THREE.Vector3(-1.0, -1.0, 0.0));
  triangleGeometry.vertices.push (new THREE.Vector3(1.0, -1.0, 0.0));

  triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));

  triangleGeometry.faces[0].vertexColors[0] = new THREE.Color(0xFF0000);
  triangleGeometry.faces[0].vertexColors[1] = new THREE.Color(0x00FF00);
  triangleGeometry.faces[0].vertexColors[2] = new THREE.Color(0xFF0000);

  return new THREE.Mesh(triangleGeometry, manualMaterial);
}