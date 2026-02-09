<template>
    <!-- 电脑端 -->
    <div class="hidden md:flex w-full md:rounded-2xl p-6 flex-col justify-center items-center gap-2 dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)]/95 backdrop-blur-md"
        v-if="!props.isMobile && !userConfig?.hidden">
        <!-- Avatar -->
        <img :src="typeof userConfig?.avatar === 'string' ? userConfig.avatar : userConfig?.avatar?.light || userConfig?.avatar?.dark" v-if="userConfig?.avatar" alt="avatar"
            class="object-cover object-center w-24 h-24 rounded-full ring-2 ring-[var(--blog-border-c)]" />
        <div class="mt-3" v-else></div>
        <!-- Name -->
        <div class="text-lg font-semibold text-center mt-2 tracking-tight">
            {{ userConfig?.name }}
        </div>
        <!-- Description -->
        <div class="text-center text-xs opacity-75 leading-relaxed">{{ userConfig?.describe }}</div>
        <!-- Stats -->
        <div class="flex justify-center items-center gap-12 w-full border-t-2 mt-3 border-[var(--blog-border-c)]/70">
            <div class="flex flex-col justify-center items-center gap-1">
                <div class="text-[10px] uppercase tracking-wider opacity-70">{{ postsText }}</div>
                <div class="text-xl font-semibold">{{ posts.length }}</div>
            </div>
            <div class="flex flex-col justify-center items-center gap-1">
                <div class="text-[10px] uppercase tracking-wider opacity-70">{{ tagsText }}</div>
                <div class="text-xl font-semibold">{{ uniqueTagCount }}</div>
            </div>
        </div>
    </div>
    <!-- 移动端个人信息显示 -->
    <div class="flex md:hidden justify-center items-center w-full mt-8 flex-col gap-3" v-else-if="!userConfig?.hidden">
        <img :src="typeof userConfig?.avatar === 'string' ? userConfig.avatar : userConfig?.avatar?.light || userConfig?.avatar?.dark" v-if="userConfig?.avatar" alt="avatar"
            class="object-cover object-center w-32 rounded-full" />
        <!-- 昵称 -->
        <div class="text-2xl font-bold text-center">{{ userConfig?.name }}</div>
        <!-- 签名 -->
        <div class="text-center text-sm">{{ userConfig?.describe }}</div>
    </div>
</template>

<script setup lang="ts">

// TODO 待优化
// @ts-ignore
import { data as posts } from '../posts.data.js';

import { useData } from 'vitepress';
import { computed } from 'vue';
import { getLocalizedString } from '../utils/constants';
import { useTags } from '../composables/useTags';

const { theme, lang } = useData<Open17Config>();

const userConfig = theme.value.blog ? theme.value.blog.user : null;

const { uniqueTagCount } = useTags();

const postsText = computed(() => getLocalizedString('posts', lang.value));
const tagsText = computed(() => getLocalizedString('tags', lang.value));

const props = defineProps<{
    isMobile: Boolean
}>();
</script>
