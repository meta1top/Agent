---
name: svg-icon-process
description: SVG 图标处理。将 SVG 中的硬编码 fill 改为 currentColor，使图标可通过 Tailwind 的 text-* 类控制颜色。当用户添加、创建 SVG 图标或遇到图标颜色无法通过 CSS 控制时自动应用。
language: typescript,tsx
framework: react,nextjs,tailwindcss
---

# SVG 图标处理

让 SVG 图标支持通过 CSS 类控制颜色的处理指南。

## 何时使用

- 用户添加新的 SVG 图标到项目中
- 用户反馈 SVG 图标使用 `text-red`、`text-blue` 等 Tailwind 颜色类无法改变颜色
- 用户创建或导入 SVG 图标资源时

## 问题原因

SVG 的 `<path>`、`<circle>` 等元素若有硬编码的 `fill="#000000"` 或 `fill="#040000"` 等属性，会覆盖 CSS 的 `color` 属性。Tailwind 的 `text-*` 类设置的是 `color`，因此不会生效。

## 处理方法

将 SVG 中所有硬编码的 `fill` 属性改为 `fill="currentColor"`，图标会继承父元素的 `color` 值。

### 修改前

```svg
<path d="..." fill="#040000"></path>
```

### 修改后

```svg
<path d="..." fill="currentColor"></path>
```

批量替换：`fill="#040000"` → `fill="currentColor"`（或替换其他具体色值）

## 使用方式

修改后，可通过以下方式控制图标颜色：

```tsx
<ChatIcon className="text-red-500" />

<span className="text-blue-600">
  <ChatIcon />
</span>
```

## 注意事项

- 若 SVG 有多个 path 且需要不同颜色，此方法不适用，需保留各自的 fill 或使用其他方案
- 仅适用于单色图标
