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
pubDate: 2023-04-20 15:33:10
tags:
- GAMES101
- 计算机图形学
theme: light
title: GAMES101-6.光栅化（深度测试与抗锯齿）
---
# Antifact

任何光栅化后和原图不符的现象，中文叫瑕疵

比如：

- 锯齿
- 摩尔纹
- 车轮效应

**本质原因**：信号变化的速度太快了，采样速度跟不上

# 反走样


## 频率

描述变化的速度

![image-20230420160726820](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201607850.png)

## 傅里叶级数

任何一个周期函数都可以写成一系列正弦余弦函数的线性组合以及一个常数项

![image-20230420162122084](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201621154.png)

如下图所示，相同的采样频率去采样不同频率的周期函数

当频率增加的时候，采样频率跟不上就会丢失很多信息，即把采样的点连起来不能恢复原来的函数

虚线的函数和实线的函数的采样结果是一样的，但他们的频率截然不同

![image-20230420161357709](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201613748.png)

## 滤波

**滤波**：就是去掉一些频域的内容

**高通滤波**：只让高频信息通过

![image-20230420162815667](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201628706.png)

从图中可以看到，高频对应了图中人物（内容）的轮廓信息

**低通滤波**：只让低频信息通过，阻碍高频信息，即使轮廓不明显，达到了模糊的效果

![image-20230420163129112](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201631145.png)

## 卷积

这是图形学上的简化操作

![image-20230420163506179](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201635217.png)

从结果上来看，是对每个点和其周围几个点进行平均操作，从而达到模糊的效果

> 空间域（时域）上的卷积等于频域上的乘

![image-20230420194351762](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201943818.png)

上述是用$3 \times 3$的低通滤波，如果我们使用更大的矩阵呢，它的频域图将会变小

怎么理解呢？

当矩阵很大时，大到比原来的图像还大，那滤波后图的每个像素都是一样的了，那高频信息就没了，表示在频域图中就是白色区域变小（越靠近中心表示频率越低）

## 模糊反走样



**原理**：下图是走样现象在频域上的反应，采样频率越小就是采样越稀疏，搬移的越密集，原始信号就会和复制粘贴的信号产生重叠，就是走样

![image-20230420195534010](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201955039.png)



先进行滤波模糊处理，再对滤波后的图像采样，点亮的像素的颜色和滤波后对应像素一致。

![image-20230420200403499](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304202004524.png)

对应到频域图上的操作就是将高频信息砍掉，也就是发生重叠的部分

**强调**：一定要先滤波再采样，先采样再滤波是不行的

![image-20230420160454031](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201604065.png)

# MSAA（Multisample Anti-Aliasing）

![image-20230420201115722](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304202011754.png)

我们通过覆盖率来定义这个像素的颜色亮度

那么怎么计算覆盖率？

把一个像素在理论上细分，分的越细致，最后结果越准确，类似于微分的思想，然后统计分完后覆盖的中心

**坏处**：显然不能越细分越好，计算每个点是否在三角形内需要耗费时间

# FXAA（Fast Approximate AA）

是一种快速的近似抗锯齿技术，旨在提高图形质量并减少锯齿。与传统的MSAA（Multisample Anti-Aliasing）相比，FXAA可以更快地处理较大的场景，并且不需要额外的硬件支持。 FXAA通过对像素颜色进行平滑处理来减少锯齿和其他视觉噪点。它使用了一些启发式算法来检测锯齿和其他图像问题，并对其进行消除。这些算法包括检测高频率变化、过滤器阈值和局部对比度等。 FXAA虽然处理速度很快，但它也有一些缺点。由于它是一种近似技术，因此可能会导致某些细节丢失或模糊。此外，在某些情况下，它可能会产生类似于“水彩画”效果的图像问题。 总体而言，FXAA是一种适用于许多游戏引擎的快速抗锯齿技术。

# TAA（Temporal AA）

AA使用了前一帧和当前帧之间的信息来计算出运动物体的轨迹，然后对其进行平滑处理，从而消除锯齿和图像噪点。

TAA的原理是在连续两帧之间比较像素颜色值的变化，并根据这些变化来计算出物体在两帧之间的位置和运动方向。然后，通过对这些像素进行平均处理来模拟物体在两帧之间运动时产生的模糊效果。

TAA可以有效地降低图形中出现的锯齿、马赛克和其他视觉噪点，并提高图形质量。

