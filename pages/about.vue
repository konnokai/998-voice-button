<template>
  <div>
    <VCard>
      <VCardTitle>
        <span class="text-3xl">玖玖巴音效版</span>
      </VCardTitle>
      <VCardText class="text-lg">
        <ul class="list-disc pl-6">
          <li>
            製作:
            <a class="link" href="https://konnokai.me/" target="_blank">
              孤之界
            </a>
            ,
            <a class="link" href="https://twitter.com/7Red4" target="_blank">
              紅柿
            </a>
            ,
            <a
              class="link"
              href="https://github.com/kujyonatsume"
              target="_blank"
            >
              九条夏目
            </a>
          </li>
          <li>音檔素材來源: Twitch Clip、玖玖巴 Discord 音效板、茄子阿光</li>
          <li>圖檔素材來源: 玖玖巴 Discord</li>
        </ul>
      </VCardText>
    </VCard>
  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
.link {
  @apply text-primary-500 underline;
}

ul * {
  @apply text-lg;
}
</style>
