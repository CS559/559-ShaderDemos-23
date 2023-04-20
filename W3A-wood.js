
/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";

// get things we need
import { GrWorld }  from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import {shaderMaterial} from "../libs/CS559-Framework/shaderHelper.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";



function stripeExperiment(title,fsfilebase) {
    let mydiv;

    // parameters for the transformation
    let tx = 0;
    let ty = 0;
    let tz = 0;
    let ts = 1.0;
    let trotx = 0;
    let troty = 0;
    let trotz = 0;

    function updateMatrix(matr) {
        let q = new T.Quaternion(1,0,0,0);
        q.setFromEuler( new T.Euler(trotx,troty,trotz));
        matr.compose(new T.Vector3(tx,ty,tz), q, new T.Vector3(ts,ts,ts));
        console.log("-----");
        console.log(matr);
    }

    // these are really stored in the sliders, but put in variables so we have
    // access to them (for initial values for the sliders)
    let stripes = 4.0;


    let box = InputHelpers.makeBoxDiv({width: 640},mydiv);
    if (!mydiv) {
        InputHelpers.makeBreak();   // sticks a break after the box
    }
    InputHelpers.makeHead(title,box);
    
    let world = new GrWorld({width:600, where:box, 
        lightColoring:"white"
    });
    
    let shaderMat = shaderMaterial(fsfilebase+".vs",fsfilebase+".fs", 
        {
            uniforms: {
                stripes: { value: stripes},
                sw: { value: 0.5},
                color2: { value: new T.Color("#997950")},
                color1: { value: new T.Color("#4B3A26")},
                blur : {value: -0.01},
                woodTrans : { value: new T.Matrix4() }
            }
        }
    );
    
    new InputHelpers.LabelSlider("Stripes", {min:1, max:20, initial:stripes, step:1, where:box}).oninput = function(s) {
        shaderMat.uniforms.stripes.value = Number(s.value());
        shaderMat.uniformsNeedUpdate = true;
    }
    new InputHelpers.LabelSlider("Width", {min:0, max:1.0, initial:0.5, step:.05, where:box}).oninput = function(s) {
        shaderMat.uniforms.sw.value = Number(s.value());
        shaderMat.uniformsNeedUpdate = true;
    }
    new InputHelpers.LabelSlider("Blur", {min:-.1, max:.1, initial:-0.05, step:.01, where:box}).oninput = function(s) {
        shaderMat.uniforms.blur.value = Number(s.value());
        shaderMat.uniformsNeedUpdate = true;
    }

    new InputHelpers.LabelSlider("tranf X", {min:-4, max:4, initial:tx, step:.25, where:box}).oninput = function(s) {
        tx = Number(s.value());
        updateMatrix(shaderMat.uniforms.woodTrans.value);
        shaderMat.uniformsNeedUpdate = true;
    }
    new InputHelpers.LabelSlider("tranf Y", {min:-4, max:4, initial:ty, step:.25, where:box}).oninput = function(s) {
        ty = Number(s.value());
        updateMatrix(shaderMat.uniforms.woodTrans.value);
        shaderMat.uniformsNeedUpdate = true;
    }

    new InputHelpers.LabelSlider("tranf Z", {min:-4, max:4, initial:tz, step:.25, where:box}).oninput = function(s) {
        tz = Number(s.value());
        updateMatrix(shaderMat.uniforms.woodTrans.value);
        shaderMat.uniformsNeedUpdate = true;
    }

    new InputHelpers.LabelSlider("tranf S", {min:.1, max:2, initial:ts, step:.1, where:box}).oninput = function(s) {
        ts = Number(s.value());
        updateMatrix(shaderMat.uniforms.woodTrans.value);
        shaderMat.uniformsNeedUpdate = true;
    }
    
    new InputHelpers.LabelSlider("tranf rotX", {min:-1, max:1, initial:trotx, step:.1, where:box}).oninput = function(s) {
        trotx = Number(s.value());
        updateMatrix(shaderMat.uniforms.woodTrans.value);
        shaderMat.uniformsNeedUpdate = true;
    }
    new InputHelpers.LabelSlider("tranf rotY", {min:-1, max:1, initial:troty, step:.1, where:box}).oninput = function(s) {
        troty = Number(s.value());
        updateMatrix(shaderMat.uniforms.woodTrans.value);
        shaderMat.uniformsNeedUpdate = true;
    }
    new InputHelpers.LabelSlider("tranf rotZ", {min:-1, max:1, initial:trotz, step:.1, where:box}).oninput = function(s) {
        trotz = Number(s.value());
        updateMatrix(shaderMat.uniforms.woodTrans.value);
        shaderMat.uniformsNeedUpdate = true;
    }
    
    world.add(new SimpleObjects.GrSphere({x:-2,y:1, material:shaderMat}));
    world.add(new SimpleObjects.GrSquareSign({x:2,y:1,size:1,material:shaderMat}));
    
    //@ts-ignore
    world.ambient.intensity = 1;
    
    world.go(); 
}

stripeExperiment("Wood V3A","W3A-wood");
