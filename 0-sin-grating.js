
/*jshint esversion: 6 */
// @ts-check

// get things we need
import { GrWorld }  from "../libs/CS559-Framework/GrWorld.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import {shaderMaterial} from "../libs/CS559-Framework/shaderHelper.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

let mydiv;

let box = InputHelpers.makeBoxDiv({width: (mydiv ? 640:820)},mydiv);
if (!mydiv) {
    InputHelpers.makeBreak();   // sticks a break after the box
}
InputHelpers.makeHead("Shader Test Sin Stripes (aliasing)",box);

let world = new GrWorld({width:(mydiv ? 600:800), where:box, 
    lightColoring:"white"
});

let shaderMat = shaderMaterial("simple.vs","0-sin-grating.fs",
    {
        uniforms: {
            stripes: { value: 10.0}
        }
    }
);

new InputHelpers.LabelSlider("Stripes (log)", {min:.5, max:3, initial:1, step:.1, where:box}).oninput = function(s) {
    shaderMat.uniforms.stripes.value = Number(Math.pow(10,s.value()));
    shaderMat.uniformsNeedUpdate = true;
}

world.add(new SimpleObjects.GrSphere({x:-2,y:1, material:shaderMat}));
world.add(new SimpleObjects.GrSquareSign({x:2,y:1,size:1,material:shaderMat}));

world.ambient.intensity = 1;

world.go();

