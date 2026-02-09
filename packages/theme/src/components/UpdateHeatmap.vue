<template>
  <div
    class="flex w-full md:rounded-2xl px-5 py-5 flex-col justify-center gap-3 dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)]/95 backdrop-blur-md">
    <div class="flex items-center justify-between text-xs uppercase tracking-wider opacity-70">
      <span class="text-[12px] opacity-90 normal-case tracking-normal">{{ titleLabel }}</span>
      <a v-if="archiveLink" :href="archiveLink"
        class="px-2.5 py-0.5 rounded-full border border-[var(--blog-border-c)]/70 bg-[var(--vp-c-bg)]/40 hover:bg-[var(--vp-c-bg)]/60 transition normal-case text-[11px]">
        {{ archiveLabel }}
      </a>
    </div>
    <div class="grid gap-2">
      <div class="flex justify-center">
        <div class="grid grid-flow-col grid-rows-7 auto-cols-[10px] gap-1">
          <div
            v-for="day in days"
            :key="day.key"
            class="w-[10px] h-[10px] rounded-[3px] transition"
            :style="levelStyle(day.count, day.inRange)"
            :title="`${day.key} · ${day.count}`"
          />
        </div>
      </div>
      <div class="flex items-center justify-between text-[11px] opacity-70">
        <span>{{ recentLabel }}</span>
        <div class="flex items-center gap-1">
          <span>Less</span>
          <span class="w-[10px] h-[10px] rounded-[3px]" :style="legendStyle(0)"></span>
          <span class="w-[10px] h-[10px] rounded-[3px]" :style="legendStyle(1)"></span>
          <span class="w-[10px] h-[10px] rounded-[3px]" :style="legendStyle(2)"></span>
          <span class="w-[10px] h-[10px] rounded-[3px]" :style="legendStyle(3)"></span>
          <span class="w-[10px] h-[10px] rounded-[3px]" :style="legendStyle(4)"></span>
          <span>More</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import { parseDateValue } from '@velonor/engine';
import { data as posts } from '../posts.data.js';

const props = defineProps({
  archiveLink: {
    type: String,
    default: '',
  },
  archiveLabel: {
    type: String,
    default: '',
  },
  titleLabel: {
    type: String,
    default: 'Activity',
  },
});

const { lang } = useData();

const today = new Date();
today.setHours(0, 0, 0, 0);

const endDate = new Date(today);
const startDate = new Date(today);
startDate.setDate(today.getDate() - 59);

const totalDays = 60;

const recentLabel = computed(() => {
  const isZh = (lang.value || '').startsWith('zh');
  return isZh ? `近 ${totalDays} 天` : `Last ${totalDays} days`;
});

const formatKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const counts = computed(() => {
  const map = new Map();
  posts.forEach((post) => {
    const time = parseDateValue(post.frontmatter.date);
    if (!time) return;
    const date = new Date(time);
    date.setHours(0, 0, 0, 0);
    const key = formatKey(date);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return map;
});

const days = computed(() => {
  const list = [];
  for (let i = 0; i < totalDays; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const key = formatKey(date);
    const count = counts.value.get(key) || 0;
    const inRange = date >= startDate && date <= endDate;
    list.push({ key, date, count, inRange });
  }
  return list;
});

const levelColor = (level) => {
  const stops = [10, 28, 50, 75, 92];
  const ratio = stops[Math.min(level, stops.length - 1)];
  return `color-mix(in srgb, var(--vp-c-brand-1) ${ratio}%, transparent)`;
};

const levelStyle = (count, inRange) => {
  if (!inRange) return { backgroundColor: levelColor(0) };
  if (count <= 0) return { backgroundColor: levelColor(0) };
  if (count === 1) return { backgroundColor: levelColor(1) };
  if (count === 2) return { backgroundColor: levelColor(2) };
  if (count === 3) return { backgroundColor: levelColor(3) };
  return { backgroundColor: levelColor(4) };
};

const legendStyle = (level) => ({
  backgroundColor: levelColor(level),
});
</script>

