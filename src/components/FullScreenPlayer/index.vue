<template>
    <main v-if="showFullScreenPlayer" class="full-screen-container">
        <div class="full-screen-container__top">
            <div class="full-screen-container__top__title">
                <div class="full-screen-container__top__title__icon-wrapper">
                    <IconPrimaryLogo />
                </div>
                <div class="full-screen-container__top__title__text-wrapper">
                    <h1 class="full-screen-container__top__title__text-wrapper__from">PLAYING FROM {{ fromType }}</h1>
                    <h2 class="full-screen-container__top__title__text-wrapper__name">{{ fromName }}</h2>
                </div>
            </div>
            <button class="full-screen-container__top__close-wrapper" @click="toggleFullScreemPlayer">
                <div class="full-screen-container__top__close-wrapper__close">
                    <IconClose />
                </div>
            </button>
        </div>
        <div class="full-screen-container__content">
            <div class="full-screen-container__content__cover-wrapper">
                <img class="full-screen-container__content__cover-wrapper__cover" :src="coverUrl" :alt="name">
            </div>
            <div class="full-screen-container__content__text-wrapper">
                <h1 class="full-screen-container__content__text-wrapper__name">{{ name }}</h1>
                <h2 class="full-screen-container__content__text-wrapper__artist">{{ artist }}</h2>
            </div>
        </div>
        <div class="full-screen-container__player">
            <div class="full-screen-container__player__process-bar">
                <div class="full-screen-container__player__process-bar__seek">{{ seek }}</div>
                <ProcessBar :percentage="percentage" />
                <div class="full-screen-container__player__process-bar__duration">{{ duration }}</div>
            </div>
            <div class="full-screen-container__player__btns">
                <div class="full-screen-container__player__btns__left"></div>
                <div class="full-screen-container__player__btns__mid">
                    <button class="icon-wrapper" :class="{ 'btn-active': isShuffle }" @click="toggleShuffle">
                        <IconShuffle />
                    </button>
                    <button class="icon-wrapper">
                        <IconPrevious />
                    </button>
                    <button class="full-screen-container__player__btns__mid__play" @click="togglePause">
                        <span class="full-screen-container__player__btns__mid__play__icon-wrapper-round">
                            <IconPlay v-if="isPause" />
                            <IconPause v-else />
                        </span>
                    </button>
                    <button class="icon-wrapper">
                        <IconNext />
                    </button>
                    <button class="icon-wrapper" :class="{ 'btn-active': isRepeat }" @click="toggleRepeat">
                        <IconRepeat />
                    </button>
                </div>
                <div class="full-screen-container__player__btns__right">
                    <div class="full-screen-container__player__btns__right__volume">
                        <VolumeBar />
                    </div>
                    <button class="icon-wrapper" @click="toggleFullScreemPlayer">
                        <IconFullScreenClose />
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { useTrackStore } from '@/stores/track'
import { mapActions, mapState } from 'pinia';
import IconPrimaryLogo from '@/components/Icons/IconPrimaryLogo.vue';
import IconClose from '@/components/Icons/IconClose.vue';
import ProcessBar from '@/components/ProcessBar/index.vue'
import IconShuffle from '../Icons/IconShuffle.vue';
import IconPause from '../Icons/IconPause.vue';
import IconPlay from '../Icons/IconPlay.vue';
import IconPrevious from '../Icons/IconPrevious.vue';
import IconNext from '../Icons/IconNext.vue';
import IconRepeat from '../Icons/IconRepeat.vue';
import IconFullScreenClose from '../Icons/IconFullScreenClose.vue';
import VolumeBar from '@/components/VolumeBar/index.vue'

export default {
    name: 'FullScreenPlayer',
    computed: {
        ...mapState(useAppStore, ['showFullScreenPlayer', 'isPause', 'isRepeat', 'isShuffle', 'isMute', 'volume']),
        ...mapState(useTrackStore, ['fromType', 'fromName', 'coverUrl', 'name', 'artist', 'seek', 'duration', 'percentage'])
    },
    components: {
        IconPrimaryLogo,
        IconClose,
        IconShuffle,
        IconPause,
        IconPlay,
        IconPrevious,
        IconNext,
        IconRepeat,
        IconFullScreenClose,
        VolumeBar,
        ProcessBar
    },
    methods: {
        ...mapActions(useAppStore, ['toggleFullScreemPlayer', 'togglePause', 'toggleRepeat', 'toggleShuffle'])
    }
}
</script>

<style lang="scss" scoped>
.btn-active:nth-child(n) {
    fill: $color-brand;
    position: relative;

    &::after {
        content: '';
        display: block;
        height: 0.4rem;
        width: 0.4rem;
        border-radius: 50%;
        background-color: $color-brand;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }

    &:hover {
        fill: $color-brand;
    }
}

.icon-wrapper {
    display: inline-block;
    fill: $color-font-secondary;
    height: 3.2rem;
    width: 3.2rem;
    padding: $gutter;

    &:hover {
        fill: $color-font-primary;
    }

    &:active {
        fill: $color-font-primary;
    }

    @include clickAnimation;
}

.full-screen-container {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-4);
    z-index: 100;
    padding: 4rem 6rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__top {
        display: flex;
        justify-content: space-between;


        &__title {
            display: flex;
            justify-content: start;
            gap: 2rem;

            &__icon-wrapper {
                height: 4rem;
                width: 4rem;
                fill: $color-font-primary;
            }

            &__text-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                line-height: 1;

                &__from {
                    letter-spacing: .2rem;
                    font-size: 1.4rem;
                }

                &__name {
                    font-size: 1.6rem;
                }
            }
        }

        &__close-wrapper {
            height: 4rem;
            width: 4rem;
            border-radius: 50%;
            background-color: $color-bg-5;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            &__close {
                height: 2rem;
                width: 2rem;
                fill: $color-font-primary;
            }
        }
    }

    &__content {
        display: flex;
        justify-content: start;
        align-items: end;
        gap: 3rem;

        &__cover-wrapper {
            height: 50vh;
            aspect-ratio: 1 / 1;
            border-radius: $border-radius-default;
            overflow: hidden;

            &__cover {
                height: 100%;
                width: 100%;
                object-fit: cover;
            }
        }

        &__text-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: start;
            line-height: 1;
            gap: 1.6rem;

            &__name {
                font-size: 3rem;
            }

            &__artist {
                font-size: 1.4rem;
                color: $color-font-secondary;
            }
        }
    }

    &__player {

        &__process-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 5rem;
            gap: 1.6rem;
            font-size: 1.8rem;
            color: $color-font-secondary;
        }

        &__btns {
            display: flex;
            justify-content: space-between;

            &__left {
                flex: 3
            }

            &__mid {
                flex: 4;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 1rem;

                &__play {
                    height: 5.2rem;
                    width: 5.2rem;
                    border-radius: 50%;
                    background-color: $color-font-primary;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 $gutter;


                    @include clickAnimation;

                    &__icon-wrapper-round {
                        display: inline-block;
                        fill: $color-bg-1;
                        height: 1.6rem;
                        width: 1.6rem;
                    }
                }
            }

            &__right {
                flex: 3;
                display: flex;
                justify-content: end;
                align-items: center;
            }

        }
    }
}
</style>