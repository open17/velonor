<template>
    <div v-for="widget in widgets"
        class="flex w-full min-w-0 md:rounded-2xl flex-col py-5 justify-center gap-4 dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)]/95 backdrop-blur-md overflow-hidden">
        <div class="flex w-full justify-between items-center px-5">
            <div class="text-base font-bold tracking-tight" v-if="widget.name">
                {{ widget.name }}
            </div>
            <a v-if="widget.link" :href="widget.link" class="opacity-70 hover:opacity-100 transition">
                <IconLink />
            </a>
        </div>
        <div v-html="widget.html"
            class="w-full min-w-0 max-w-full relative px-5 pb-2 text-sm leading-relaxed overflow-hidden break-words"></div>
    </div>
</template>


<script lang="ts" setup>
import IconLink from './icon/IconLink.vue';
import { useData } from 'vitepress';
const { theme, frontmatter } = useData<Open17Config>();
const widgets = [
    ...(theme.value.blog?.widgets || []),
    ...(frontmatter.value.widgets || []),
];
</script>
