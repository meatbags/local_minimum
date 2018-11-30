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

const easingOut = (t) => {
  return 1 - Math.pow(1 - t, 2);
}

const randomRange = (min, max) => {
  return (max - min) * Math.random() + min;
};

const clamp = (val, min, max) => {
  return Math.max(min, Math.min(max, val));
};

const posterise = (val, step) => {
  return Math.round(val / step) * step;
}

const minAngleBetween = (a, b) => {
  return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

export { blend, clamp, easing, easingOut, minAngleBetween, posterise, randomRange };
