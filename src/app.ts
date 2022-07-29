import {
    ArcRotateCamera, Color4,
    Engine,
    FreeCamera,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3
} from "@babylonjs/core";
import '@babylonjs/loaders/glTF';

enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }

class App {
    private _scene : Scene;
    private readonly _canvas : HTMLCanvasElement;
    private readonly _engine : Engine;

    private _state : number = 0;

    constructor(){
        this._canvas = document.createElement('canvas');
        this._canvas.style.width = '100%';
        this._canvas.style.height = '100%';
        this._canvas.id='babylonApp';
        document.body.appendChild(this._canvas);

        this._engine = new Engine(this._canvas, true);
        this._scene = this.CreateScene(this._engine, this._canvas);

        window.addEventListener("keydown", (ev) => {
            if(ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

        window.addEventListener("resize", () => {
            this._engine.resize();
        });

        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }

    CreateScene(engine : Engine, canvas : HTMLCanvasElement) : Scene {

        let scene = new Scene(engine);

        let camera : ArcRotateCamera = new ArcRotateCamera('camera', 0, 0, 1, new Vector3(0, 0, 0), scene);
        camera.attachControl(canvas,true);
        let light1 : HemisphericLight = new HemisphericLight('light1',new Vector3(1,1,0),scene);
        let sphere : Mesh = MeshBuilder.CreateSphere('sphere',{diameter:1},scene);

        return scene;
    }

    private async _goToStart() {
        this._engine.displayLoadingUI();

        this._scene.detachControl();
        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(0,0,0,1);

        let camera : FreeCamera = new FreeCamera('camera', new Vector3(0,0,0), scene);
        camera.setTarget(Vector3.Zero());

        await scene.whenReadyAsync();
        this._engine.hideLoadingUI();

        this._scene.dispose();
        this._scene = scene;
        this._state = State.START;

    }
}
new App();