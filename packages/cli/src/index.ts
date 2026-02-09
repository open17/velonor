#!/usr/bin/env node
import { Command } from 'commander'
import inquirer from 'inquirer'
import path from 'node:path'
import fs from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
// import { fileURLToPath } from 'node:url'
// @ts-ignore
import validateProjectName from 'validate-npm-package-name'

const program = new Command()

program
  .name('create-blog')
  .description('Create a VitePress blog preconfigured with @velonor/theme')
  .version('1.0.0')
  .argument('[project-name]', 'Folder to create the project in')
  .option('-f, --force', 'Overwrite target directory if it exists', false)
  .action(async (projectName, options) => {
    try {
      const cwd = process.cwd()
      const targetDir = projectName ? path.resolve(cwd, projectName) : cwd

      // Ask for project name if not provided
      let name = projectName
      if (!name) {
        const ans = await inquirer.prompt<{ name: string }>([{
          name: 'name',
          type: 'input',
          message: 'Project name:',
          default: 'my-velonor-blog',
        }])
        name = ans.name
      }

      const valid = validateProjectName(name)
      if (!valid.validForNewPackages) {
        console.error(chalk.red('Invalid project name: ' + name))
        valid.errors?.forEach((e: string) => console.error(chalk.red('  ' + e)))
        valid.warnings?.forEach((w: string) => console.error(chalk.yellow('  ' + w)))
        process.exit(1)
      }

      // Resolve final directory
      const dir = projectName ? targetDir : path.resolve(cwd, name)

      if (fs.existsSync(dir)) {
        const isEmpty = (await fs.readdir(dir)).length === 0
        if (!isEmpty && !options.force) {
          const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([{
            name: 'overwrite',
            type: 'confirm',
            message: `Target directory ${chalk.cyan(dir)} is not empty. Overwrite?`,
            default: false,
          }])
          if (!overwrite) process.exit(1)
          await fs.emptyDir(dir)
        }
      } else {
        await fs.ensureDir(dir)
      }

      // Scaffold basic structure
      const spinner = ora('Scaffolding project...').start()
      await scaffold(dir, name!)
      spinner.succeed('Project scaffolded')

      // Print next steps
      const pkgManager = detectPackageManager()
      console.log()
      console.log(chalk.green('Done. Now run:'))
      if (projectName) {
        console.log('  cd ' + chalk.cyan(projectName))
      }
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      console.log()
    } catch (err) {
      console.error(chalk.red((err as Error).message))
      process.exit(1)
    }
  })

program.parse()

async function scaffold(dir: string, name: string) {
  const vpDir = path.join(dir, 'docs')
  const vpThemeDir = path.join(vpDir, '.vitepress')
  const vpThemeIndexDir = path.join(vpThemeDir, 'theme')

  await fs.ensureDir(vpThemeIndexDir)

  // package.json
  const pkgJson = {
    name,
    private: true,
    type: 'module',
    scripts: {
      dev: 'vitepress dev docs --port 8090',
      build: 'vitepress build docs',
      preview: 'vitepress preview docs'
    },
    dependencies: {
      vite: '^5.2.14',
      vitepress: '^1.3.4',
      vue: '^3.4.21',
      '@giscus/vue': '^3.0.0',
      'vitepress-sidebar': '^1.22.0',
      '@velonor/theme': '^1.0.0',
      '@unocss/vite': '^66.0.0',
      'unocss': '^66.0.0'
    },
    devDependencies: {}
  }
  await fs.writeJSON(path.join(dir, 'package.json'), pkgJson, { spaces: 2 })

  await fs.writeFile(path.join(dir, '.gitignore'), `node_modules\ndist\ndocs/.vitepress/cache/*\n`)

  await fs.writeFile(path.join(vpDir, 'index.md'), postIndexTemplate())
  await fs.ensureDir(path.join(vpDir, 'posts'))
  await fs.ensureDir(path.join(vpDir, 'posts', 'foo'))
  await fs.writeFile(path.join(vpDir, 'posts', `${formatDate(new Date())}-hello-velonor.md`), samplePost())
  await fs.writeFile(path.join(vpDir, 'posts', 'foo', `${formatDate(new Date())}-second-post.md`), samplePostAlt())
  await fs.ensureDir(path.join(vpDir, 'page'))
  await fs.writeFile(path.join(vpDir, 'page', 'tags.md'), tagsPageTemplate())
  await fs.writeFile(path.join(vpDir, 'page', 'categories.md'), categoriesPageTemplate())
  await fs.writeFile(path.join(vpDir, 'page', 'archive.md'), archivePageTemplate())
  await fs.writeFile(path.join(vpThemeDir, 'config.ts'), configTsTemplate())
  await fs.writeFile(path.join(vpThemeIndexDir, 'index.ts'), themeIndexTemplate())
  await fs.ensureDir(path.join(vpDir, 'public'))
  await fs.writeFile(path.join(dir, 'uno.config.ts'), unoConfigTemplate())
  await fs.writeFile(path.join(dir, 'README.md'), projectReadmeTemplate(name))
}

function detectPackageManager() {
  const ua = process.env.npm_config_user_agent || ''
  if (ua.startsWith('yarn')) return 'yarn'
  if (ua.startsWith('pnpm')) return 'pnpm'
  if (ua.startsWith('bun')) return 'bun'
  return 'npm'
}

function formatDate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function postIndexTemplate() {
  return `---
layout: blog
bgImage:
  light: "https://vitepress.open17.vip/bg.jpg"
  dark: "https://vitepress.open17.vip/bg2_dark.jpg"
---
`
}


function samplePost() {
  return `---
title: Hello,World!
date: 2025-08-11
tags:
  - Hello World
categories:
  - Demo

---


这是你的第一篇文章，来自 Velonor CLI 初始化。

---

:::tip ✨ 为什么选择 Velonor？

**无缝沿用 VitePress 默认配置，轻松构建你的个性化博客**

Velonor 是一款专为 VitePress 设计的现代化博客主题，在保持原有强大功能的基础上，为你带来全新的博客体验。
:::

## 使用说明

- 使用 /docs/posts 下的 md 文件作为博客文章



## 📚 完整指南

- 📖 [快速开始](https://vitepress.open17.vip/blog-docs/0-intro/0-start.html) - 5分钟上手指南
- ⚙️ [主题配置](https://vitepress.open17.vip/blog-docs/1-config/) - 详细配置说明
- 🎨 [样式定制](https://vitepress.open17.vip/blog-docs/1-config/2-style.html) - 打造专属风格
- 🔧 [进阶使用](https://vitepress.open17.vip/blog-docs/2-more/) - 高级功能探索
`
}

function samplePostAlt() {
  return `---
title: Another Post
date: 2025-08-12
tags:
  - Tips
categories:
  - Notes

---

This is a second sample post to demonstrate multiple categories.

---

## Quick Tips

- Keep your posts inside \`/docs/posts\`
- Use \`tags\`  in frontmatter
- Try the archive and categories pages
`
}

function configTsTemplate() {
  return `import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from '@velonor/theme/config'
import UnoCSS from 'unocss/vite'

export default defineConfigWithTheme<ThemeConfig>({
  title: 'Blog Demo',
  description: 'A VitePress Site',
  vite: {
    plugins: [UnoCSS()],
    ssr: {
      noExternal: ['@velonor/engine', '@velonor/theme'],
    },
  },
  themeConfig: {
    search: { provider: 'local' },
    blog: {
      direct: 'lft',
      tagPageLink: '/page/tags',
      categoryPageLink: '/page/categories',
      user: {
        name: 'Velonor',
        avatar: 'https://vitepress.open17.vip/ava.jpg',
        describe: 'Made with ❤️ by velonor',
      },
      bgImage: { dark: "https://vitepress.open17.vip/bg_dark.jpg", light: "https://vitepress.open17.vip/bg.jpg" },
    },
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Others",
        items: [
          { text: "Tags", link: "/page/tags" },
          { text: "Categories", link: "/page/categories" },
          { text: "Archive", link: "/page/archive" },
        ],
      },
    ],
    home: {
      maxTagsDisplayed: 20,
      postsPerPage: 3
    },
  }
})
`
}

function themeIndexTemplate() {
  return `import Theme from '@velonor/theme'
import 'virtual:uno.css'

export default Theme
`
}

function tagsPageTemplate() {
  return `---
layout: tags
lastUpdated: false
bgImage:
  light: "https://vitepress.open17.vip/bg.jpg"
  dark: "https://vitepress.open17.vip/bg2_dark.jpg"
---
`
}

function categoriesPageTemplate() {
  return `---
layout: categories
lastUpdated: false
bgImage:
  light: "https://vitepress.open17.vip/bg.jpg"
  dark: "https://vitepress.open17.vip/bg2_dark.jpg"
---
`
}

function archivePageTemplate() {
  return `---
layout: archive
lastUpdated: false
bgImage:
  light: "https://vitepress.open17.vip/bg.jpg"
  dark: "https://vitepress.open17.vip/bg2_dark.jpg"
---
`
}

function unoConfigTemplate() {
  return `import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
})
`
}

function projectReadmeTemplate(name: string) {
  return `# ${name}

Quick start:

\`\`\`bash
npm i
npm run dev
\`\`\`

Build:

\`\`\`bash
npm run build
\`\`\`
`
}



