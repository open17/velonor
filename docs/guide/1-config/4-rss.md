# RSS配置

主题支持开箱即用的RSS功能，只需要在配置文件中配置即可

## RSS配置

```ts
// .vitepress/config.ts
import { genFeed } from '@velonor/theme/genFeed'
import { defineConfigWithTheme } from 'vitepress'

export default defineConfigWithTheme({
  //...
  themeConfig: {
    // ...
    feed: {
      baseUrl: 'https://www.open17.vip', // 你的部署的域名,必须
      copyright: 'Copyright © 2023-present open17', //版权声明,可选
      image: 'https://www.open17.vip/logo.png', // RSS图片,可选
      favicon: 'https://www.open17.vip/logo.ico' //RSS图标,可选
    },
  },
  buildEnd: genFeed,
})
```

然后RSS的地址即为`{baseUrl}/feed.rss`
