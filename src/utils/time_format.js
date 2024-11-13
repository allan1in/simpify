// M:SS
export function timeFormatTrack(time) {
  let min = Math.floor(time / 1000 / 60)
  let sec = Math.floor((time / 1000) % 60)
  return `${min > 59 ? '59' : min}:${(sec + '').length === 1 ? '0' + sec : sec}`
}

// {hr:HH, min:MM, sec:SS}
export function timeFormatAlbum(time) {
  let hr = Math.floor(time / 1000 / 60 / 60)
  let min = Math.floor((time / 1000 / 60) % 60)
  let sec = Math.floor((time / 1000) % 60)
  return {
    hr: hr === 0 ? undefined : hr,
    min: min === 0 ? undefined : min,
    sec: sec === 0 ? undefined : sec
  }
}
