// we need to use the WebGL derivative functions, which are not built in
// see https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives
// note that THREE does load the extensions for derivatives
// #extension GL_EXT_shader_texture_lod : enable
// #extension GL_OES_standard_derivatives : enable

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;

uniform vec3 color1;
uniform vec3 color2;

uniform float sw;
uniform float stripes;

uniform float blur;

// constants - things we might want to tweak
// modulate the thickness of the rings
const float thickFrequency = 20.0;
const float tickAmount = .1;

// modulate the distance from center (radius)
const float radialFreq = 4.0;
const float radialAmount = 1.0;

// anti-alias both sides of the stripe
// we need to deal with both sides of the stripe
// having the stripe edge at the boundary makes things tricky,
// so I'll put the stripe edge in the center
// then we treat each side of the stripe separately
void main()
{
    // uv so that (0,0) is the center 
    float nu = (v_uv.x -.5) * stripes;
    float nv = (v_uv.y -.5) * stripes;

    // now the distance
    float d = sqrt(nu*nu + nv*nv);

    // we also want the angle, so we can use it to make circular noise
    float angle = atan(nv,nu);

    // add to the distance based on where we are around the circle
    d += radialAmount * sin(radialFreq * angle);

    // now we need to know ehre in the stripe are we
    float su = fract(d);
 
     // the trick is to use the distance to the stripe (which we put at -.5)
     // we compute it here because it is the thing that determines the amount
     // of anti-aliasing - note that I add in some randomness to the
    float dst = abs(su-0.5) + tickAmount * sin(angle * thickFrequency);

    // amount of anti-aliasing
    // warning... the amount for fwidth cannot be su - since it is different at the fract
    // boundary!
    float a = blur >= 0.0 ? blur : fwidth(dst);
    // the "half width" of the stripe
    float h = sw/2.0;

    // version 2: based on the distance to the stripe
    // 
    // float st=step(h,abs(su-.5));
    float st = smoothstep(h-a,h+a,abs(dst));

    vec3 color = mix(color1, color2, st);

    // color = vec3(abs(su-.5),abs(su-.5),abs(su-.5));
    gl_FragColor = vec4(color,1);
}
