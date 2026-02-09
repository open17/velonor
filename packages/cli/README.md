# @velonor/create-blog

A CLI tool for quickly setting up a VitePress blog with `@velonor/theme`

## Usage

```bash
npm create @velonor/blog my-blog
# or
yarn create @velonor/blog my-blog
# or  
pnpm create @velonor/blog my-blog
# or
bun create @velonor/blog my-blog
```

You can also run it without arguments to create a blog in current directory:

```bash
npm create @velonor/blog
```

## Features

- 🚀 Quick scaffolding with minimal setup
- 📁 Generates proper project structure
- 🎨 Preconfigured with Velonor theme defaults  
- 📝 Sample blog post included
- ⚙️ Type-safe configuration
- 🔧 Works with npm/yarn/pnpm/bun

## What it creates

```
my-blog/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts          # VitePress config with theme
│   │   └── theme/
│   │       └── index.ts       # Theme entry
│   ├── posts/
│   │   └── 2024-xx-xx-hello-velonor.md  # Sample post
│   ├── index.md               # Homepage with <blog /> component
│   └── public/                # Static assets
├── package.json
└── .gitignore
```

## After scaffolding

```bash
cd my-blog
npm install
npm run dev
```

Your blog will be available at http://localhost:8090

## Options

- `-f, --force` - Overwrite target directory if it exists

## License

Apache-2.0

