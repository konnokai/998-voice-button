<template>
  <div>
    <VCard>
      <VCardText>
        <VTextField
          v-model="search"
          placeholder="搜尋"
          variant="outlined"
          color="primary"
          append-icon="mdi-magnify"
          @click:append="doSearch"
          hide-details
          @keyup.enter="doSearch"
          append-inner-icon="mdi-close"
          @click:append-inner="
            search = '';
            doSearch();
          "
        />
      </VCardText>
    </VCard>
    <div class="h-4" />
    <VProgressCircular v-if="isSearching" indeterminate color="secondary" />

    <div
      v-if="filteredSounds.length === 0 && !isSearching && !!search"
      class="text-center"
    >
      什麼都沒找到🥲
    </div>

    <VTabs v-if="!isSearching" class="mb-3" hide-slider>
      <VTab
        v-for="group in filteredSounds"
        :key="group.group_name"
        class="text-secondary-600"
        @click="
          goTo(`#group-btn-${group.group_name}`, {
            offset: -100
          })
        "
      >
        {{ group.group_description.zh }}
      </VTab>
    </VTabs>

    <VExpansionPanels v-model="expansionPanelController" multiple>
      <VExpansionPanel
        v-for="group in filteredSounds"
        :key="group.group_name"
        :value="group.group_name"
        :id="`group-btn-${group.group_name}`"
      >
        <VExpansionPanelTitle>
          <span class="text-2xl">
            {{ group.group_description.zh }}
          </span>
        </VExpansionPanelTitle>

        <VExpansionPanelText>
          <VBtn
            v-for="voice in group.voice_list"
            @click="playSound(voice.path, voice.description.zh)"
            class="sound_btn !rounded-[28px] overflow-hidden"
            :color="
              currentPlayingSound?.name === voice.description.zh
                ? 'secondary'
                : 'primary'
            "
            variant="flat"
            :data-sound-name="voice.description.zh"
          >
            <div>
              {{ voice.description.zh }}
            </div>
            <VProgressLinear
              v-if="currentPlayingSound?.name === voice.description.zh"
              :model-value="currentPlayingSound?.progress"
              color="secondary"
              class="!absolute !bottom-0 !top-auto left-0 w-full"
            />
          </VBtn>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VBottomSheet
      inset
      :model-value="!!currentPlayingSound"
      :scrim="false"
      disabled
      persistent
      no-click-animation
      scroll-strategy="none"
    >
      <VSheet>
        <VProgressLinear
          :model-value="currentPlayingSound?.progress"
          color="secondary"
        />

        <VList>
          <VListItem
            @click.stop="
              goTo(`[data-sound-name='${currentPlayingSound?.name}']`, {
                offset: -100
              })
            "
          >
            <VListItemTitle class="!whitespace-normal">
              {{ currentPlayingSound?.name }}
            </VListItemTitle>

            <template v-slot:append>
              <VBtn
                v-if="hasClipboard"
                icon="mdi-share"
                variant="text"
                color="secondary"
                @click.stop="doShare"
              />

              <VBtn
                :icon="soundSettings.loop ? 'mdi-repeat' : 'mdi-repeat-off'"
                variant="text"
                @click.stop="toggleSoundLoop"
                color="secondary"
              />

              <VBtn
                :icon="
                  currentPlayingSound?.isPlaying ? 'mdi-pause' : 'mdi-play'
                "
                variant="text"
                @click.stop="toggleSound"
                color="secondary"
              />

              <VBtn
                class="ms-0"
                icon="mdi-close"
                variant="text"
                color="secondary"
                @click.stop="stopSound"
              />
            </template>
          </VListItem>
        </VList>
      </VSheet>
    </VBottomSheet>

    <VFab location="bottom right" app icon="mdi-tune-vertical-variant">
      <VIcon>mdi-tune-vertical-variant</VIcon>

      <VMenu activator="parent" location="top">
        <VBtn
          :icon="soundSettings.loop ? 'mdi-repeat' : 'mdi-repeat-off'"
          class="my-2"
          @click="toggleSoundLoop"
        />
        <VBtn icon="mdi-shuffle" @click="playRandomSound" class="my-2" />
      </VMenu>
    </VFab>

    <ClientOnly>
      <VSonner
        position="top-right"
        timeout="-1"
        :toast-options="{
          style: { background: '#315b68', borderRadius: '8px' }
        }"
      />
    </ClientOnly>

    <div class="h-32" />
  </div>
</template>

<script setup lang="ts">
import { VSonner, toast } from 'vuetify-sonner';
import sounds from '~/assets/voices.json';
import { useGoTo } from 'vuetify';
import { VTabs } from 'vuetify/components';

const route = useRoute();

const goTo = useGoTo();

type T_SoundStructure = typeof sounds;

const search = ref('');

const filteredSounds = ref(sounds.groups);

const isSearching = ref(false);
const doSearch = () => {
  if (!search.value) {
    filteredSounds.value = sounds.groups;
    isSearching.value = false;
    return;
  }

  isSearching.value = true;

  filteredSounds.value = sounds.groups
    .map((group) => {
      const isGroupMatch = group.group_name.includes(search.value);

      const filteredVoiceList = group.voice_list.filter((voice) =>
        voice.description.zh.includes(search.value)
      );

      return isGroupMatch || filteredVoiceList.length > 0
        ? {
            ...group,
            voice_list: filteredVoiceList
          }
        : null;
    })
    .filter((group) => !!group);

  isSearching.value = false;
};

const soundSettings = ref<{
  loop?: boolean;
  volume?: number;
  stack?: boolean;
}>({});

const toggleSoundLoop = () => {
  soundSettings.value.loop = !soundSettings.value.loop;
};

watch(
  () => soundSettings.value,
  (v) => {
    if (currentPlayingSound.value) {
      currentPlayingSound.value.settings = v;
    }
  },
  { deep: true }
);

watch(
  () => soundSettings.value.loop,
  (v) => {
    toast(v ? '開啟循環播放' : '關閉循環播放');
  }
);

const currentPlayingSound = ref<{
  audio: HTMLAudioElement;
  settings: { loop?: boolean; volume?: number; stack?: boolean };
  name: string;
  path: string;
  progress?: number;
  isPlaying?: boolean;
} | null>(null);

const setListenerForCurrentPlayingSound = () => {
  const audio = currentPlayingSound.value?.audio;
  if (!audio) return;

  audio.addEventListener('play', () => {
    if (currentPlayingSound.value) {
      currentPlayingSound.value.isPlaying = true;
    }
  });

  audio.addEventListener('pause', () => {
    if (currentPlayingSound.value) {
      currentPlayingSound.value.isPlaying = false;
    }
  });

  audio.addEventListener('ended', () => {
    if (currentPlayingSound.value) {
      if (soundSettings.value.loop) {
        currentPlayingSound.value.audio.play();
      } else {
        currentPlayingSound.value = null;
      }
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (currentPlayingSound.value) {
      currentPlayingSound.value.progress =
        (audio.currentTime / audio.duration) * 100;
    }
  });
};

const playSound = (soundPath: string, soundName: string) => {
  if (currentPlayingSound.value) {
    stopSound();
  }

  const audio = new Audio(`/voices/${soundPath}`);
  currentPlayingSound.value = {
    audio,
    settings: soundSettings.value,
    name: soundName,
    path: soundPath
  };

  setListenerForCurrentPlayingSound();
  currentPlayingSound.value?.audio?.play?.();
};

const playRandomSound = async () => {
  search.value = '';
  doSearch();
  stopSound();
  const randomSoundGroup =
    sounds.groups[Math.floor(Math.random() * sounds.groups.length)];
  const randomSound =
    randomSoundGroup.voice_list[
      Math.floor(Math.random() * randomSoundGroup.voice_list.length)
    ];

  await nextTick();
  goTo(`#group-btn-${randomSoundGroup.group_name}`);

  playSound(randomSound.path, randomSound.description.zh);
};

const toggleSound = () => {
  if (currentPlayingSound.value?.audio?.paused) {
    currentPlayingSound.value?.audio?.play?.();
  } else {
    currentPlayingSound.value?.audio?.pause?.();
  }
};

const stopSound = () => {
  currentPlayingSound.value?.audio?.pause?.();
  currentPlayingSound.value = null;
};

const expansionPanelController = ref<string[]>([]);

const doShare = () => {
  const currentSound = currentPlayingSound.value;
  if (!currentSound) return;

  navigator.clipboard.writeText(
    `${location.origin}?btn=${encodeURIComponent(
      currentSound.path
    )}&name=${encodeURIComponent(currentSound.name)}`
  );
  toast('已複製到剪貼簿');
};

const hasClipboard = ref(true);

onMounted(() => {
  expansionPanelController.value = sounds.groups.map(
    (group) => group.group_name
  );

  if (!navigator.clipboard) {
    hasClipboard.value = false;
  }

  if (route.query?.btn && route.query?.name) {
    playSound(
      decodeURIComponent(route.query.btn as string),
      decodeURIComponent(route.query.name as string)
    );
  }
});

onBeforeUnmount(() => {
  stopSound();
});
</script>

<style scoped>
.sound_btn {
  @apply relative;
  margin-top: 4px;
  margin-left: 4px;

  min-height: auto;
  height: auto;
  padding: 8px 20px;
}

.sound_btn:deep(.v-btn__content) {
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
}

:deep(.card-snackbar) {
  background: transparent !important;
  color: #fff !important;
}
</style>
