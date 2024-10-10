export function debounce(func, wait = 1500) {
  let timeout

  return function () {
    let context = this
    let args = arguments

    clearTimeout(timeout)
    timeout = setTimeout(function () {
      func.apply(context, args)
    }, wait)
  }
}
