/*
 * Simple Vertex Shader
 * Simplest vertex shader, except that we add the UV coordinate
 * All we do is pass this to the fragment shader 
 */

 /* Provided by THREE: (see https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram)
uniform mat4 modelViewMatrix;
attribute vec3 position;
attribute vec2 uv;
  */

/* pass interpolated variables to the fragment */
varying vec4 v_uv;

/* the transform from local coordinates to "Wood Coordinates" */
uniform mat4 woodTrans;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // pass the texture coordinate to the fragment
    v_uv = woodTrans * vec4(position,1.0);

    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}