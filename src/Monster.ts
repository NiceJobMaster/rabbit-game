import gsap, { Power1, Power4 } from 'gsap';
import {
    BoxGeometry,
    CylinderGeometry,
    Group,
    Matrix4,
    Mesh,
    MeshPhongMaterial,
} from 'three';

export class Monster {
    public mesh: Group;
    public heroHolder: Group;
    public runningCycle: number = 0;
    public speed: number = 5;
    public maxSpeed: number = 5;
    public delta: number;
    public body: Group;
    public torso: Mesh;
    public head: Mesh;
    public mouth: Mesh;
    public tongue: Mesh;
    public nose: Mesh;
    public eyeL: Mesh;
    public eyeR: Mesh;
    public iris: Mesh;
    public earL: Mesh;
    public earR: Mesh;
    public tail: Mesh;
    public pawFL: Mesh;
    public pawFR: Mesh;
    public pawBR: Mesh;
    public pawBL: Mesh;

    constructor(
        colors: MonsterColors,
        public gameStatusChanger: (type: string) => void
    ) {
        this.runningCycle = 0;

        this.mesh = new Group();
        this.body = new Group();

        const torsoGeom = new BoxGeometry(15, 15, 20, 1);
        this.torso = new Mesh(torsoGeom, colors.torsoColor);

        const headGeom = new BoxGeometry(20, 20, 40, 1);
        headGeom.applyMatrix4(new Matrix4().makeTranslation(0, 0, 20));
        this.head = new Mesh(headGeom, colors.headColor);
        this.head.position.z = 12;
        this.head.position.y = 2;

        const mouthGeom = new BoxGeometry(10, 4, 20, 1);
        mouthGeom.applyMatrix4(new Matrix4().makeTranslation(0, -2, 10));
        this.mouth = new Mesh(mouthGeom, colors.mouthColor);
        this.mouth.position.y = -8;
        this.mouth.rotation.x = 0.4;
        this.mouth.position.z = 4;

        this.heroHolder = new Group();
        this.heroHolder.position.z = 20;
        this.mouth.add(this.heroHolder);

        const toothGeom = new BoxGeometry(2, 2, 1, 1);

        for (let i = 0; i < 3; i += 1) {
            const toothf = new Mesh(toothGeom, colors.toothColor);
            toothf.position.x = -2.8 + i * 2.5;
            toothf.position.y = 1;
            toothf.position.z = 19;

            const toothl = new Mesh(toothGeom, colors.toothColor);
            toothl.rotation.y = Math.PI / 2;
            toothl.position.z = 12 + i * 2.5;
            toothl.position.y = 1;
            toothl.position.x = 4;

            const toothr = toothl.clone();
            toothl.position.x = -4;

            this.mouth.add(toothf);
            this.mouth.add(toothl);
            this.mouth.add(toothr);
        }

        const tongueGeometry = new BoxGeometry(6, 1, 14);
        tongueGeometry.applyMatrix4(new Matrix4().makeTranslation(0, 0, 7));

        this.tongue = new Mesh(tongueGeometry, colors.tongueColor);
        this.tongue.position.z = 2;
        this.tongue.rotation.x = -0.2;
        this.mouth.add(this.tongue);

        const noseGeom = new BoxGeometry(4, 4, 4, 1);
        this.nose = new Mesh(noseGeom, colors.noseColor);
        this.nose.position.z = 39.5;
        this.nose.position.y = 9;
        this.head.add(this.nose);

        this.head.add(this.mouth);

        const eyeGeom = new BoxGeometry(2, 3, 3);

        this.eyeL = new Mesh(eyeGeom, colors.eyeColor);
        this.eyeL.position.x = 10;
        this.eyeL.position.z = 5;
        this.eyeL.position.y = 5;
        this.eyeL.castShadow = true;
        this.head.add(this.eyeL);

        const irisGeom = new BoxGeometry(0.6, 1, 1);

        this.iris = new Mesh(irisGeom, colors.irisColor);
        this.iris.position.x = 1.2;
        this.iris.position.y = -1;
        this.iris.position.z = 1;
        this.eyeL.add(this.iris);

        this.eyeR = this.eyeL.clone();
        this.eyeR.children[0].position.x = -this.iris.position.x;
        this.eyeR.position.x = -this.eyeL.position.x;
        this.head.add(this.eyeR);

        const earGeom = new BoxGeometry(8, 6, 2, 1);

        earGeom.applyMatrix4(new Matrix4().makeTranslation(0, 3, 0));

        this.earL = new Mesh(earGeom, colors.earColor);
        this.earL.position.x = 6;
        this.earL.position.z = 1;
        this.earL.position.y = 10;
        this.earL.castShadow = true;
        this.head.add(this.earL);

        this.earR = this.earL.clone();
        this.earR.position.x = -this.earL.position.x;
        this.earR.rotation.z = -this.earL.rotation.z;
        this.head.add(this.earR);

        const tailGeom = new CylinderGeometry(5, 2, 20, 4, 1);
        tailGeom.applyMatrix4(new Matrix4().makeTranslation(0, 10, 0));
        tailGeom.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
        tailGeom.applyMatrix4(new Matrix4().makeRotationZ(Math.PI / 4));

        this.tail = new Mesh(tailGeom, colors.tailColor);
        this.tail.position.z = -10;
        this.tail.position.y = 4;
        this.torso.add(this.tail);

        const pawGeom = new CylinderGeometry(1.5, 0, 10);
        pawGeom.applyMatrix4(new Matrix4().makeTranslation(0, -5, 0));
        this.pawFL = new Mesh(pawGeom, colors.pawColor);
        this.pawFL.position.y = -7.5;
        this.pawFL.position.z = 8.5;
        this.pawFL.position.x = 5.5;
        this.torso.add(this.pawFL);

        this.pawFR = this.pawFL.clone();
        this.pawFR.position.x = -this.pawFL.position.x;
        this.torso.add(this.pawFR);

        this.pawBR = this.pawFR.clone();
        this.pawBR.position.z = -this.pawFL.position.z;
        this.torso.add(this.pawBR);

        this.pawBL = this.pawBR.clone();
        this.pawBL.position.x = this.pawFL.position.x;
        this.torso.add(this.pawBL);

        this.mesh.add(this.body);
        this.torso.add(this.head);
        this.body.add(this.torso);

        this.torso.castShadow = true;
        this.head.castShadow = true;
        this.pawFL.castShadow = true;
        this.pawFR.castShadow = true;
        this.pawBL.castShadow = true;
        this.pawBR.castShadow = true;

        this.body.rotation.y = Math.PI / 2;
    }

    public run() {
        const s = Math.min(this.speed, this.maxSpeed);
        this.runningCycle += this.delta * s * 0.7;
        this.runningCycle %= Math.PI * 2;
        const t = this.runningCycle;
        this.pawFR.rotation.x = (Math.sin(t) * Math.PI) / 4;
        this.pawFR.position.y = -5.5 - Math.sin(t);
        this.pawFR.position.z = 7.5 + Math.cos(t);
        this.pawFL.rotation.x = (Math.sin(t + 0.4) * Math.PI) / 4;
        this.pawFL.position.y = -5.5 - Math.sin(t + 0.4);
        this.pawFL.position.z = 7.5 + Math.cos(t + 0.4);
        this.pawBL.rotation.x = (Math.sin(t + 2) * Math.PI) / 4;
        this.pawBL.position.y = -5.5 - Math.sin(t + 3.8);
        this.pawBL.position.z = -7.5 + Math.cos(t + 3.8);
        this.pawBR.rotation.x = (Math.sin(t + 2.4) * Math.PI) / 4;
        this.pawBR.position.y = -5.5 - Math.sin(t + 3.4);
        this.pawBR.position.z = -7.5 + Math.cos(t + 3.4);
        this.torso.rotation.x = (Math.sin(t) * Math.PI) / 8;
        this.torso.position.y = 3 - Math.sin(t + Math.PI / 2) * 3;
        this.head.position.y = 5 - Math.sin(t + Math.PI / 2) * 2;
        this.head.rotation.x = -0.1 + Math.sin(-t - 1) * 0.4;
        this.mouth.rotation.x = 0.2 + Math.sin(t + Math.PI + 0.3) * 0.4;
        this.tail.rotation.x = 0.2 + Math.sin(t - Math.PI / 2);
        this.eyeR.scale.y = 0.5 + Math.sin(t + Math.PI) * 0.5;
    }

    public nod() {
        const sp = 1 + Math.random() * 2;

        const tHeadRotY = -Math.PI / 3 + Math.random() * 0.5;
        const tHeadRotX = Math.PI / 3 - 0.2 + Math.random() * 0.4;
        gsap.to(this.head.rotation, sp, {
            x: tHeadRotX,
            y: tHeadRotY,
            ease: Power4.easeInOut,
            onComplete: () => {
                this.nod();
            },
        });

        const tTailRotY = -Math.PI / 4;
        gsap.to(this.tail.rotation, sp / 8, {
            y: tTailRotY,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 8,
        });

        gsap.to([this.eyeR.scale, this.eyeL.scale], sp / 20, {
            y: 0,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 1,
        });
    }

    public sit() {
        const sp = 1.2;
        const ease = Power4.easeOut;
        gsap.to(this.torso.rotation, sp, {
            x: -1.3,
            ease,
        });
        gsap.to(this.torso.position, sp, {
            y: -5,
            ease,
            onComplete: () => {
                this.nod();
                this.gameStatusChanger('readyToReplay');
            },
        });

        gsap.to(this.head.rotation, sp, {
            x: Math.PI / 3,
            y: -Math.PI / 3,
            ease,
        });
        gsap.to(this.tail.rotation, sp, {
            x: 2,
            y: Math.PI / 4,
            ease,
        });
        gsap.to(this.pawBL.rotation, sp, {
            x: -0.1,
            ease,
        });
        gsap.to(this.pawBR.rotation, sp, {
            x: -0.1,
            ease,
        });
        gsap.to(this.pawFL.rotation, sp, {
            x: 1,
            ease,
        });
        gsap.to(this.pawFR.rotation, sp, {
            x: 1,
            ease,
        });
        gsap.to(this.mouth.rotation, sp, {
            x: 0.3,
            ease,
        });
        gsap.to(this.eyeL.scale, sp, {
            y: 1,
            ease,
        });
        gsap.to(this.eyeR.scale, sp, {
            y: 1,
            ease,
        });
    }
}

interface MonsterColors {
    torsoColor: MeshPhongMaterial;
    headColor: MeshPhongMaterial;
    mouthColor: MeshPhongMaterial;
    tongueColor: MeshPhongMaterial;
    noseColor: MeshPhongMaterial;
    eyeColor: MeshPhongMaterial;
    irisColor: MeshPhongMaterial;
    earColor: MeshPhongMaterial;
    tailColor: MeshPhongMaterial;
    pawColor: MeshPhongMaterial;
    toothColor: MeshPhongMaterial;
}
