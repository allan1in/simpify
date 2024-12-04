<template>
    <div class="tooltip-container" ref="triggerWrapper" @click="hideImmediate" @mouseover="handleMouseEnter"
        @mouseout="handleMouseLeave">
        <slot></slot>

        <Teleport to="body">
            <Transition :name="transitionName" @after-leave="handleAfterLeave">
                <div v-if="visible" ref="toolTip" class="tooltip-container__tooltip" :style="tooltipStyle">
                    {{ content }}
                </div>
            </Transition>
        </Teleport>
    </div>
</template>
<script>

export default {
    name: 'ToolTip',
    data() {
        return {
            visible: false,
            tooltipStyle: {},
            timer: undefined,
            transitionName: 'fade',
            content: undefined,
            delay: 600
        };
    },
    props: {
        text: {
            type: String,
            default: ''
        },
        position: {
            type: String,
            default: 'top'
        }
    },
    methods: {
        handleMouseEnter() {
            this.timer = setTimeout(() => {
                this.showTooltip();
            }, this.delay);
        },
        handleMouseLeave() {
            clearTimeout(this.timer);
            this.hideTooltip();
        },
        showTooltip() {
            this.visible = true;
            const rect = this.$refs.triggerWrapper.getBoundingClientRect();
            // Make sure to get the offsetHeight after DOM rendering is complete
            let top, left = 'auto'
            let translate
            const gutter = 8
            this.$nextTick(() => {
                switch (this.position) {
                    case 'top': {
                        top = rect.top - this.$refs.toolTip.offsetHeight - gutter
                        left = rect.left + rect.width / 2
                        translate = 'translateX(-50%)'
                        break;
                    }
                    case 'right': {
                        top = rect.top + rect.height / 2
                        left = rect.right + gutter
                        translate = 'translateY(-50%)'
                        break;
                    }
                    case 'left': {
                        top = rect.top + rect.height / 2
                        left = rect.left - this.$refs.toolTip.offsetWidth - gutter
                        translate = 'translateY(-50%)'
                        break;
                    }
                    case 'bottom': {
                        top = rect.bottom + gutter
                        left = rect.left + rect.width / 2
                        translate = 'translateX(-50%)'
                        break;
                    }
                }
                this.tooltipStyle = {
                    position: 'absolute',
                    top: top + 'px',
                    left: left + 'px',
                    transform: translate
                };
            })
        },
        hideTooltip() {
            this.visible = false;
        },
        hideImmediate() {
            this.transitionName = ''
            this.visible = false

        },
        handleAfterLeave() {
            this.transitionName = 'fade'
            this.content = this.text
        }
    },
    created() {
        this.content = this.text
    }
}
</script>
<style lang="scss" scoped>
.tooltip-container__tooltip {
    background-color: $color-bg-4;
    border-radius: $border-radius-small;
    width: max-content;
    font-size: $font-size-text-secondary;
    padding: 0.4rem 1rem;
    z-index: 99999;
}
</style>