import variables from '../styles/variables.module.scss'

export default function (content) {
  const msg = document.getElementById('messageContainer')
  if (msg) {
    msg.remove()
  }
  const duration = 3000
  const el = document.getElementById('mid-wrapper')
  const msg_contanier = document.createElement('div')
  msg_contanier.id = 'messageContainer'
  msg_contanier.innerText = content
  msg_contanier.style.cssText = `
    padding: 2rem;
    position: fixed;
    bottom: calc(${variables.height_player} + (2 * ${variables.gutter_2x}));
    left: 50%;
    transform: translateX(-50%) translateY(2rem);
    z-index: 10000;
    background-color: ${variables.color_font_primary};
    color: ${variables.color_bg_1};
    font-size: ${variables.font_size_text_primary};
    border-radius: ${variables.gutter};
    transition-property: all;
    transition-duration: ${variables.duration_slow};
    transition-timing-function: ease;
    opacity: 0;
    `
  el.appendChild(msg_contanier)

  clearTimeout()
  setTimeout(() => {
    msg_contanier.style.opacity = '1'
    msg_contanier.style.transform = 'translateX(-50%) translateY(0)'
  }, 0)
  setTimeout(() => {
    msg_contanier.style.opacity = '0'
    msg_contanier.style.transform = 'translateX(-50%) translateY(2rem)'
  }, duration)
  setTimeout(() => {
    msg_contanier.remove()
  }, duration + 1000)
}
