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

                <template v-for="(author, i) in site.footer.authors">
                  <a :href="author.link" target="_blank">{{ author.name }}</a>
                  <span v-if="i !== site.footer.authors.length - 1">&</span>
                </template>
              </div>
              <div v-html="parseContent(site.footer.content)" />
            </div>
          </VFooter>
        </div>
      </div>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { links } from '~/assets/links';
import site from './assets/locales/site.json';

const isDrawerOpen = ref(false);

const parseContent = (content: string) => {
  const params = site.footer.content_params;
  params.forEach((param, i) => {
    if (param.link) {
      content = content.replace(
        `{${i}}`,
        `<a href="${param.link}" target="${param.target}">${param.name}</a>`
      );
    } else {
      content = content.replace(`{${i}}`, param.name);
    }
  });
  return content;
};
</script>

<style scoped>
.drawer:deep(.v-navigation-drawer__content) {
  @apply flex flex-1;
}

.footer :deep(a) {
  @apply text-primary-500 underline;
}
</style>
