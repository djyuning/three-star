// 获取窗口尺寸
let width = window.innerWidth;
let height = window.innerHeight;

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// 创建场景
const scene = new THREE.Scene();

// 摄像机
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.lookAt({
    x: 0,
    y: 0,
    z: 0
});
camera.position.z = 100;
scene.add(camera);

////////////////////////////////////////////////////////////

// 调试控制器
const control = new THREE.OrbitControls(camera, renderer.domElement);

////////////////////////////////////////////////////////////

// 灯光 A，蓝色顶光
const pointLightAtTop = new THREE.PointLight(0x004EFF, 4, 150);
pointLightAtTop.castShadow = true;
pointLightAtTop.position.set(-20, 60, 0);
scene.add(pointLightAtTop);

// 调整顶部光源的阴影
pointLightAtTop.shadow.mapSize.width = 512;
pointLightAtTop.shadow.mapSize.height = 512;
pointLightAtTop.shadow.camera.near = 0.5;
pointLightAtTop.shadow.camera.far = 500;

// 灯光 B，黄色侧光
const pointLightAtSide = new THREE.PointLight(0xFFFFFF, 4, 100);
pointLightAtSide.castShadow = true;
pointLightAtSide.position.set(-70, 20, 40);
scene.add(pointLightAtSide);

// 调整侧面光源的阴影
pointLightAtSide.shadow.mapSize.width = 512;
pointLightAtSide.shadow.mapSize.height = 512;
pointLightAtSide.shadow.camera.near = 0.5;
pointLightAtSide.shadow.camera.far = 500;

// 灯光 C，蓝色顶光
const pointLightAtTopTwo = new THREE.PointLight(0xFF9AEB, 1, 150);
pointLightAtTopTwo.castShadow = true;
pointLightAtTopTwo.position.set(100, -60, 0);
scene.add(pointLightAtTopTwo);

////////////////////////////////////////////////////////////

// 火星
const marsSegments = 200;
const mars = new THREE.SphereGeometry(20, marsSegments, marsSegments);

// 漫反射贴图
const marsLightMapTexture = new THREE.TextureLoader().load('images/mars.jpg');
marsLightMapTexture.repeat.set(1, 1);

// 凹凸贴图
const marsBumpMapTexture = new THREE.TextureLoader().load('images/mars_bump.jpg');
marsBumpMapTexture.wrapS = THREE.RepeatWrapping;
marsBumpMapTexture.wrapT = THREE.RepeatWrapping;
marsBumpMapTexture.repeat.set(1, 1);

const marsMaterial = new THREE.MeshStandardMaterial({
    map: marsLightMapTexture, // 漫反射贴图
    lightMap: marsLightMapTexture, // 自发光贴图
    lightMapIntensity: 0.05, // 自发光强度   
    bumpMap: marsBumpMapTexture, // 凹凸贴图
    bumpScale: 0.1, // 凹凸程度
    metalness: 0.1, // 金属质感
    roughness: 1, // 粗糙程度
});

const marsMesh = new THREE.Mesh(mars, marsMaterial);

marsMesh.scale.x = 1;
marsMesh.scale.y = 1;
marsMesh.scale.z = 10;

scene.add(marsMesh);

////////////////////////////////////////////////////////////

// 木星
const jupiterGroup = new THREE.Group();
const segmentsJupiter = 200;
const jupiter = new THREE.SphereGeometry(20, segmentsJupiter, segmentsJupiter);

// 漫反射贴图
const jupiterMapTexture = new THREE.TextureLoader().load('images/jupiter.jpg');
jupiterMapTexture.repeat.set(1, 1);

const jupiterMaterial = new THREE.MeshStandardMaterial({
    map: jupiterMapTexture, // 漫反射贴图
    lightMap: jupiterMapTexture, // 自发光贴图
    lightMapIntensity: 0.1, // 自发光强度   
    bumpMap: jupiterMapTexture, // 凹凸贴图
    bumpScale: 0.1, // 凹凸程度
    metalness: 0.5, // 金属质感
    roughness: 1, // 粗糙程度
});

const jupiterMesh = new THREE.Mesh(jupiter, jupiterMaterial);

jupiterGroup.add(jupiterMesh);

// 土星环
var jupiterSatelliteGroup = new THREE.Group();
for (let i = 0; i < 1200; i++) {
    const boxGeom = new THREE.SphereGeometry(Math.max(0.0002, Math.random() * 0.15), 6, 6);
    const cube = new THREE.Mesh(boxGeom, jupiterMaterial);

    // 初始化随机位置
    cube.position.x = Math.sin(i) * Math.PI * (Math.random() + 10 + Math.random() * 5);
    cube.position.y = Math.cos(i) * Math.PI * (Math.random() + 10 + Math.random() * 5);
    cube.position.z = Math.sin(i) * Math.random(3);

    jupiterSatelliteGroup.add(cube);
}

// 土星环线条
const jupiterRingShadown = new THREE.RingGeometry(35, 45, 360, 8, 0.1, Math.PI * 2);

// 漫反射贴图
const jupiterRingShadownTexture = new THREE.TextureLoader().load('images/jupiter_ring.png');

const jupiterRingShadownMaterial = new THREE.MeshStandardMaterial({
    alphaMap: jupiterRingShadownTexture,
    side: THREE.DoubleSide,
    specular: 0,
    opacity: 0.5,
    transparent: true,
    roughness: 2, // 粗糙程度
});

const jupiterRingShadownmMesh = new THREE.Mesh(jupiterRingShadown, jupiterRingShadownMaterial);
jupiterSatelliteGroup.add(jupiterRingShadownmMesh);

// 调整土星环的角度
jupiterSatelliteGroup.rotation.x = 1.7;
jupiterSatelliteGroup.rotation.y = 0.2;
jupiterGroup.add(jupiterSatelliteGroup);

jupiterGroup.scale.x = 0;
jupiterGroup.scale.y = 0;
jupiterGroup.scale.z = 0;

scene.add(jupiterGroup);

////////////////////////////////////////////////////////////

// 星空
for (let i = 0; i < 1000; i++) {
    const boxGeom = new THREE.SphereGeometry(Math.max(0.001, Math.random(1)), 6, 6);

    const material = new THREE.MeshBasicMaterial({
        color: 0xeeeeee
    });
    const cube = new THREE.Mesh(boxGeom, material);

    // 初始化随机位置
    cube.position.x = (Math.random() - Math.random()) * width;
    cube.position.y = (Math.random() - Math.random()) * width;
    cube.position.z = Math.sin(i) * Math.random() * width;

    scene.add(cube);
}

////////////////////////////////////////////////////////////

// 后期处理
const composer = new THREE.EffectComposer(renderer);
composer.setSize(width, height);

// 设置渲染场景
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

// 特效通道
const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
effectCopy.renderToScreen = true;
composer.addPass(effectCopy);

// 光效
const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
bloomPass.renderToScreen = true;
bloomPass.threshold = 0.05;
bloomPass.strength = 0.3; // 辉光强度
bloomPass.radius = 2;
composer.addPass(bloomPass);

////////////////////////////////////////////////////////////

// 渲染场景，更新控制器
const render = () => {
    // 动画执行
    TWEEN.update();

    // 渲染场景
    // 启用后期处理后，需要使用 composer.render
    composer.render();
    // renderer.render(scene, camera);

    // 控制器更新
    control.update();
}

// 场景动画
const animate = () => {
    // 球体自转
    marsMesh.rotation.y += 0.0008;
    jupiterMesh.rotation.y += 0.0008;
    jupiterSatelliteGroup.rotation.z -= 0.0005;

    render();
    requestAnimationFrame(animate);
}

// 窗口尺寸变化
const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
};

////////////////////////////////////////////////////////////

// 过渡动画
const transform = preset => {
    TWEEN.removeAll();

    preset.forEach(preset => {
        new TWEEN.Tween(preset.start)
            .to(preset.end, preset.duration || 1000 * 2)
            .easing(preset.easing || TWEEN.Easing.Linear.None)
            .delay(preset.delay || 0)
            .onUpdate(preset.onUpdate)
            .start();
    });

};

////////////////////////////////////////////////////////////

// 当前可见的星球
let currentStar = marsMesh;

// 场景切换
const checkStar = (prev, current) => {
    transform([
        // 摄像机归位
        {
            start: camera.position,
            end: {
                x: 0,
                y: 0,
                z: 100
            },
        },

        // 上一星球退出画外
        {
            start: prev.scale,
            end: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        {
            start: prev.position,
            end: {
                x: 0,
                y: 0,
                z: 200
            }
        },
        {
            start: prev.rotation,
            end: new THREE.Vector3(0, 0, 0),
        },

        // 当前星球进入视野
        {
            start: current.scale,
            end: {
                x: 1,
                y: 1,
                z: 1
            }
        },
        {
            start: current.position,
            end: {
                x: 0,
                y: 0,
                z: 0
            }
        },
    ]);
}

// 初始化
animate();
checkStar(jupiterGroup, marsMesh);


////////////////////////////////////////////////////////////

// 响应窗口尺寸变化
window.addEventListener("resize", resize);

// 切换星球
document.getElementById('star-mars').addEventListener('click', () => {
    currentStar = marsMesh;
    checkStar(jupiterGroup, marsMesh);
});

document.getElementById('star-jupiter').addEventListener('click', () => {
    currentStar = jupiterGroup;
    checkStar(marsMesh, jupiterGroup);
});

// 基础控制
document.getElementById('control-a').addEventListener('click', () => {
    transform([
        // 摄像机由远及近
        {
            start: camera.position,
            end: {
                x: 0,
                y: 0,
                z: 100
            },
        },

        // 球体拉近展示
        {
            start: currentStar.position,
            end: {
                x: 0,
                y: 0,
                z: 0
            },
        },

        // 球体旋转到向阳面
        {
            start: currentStar.rotation,
            end: new THREE.Vector3(0, 0, 0),
            easing: TWEEN.Easing.Exponential.Out,
        },
    ]);
});

// 随机角度
document.getElementById('control-b').addEventListener('click', () => {
    transform([
        // 摄像机由远及近
        {
            start: camera.position,
            end: {
                x: currentStar.position.x + 10,
                y: currentStar.position.y + 5,
                z: 45 // 调整球体远近，值越小球越大
            },
        },

        // 球体拉近展示
        {
            start: currentStar.position,
            end: {
                x: 10,
                y: -5,
                z: 10
            },
        },

        // 球体旋转到向阳面
        {
            start: currentStar.rotation,
            end: new THREE.Vector3(-2 * Math.random(), 2 * Math.random(), 1.5 * Math.random()),
            easing: TWEEN.Easing.Exponential.Out,
        },
    ]);
});