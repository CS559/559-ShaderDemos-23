// we need to use the WebGL derivative functions, which are not built in
// see https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives
// note that THREE does load the extensions for derivatives
// update - it seems like THREE does load the extensions (?)
//#extension GL_EXT_shader_texture_lod : enable
//#extension GL_OES_standard_derivatives : enable

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;

uniform float stripes;

float sinx(float v) 
{
    return sin(6.28*stripes*v);
}

void main()
{
    float l = sinx(v_uv.x);
    float r = l;
    float g = l;
    float b = l;
    gl_FragColor = vec4(r,g,b,1);
}
