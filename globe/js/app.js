/**
 * This is partly from the Earth in WebGL tutorial here
 * http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
 */

(function() {
  'use strict';

  var scene = new THREE.Scene();
  var ambientLight = new THREE.AmbientLight(0xf0f0f0);
  var sunLight = new THREE.DirectionalLight(0x202020);
  var renderer, camera, globe, clouds, space;

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

    scene.add(ambientLight);

    // Directional light.
    sunLight.position.set(-15, 15, 60);
    scene.add(sunLight);

    scene.add(camera);

    // GLOBE.
    var geometry = new THREE.SphereGeometry(20, 32, 32);
    var material = new THREE.MeshPhongMaterial();

    // Diffuse map.
    material.map = THREE.ImageUtils.loadTexture('../textures/earth/earthmap1k.jpg');

    // Bump map.
    material.bumpMap = THREE.ImageUtils.loadTexture('../textures/earth/earthbump1k.jpg');
    material.bumpScale = 0.3;

    // Specular map.
    material.specularMap = THREE.ImageUtils.loadTexture('../textures/earth/earthspec1k.jpg');
    material.specular = new THREE.Color('grey');

    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // CLOUDS.
    clouds = createCloudMesh();
    globe.add(clouds); // Attached to the globe.

    // STARS.
    var spaceGeometry = new THREE.SphereGeometry(90, 32, 32);
    var spaceMaterial = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture('../textures/galaxy_starfield.png'),
      side: THREE.BackSide
    });
    spaceGeometry.name = 'space';
    space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    space.name = 'space';
    scene.add(space);
  }

  // Infinite recursive loop.
  function render() {
    renderer.render(scene, camera);

    if (globe) {
      globe.rotation.y += 0.001;
    }

    if (clouds) {
      clouds.rotation.x += 0.0002;
      clouds.rotation.y += 0.0005;
    }

    if (space) {
      space.rotation.x += 0.0001;
      space.rotation.y -= 0.00005;
    }
    window.requestAnimationFrame(render);
  }
})();


// Create the cloud texture through manipulating two JPEGs.
// Taken from https://github.com/jeromeetienne/threex.planets/blob/master/threex.planets.js
// Alternatively and far more simply use a PNG with an alpha channel as the texture source:
// http://a.disquscdn.com/uploads/mediaembed/images/625/3633/original.jpg
function createCloudMesh() {
  'use strict';

  // create destination canvas
  var canvasResult = document.createElement('canvas');
  canvasResult.width  = 1024;
  canvasResult.height = 512;
  var contextResult = canvasResult.getContext('2d');

  // load earthcloudmap
  var imageMap = new Image();
  imageMap.addEventListener('load', function() {

    // create dataMap ImageData for earthcloudmap
    var canvasMap = document.createElement('canvas');
    canvasMap.width = imageMap.width;
    canvasMap.height= imageMap.height;
    var contextMap = canvasMap.getContext('2d');
    contextMap.drawImage(imageMap, 0, 0);
    var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

    // load earthcloudmaptrans
    var imageTrans = new Image();
    imageTrans.addEventListener('load', function(){

      // create dataTrans ImageData for earthcloudmaptrans
      var canvasTrans = document.createElement('canvas');
      canvasTrans.width = imageTrans.width;
      canvasTrans.height  = imageTrans.height;
      var contextTrans = canvasTrans.getContext('2d');
      contextTrans.drawImage(imageTrans, 0, 0);
      var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);

      // merge dataMap + dataTrans into dataResult
      var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
      for(var y = 0, offset = 0; y < imageMap.height; y++){
        for(var x = 0; x < imageMap.width; x++, offset += 4){
          dataResult.data[offset+0] = dataMap.data[offset+0];
          dataResult.data[offset+1] = dataMap.data[offset+1];
          dataResult.data[offset+2] = dataMap.data[offset+2];
          dataResult.data[offset+3] = 255 - dataTrans.data[offset+0];
        }
      }

      // update texture with result
      contextResult.putImageData(dataResult,0,0);
      material.map.needsUpdate = true;
    });
    imageTrans.src  = '../textures/earth/earthcloudmaptrans.jpg';
  }, false);

  imageMap.src  = '../textures/earth/earthcloudmap.jpg';
  var geometry = new THREE.SphereGeometry(21, 32, 32);
  var material = new THREE.MeshPhongMaterial({
    map : new THREE.Texture(canvasResult),
    side : THREE.DoubleSide,
    transparent : true,
    opacity : 0.8,
    depthWrite: false
  });
  var mesh = new THREE.Mesh(geometry, material);
  return mesh;
}