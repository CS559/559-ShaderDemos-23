
/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";

// get things we need
import { GrWorld }  from "../libs/CS559-Framework/GrWorld.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import {shaderMaterial} from "../libs/CS559-Framework/shaderHelper.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";



    let mydiv;

    let box = InputHelpers.makeBoxDiv({width: 640},mydiv);
    if (!mydiv) {
        InputHelpers.makeBreak();   // sticks a break after the box
    }
    InputHelpers.makeHead("Shader Stripes",box);

    let world = new GrWorld({width:600, where:box, 
        lightColoring:"white"
    });

    let shaderMat = shaderMaterial("simple.vs","1-stripes-simple.fs",
        {
            uniforms: {
                stripes: { value: 10.0},
                sw: { value: 0.5},
                color1: { value: new T.Vector3(1,.6,0)},
                color2: { value: new T.Vector3(0,0.4,0.4)}
            }
        }
    );

    new InputHelpers.LabelSlider("Stripes", {min:2, max:50, initial:10, step:1, where:box}).oninput = function(s) {
        shaderMat.uniforms.stripes.value = Number(s.value());
        shaderMat.uniformsNeedUpdate = true;
    }
    new InputHelpers.LabelSlider("Width", {min:0, max:1.0, initial:0.5, step:.05, where:box}).oninput = function(s) {
        shaderMat.uniforms.sw.value = Number(s.value());
        shaderMat.uniformsNeedUpdate = true;
    }

    world.add(new SimpleObjects.GrSphere({x:-2,y:1, material:shaderMat}));
    world.add(new SimpleObjects.GrSquareSign({x:2,y:1,size:1,material:shaderMat}));

    world.ambient.intensity = 1;

    world.go();
