// MM:SS
export function timeFormatTrack(time) {
  let min = Math.floor(time / 1000 / 60)
  let sec = Math.floor((time / 1000) % 60)
  return `${min > 59 ? '59' : (min + '').length === 1 ? '0' + min : min}:${(sec + '').length === 1 ? '0' + sec : sec}`
}

// HH hour MM min SS sec
export function timeFormatAlbum(time) {
  let hour = Math.floor(time / 1000 / 60 / 60)
  let min = Math.floor(time / 1000 / 60)
  let sec = Math.floor((time / 1000) % 60)
  return `${hour === 0 ? '' : hour + ' hour '}${min === 0 ? '' : min + ' min '}${sec === 0 ? '' : sec + ' sec'}`
}
