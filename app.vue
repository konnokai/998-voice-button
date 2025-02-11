<template>
  <VApp>
    <VAppBar color="primary">
      <template #prepend>
        <VAppBarNavIcon @click="isDrawerOpen = !isDrawerOpen" />
      </template>
      <VAppBarTitle>
        <div class="flex items-center">
          <NuxtLink class="font-bold" to="/">【玖玖巴按鈕】</NuxtLink>
        </div>
      </VAppBarTitle>
    </VAppBar>

    <VNavigationDrawer v-model="isDrawerOpen" class="drawer">
      <VList class="flex-1">
        <VListItem to="/">
          <template #prepend>
            <div class="mr-8">
              <VIcon>mdi-home</VIcon>
            </div>
          </template>
          <VListItemTitle>首頁</VListItemTitle>
        </VListItem>
        <template v-for="(linkGroup, index) in links">
          <VListItem
            v-for="link in linkGroup"
            :key="link.title"
            :href="link.url"
            target="_blank"
            class="d-flex items-center"
            color="primary"
          >
            <template #prepend>
              <div class="mr-8">
                <template v-if="link.icon?.name">
                  <VIcon :color="link.icon?.color" width="24" height="24">
                    {{ link.icon?.name }}
                  </VIcon>
                </template>
                <template v-else>
                  <TwemojiParse class="text-xl">
                    {{ link.icon?.emoji }}
                  </TwemojiParse>
                </template>
              </div>
            </template>
            <VListItemTitle>{{ link.title }}</VListItemTitle>
          </VListItem>

          <VDivider v-if="index !== links.length - 1" class="border-rose-950" />
        </template>
      </VList>

      <template #append>
        <VListItem
          to="/about"
          prepend-icon="mdi-text-box-search"
          title="關於"
        />
      </template>
    </VNavigationDrawer>

    <VMain class="bg-primary-200">
      <div class="flex flex-col h-full">
        <VContainer class="flex-1">
          <NuxtPage />
        </VContainer>

        <div>
          <VFooter color="neutral" class="footer">
            <VIcon>mdi-copyright</VIcon>
            <div class="w-1" />
            <div>
              <div>
                2025
                <a href="https://konnokai.me/" target="_blank">孤之界</a>
                &
                <a href="https://twitter.com/7Red4" target="_blank">紅柿</a>
                &
                <a href="https://github.com/kujyonatsume" target="_blank">
                  九条夏目
                </a>
              </div>
              <div>
                本站為愛好者作品，和玖玖巴沒有關聯，其餘資訊請查看
                <NuxtLink to="/about">關於</NuxtLink>
                頁面,
                <a
                  href="https://github.com/7Red4/vtuber-button-template"
                  target="_blank"
                >
                  原始碼
                </a>
              </div>
            </div>
          </VFooter>
        </div>
      </div>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { links } from '~/assets/links';

const isDrawerOpen = ref(false);
</script>

<style scoped>
.drawer:deep(.v-navigation-drawer__content) {
  @apply flex flex-1;
}

.footer a {
  @apply text-primary-500 underline;
}
</style>
