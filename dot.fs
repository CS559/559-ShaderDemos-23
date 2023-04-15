/* a simple procedural texture: dots */

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;

/* colors for the dots */
uniform vec3 light;
uniform vec3 dark;

/* number of dots over the UV range */
uniform float dots;
/* how big are the circles */
uniform float radius;

/* amount of blur - -1 means do it "correctly" */
uniform float blur;

// lighting parameters
const float ambient = .2;
const vec3 lightDir = normalize(vec3(1,1,1));

varying vec3 l_normal;

// we pass blur so we can switch it off
float fdot(vec2 uv, float bl) {
    float x = uv.x * dots;
    float y = uv.y * dots;

    float xc = floor(x);
    float yc = floor(y);

    float dx = x-xc-.5;
    float dy = y-yc-.5;

    float d = sqrt(dx*dx + dy*dy);

    // if the blur is positive, use it for blurring
    // if the blur is negative - compute the amount of bluring using fwidth
    float a = bl >= -.001 ? bl : fwidth(d);
    float dc = 1.0-smoothstep(radius-a,radius+a,d);

    // for the non anti-aliased version
    // dc = 1.0-step(radius,d);
    
    return dc;
}

void main()
{
    // 
    float dc;
    if (blur < .5) {
        dc = fdot(v_uv, blur);
    } else {
        float u = v_uv.x;
        float v = v_uv.y;
        float dudx = dFdx(u) / 3.0;
        float dudy = dFdx(u) / 3.0;
        float dvdx = dFdy(v) / 3.0;
        float dvdy = dFdy(v) / 3.0;
        float dc1 = fdot(vec2(u+dudx,v+dvdx),0.0);
        float dc2 = fdot(vec2(u-dudx,v-dvdx),0.0);
        float dc3 = fdot(vec2(u+dudy,v+dvdy),0.0);
        float dc4 = fdot(vec2(u-dudy,v-dvdy),0.0);
        dc = (dc1+dc2+dc3+dc4)/4.0;
    }
    vec3 baseColor = mix(light,dark,dc);

    // simple diffuse lighting
    // we need to renormalize the normal since it was interpolated
    vec3 nhat = normalize(l_normal);

    float bright = clamp(dot(nhat, lightDir),0.0,1.0);

    // add ambient
    bright = clamp(bright+ambient,0.0,1.0);

    // brighten the base color
    gl_FragColor = vec4(bright * baseColor,1);
}

