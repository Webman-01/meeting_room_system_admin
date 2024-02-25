export function debounce(this: any, fun: Function, delay: number) {
  let timeoutID: ReturnType<typeof setTimeout>;
  let that = this;
  return function () {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
      fun.apply(that, arguments);
    }, delay);
  };
}
