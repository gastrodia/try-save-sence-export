/**
 * Created by ELatA on 2014/4/14.
 */
require(['jquery','three','socket.io-client','controls',"threejs-stats","dat.gui","threex.domevents"],function($,THREE,io){
    var DefaultWorld = function(){
        this.camera = null;
        this.renderer = null;
        this.update = null;
        this.controls = null;
        this.enableRotateCube = false;
        THREE.Scene.apply(this);
    };
    DefaultWorld.prototype = Object.create(THREE.Scene.prototype);
    DefaultWorld.prototype.constructor = DefaultWorld;
    DefaultWorld.prototype.run = function(){
        var world = this;
        if(!world.camera){
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            world.camera = camera;
        }
        if(!this.renderer){
            var renderer =  new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            world.renderer = renderer;
        }
        if(!world.controls){
            var orbitControls = new THREE.OrbitControls(this.camera);
            orbitControls.autoRotate = false;
            world.controls = orbitControls;
        }
        if(world.enableRotateCube){
            var cube = new RotateCube();
            world.add(cube);
            if(world.update){
                var _update = world.update;
                world.update = function(){
                    cube.update();
                    _update();
                }
            }else{
                world.update = function(){
                    cube.update();
                }
            }
        }

        var clock = new THREE.Clock();
        var render = function () {
            requestAnimationFrame(render);
            var delta = new clock.getDelta();
            world.controls.update(delta);
            if(world.update){
                world.update();
            }
            world.renderer.render(world, world.camera);
        };

        render();
    };

    var RotateCube = function(){
        var geometry = new THREE.CubeGeometry(1,1,1);
        var material = new THREE.MeshBasicMaterial({color: Math.random()*0xffffff});
        THREE.Mesh.apply(this, [geometry,material]);
    }
    RotateCube.prototype = Object.create(THREE.Mesh.prototype);
    RotateCube.prototype.constructor = RotateCube;
    RotateCube.prototype.update = function(){
        this.rotation.x += 0.1;
        this.rotation.y += 0.1;
    }


    var SceneExporter = function(){} ;
    SceneExporter.prototype = {
        constructor:SceneExporter,
        parse:function(scene){

            var meshes = {};
            for(var i in scene.children){
                var node =  scene.children[i];
                if(node instanceof  THREE.Mesh){
                    console.log(node);
                }
            }
        }
    };


    var controls = new function() {
        this.SceneExporter = function(){
            var exporter = new SceneExporter();
            exporter.parse(world);
        };
    };
    var gui = new dat.GUI();
    gui.add(controls,'SceneExporter');

    var world = new DefaultWorld();
    world.enableRotateCube = true;
    world.run();

});