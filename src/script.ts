import gsap, { Power4 } from 'gsap';
import {
    AmbientLight,
    Clock,
    DirectionalLight,
    Fog,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    SphereGeometry,
    Vector3,
    WebGLRenderer,
} from 'three';
import { BonusParticles } from './BonusParticles';
import { Carrot } from './Carrot';
import { Hedgehog } from './Hedgehog';
import Hero from './Hero';
import Materials from './Materials';
import { Monster } from './Monster';
import './style.scss';
import { Tree } from './Tree';

export class Game {
    public scene: Scene;
    public camera: PerspectiveCamera;
    public fieldOfView: number;
    public aspectRatio: number;
    public nearPlane: number;
    public farPlane: number;
    public globalLight: AmbientLight;
    public shadowLight: DirectionalLight;
    public renderer: WebGLRenderer;
    public container: HTMLElement;
    public clock: Clock;
    public delta = 0;
    public floorRadius = 200;
    public speed = 6;
    public distance = 0;
    public levelInterval: NodeJS.Timer;
    public bonusParticles: BonusParticles;
    public levelUpdateFreq = 3000;
    public initSpeed = 5;
    public maxSpeed = 48;
    public floor: Group;
    public monsterPos = 0.65;
    public monsterPosTarget = 0.65;
    public floorRotation = 0;
    public collisionObstacle = 10;
    public collisionBonus = 20;
    public gameStatus = 'play';
    public cameraPosGame = 160;
    public cameraPosGameOver = 260;
    public monsterAcceleration = 0.004;
    public malusClearColor = 0xb44b39;
    public malusClearAlpha = 0;
    public audio = new Audio(
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/Antonio-Vivaldi-Summer_01.mp3'
    );

    public fieldGameOver: HTMLElement;
    public fieldDistance: HTMLElement;

    public WIDTH: number;
    public HEIGHT: number;
    public hero: Hero;
    public monster: Monster;
    public carrot: Carrot;
    public obstacle: Hedgehog;
    public materials = new Materials();

    public handleWindowResize = () => {
        this.HEIGHT = window.innerHeight;
        this.WIDTH = window.innerWidth;
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix();
    };

    public handleMouseDown = () => {
        if (this.gameStatus === 'play') {
            this.hero.jump();
        } else if (this.gameStatus === 'readyToReplay') {
            this.replay();
        }
    };

    public gameStatusChanger = (type: string) => {
        this.gameStatus = type;
    };

    public initScreenAnd3D = () => {
        this.HEIGHT = window.innerHeight;
        this.WIDTH = window.innerWidth;

        this.scene = new Scene();

        this.scene.fog = new Fog(0xd6eae6, 160, 350);

        this.aspectRatio = this.WIDTH / this.HEIGHT;
        this.fieldOfView = 50;
        this.nearPlane = 1;
        this.farPlane = 2000;
        this.camera = new PerspectiveCamera(
            this.fieldOfView,
            this.aspectRatio,
            this.nearPlane,
            this.farPlane
        );
        this.camera.position.x = 0;
        this.camera.position.z = this.cameraPosGame;
        this.camera.position.y = 30;
        this.camera.lookAt(new Vector3(0, 30, 0));

        this.renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(this.malusClearColor, this.malusClearAlpha);

        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.shadowMap.enabled = true;

        this.container = document.getElementById('world');
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.handleWindowResize, false);
        document.addEventListener('mousedown', this.handleMouseDown, false);
        document.addEventListener('touchend', this.handleMouseDown, false);

        this.clock = new Clock();
    };

    public createLights = () => {
        this.globalLight = new AmbientLight(0xffffff, 0.9);

        this.shadowLight = new DirectionalLight(0xffffff, 1);
        this.shadowLight.position.set(-30, 40, 20);
        this.shadowLight.castShadow = true;
        this.shadowLight.shadow.camera.left = -400;
        this.shadowLight.shadow.camera.right = 400;
        this.shadowLight.shadow.camera.top = 400;
        this.shadowLight.shadow.camera.bottom = -400;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 2000;
        this.shadowLight.shadow.mapSize.width = 2048;
        this.shadowLight.shadow.mapSize.height = 2048;

        this.scene.add(this.globalLight);
        this.scene.add(this.shadowLight);
    };

    public createFloor = () => {
        const floorShadow = new Mesh(
            new SphereGeometry(this.floorRadius, 50, 50),
            new MeshPhongMaterial({
                color: 0x7abf8e,
                specular: 0x000000,
                shininess: 1,
                transparent: true,
                opacity: 0.5,
            })
        );
        floorShadow.receiveShadow = true;

        const floorGrass = new Mesh(
            new SphereGeometry(this.floorRadius - 0.5, 50, 50),
            new MeshBasicMaterial({
                color: 0x7abf8e,
            })
        );
        floorGrass.receiveShadow = false;

        this.floor = new Group();
        this.floor.position.y = -this.floorRadius;

        this.floor.add(floorShadow);
        this.floor.add(floorGrass);
        this.scene.add(this.floor);
    };

    public createHero = () => {
        this.hero = new Hero({
            torsoColor: this.materials.brownMat,
            pantsColor: this.materials.whiteMat,
            tailColor: this.materials.lightBrownMat,
            headColor: this.materials.brownMat,
            cheekColor: this.materials.pinkMat,
            noseColor: this.materials.lightBrownMat,
            mouthColor: this.materials.brownMat,
            pawColor: this.materials.lightBrownMat,
            earColor: this.materials.brownMat,
            eyeColor: this.materials.whiteMat,
            irisColor: this.materials.blackMat,
        });
        this.hero.mesh.rotation.y = Math.PI / 2;
        this.scene.add(this.hero.mesh);
        this.hero.nod();
    };

    public createMonster = () => {
        this.monster = new Monster(
            {
                torsoColor: this.materials.blackMat,
                headColor: this.materials.blackMat,
                mouthColor: this.materials.blackMat,
                toothColor: this.materials.whiteMat,
                tongueColor: this.materials.pinkMat,
                noseColor: this.materials.pinkMat,
                eyeColor: this.materials.whiteMat,
                irisColor: this.materials.blackMat,
                earColor: this.materials.blackMat,
                tailColor: this.materials.blackMat,
                pawColor: this.materials.blackMat,
            },
            this.gameStatusChanger
        );
        this.monster.mesh.position.z = 20;
        this.scene.add(this.monster.mesh);
        this.updateMonsterPosition();
    };

    public updateMonsterPosition = () => {
        this.monster.delta = this.delta;
        this.monster.run();
        this.monsterPosTarget -= this.delta * this.monsterAcceleration;
        this.monsterPos +=
            (this.monsterPosTarget - this.monsterPos) * this.delta;
        if (this.monsterPos < 0.56) {
            this.gameOver();
        }

        const angle = Math.PI * this.monsterPos;
        this.monster.mesh.position.y =
            -this.floorRadius + Math.sin(angle) * (this.floorRadius + 12);
        this.monster.mesh.position.x =
            Math.cos(angle) * (this.floorRadius + 15);
        this.monster.mesh.rotation.z = -Math.PI / 2 + angle;
    };

    public gameOver = () => {
        this.fieldGameOver.className = 'show';
        this.gameStatus = 'gameOver';
        this.monster.sit();
        this.hero.hang();
        this.monster.heroHolder.add(this.hero.mesh);
        gsap.to(this, 1, {
            speed: 0,
        });
        gsap.to(this.camera.position, 3, {
            z: this.cameraPosGameOver,
            y: 60,
            x: -30,
        });
        this.carrot.mesh.visible = false;
        this.obstacle.mesh.visible = false;
        clearInterval(this.levelInterval);
    };

    public replay = () => {
        this.gameStatus = 'preparingToReplay';

        this.fieldGameOver.className = '';

        gsap.killTweensOf(this.monster.pawFL.position);
        gsap.killTweensOf(this.monster.pawFR.position);
        gsap.killTweensOf(this.monster.pawBL.position);
        gsap.killTweensOf(this.monster.pawBR.position);

        gsap.killTweensOf(this.monster.pawFL.rotation);
        gsap.killTweensOf(this.monster.pawFR.rotation);
        gsap.killTweensOf(this.monster.pawBL.rotation);
        gsap.killTweensOf(this.monster.pawBR.rotation);

        gsap.killTweensOf(this.monster.tail.rotation);
        gsap.killTweensOf(this.monster.head.rotation);
        gsap.killTweensOf(this.monster.eyeL.scale);
        gsap.killTweensOf(this.monster.eyeR.scale);

        this.monster.tail.rotation.y = 0;

        gsap.to(this.camera.position, 3, {
            z: this.cameraPosGame,
            x: 0,
            y: 30,
            ease: Power4.easeInOut,
        });
        gsap.to(this.monster.torso.rotation, 2, {
            x: 0,
            ease: Power4.easeInOut,
        });
        gsap.to(this.monster.torso.position, 2, {
            y: 0,
            ease: Power4.easeInOut,
        });
        gsap.to(this.monster.pawFL.rotation, 2, {
            x: 0,
            ease: Power4.easeInOut,
        });
        gsap.to(this.monster.pawFR.rotation, 2, {
            x: 0,
            ease: Power4.easeInOut,
        });
        gsap.to(this.monster.mouth.rotation, 2, {
            x: 0.5,
            ease: Power4.easeInOut,
        });

        gsap.to(this.monster.head.rotation, 2, {
            y: 0,
            x: -0.3,
            ease: Power4.easeInOut,
        });

        gsap.to(this.hero.mesh.position, 2, {
            x: 20,
            ease: Power4.easeInOut,
        });
        gsap.to(this.hero.head.rotation, 2, {
            x: 0,
            y: 0,
            ease: Power4.easeInOut,
        });
        gsap.to(this.monster.mouth.rotation, 2, {
            x: 0.2,
            ease: Power4.easeInOut,
        });
        gsap.to(this.monster.mouth.rotation, 1, {
            x: 0.4,
            ease: Power4.easeIn,
            delay: 1,
            onComplete: () => {
                this.resetGame();
            },
        });
    };

    public createFirs = () => {
        const nTrees = 100;
        for (let i = 0; i < nTrees; i += 1) {
            const phi = (i * (Math.PI * 2)) / nTrees;
            let theta = Math.PI / 2;
            theta +=
                Math.random() > 0.05
                    ? 0.25 + Math.random() * 0.3
                    : -0.35 - Math.random() * 0.1;

            const fir = new Tree({
                blackMat: this.materials.blackMat,
                brownMat: this.materials.brownMat,
                greenMat: this.materials.greenMat,
                lightBrownMat: this.materials.lightBrownMat,
                pinkMat: this.materials.pinkMat,
                whiteMat: this.materials.whiteMat,
            });
            fir.mesh.position.x =
                Math.sin(theta) * Math.cos(phi) * this.floorRadius;
            fir.mesh.position.y =
                Math.sin(theta) * Math.sin(phi) * (this.floorRadius - 10);
            fir.mesh.position.z = Math.cos(theta) * this.floorRadius;

            const vec = fir.mesh.position.clone();
            const axis = new Vector3(0, 1, 0);
            fir.mesh.quaternion.setFromUnitVectors(
                axis,
                vec.clone().normalize()
            );
            this.floor.add(fir.mesh);
        }
    };

    public createCarrot = () => {
        this.carrot = new Carrot({
            bodyColor: this.materials.pinkMat,
            leafColor: this.materials.greenMat,
        });
        this.scene.add(this.carrot.mesh);
    };

    public updateCarrotPosition = () => {
        this.carrot.mesh.rotation.y += this.delta * 6;
        this.carrot.mesh.rotation.z =
            Math.PI / 2 - (this.floorRotation + this.carrot.angle);
        this.carrot.mesh.position.y =
            -this.floorRadius +
            Math.sin(this.floorRotation + this.carrot.angle) *
                (this.floorRadius + 50);
        this.carrot.mesh.position.x =
            Math.cos(this.floorRotation + this.carrot.angle) *
            (this.floorRadius + 50);
    };

    public updateObstaclePosition = () => {
        if (this.obstacle.status === 'flying') {
            return;
        }

        // TODO fix this,
        if (this.floorRotation + this.obstacle.angle > 2.5) {
            this.obstacle.angle = -this.floorRotation + Math.random() * 0.3;
            this.obstacle.body.rotation.y = Math.random() * Math.PI * 2;
        }

        this.obstacle.mesh.rotation.z =
            this.floorRotation + this.obstacle.angle - Math.PI / 2;
        this.obstacle.mesh.position.y =
            -this.floorRadius +
            Math.sin(this.floorRotation + this.obstacle.angle) *
                (this.floorRadius + 3);
        this.obstacle.mesh.position.x =
            Math.cos(this.floorRotation + this.obstacle.angle) *
            (this.floorRadius + 3);
    };

    public updateFloorRotation = () => {
        this.floorRotation += this.delta * 0.03 * this.speed;
        this.floorRotation %= Math.PI * 2;
        this.floor.rotation.z = this.floorRotation;
    };

    public createObstacle = () => {
        this.obstacle = new Hedgehog({
            bodyColor: this.materials.blackMat,
            headColor: this.materials.lightBrownMat,
            noseColor: this.materials.blackMat,
            eyeColor: this.materials.whiteMat,
            irisColor: this.materials.blackMat,
            spikeColor: this.materials.blackMat,
            earColor: this.materials.lightBrownMat,
            mouthColor: this.materials.blackMat,
        });
        this.obstacle.body.rotation.y = -Math.PI / 2;
        this.obstacle.mesh.scale.set(1.1, 1.1, 1.1);
        this.obstacle.mesh.position.y = this.floorRadius + 4;
        this.obstacle.nod();
        this.scene.add(this.obstacle.mesh);
    };

    public createBonusParticles = () => {
        this.bonusParticles = new BonusParticles(
            this.materials.pinkMat,
            this.materials.greenMat
        );
        this.bonusParticles.mesh.visible = false;
        this.scene.add(this.bonusParticles.mesh);
    };

    public checkCollision = () => {
        const db = this.hero.mesh.position
            .clone()
            .sub(this.carrot.mesh.position.clone());
        const dm = this.hero.mesh.position
            .clone()
            .sub(this.obstacle.mesh.position.clone());

        if (db.length() < this.collisionBonus) {
            this.getBonus();
        }

        if (
            dm.length() < this.collisionObstacle &&
            this.obstacle.status !== 'flying'
        ) {
            this.getMalus();
        }
    };

    public getBonus = () => {
        this.bonusParticles.mesh.position.copy(this.carrot.mesh.position);
        this.bonusParticles.mesh.visible = true;
        this.bonusParticles.explose();
        this.carrot.angle += Math.PI / 2;
        this.speed *= 0.95;
        this.monsterPosTarget += 0.025;
    };

    public getMalus = () => {
        this.obstacle.status = 'flying';
        const tx =
            Math.random() > 0.5
                ? -20 - Math.random() * 10
                : 20 + Math.random() * 5;
        gsap.to(this.obstacle.mesh.position, 4, {
            x: tx,
            y: Math.random() * 50,
            z: 350,
            ease: Power4.easeOut,
        });
        gsap.to(this.obstacle.mesh.rotation, 4, {
            x: Math.PI * 3,
            z: Math.PI * 3,
            y: Math.PI * 6,
            ease: Power4.easeOut,
            onComplete: () => {
                this.obstacle.status = 'ready';
                this.obstacle.body.rotation.y = Math.random() * Math.PI * 2;
                this.obstacle.angle = -this.floorRotation - Math.random() * 0.4;
                this.obstacle.angle %= Math.PI * 2;
                this.obstacle.mesh.rotation.x = 0;
                this.obstacle.mesh.rotation.y = 0;
                this.obstacle.mesh.rotation.z = 0;
                this.obstacle.mesh.position.z = 0;
            },
        });

        this.monsterPosTarget -= 0.04;
        gsap.from(this, 0.5, {
            malusClearAlpha: 0.5,
            onUpdate: () => {
                this.renderer.setClearColor(
                    this.malusClearColor,
                    this.malusClearAlpha
                );
            },
        });
    };

    public updateDistance = () => {
        this.distance += this.delta * this.speed;
        const d = this.distance / 2;
        this.fieldDistance.innerHTML = Math.floor(d).toString();
    };

    public updateLevel = () => {
        if (this.speed >= this.maxSpeed) {
            return;
        }
        this.speed += 2;
        this.hero.speed = this.speed;
    };

    public loop = () => {
        this.delta = this.clock.getDelta();
        this.updateFloorRotation();

        if (this.gameStatus === 'play') {
            if (this.hero.status === 'running') {
                this.hero.delta = this.delta;
                this.hero.run();
            }
            this.updateDistance();
            this.updateMonsterPosition();
            this.updateCarrotPosition();
            this.updateObstaclePosition();
            this.checkCollision();
        }

        this.render();
        requestAnimationFrame(this.loop);
    };
    public render = () => {
        this.renderer.render(this.scene, this.camera);
    };

    public init = () => {
        this.initScreenAnd3D();
        this.createLights();
        this.createFloor();
        this.createHero();
        this.createMonster();
        this.createFirs();
        this.createCarrot();
        this.createBonusParticles();
        this.createObstacle();
        this.initUI();
        this.resetGame();
        this.loop();
    };

    public resetGame = () => {
        this.scene.add(this.hero.mesh);
        this.hero.mesh.rotation.y = Math.PI / 2;
        this.hero.mesh.position.y = 0;
        this.hero.mesh.position.z = 0;
        this.hero.mesh.position.x = 0;

        this.monsterPos = 0.56;
        this.monsterPosTarget = 0.65;
        this.speed = this.initSpeed;
        // speed need fix
        this.monster.speed = this.speed;
        this.monster.maxSpeed = this.maxSpeed;
        this.hero.speed = this.speed;
        this.hero.maxSpeed = this.maxSpeed;
        this.distance = 0;
        this.carrot.mesh.visible = true;
        this.obstacle.mesh.visible = true;
        this.gameStatus = 'play';
        this.hero.status = 'running';
        this.hero.nod();
        // this.audio.play();
        // this.audio.volume = 0.1;
        this.updateLevel();
        this.levelInterval = setInterval(
            this.updateLevel,
            this.levelUpdateFreq
        );
    };

    public initUI = () => {
        this.fieldDistance = document.getElementById('distValue');
        this.fieldGameOver = document.getElementById('gameoverInstructions');
    };
}

export const game = new Game();
window.addEventListener('load', game.init, false);
