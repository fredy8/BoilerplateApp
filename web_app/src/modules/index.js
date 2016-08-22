import { allPass, compose, not, is, map, apply, propSatisfies, reverse, toPairs, curryN } from 'ramda';

const isNumber = allPass([compose(not, isNaN), is(Number)]);

const formatPercentage = (x) => Math.round(x*100) + "%";

const makeValidator = compose(allPass,
      map(compose(apply(propSatisfies), reverse)),
      toPairs);

const validateObject = (validations, obj) => allPass([is(Object), makeValidator(validations)], obj);

export default {
  isNumber,
  formatPercentage,
  validateObject: curryN(2, validateObject)
};
