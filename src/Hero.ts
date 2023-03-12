import gsap, { Back, Power1, Power4 } from 'gsap';
import { BoxGeometry, Group, Matrix4, Mesh, MeshPhongMaterial } from 'three';

export default class Hero {
    public mesh: Group;
    public status: string;
    public runningCycle: number;
    public body: Group;
    public speed: number;
    public delta: number;
    public maxSpeed: number;
    public torso: Mesh;
    public pants: Mesh;
    public tail: Mesh;
    public head: Mesh;
    public cheekR: Mesh;
    public cheekL: Mesh;
    public nose: Mesh;
    public mouth: Mesh;
    public pawFR: Mesh;
    public pawFL: Mesh;
    public pawBR: Mesh;
    public pawBL: Mesh;
    public earR: Mesh;
    public earL: Mesh;
    public eyeR: Mesh;
    public eyeL: Mesh;
    public iris: Mesh;

    constructor(colors: HeroColors) {
        this.status = 'running';
        this.runningCycle = 0;
        this.mesh = new Group();
        this.body = new Group();
        this.mesh.add(this.body);

        const torsoGeom = new BoxGeometry(7, 7, 10, 1);

        this.torso = new Mesh(torsoGeom, colors.torsoColor);
        this.torso.position.z = 0;
        this.torso.position.y = 7;
        this.torso.castShadow = true;
        this.body.add(this.torso);

        const pantsGeom = new BoxGeometry(9, 9, 5, 1);
        this.pants = new Mesh(pantsGeom, colors.pantsColor);
        this.pants.position.z = -3;
        this.pants.position.y = 0;
        this.pants.castShadow = true;
        this.torso.add(this.pants);

        const tailGeom = new BoxGeometry(3, 3, 3, 1);
        tailGeom.applyMatrix4(new Matrix4().makeTranslation(0, 0, -2));
        this.tail = new Mesh(tailGeom, colors.tailColor);
        this.tail.position.z = -4;
        this.tail.position.y = 5;
        this.tail.castShadow = true;
        this.torso.add(this.tail);

        this.torso.rotation.x = -Math.PI / 8;

        const headGeom = new BoxGeometry(10, 10, 13, 1);

        headGeom.applyMatrix4(new Matrix4().makeTranslation(0, 0, 7.5));
        this.head = new Mesh(headGeom, colors.headColor);
        this.head.position.z = 2;
        this.head.position.y = 11;
        this.head.castShadow = true;
        this.body.add(this.head);

        const cheekGeom = new BoxGeometry(1, 4, 4, 1);
        this.cheekR = new Mesh(cheekGeom, colors.cheekColor);
        this.cheekR.position.x = -5;
        this.cheekR.position.z = 7;
        this.cheekR.position.y = -2.5;
        this.cheekR.castShadow = true;
        this.head.add(this.cheekR);

        this.cheekL = this.cheekR.clone();
        this.cheekL.position.x = -this.cheekR.position.x;
        this.head.add(this.cheekL);

        const noseGeom = new BoxGeometry(6, 6, 3, 1);
        this.nose = new Mesh(noseGeom, colors.noseColor);
        this.nose.position.z = 13.5;
        this.nose.position.y = 2.6;
        this.nose.castShadow = true;
        this.head.add(this.nose);

        const mouthGeom = new BoxGeometry(4, 2, 4, 1);
        mouthGeom.applyMatrix4(new Matrix4().makeTranslation(0, 0, 3));
        mouthGeom.applyMatrix4(new Matrix4().makeRotationX(Math.PI / 12));
        this.mouth = new Mesh(mouthGeom, colors.mouthColor);
        this.mouth.position.z = 8;
        this.mouth.position.y = -4;
        this.mouth.castShadow = true;
        this.head.add(this.mouth);

        const pawFGeom = new BoxGeometry(3, 3, 3, 1);
        this.pawFR = new Mesh(pawFGeom, colors.pawColor);
        this.pawFR.position.x = -2;
        this.pawFR.position.z = 6;
        this.pawFR.position.y = 1.5;
        this.pawFR.castShadow = true;
        this.body.add(this.pawFR);

        this.pawFL = this.pawFR.clone();
        this.pawFL.position.x = -this.pawFR.position.x;
        this.pawFL.castShadow = true;
        this.body.add(this.pawFL);

        const pawBGeom = new BoxGeometry(3, 3, 6, 1);
        this.pawBL = new Mesh(pawBGeom, colors.pawColor);
        this.pawBL.position.y = 1.5;
        this.pawBL.position.z = 0;
        this.pawBL.position.x = 5;
        this.pawBL.castShadow = true;
        this.body.add(this.pawBL);

        this.pawBR = this.pawBL.clone();
        this.pawBR.position.x = -this.pawBL.position.x;
        this.pawBR.castShadow = true;
        this.body.add(this.pawBR);

        const earGeom = new BoxGeometry(7, 18, 2, 1);

        earGeom.applyMatrix4(new Matrix4().makeTranslation(0, 9, 0));

        this.earL = new Mesh(earGeom, colors.earColor);
        this.earL.position.x = 2;
        this.earL.position.z = 2.5;
        this.earL.position.y = 5;
        this.earL.rotation.z = -Math.PI / 12;
        this.earL.castShadow = true;
        this.head.add(this.earL);

        this.earR = this.earL.clone();
        this.earR.position.x = -this.earL.position.x;
        this.earR.rotation.z = -this.earL.rotation.z;
        this.earR.castShadow = true;
        this.head.add(this.earR);

        const eyeGeom = new BoxGeometry(2, 4, 4);

        this.eyeL = new Mesh(eyeGeom, colors.eyeColor);
        this.eyeL.position.x = 5;
        this.eyeL.position.z = 5.5;
        this.eyeL.position.y = 2.9;
        this.eyeL.castShadow = true;
        this.head.add(this.eyeL);

        const irisGeom = new BoxGeometry(0.6, 2, 2);

        this.iris = new Mesh(irisGeom, colors.irisColor);
        this.iris.position.x = 1.2;
        this.iris.position.y = 1;
        this.iris.position.z = 1;
        this.eyeL.add(this.iris);

        this.eyeR = this.eyeL.clone();
        this.eyeR.children[0].position.x = -this.iris.position.x;

        this.eyeR.position.x = -this.eyeL.position.x;
        this.head.add(this.eyeR);

        this.body.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }

    public jump() {
        if (this.status === 'jumping') {
            return;
        }
        this.status = 'jumping';
        const totalSpeed = 10 / this.speed;
        const jumpHeight = 45;

        gsap.to(this.earL.rotation, totalSpeed, {
            x: '+=.3',
            ease: Back.easeOut,
        });

        gsap.to(this.earR.rotation, totalSpeed, {
            x: '-=.3',
            ease: Back.easeOut,
        });

        gsap.to(this.pawFL.rotation, totalSpeed, {
            x: '+=.7',
            ease: Back.easeOut,
        });

        gsap.to(this.pawFR.rotation, totalSpeed, {
            x: '-=.7',
            ease: Back.easeOut,
        });

        gsap.to(this.pawBL.rotation, totalSpeed, {
            x: '+=.7',
            ease: Back.easeOut,
        });

        gsap.to(this.pawBR.rotation, totalSpeed, {
            x: '-=.7',
            ease: Back.easeOut,
        });

        gsap.to(this.tail.rotation, totalSpeed, {
            x: '+=1',
            ease: Back.easeOut,
        });

        gsap.to(this.mouth.rotation, totalSpeed, {
            x: 0.5,
            ease: Back.easeOut,
        });

        gsap.to(this.mesh.position, totalSpeed / 2, {
            y: jumpHeight,
            ease: Power4.easeIn,
        });

        gsap.to(this.mesh.position, totalSpeed / 2, {
            y: 0,
            ease: Power4.easeIn,
            delay: totalSpeed / 2,
            onComplete: () => {
                this.status = 'running';
            },
        });
    }

    public run() {
        this.status = 'running';
        const s = Math.min(this.speed, this.maxSpeed);
        this.runningCycle += this.delta * s * 0.7;
        this.runningCycle %= Math.PI * 2;
        const t = this.runningCycle;
        const amp = 4;
        const disp = 0.2;

        this.body.position.y = 6 + Math.sin(t - Math.PI / 2) * amp;
        this.body.rotation.x = 0.2 + Math.sin(t - Math.PI / 2) * amp * 0.1;

        this.torso.rotation.x = Math.sin(t - Math.PI / 2) * amp * 0.1;
        this.torso.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * 0.5;

        this.mouth.rotation.x = Math.PI / 16 + Math.cos(t) * amp * 0.05;

        this.head.position.z = 2 + Math.sin(t - Math.PI / 2) * amp * 0.5;
        this.head.position.y = 8 + Math.cos(t - Math.PI / 2) * amp * 0.7;
        this.head.rotation.x = -0.2 + Math.sin(t + Math.PI) * amp * 0.1;

        this.earL.rotation.x = Math.cos(-Math.PI / 2 + t) * (amp * 0.2);
        this.earR.rotation.x = Math.cos(-Math.PI / 2 + 0.2 + t) * (amp * 0.3);

        const eyeScaleY =
            0.7 + Math.abs(Math.cos(-Math.PI / 4 + t * 0.5)) * 0.6;
        this.eyeR.scale.y = eyeScaleY;
        this.eyeL.scale.y = eyeScaleY;

        this.tail.rotation.x = Math.cos(Math.PI / 2 + t) * amp * 0.3;

        this.pawFR.position.y = 1.5 + Math.sin(t) * amp;
        this.pawFR.rotation.x = (Math.cos(t) * Math.PI) / 4;
        this.pawFR.position.z = 6 - Math.cos(t) * amp * 2;

        this.pawFL.position.y = 1.5 + Math.sin(disp + t) * amp;
        this.pawFL.rotation.x = (Math.cos(t) * Math.PI) / 4;
        this.pawFL.position.z = 6 - Math.cos(disp + t) * amp * 2;

        this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
        this.pawBR.rotation.x = (Math.cos(t + Math.PI * 1.5) * Math.PI) / 3;
        this.pawBR.position.z = -Math.cos(Math.PI + t) * amp;

        this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
        this.pawBL.rotation.x = (Math.cos(t + Math.PI * 1.5) * Math.PI) / 3;
        this.pawBL.position.z = -Math.cos(Math.PI + t) * amp;
    }

    public nod() {
        const sp = 0.5 + Math.random();

        const tHeadRotY = -Math.PI / 6 + (Math.random() * Math.PI) / 3;
        gsap.to(this.head.rotation, sp, {
            y: tHeadRotY,
            ease: Power4.easeInOut,
            onComplete: () => {
                this.nod();
            },
        });

        const tEarLRotX = Math.PI / 4 + (Math.random() * Math.PI) / 6;
        const tEarRRotX = Math.PI / 4 + (Math.random() * Math.PI) / 6;

        gsap.to(this.earL.rotation, sp, {
            x: tEarLRotX,
            ease: Power4.easeInOut,
        });
        gsap.to(this.earR.rotation, sp, {
            x: tEarRRotX,
            ease: Power4.easeInOut,
        });

        const tPawBLRot = (Math.random() * Math.PI) / 2;
        const tPawBLY = -4 + Math.random() * 8;

        gsap.to(this.pawBL.rotation, sp / 2, {
            x: tPawBLRot,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 2,
        });
        gsap.to(this.pawBL.position, sp / 2, {
            y: tPawBLY,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 2,
        });

        const tPawBRRot = (Math.random() * Math.PI) / 2;
        const tPawBRY = -4 + Math.random() * 8;
        gsap.to(this.pawBR.rotation, sp / 2, {
            x: tPawBRRot,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 2,
        });
        gsap.to(this.pawBR.position, sp / 2, {
            y: tPawBRY,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 2,
        });

        const tPawFLRot = (Math.random() * Math.PI) / 2;
        const tPawFLY = -4 + Math.random() * 8;

        gsap.to(this.pawFL.rotation, sp / 2, {
            x: tPawFLRot,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 2,
        });

        gsap.to(this.pawFL.position, sp / 2, {
            y: tPawFLY,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 2,
        });

        const tPawFRRot = (Math.random() * Math.PI) / 2;
        const tPawFRY = -4 + Math.random() * 8;

        gsap.to(this.pawFR.rotation, sp / 2, {
            x: tPawFRRot,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 2,
        });

        gsap.to(this.pawFR.position, sp / 2, {
            y: tPawFRY,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 2,
        });

        const tMouthRot = (Math.random() * Math.PI) / 8;
        gsap.to(this.mouth.rotation, sp, {
            x: tMouthRot,
            ease: Power1.easeInOut,
        });

        const tIrisY = -1 + Math.random() * 2;
        const tIrisZ = -1 + Math.random() * 2;
        const iris1 = this.iris;
        const iris2 = this.eyeR.children[0];
        gsap.to([iris1.position, iris2.position], sp, {
            y: tIrisY,
            z: tIrisZ,
            ease: Power1.easeInOut,
        });

        if (Math.random() > 0.2) {
            gsap.to([this.eyeR.scale, this.eyeL.scale], sp / 8, {
                y: 0,
                ease: Power1.easeInOut,
                yoyo: true,
                repeat: 1,
            });
        }
    }

    public hang() {
        const sp = 1;

        gsap.killTweensOf(this.eyeL.scale);
        gsap.killTweensOf(this.eyeR.scale);

        this.body.rotation.x = 0;
        this.torso.rotation.x = 0;
        this.body.position.y = 0;
        this.torso.position.y = 7;

        gsap.to(this.mesh.rotation, sp, {
            y: 0,
            ease: Power4.easeOut,
        });
        gsap.to(this.mesh.position, sp, {
            y: -7,
            z: 6,
            ease: Power4.easeOut,
        });
        gsap.to(this.head.rotation, sp, {
            x: Math.PI / 6,
            ease: Power4.easeOut,
            onComplete: () => {
                this.nod();
            },
        });

        gsap.to(this.earL.rotation, sp, {
            x: Math.PI / 3,
            ease: Power4.easeOut,
        });
        gsap.to(this.earR.rotation, sp, {
            x: Math.PI / 3,
            ease: Power4.easeOut,
        });

        gsap.to(this.pawFL.position, sp, {
            y: -1,
            z: 3,
            ease: Power4.easeOut,
        });
        gsap.to(this.pawFR.position, sp, {
            y: -1,
            z: 3,
            ease: Power4.easeOut,
        });
        gsap.to(this.pawBL.position, sp, {
            y: -2,
            z: -3,
            ease: Power4.easeOut,
        });
        gsap.to(this.pawBR.position, sp, {
            y: -2,
            z: -3,
            ease: Power4.easeOut,
        });

        gsap.to(this.eyeL.scale, sp, {
            y: 1,
            ease: Power4.easeOut,
        });
        gsap.to(this.eyeR.scale, sp, {
            y: 1,
            ease: Power4.easeOut,
        });
    }
}

interface HeroColors {
    torsoColor: MeshPhongMaterial;
    pantsColor: MeshPhongMaterial;
    tailColor: MeshPhongMaterial;
    headColor: MeshPhongMaterial;
    cheekColor: MeshPhongMaterial;
    noseColor: MeshPhongMaterial;
    mouthColor: MeshPhongMaterial;
    pawColor: MeshPhongMaterial;
    earColor: MeshPhongMaterial;
    eyeColor: MeshPhongMaterial;
    irisColor: MeshPhongMaterial;
}
