import { createApp } from 'vue'
import Tooltip from '@/components/ToolTip/index.vue'

export default {
  mounted(el, binding) {
    if (!binding.value) {
      return
    }
    const app = createApp(Tooltip)
    const instance = app.mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    const content = typeof binding.value === 'string' ? binding.value : binding.value.content || ''
    const placement = binding.value.placement || 'top'

    const showTooltip = () => {
      const rect = el.getBoundingClientRect()
      instance.content = content
      instance.rect = rect
      instance.placement = placement
      instance.show()
    }

    const hideTooltip = () => {
      instance.hide()
    }

    el.addEventListener('mouseenter', showTooltip)
    el.addEventListener('mouseleave', hideTooltip)
    el.addEventListener('click', hideTooltip)

    el._showTooltip = showTooltip
    el._hideTooltip = hideTooltip
    el._instance = instance
  },
  updated(el, binding) {
    if (!binding.value) {
      return
    }
    const content = typeof binding.value === 'string' ? binding.value : binding.value.content || ''
    const placement = binding.value.placement || 'top'
    const instance = el._instance

    const showTooltip = () => {
      const rect = el.getBoundingClientRect()
      instance.content = content
      instance.rect = rect
      instance.placement = placement
      instance.show()
    }

    el.removeEventListener('mouseenter', el._showTooltip)
    el.addEventListener('mouseenter', showTooltip)

    el._showTooltip = showTooltip
    el._instance = instance
  },
  beforeUnmount(el) {
    if (el._instance) {
      el._instance.hide()
    }
  },
  unmounted(el) {
    el.removeEventListener('mouseenter', el._showTooltip)
    el.removeEventListener('mouseleave', el._hideTooltip)
    el.removeEventListener('click', el._hideTooltip)
  }
}
