/*
 * Simple Vertex 
 * Simple vertex shader, except that we add the UV coordinate
 * All we do is pass this to the fragment shader 
 */
/* number of dots over the UV range */
uniform float dots;
/* how big are the circles */
uniform float radius;
/* amount of blur - -1 means do it "correctly" */
uniform float blur;


float fdot(vec2 uv) {
    float x = uv.x * dots;
    float y = uv.y * dots;

    float xc = floor(x);
    float yc = floor(y);

    float dx = x-xc-.5;
    float dy = y-yc-.5;

    float d = sqrt(dx*dx + dy*dy);
    // if the blur is positive, use it for blurring
    // if the blur is negative - compute the amount of bluring using fwidth
    float a = blur;
    float dc = 1.0-smoothstep(radius-a,radius+a,d);

    return dc;
}

// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// in vec3 position;
// in vec3 normal;

// The varying is the "output" to the fragment shader
// I call it v_normal to remind myself that it is for the vertex
// the fragment shader will get interpolated values
/* pass interpolated variables to the fragment */
varying vec2 v_uv;
varying vec3 l_normal;
varying vec3 v_world_position;

void main() {
    v_uv = uv;

    float d = fdot(uv);

    vec4 world_pos = (modelMatrix * vec4(position,1.0));
    v_world_position = world_pos.xyz;
    
    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * viewMatrix * world_pos;
    
    // compute the normal and pass it to fragment
    // note - this is in world space, but uses a hack that
    // assumes the model matrix is its own adjoint 
    // (which is true, sometimes)
    l_normal = (modelMatrix * vec4(normal,0)).xyz;
}
