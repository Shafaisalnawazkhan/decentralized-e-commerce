/**
 * BrandVerify / mėntality — Three.js 3D Robotic Arm Viewport Engine
 * Renders an articulating 3D Robotic Inspection Arm, Scanning Laser,
 * and Luxury Product Digital Twin models (Swiss Watch, Tote, Fragrance).
 */

const RobotStudioEngine = (function() {
  'use strict';

  let scene, camera, renderer;
  let robotBase, robotArm1, robotArm2, robotHead, laserPlane;
  let productGroup, currentProductMesh;
  let isLaserActive = true;
  let laserDirection = 1;

  function initRobotStudio() {
    const container = document.getElementById('robotCanvas3D');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 3.5, 6);
    camera.lookAt(0, 0.5, 0);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Studio Base Platform
    const platformGeo = new THREE.CylinderGeometry(2.5, 2.7, 0.2, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      metalness: 0.8,
      roughness: 0.2
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.1;
    scene.add(platform);

    // Articulating 3D Robotic Arm Group
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // 1. Robot Base Cylinder
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.6, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.9, roughness: 0.1 });
    robotBase = new THREE.Mesh(baseGeo, baseMat);
    robotBase.position.set(-1.2, 0.3, -1);
    robotGroup.add(robotBase);

    // 2. Robot Joint 1 & Arm Segment 1
    const arm1Geo = new THREE.BoxGeometry(0.2, 1.4, 0.2);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x0F766E, metalness: 0.7, roughness: 0.3 });
    robotArm1 = new THREE.Mesh(arm1Geo, armMat);
    robotArm1.position.set(0, 0.7, 0);
    robotArm1.rotation.z = -0.4;
    robotBase.add(robotArm1);

    // 3. Robot Joint 2 & Upper Arm
    const arm2Geo = new THREE.BoxGeometry(0.18, 1.2, 0.18);
    robotArm2 = new THREE.Mesh(arm2Geo, armMat);
    robotArm2.position.set(0, 0.6, 0);
    robotArm2.rotation.z = 0.8;
    robotArm1.add(robotArm2);

    // 4. Scanner End Effector Head
    const headGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x9FFF00, emissive: 0x0F766E, emissiveIntensity: 0.3 });
    robotHead = new THREE.Mesh(headGeo, headMat);
    robotHead.position.set(0, 0.6, 0);
    robotArm2.add(robotHead);

    // 5. Scanning Laser Beam Plane
    const laserGeo = new THREE.PlaneGeometry(2.2, 0.04);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    laserPlane = new THREE.Mesh(laserGeo, laserMat);
    laserPlane.rotation.x = Math.PI / 2;
    laserPlane.position.set(1.2, 0.6, 1);
    scene.add(laserPlane);

    // Digital Twin Luxury Product Container
    productGroup = new THREE.Group();
    productGroup.position.set(0.2, 0.4, 0);
    scene.add(productGroup);

    // Default Digital Twin: Luxury Watch Case / Box
    createLuxuryWatchModel();

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const greenSpot = new THREE.SpotLight(0x9FFF00, 2, 10);
    greenSpot.position.set(-2, 4, 2);
    scene.add(greenSpot);

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      // Articulate Robotic Arm Joint Rotations
      const time = Date.now() * 0.0015;
      robotBase.rotation.y = Math.sin(time) * 0.3;
      robotArm1.rotation.z = -0.4 + Math.sin(time * 1.5) * 0.15;
      robotArm2.rotation.z = 0.8 + Math.cos(time * 1.5) * 0.12;

      // Rotate Digital Twin Product
      if (productGroup) {
        productGroup.rotation.y += 0.008;
      }

      // Scanning Laser Sweep Animation
      if (isLaserActive && laserPlane) {
        laserPlane.position.y += 0.015 * laserDirection;
        if (laserPlane.position.y > 1.2) laserDirection = -1;
        if (laserPlane.position.y < 0.1) laserDirection = 1;
      }

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  function createLuxuryWatchModel() {
    clearProductGroup();
    const caseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x0F766E, metalness: 0.9, roughness: 0.1 });
    const watchCase = new THREE.Mesh(caseGeo, caseMat);

    const dialGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.32, 32);
    const dialMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.2, roughness: 0.1 });
    const dial = new THREE.Mesh(dialGeo, dialMat);

    watchCase.add(dial);
    productGroup.add(watchCase);
    currentProductMesh = watchCase;
  }

  function createToteModel() {
    clearProductGroup();
    const bagGeo = new THREE.BoxGeometry(1.4, 1.2, 0.6);
    const bagMat = new THREE.MeshStandardMaterial({ color: 0x7C2D12, roughness: 0.6 });
    const bag = new THREE.Mesh(bagGeo, bagMat);
    productGroup.add(bag);
    currentProductMesh = bag;
  }

  function createFragranceModel() {
    clearProductGroup();
    const bottleGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.4, 24);
    const bottleMat = new THREE.MeshPhysicalMaterial({
      color: 0x0F766E,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.05
    });
    const bottle = new THREE.Mesh(bottleGeo, bottleMat);
    productGroup.add(bottle);
    currentProductMesh = bottle;
  }

  function clearProductGroup() {
    while (productGroup.children.length > 0) {
      productGroup.remove(productGroup.children[0]);
    }
  }

  function toggleLaser() {
    isLaserActive = !isLaserActive;
    if (laserPlane) laserPlane.visible = isLaserActive;
  }

  function setProductTwin(type) {
    if (type === 'watch') createLuxuryWatchModel();
    else if (type === 'tote') createToteModel();
    else if (type === 'fragrance') createFragranceModel();
  }

  return {
    initRobotStudio,
    toggleLaser,
    setProductTwin
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  RobotStudioEngine.initRobotStudio();
});
