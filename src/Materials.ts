import { MeshPhongMaterial } from 'three';

export default class Materials {
    public blackMat = new MeshPhongMaterial({
        color: 0x100707,
        flatShading: true,
    });

    public brownMat = new MeshPhongMaterial({
        color: 0xb44b39,
        shininess: 0,
        flatShading: true,
    });

    public greenMat = new MeshPhongMaterial({
        color: 0x7abf8e,
        shininess: 0,
        flatShading: true,
    });

    public pinkMat = new MeshPhongMaterial({
        color: 0xdc5f45,
        shininess: 0,
        flatShading: true,
    });

    public lightBrownMat = new MeshPhongMaterial({
        color: 0xe07a57,
        flatShading: true,
    });

    public whiteMat = new MeshPhongMaterial({
        color: 0xa49789,
        flatShading: true,
    });
}
