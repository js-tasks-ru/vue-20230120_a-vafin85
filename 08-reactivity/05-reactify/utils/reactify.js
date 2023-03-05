import {computed, isRef} from 'vue';

/**
 * @template T
 * @param {function(...[*]): T} func - Исходная функция вычисления
 * @returns {function(...[*]): ComputedRef<T>} - Функция вычисления от ref-ов, возвращающая вычисляемое значение computed
 */
export function reactify(func) {
  const unref = (el) => {
    return isRef(el) ? el.value : el;
  };

  return (...args) => computed(() => func(...args.map((el) => unref(el))));
}
