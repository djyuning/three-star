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
camera.position.z = 80;
scene.add(camera);

////////////////////////////////////////////////////////////

// 调试控制器
const control = new THREE.OrbitControls(camera, renderer.domElement);
control.enableZoom = false;

////////////////////////////////////////////////////////////

// 灯光 A，蓝色顶光
const pointLightAtTop = new THREE.PointLight(0x004EFF, 1, 150);
pointLightAtTop.castShadow = true;
pointLightAtTop.position.set(-60, 60, 0);
scene.add(pointLightAtTop);

// 灯光 B，黄色侧光
const pointLightAtSide = new THREE.PointLight(0xFFFFFF, 4, 100);
pointLightAtSide.castShadow = true;
pointLightAtSide.position.set(-70, 20, 40);
scene.add(pointLightAtSide);

// 灯光 C，紫色侧光，背面不光
const pointLightAtBack = new THREE.PointLight(0xFF9AEB, 1, 150);
pointLightAtBack.castShadow = true;
pointLightAtBack.position.set(100, -60, 0);
scene.add(pointLightAtBack);

////////////////////////////////////////////////////////////

// 金星
const starOfVenus = new StarVenus();
scene.add(starOfVenus.mesh);

// 火星
const starOfMesh = new StarMars();
scene.add(starOfMesh.mesh);

// 木星
const starOfJupiter = new StartJupiter();
scene.add(starOfJupiter.mesh);

// 土星
const starOfSaturn = new StartSaturn();
scene.add(starOfSaturn.group);

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
    starOfVenus.mesh.rotation.y += 0.001;
    starOfMesh.mesh.rotation.y += 0.0008;
    starOfJupiter.mesh.rotation.y += 0.0008;

    starOfSaturn.mesh.rotation.z += 0.0005;
    starOfSaturn.ringGroup.rotation.z -= 0.0005;

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

// 过渡动画
const transform = presets => {
    TWEEN.removeAll();

    presets.forEach(preset => {
        new TWEEN.Tween(preset.start)
            .to(preset.end, preset.duration || 1000 * 2)
            .easing(preset.easing || TWEEN.Easing.Linear.None)
            .delay(preset.delay || 0)
            .onUpdate(preset.onUpdate)
            .start();
    });

};

// 场景切换
const checkStar = (current, prev) => {
    const end = [
        // 摄像机归位
        {
            start: camera.position,
            end: {
                x: 0,
                y: 0,
                z: 100
            },
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
    ];

    // 上一星球退出画外
    if (prev) {
        end.push({
            start: prev.scale,
            end: {
                x: 0,
                y: 0,
                z: 0
            }
        }, {
            start: prev.position,
            end: {
                x: 0,
                y: 0,
                z: 200
            }
        }, {
            start: prev.rotation,
            end: new THREE.Vector3(0, 0, 0),
        }, );
    }

    transform(end);
}

////////////////////////////////////////////////////////////

// 当前可见的星球
let currentStar = starOfMesh.mesh;

// 初始化
animate();

// 初始显示火星
checkStar(currentStar);

////////////////////////////////////////////////////////////

// 响应窗口尺寸变化
window.addEventListener("resize", resize);

// 切换星球
document.getElementById('star-venus').addEventListener('click', () => {
    if (currentStar === starOfVenus.mesh) return;
    checkStar(starOfVenus.mesh, currentStar);
    currentStar = starOfVenus.mesh;
});

document.getElementById('star-mars').addEventListener('click', () => {
    if (currentStar === starOfMesh.mesh) return;
    checkStar(starOfMesh.mesh, currentStar);
    currentStar = starOfMesh.mesh;
});

document.getElementById('star-jupiter').addEventListener('click', () => {
    if (currentStar === starOfJupiter.mesh) return;
    checkStar(starOfJupiter.mesh, currentStar);
    currentStar = starOfJupiter.mesh;
});

document.getElementById('star-saturn').addEventListener('click', () => {
    if (currentStar === starOfSaturn.group) return;
    checkStar(starOfSaturn.group, currentStar);
    currentStar = starOfSaturn.group;
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

        // 主光源前移
        {
            start: pointLightAtSide.position,
            end: {
                x: -70,
                y: 20,
                z: 40
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

        // 主光源前移
        {
            start: pointLightAtSide.position,
            end: {
                x: -40,
                y: 20,
                z: 80
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
            end: new THREE.Vector3(16 * Math.random(), -10, 1.5 * Math.random()),
            easing: TWEEN.Easing.Exponential.Out,
        },
    ]);
});