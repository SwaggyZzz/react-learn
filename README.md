# path-to-regexp

**创建一个 match 对象**

第三方库 path-to-regexp，用于将一个字符串正则（路径正则，path regexp）

# history 对象

该对象提供了一些方法，用于控制或监听地址的变化。

该对象不是 window.history，而是一个抽离的对象，它提供了统一的 API 接口，封装了具体的实现

- createBrowserHistory 产生的控制浏览器真实地址的 history 对象
- createHashHistory 产生的控制浏览器 hash 的 history 对象
- createMemoryHistory 产生的控制内存中地址数组的 history 对象

history 对象的共同特点：维护了一个地址栈

第三方库：history

**以下三个函数，虽然名称和参数不同，但返回的对象结构（history）完全一致**

## history 对象

- action：当前地址栈，最后一次操作的类型
  - 如果是通过 createXXXHistory 函数新创建的 history 对象，action 固定为 POP
  - 如果调用了 history 的 push 方法，action 变成 PUSH
  - 如果调用了 history 的 replace 方法，action 变成 REPLACE
- push：向当前地址栈指针位置，入栈一个地址
- replace：替换当前指针指向的地址
- go：控制当前地址栈指针偏移，如果是 0，则刷新页面，地址不变
- location：表达当前地址的信息
- listen：函数，用于监听地址栈指针的变化
  - 该函数接收一个函数作为参数，该参数表示地址变化后要做的事情，回调
    - 参数函数接收两个参数
    - location：记录了新的地址
    - action：进入新地址的方式
      - POP：指针移动，调用 go、goBack、goForward、用户点击浏览器后退按钮
      - PUSH：调用 history.push
      - REPLACE：调用 history.replace
  - 该函数有一个返回值，返回的是一个函数，用于取消监听
- block：用于设置一个阻塞，当页面发生跳转的时候，会将指定的消息传递到 getUserConfirmation，并调用 getUserConfirmation 函数
  - 该函数接收一个字符串作为参数，表示传递的消息内容，也可以接收一个函数作为参数，函数的返回值是消息内容
  - 该函数返回一个取消函数，调用函数可以取消阻塞
- createHref：返回 basename + url

## createBrowserHistory

创建一个使用浏览器 History Api 的 history 对象

配置对象：

- basename：设置基路径，会拼接在 push 或者 replace 路径前面
- forceRefresh：地址改变时是否强制刷新
- keyLength：location 对象使用的 key 值长度
  - 地址栈中记录的并非字符串，而是一个 location 对象，key 用来区分有相同 path 的 location 对象
- getUserConfirmation：一个函数，该函数当调用 history 对象 block 函数后，发生页面跳转时运行

## createHashHistory

创建一个使用浏览器 hash 的 history 对象

配置对象：

- hashType：#号后面给定的路径格式
  - hashbang：被 chrome 弃用，#!路径
  - noslash：#a/b/c
  - slash：#/a/b/c (默认是这种)

## createMemoryHistory

创建一个使用内存中地址栈的 history 对象，一般用于没有地址栏的环境

配置对象

- initialEntries：初始地址栈中的地址 ['/', '/abc']
- initialIndex: 初始指针指向地址栈中的索引

# 手写 createBrowserHistory

## 创建 location

state 处理：

```js
var historyState = window.history.state
```

1. 如果 historyState 没有值，则 state 为 undefined
2. 如果 historyState 有值
   1. 值的类型不是对象
   2. 是对象
      1. 该对象中有 key 属性，将 key 属性作为 location 对象的 key 属性值，并且将 historyState 中的 state 属性作为 location 对象的 state 属性
      2. 如果没有 key 属性，则直接将 historyState 赋值给 state
