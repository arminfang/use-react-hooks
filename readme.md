# React Hooks Library 🎣

一个高性能、类型安全的 React Hooks 集合，为你的 React 应用提供常用的工具函数。

## 特性

- 🚀 **完全 TypeScript** - 完整的类型定义
- 📦 **轻量级** - 极小的体积，零依赖
- 🎯 **高性能** - 优化渲染，避免不必要的重渲染
- 🔧 **实用性强** - 精选日常开发中最需要的 Hooks
- 🌳 **Tree Shakable** - 只打包你使用的代码

## Hooks 列表

### 🎯 State 管理

#### `useBoolean`

布尔值状态管理，提供切换、设置 true/false 的方法。

#### `useLatest`

返回一个 ref，其 current 值始终是最新的值，避免闭包问题。

#### `usePrevious`

获取上一次渲染的值，用于比较前后状态变化。

#### `useRafState`

使用 requestAnimationFrame 来更新状态，避免频繁渲染造成的性能问题。

### ⏰ 定时器 & 倒计时

#### `useCountdown`

倒计时 Hook，支持开始、暂停、重置等操作。

### 🖱️ DOM 交互

#### `useClickAway`

点击元素外部时触发回调，常用于下拉菜单、模态框等场景。

#### `useEventListener`

便捷地添加和移除事件监听器，支持多种事件类型。

#### `useFullscreen`

控制元素全屏显示，支持进入、退出、切换全屏状态。

#### `useHover`

检测元素是否被鼠标悬停，返回悬停状态和 ref。

### 📐 元素尺寸与观察

#### `useElementSize`

获取元素的尺寸（width/height），响应尺寸变化。

#### `useResizeObserver`

使用 ResizeObserver API 监听元素尺寸变化。

#### `useInViewport`

检测元素是否在视口内可见，返回可见状态和比例。

#### `useIntersectionObserver`

使用 IntersectionObserver API 监听元素交叉状态。

### 🖼️ 资源处理

#### `useImage`

图片加载状态管理，返回加载中、错误、成功等状态。

### 🎯 效果优化

#### `useEffectWithTarget`

支持 target 元素的 useEffect，自动处理 DOM 引用和清理。

## 安装

```bash
# npm
npm install @armin4fun/use-react-hooks

# yarn
yarn add @armin4fun/use-react-hooks

# pnpm
pnpm add @armin4fun/use-react-hooks
```
