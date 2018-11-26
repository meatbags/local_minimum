/**
 ** Maths funcs.
 **/

const blend = (a, b, t) => {
  return a + (b - a) * t;
};

const easing = (t) => {
  if (t < 0.5) {
    return 2.0 * t * t;
  } else {
    return -1.0 + (4.0 - 2.0 * t) * t;
  }
}

const randomRange = (min, max) => {
  return (max - min) * Math.random() + min;
};

export { blend, randomRange, easing };
