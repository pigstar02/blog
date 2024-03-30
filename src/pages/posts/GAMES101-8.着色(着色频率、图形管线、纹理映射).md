---
author: pigstar
cover:
  alt: cover
  square: https://raw.githubusercontent.com/pigstar02/blog_img/main/202304141736721.png
  url: https://raw.githubusercontent.com/pigstar02/blog_img/main/202304141736721.png
description: ''
keywords: 计算机图形学, GAMES101
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: 计算机图形学, GAMES101
  name: keywords
pubDate: 2023-04-22 23:50:57
tags:
- GAMES101
- 计算机图形学
theme: light
title: GAMES101-8.着色（着色频率、图形管线、纹理映射）
---

## 高光区域

当反射的光线直直指向相机，那就会看到这个点是高光的。

当时镜面反射时，入射光线和反射光线是关于法线对称的

较光滑区域的反射光分布在镜面反射光周围

![image-20230423123006348](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231230379.png)

### 半程向量

法线是入射光线l和反射光线r形成夹角的角平分线

v是视线，即相机和观测点的连线

入射光线l和视线v形成夹角的角平分线就叫半程向量

> 假设：v和r越接近等价于n和h越接近

![image-20230423123429249](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231249884.png)

- 直接用视线和反射光线也行
- 半程向量的优点是好算$h = \frac{v+l}{||v+l||}$
- 这里不考虑角度偏移能量的损耗，只关注方向对了没（能否看到高光）

观测到公式中有一个指数p

![image-20230423124313143](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231243171.png)

观测上图可以很容易发现，随着指数增加，斜率减小（因为是负的），图像更陡。

这样一旦角度有细微的变化，y轴会有较明显的变化，对变化更加敏感，区分能力增强

**反映在画面中就是随着p的增加高光越来越小**

![image-20230423124755523](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231247552.png)

## 环境光

- 和观测角度无关
- 和反射角度无关

相当于一个常量，把每个点都提升一个亮度

**这只是一个大胆的简化**

![image-20230423125545138](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231255170.png)

## 着色频率

### 每个面着色一次

![image-20230423130147449](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231301481.png)

### 每个定点着色一次

- 每个顶点着色

  那如何求顶点的法向量？

  每个顶点都会被周围多个三角形所用，那么我们就用周围相关的三角形平面的法向量求个平均作为顶点的法向量

  ![image-20230423131042572](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231310596.png)

  但是每个三角形的影响不同，可以根据三角形的面积做一个加权平均

- 平面内部的点用差值来着色

![image-20230423130224862](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231302897.png)

### 每个像素着色一次

![image-20230423130252090](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231302123.png)

### 比较

![image-20230423130622335](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231306465.png)

- 当面不断细分，按面着色效果很贴近后两者了，极端的想一个面的大小是一个像素，那就相当于按像素着色

## 实时渲染管线

这里的线说的是一个过程，相当于图形渲染的流水线

![image-20230423131608739](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231316769.png)

## 纹理映射

- 定义不同的点有一个不同的属性

  有一张关于描述纹理的图，模型中每一个点都对应纹理图里的一个坐标

![image-20230423134048155](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231340194.png)

![image-20230423134313272](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231343309.png)

不管这张图的大小，uv坐标轴总是$[0,1]$

---

![image-20230423134538355](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231345392.png)

左边是效果图，右边是每个点对应纹理图中坐标的示意图

可以看到一张图可以重复同一张纹理图，像是贴瓷砖一样

右图中能看到明显的分界线，但左图却没有，这取决于纹理的设计
