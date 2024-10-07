<template>
  <main class="artist-container">
    <div class="artist-container__msg">
      <h1 class="artist-container__msg__total">{{ artists.total }} Artists</h1>
    </div>
    <div class="artist-container__results">
      <div class="artist-container__results__card" v-for="item in artists.items" :key="item.id">
        <div class="artist-container__results__card__img-wrapper">
          <img
            v-if="item.images[1]"
            :src="item.images[1].url"
            alt="Artist Cover"
            class="artist-container__results__card__img-wrapper__img"
          />
          <div v-else class="artist-container__results__card__img-wrapper__icon-wrapper">
            <IconDefaultArtist />
          </div>
        </div>
        <div class="artist-container__results__card__name-wrapper">
          <span class="artist-container__results__card__name-wrapper__name">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import IconDefaultArtist from '@/components/Icons/IconDefaultArtist.vue'

export default {
  name: 'GetArtists',
  components: {
    IconDefaultArtist
  },
  data() {
    return {
      artists: {
        href: 'https://api.spotify.com/v1/search?query=%E9%99%B6&type=artist&offset=0&limit=30',
        items: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/40tNK2YedBV2jRFAHxpifB'
            },
            followers: {
              href: null,
              total: 726999
            },
            genres: ['chinese r&b', 'mandopop', 'taiwan pop', 'taiwan singer-songwriter'],
            href: 'https://api.spotify.com/v1/artists/40tNK2YedBV2jRFAHxpifB',
            id: '40tNK2YedBV2jRFAHxpifB',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b2737c20fb440980c4f2f24346c5',
                width: 640
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e027c20fb440980c4f2f24346c5',
                width: 300
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d000048517c20fb440980c4f2f24346c5',
                width: 64
              }
            ],
            name: 'David Tao',
            popularity: 63,
            type: 'artist',
            uri: 'spotify:artist:40tNK2YedBV2jRFAHxpifB'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/1YrtUPrWcPfgdl9BaD9nhd'
            },
            followers: {
              href: null,
              total: 432045
            },
            genres: ['chinese r&b', 'mandopop'],
            href: 'https://api.spotify.com/v1/artists/1YrtUPrWcPfgdl9BaD9nhd',
            id: '1YrtUPrWcPfgdl9BaD9nhd',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb95983b263941317ed7d90c58',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab6761610000517495983b263941317ed7d90c58',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f17895983b263941317ed7d90c58',
                width: 160
              }
            ],
            name: 'Khalil Fong',
            popularity: 58,
            type: 'artist',
            uri: 'spotify:artist:1YrtUPrWcPfgdl9BaD9nhd'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/2F5W6Rsxwzg0plQ0w8dSyt'
            },
            followers: {
              href: null,
              total: 861182
            },
            genres: ['mandopop', 'taiwan pop'],
            href: 'https://api.spotify.com/v1/artists/2F5W6Rsxwzg0plQ0w8dSyt',
            id: '2F5W6Rsxwzg0plQ0w8dSyt',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb44cc73a57e7a317ee89158d4',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab6761610000517444cc73a57e7a317ee89158d4',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f17844cc73a57e7a317ee89158d4',
                width: 160
              }
            ],
            name: 'Leehom Wang',
            popularity: 58,
            type: 'artist',
            uri: 'spotify:artist:2F5W6Rsxwzg0plQ0w8dSyt'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/2elBjNSdBE2Y3f0j1mjrql'
            },
            followers: {
              href: null,
              total: 6104048
            },
            genres: ['c-pop', 'mandopop', 'taiwan pop', 'zhongguo feng'],
            href: 'https://api.spotify.com/v1/artists/2elBjNSdBE2Y3f0j1mjrql',
            id: '2elBjNSdBE2Y3f0j1mjrql',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb02b3aa55ba238b2ceafb09da',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab6761610000517402b3aa55ba238b2ceafb09da',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f17802b3aa55ba238b2ceafb09da',
                width: 160
              }
            ],
            name: 'Jay Chou',
            popularity: 74,
            type: 'artist',
            uri: 'spotify:artist:2elBjNSdBE2Y3f0j1mjrql'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/7Dx7RhX0mFuXhCOUgB01uM'
            },
            followers: {
              href: null,
              total: 3229755
            },
            genres: ['mandopop', 'singaporean mandopop', 'singaporean pop'],
            href: 'https://api.spotify.com/v1/artists/7Dx7RhX0mFuXhCOUgB01uM',
            id: '7Dx7RhX0mFuXhCOUgB01uM',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb181b3f24c2a457e7fa3edb59',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab67616100005174181b3f24c2a457e7fa3edb59',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f178181b3f24c2a457e7fa3edb59',
                width: 160
              }
            ],
            name: 'JJ Lin',
            popularity: 67,
            type: 'artist',
            uri: 'spotify:artist:7Dx7RhX0mFuXhCOUgB01uM'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/26dEy3kD4ELYk83blEhwZZ'
            },
            followers: {
              href: null,
              total: 316
            },
            genres: [],
            href: 'https://api.spotify.com/v1/artists/26dEy3kD4ELYk83blEhwZZ',
            id: '26dEy3kD4ELYk83blEhwZZ',
            images: [],
            name: '陶喆',
            popularity: 35,
            type: 'artist',
            uri: 'spotify:artist:26dEy3kD4ELYk83blEhwZZ'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/3YZU8HQWGJEAlNIhTK6UKT'
            },
            followers: {
              href: null,
              total: 32906
            },
            genres: ['classic mandopop', 'mandopop', 'taiwan pop'],
            href: 'https://api.spotify.com/v1/artists/3YZU8HQWGJEAlNIhTK6UKT',
            id: '3YZU8HQWGJEAlNIhTK6UKT',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b2737dab060970d29f32cf8f3307',
                width: 640
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e027dab060970d29f32cf8f3307',
                width: 300
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851381234ef8432c6f786d8e45d',
                width: 64
              }
            ],
            name: '陶晶瑩',
            popularity: 41,
            type: 'artist',
            uri: 'spotify:artist:3YZU8HQWGJEAlNIhTK6UKT'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/539VRZFgDOdBCUhknugi60'
            },
            followers: {
              href: null,
              total: 105
            },
            genres: [],
            href: 'https://api.spotify.com/v1/artists/539VRZFgDOdBCUhknugi60',
            id: '539VRZFgDOdBCUhknugi60',
            images: [],
            name: '陶大宇',
            popularity: 5,
            type: 'artist',
            uri: 'spotify:artist:539VRZFgDOdBCUhknugi60'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0ABU5rOo3hIfRLxQVIDz0x'
            },
            followers: {
              href: null,
              total: 13124
            },
            genres: ['musica de fondo'],
            href: 'https://api.spotify.com/v1/artists/0ABU5rOo3hIfRLxQVIDz0x',
            id: '0ABU5rOo3hIfRLxQVIDz0x',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb3d73efa8a8a8d942c76d1029',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab676161000051743d73efa8a8a8d942c76d1029',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f1783d73efa8a8a8d942c76d1029',
                width: 160
              }
            ],
            name: 'Sueño Profundo Club',
            popularity: 73,
            type: 'artist',
            uri: 'spotify:artist:0ABU5rOo3hIfRLxQVIDz0x'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/1mfzcypCggFwpCJ1gmi8BK'
            },
            followers: {
              href: null,
              total: 120273
            },
            genres: ['malaysian mandopop', 'mandopop'],
            href: 'https://api.spotify.com/v1/artists/1mfzcypCggFwpCJ1gmi8BK',
            id: '1mfzcypCggFwpCJ1gmi8BK',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb3e77893318e4da46fb14bdb3',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab676161000051743e77893318e4da46fb14bdb3',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f1783e77893318e4da46fb14bdb3',
                width: 160
              }
            ],
            name: 'Gary Chaw',
            popularity: 47,
            type: 'artist',
            uri: 'spotify:artist:1mfzcypCggFwpCJ1gmi8BK'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/2OyKkjeWOmxlp8LwpQqRP1'
            },
            followers: {
              href: null,
              total: 15526
            },
            genres: ['anime score', 'japanese soundtrack'],
            href: 'https://api.spotify.com/v1/artists/2OyKkjeWOmxlp8LwpQqRP1',
            id: '2OyKkjeWOmxlp8LwpQqRP1',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb1b2b4e4c6629bc80157b7651',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab676161000051741b2b4e4c6629bc80157b7651',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f1781b2b4e4c6629bc80157b7651',
                width: 160
              }
            ],
            name: 'Kenichiro Suehiro',
            popularity: 46,
            type: 'artist',
            uri: 'spotify:artist:2OyKkjeWOmxlp8LwpQqRP1'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/07PgUKWO5KT1KuWaasHJoL'
            },
            followers: {
              href: null,
              total: 181
            },
            genres: [],
            href: 'https://api.spotify.com/v1/artists/07PgUKWO5KT1KuWaasHJoL',
            id: '07PgUKWO5KT1KuWaasHJoL',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273c8fd34683c8e288ecbcaeea1',
                width: 640
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02c8fd34683c8e288ecbcaeea1',
                width: 300
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851c8fd34683c8e288ecbcaeea1',
                width: 64
              }
            ],
            name: 'Sue Watson',
            popularity: 44,
            type: 'artist',
            uri: 'spotify:artist:07PgUKWO5KT1KuWaasHJoL'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/4ZyBq7WEL7d2dDH0BkVDPX'
            },
            followers: {
              href: null,
              total: 106964
            },
            genres: ['trap carioca'],
            href: 'https://api.spotify.com/v1/artists/4ZyBq7WEL7d2dDH0BkVDPX',
            id: '4ZyBq7WEL7d2dDH0BkVDPX',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb4134e80d588a0bc0eaaeb666',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab676161000051744134e80d588a0bc0eaaeb666',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f1784134e80d588a0bc0eaaeb666',
                width: 160
              }
            ],
            name: 'Sueth',
            popularity: 54,
            type: 'artist',
            uri: 'spotify:artist:4ZyBq7WEL7d2dDH0BkVDPX'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0Sadg1vgvaPqGTOjxu0N6c'
            },
            followers: {
              href: null,
              total: 2554266
            },
            genres: ['k-pop', 'k-pop girl group'],
            href: 'https://api.spotify.com/v1/artists/0Sadg1vgvaPqGTOjxu0N6c',
            id: '0Sadg1vgvaPqGTOjxu0N6c',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb385df356841aaec34a0914aa',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab67616100005174385df356841aaec34a0914aa',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f178385df356841aaec34a0914aa',
                width: 160
              }
            ],
            name: "Girls' Generation",
            popularity: 64,
            type: 'artist',
            uri: 'spotify:artist:0Sadg1vgvaPqGTOjxu0N6c'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/4iDroUFo89Y7YBsdDTBmTD'
            },
            followers: {
              href: null,
              total: 624688
            },
            genres: ['cali rap'],
            href: 'https://api.spotify.com/v1/artists/4iDroUFo89Y7YBsdDTBmTD',
            id: '4iDroUFo89Y7YBsdDTBmTD',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb4346ca031ff1e019ef651c98',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab676161000051744346ca031ff1e019ef651c98',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f1784346ca031ff1e019ef651c98',
                width: 160
              }
            ],
            name: 'Sueco',
            popularity: 64,
            type: 'artist',
            uri: 'spotify:artist:4iDroUFo89Y7YBsdDTBmTD'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/2aiIFnAcGlUnGaWCZfirBp'
            },
            followers: {
              href: null,
              total: 32
            },
            genres: [],
            href: 'https://api.spotify.com/v1/artists/2aiIFnAcGlUnGaWCZfirBp',
            id: '2aiIFnAcGlUnGaWCZfirBp',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb7f7ab6d3db143889bfa9c700',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab676161000051747f7ab6d3db143889bfa9c700',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f1787f7ab6d3db143889bfa9c700',
                width: 160
              }
            ],
            name: 'Suevite',
            popularity: 37,
            type: 'artist',
            uri: 'spotify:artist:2aiIFnAcGlUnGaWCZfirBp'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/4FJpP8HnopVXrn0fYRCnzG'
            },
            followers: {
              href: null,
              total: 24504
            },
            genres: ['cantopop', 'classic cantopop'],
            href: 'https://api.spotify.com/v1/artists/4FJpP8HnopVXrn0fYRCnzG',
            id: '4FJpP8HnopVXrn0fYRCnzG',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273b902148d131e264b04269906',
                width: 640
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02b902148d131e264b04269906',
                width: 300
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851b902148d131e264b04269906',
                width: 64
              }
            ],
            name: 'Eric Suen',
            popularity: 30,
            type: 'artist',
            uri: 'spotify:artist:4FJpP8HnopVXrn0fYRCnzG'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/63tzlZxY9iaOeUnmGfwlyA'
            },
            followers: {
              href: null,
              total: 22605
            },
            genres: ['chinese singer-songwriter', 'mainland chinese pop'],
            href: 'https://api.spotify.com/v1/artists/63tzlZxY9iaOeUnmGfwlyA',
            id: '63tzlZxY9iaOeUnmGfwlyA',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273f20362002f6219a24a0d4dd1',
                width: 640
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02f20362002f6219a24a0d4dd1',
                width: 300
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851f20362002f6219a24a0d4dd1',
                width: 64
              }
            ],
            name: 'Sue',
            popularity: 34,
            type: 'artist',
            uri: 'spotify:artist:63tzlZxY9iaOeUnmGfwlyA'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/6jEjSPxnwsibG6vPOjkeER'
            },
            followers: {
              href: null,
              total: 84734
            },
            genres: ['trap venezolano'],
            href: 'https://api.spotify.com/v1/artists/6jEjSPxnwsibG6vPOjkeER',
            id: '6jEjSPxnwsibG6vPOjkeER',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb2531b09adf9ad58b0eaa0e1a',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab676161000051742531b09adf9ad58b0eaa0e1a',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f1782531b09adf9ad58b0eaa0e1a',
                width: 160
              }
            ],
            name: 'suei',
            popularity: 52,
            type: 'artist',
            uri: 'spotify:artist:6jEjSPxnwsibG6vPOjkeER'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0w4e7HVbqAHFPN6VkIlvhe'
            },
            followers: {
              href: null,
              total: 1706385
            },
            genres: ['bhajan', 'classic bollywood', 'filmi', 'garhwali pop', 'hare krishna'],
            href: 'https://api.spotify.com/v1/artists/0w4e7HVbqAHFPN6VkIlvhe',
            id: '0w4e7HVbqAHFPN6VkIlvhe',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb6a6645c135a44a10f0b0199d',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab676161000051746a6645c135a44a10f0b0199d',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f1786a6645c135a44a10f0b0199d',
                width: 160
              }
            ],
            name: 'Suresh Wadkar',
            popularity: 63,
            type: 'artist',
            uri: 'spotify:artist:0w4e7HVbqAHFPN6VkIlvhe'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/4EaUmdr2olpJ9n2OARYRJ2'
            },
            followers: {
              href: null,
              total: 172659
            },
            genres: ['brazilian gospel', 'louvores pentecostais'],
            href: 'https://api.spotify.com/v1/artists/4EaUmdr2olpJ9n2OARYRJ2',
            id: '4EaUmdr2olpJ9n2OARYRJ2',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb163e19a7f8327fefcd9aab50',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab67616100005174163e19a7f8327fefcd9aab50',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f178163e19a7f8327fefcd9aab50',
                width: 160
              }
            ],
            name: 'Sued Silva',
            popularity: 56,
            type: 'artist',
            uri: 'spotify:artist:4EaUmdr2olpJ9n2OARYRJ2'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/6PHIK3kjWggLtVygsOtpqS'
            },
            followers: {
              href: null,
              total: 494249
            },
            genres: ['britpop'],
            href: 'https://api.spotify.com/v1/artists/6PHIK3kjWggLtVygsOtpqS',
            id: '6PHIK3kjWggLtVygsOtpqS',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb9a11cd50daf186d01bbf8ab0',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab676161000051749a11cd50daf186d01bbf8ab0',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f1789a11cd50daf186d01bbf8ab0',
                width: 160
              }
            ],
            name: 'Suede',
            popularity: 52,
            type: 'artist',
            uri: 'spotify:artist:6PHIK3kjWggLtVygsOtpqS'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0B2g2ZF6jP0WkaZb33iPhX'
            },
            followers: {
              href: null,
              total: 50768
            },
            genres: ['classic mandopop', 'hokkien pop'],
            href: 'https://api.spotify.com/v1/artists/0B2g2ZF6jP0WkaZb33iPhX',
            id: '0B2g2ZF6jP0WkaZb33iPhX',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb06e4330c111b02cb063ac748',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab6761610000517406e4330c111b02cb063ac748',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f17806e4330c111b02cb063ac748',
                width: 160
              }
            ],
            name: 'Julie Sue',
            popularity: 47,
            type: 'artist',
            uri: 'spotify:artist:0B2g2ZF6jP0WkaZb33iPhX'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/4hpKB93agzoncsTXEstSpK'
            },
            followers: {
              href: null,
              total: 401443
            },
            genres: ['pagode', 'pagode novo'],
            href: 'https://api.spotify.com/v1/artists/4hpKB93agzoncsTXEstSpK',
            id: '4hpKB93agzoncsTXEstSpK',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb78712fe5081b74d8433afc64',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab6761610000517478712fe5081b74d8433afc64',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f17878712fe5081b74d8433afc64',
                width: 160
              }
            ],
            name: 'Suel',
            popularity: 63,
            type: 'artist',
            uri: 'spotify:artist:4hpKB93agzoncsTXEstSpK'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/5w61NhDHxboaPUjFZ9r2vh'
            },
            followers: {
              href: null,
              total: 229388
            },
            genres: [],
            href: 'https://api.spotify.com/v1/artists/5w61NhDHxboaPUjFZ9r2vh',
            id: '5w61NhDHxboaPUjFZ9r2vh',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eba69dc118211aedfcff9ccc4e',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab67616100005174a69dc118211aedfcff9ccc4e',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f178a69dc118211aedfcff9ccc4e',
                width: 160
              }
            ],
            name: 'MoneySign Suede',
            popularity: 61,
            type: 'artist',
            uri: 'spotify:artist:5w61NhDHxboaPUjFZ9r2vh'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/1lMaDSraU3oiNUsVWJLHdF'
            },
            followers: {
              href: null,
              total: 295924
            },
            genres: ['ccm', 'christian alternative rock', 'christian music'],
            href: 'https://api.spotify.com/v1/artists/1lMaDSraU3oiNUsVWJLHdF',
            id: '1lMaDSraU3oiNUsVWJLHdF',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb760d1110346fc7e4ad5a6051',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab67616100005174760d1110346fc7e4ad5a6051',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f178760d1110346fc7e4ad5a6051',
                width: 160
              }
            ],
            name: 'Jars Of Clay',
            popularity: 45,
            type: 'artist',
            uri: 'spotify:artist:1lMaDSraU3oiNUsVWJLHdF'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/57s0ep3eNSg81D7ZxiuHbC'
            },
            followers: {
              href: null,
              total: 160185
            },
            genres: [
              'murcia indie',
              'rock alternativo espanol',
              'spanish indie pop',
              'spanish modern rock'
            ],
            href: 'https://api.spotify.com/v1/artists/57s0ep3eNSg81D7ZxiuHbC',
            id: '57s0ep3eNSg81D7ZxiuHbC',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5ebca158ff57707545b25b03e74',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab67616100005174ca158ff57707545b25b03e74',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f178ca158ff57707545b25b03e74',
                width: 160
              }
            ],
            name: 'Viva Suecia',
            popularity: 63,
            type: 'artist',
            uri: 'spotify:artist:57s0ep3eNSg81D7ZxiuHbC'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0zzGKwACaZBuRBCb2CXYVH'
            },
            followers: {
              href: null,
              total: 262323
            },
            genres: ['thai folk pop', 'thai folk rock'],
            href: 'https://api.spotify.com/v1/artists/0zzGKwACaZBuRBCb2CXYVH',
            id: '0zzGKwACaZBuRBCb2CXYVH',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b2735d5872c86dd81d6948c16c7b',
                width: 640
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e025d5872c86dd81d6948c16c7b',
                width: 300
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d000048515d5872c86dd81d6948c16c7b',
                width: 64
              }
            ],
            name: 'Suer Thanapon',
            popularity: 43,
            type: 'artist',
            uri: 'spotify:artist:0zzGKwACaZBuRBCb2CXYVH'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/4KCnuZQWRl9FEwAcduZhP9'
            },
            followers: {
              href: null,
              total: 18518
            },
            genres: ['deep adult standards'],
            href: 'https://api.spotify.com/v1/artists/4KCnuZQWRl9FEwAcduZhP9',
            id: '4KCnuZQWRl9FEwAcduZhP9',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273792317211c4781d4aab337e6',
                width: 640
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02792317211c4781d4aab337e6',
                width: 300
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851792317211c4781d4aab337e6',
                width: 64
              }
            ],
            name: 'Sue Thompson',
            popularity: 37,
            type: 'artist',
            uri: 'spotify:artist:4KCnuZQWRl9FEwAcduZhP9'
          },
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/3CFyVJRAmjkptSfvwMljQi'
            },
            followers: {
              href: null,
              total: 27059
            },
            genres: [],
            href: 'https://api.spotify.com/v1/artists/3CFyVJRAmjkptSfvwMljQi',
            id: '3CFyVJRAmjkptSfvwMljQi',
            images: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab6761610000e5eb57fc48199ddaa43d0c041caa',
                width: 640
              },
              {
                height: 320,
                url: 'https://i.scdn.co/image/ab6761610000517457fc48199ddaa43d0c041caa',
                width: 320
              },
              {
                height: 160,
                url: 'https://i.scdn.co/image/ab6761610000f17857fc48199ddaa43d0c041caa',
                width: 160
              }
            ],
            name: 'Sued Nunes',
            popularity: 46,
            type: 'artist',
            uri: 'spotify:artist:3CFyVJRAmjkptSfvwMljQi'
          }
        ],
        limit: 30,
        next: 'https://api.spotify.com/v1/search?query=%E9%99%B6&type=artist&offset=30&limit=30',
        offset: 0,
        previous: null,
        total: 106
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
  &__msg {
    padding-bottom: 1.6rem;

    &__total {
      font-family: $font-family-title;
      font-size: 2.4rem;
    }
  }

  &__results {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    &__card {
      border-radius: $border-radius-default;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.6rem 0;
      cursor: pointer;

      &:hover {
        background-color: $color-bg-3;
      }

      &__img-wrapper {
        width: 85%;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $color-bg-6;
        box-shadow: 0 0 15px 12px rgba(0, 0, 0, 0.2);

        &__img {
          max-width: 100%;
          object-fit: contain;
        }

        &__icon-wrapper {
          width: 40%;
          aspect-ratio: 1 / 1;
          fill: $color-font-primary;
        }
      }

      &__name-wrapper {
        width: 85%;
        text-align: center;
        padding-top: 1.2rem;

        &__name {
          font-size: 1.6rem;
        }
      }
    }
  }
}
</style>
