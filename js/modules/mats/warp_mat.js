// uniform float time

const warpMat = `
  // positio
  vec3 p = position;
  vec3 n = vNormal;
  float t = time * 0.5;
  vec3 inp = position;
  inp.x = (inp.x + t) * 0.25;
  inp.y = 0.0;
  inp.z += t;
  float noise = pnoise(inp * 0.5);
  float noise2 = pnoise(inp * 2.0);
  //p.x += 0.25 * sin(p.z + t);
  p.y += noise * 3.0 + noise2 * 0.1;
  //p.z += 0.25 * sin(p.x + t);

  //float scaleY = min(1.0, time * 0.25);
  //p.y *= scaleY;

  // do transform
  vec4 pm = modelMatrix * vec4(p, 1.0);
  vec3 transformed = vec3(pm.x, pm.y, pm.z);

  // normal
  vec3 pn = vNormal + vec3(p - position);
  vNormal = normalize(pn);
`;

export { warpMat };
