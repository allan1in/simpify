import { createApp } from 'vue'
import Message from './index.vue'
import variables from '@/styles/variables.module.scss'

const createInstance = (config = {}) => {
  const bottom = `calc(${variables.height_player} + ${variables.gutter_4x}`
  const height = `calc(2 * ${variables.gutter_4x} + ${variables.font_size_text_primary})`
  // Create a message_box
  const message_box = document.createElement('div')
  message_box.className = 'message-box'

  const messageList = document.getElementsByClassName('message-box')
  // Set bottom distance
  message_box.style.bottom = `calc(${bottom} + (${messageList.length} * ${height}))`
  // Reset each message's bottom distance
  const resetMsgTop = () => {
    for (let i = 0; i < messageList.length; i++) {
      if (i === 0) {
        messageList[i].style.bottom = bottom
      } else {
        messageList[i].style.bottom = `calc(${bottom} + (${i} * ${height}))`
      }
    }
  }

  const handleRemove = () => {
    app.unmount(message_box)
    document.body.removeChild(message_box)
    resetMsgTop()
  }
  // Create app by SFC
  const app = createApp(Message, {
    config,
    remove() {
      handleRemove()
    }
  })

  // Mount the app on message_box
  app.vm = app.mount(message_box)
  document.body.appendChild(message_box)
}

export default function (config) {
  // Set default duration for string type config
  config =
    typeof config === 'string'
      ? {
          content: config,
          duration: 3000
        }
      : config

  createInstance(config)
}
