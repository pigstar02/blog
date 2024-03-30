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
pubDate: 2023-04-20 00:51:21
tags:
- GAMES101
- 计算机图形学
theme: light
title: GAMES101-5.光栅化（三角形的离散化）
---

# 视锥

**如何定义一个视锥**

![image-20230420121304269](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201213312.png)

纵横比 = 宽度 / 高度

红色虚线构成的角叫做垂直可视角度，同样的也会有水平可视角度

![image-20230420133435512](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201334554.png)

从x轴方向看能观测到如上的图

这里假设了视锥底面的中心在$(0, 0, z)$的位置，则
$$
\begin{gathered}
\tan{\frac{f o v Y}{2}}={\frac{t}{|n|}} \\
aspect = \frac{r}{t}\\
t在这里是高度的一半
\end{gathered}
$$

# MVP

- **M**odel transformation (模型变换，放置物体)

- **V**iew transformation（视角变换，放置照相机）

- **P**rojection transformation（投影变换，把物体映射到$[-1,1]^3$的立方体中）

  前面我们已经学完了以上所有转化，最后所有图形都到了$[-1,1]^3$的立方体中，接下来我们要把它们在屏幕上展示出来

# 屏幕

屏幕可以看作一个二维数组，它的大小叫做分辨率，每个点叫做像素

## 像素

看成一个方块，它是关于rgb的一个三元组，每个颜色有256个等级

## 屏幕的空间

![image-20230420135518245](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201355273.png)

可以用一个整数下标来定义一个像素的位置

图中蓝色的下标就是(2,3)

# 光栅化

光栅化就是把图形画在屏幕上

我们先忽略z的影响，把x,y的平面画出

1. 把图像伸缩到$width \times height$
2. 移到屏幕的中心($\frac{width}{2},\frac{height}{2}$)

得到视口变换的矩阵
$$
M_{viewport}=\begin{pmatrix}\frac{widthh}{2}&0&0&\frac{with}{2}\\ 0&\frac{height}{2}&0&\frac{heightt}{2}\\ 0&0&1&0\\ 0&0&0&1\end{pmatrix}
$$


## 三角形

**为什么用三角形**

- 三角形是最基本的多边形
- 任何多边形都可以拆分成若干个三角形
- 三角形的内部一定是同一平面的
- 内部外部定义清晰
- 方便构造渐变效果

## 采样

如果我们要显示一个图形，但是一个像素一部分在图形内，一部分在图形外，我们知道像素是一个最小放光单元，不能再细分，那么这个像素应不应该被点亮？

那么我们只需要采样像素的中心点是否在图形内，用它来代表整个像素

```cpp
bool inside(triangle t, int x, int y) {
	//判断点(x,y)和多边形t的关系
}

for (int i = 0; i < mx; i ++) {
	for (int j = 0; j < mx; j ++) {
		image[i][j] = inside(t, i + 0.5, j + 0.5);
	}
}
```

## 判断点在多边形内部与否

![image-20230420150703413](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201507468.png)

按照一个顺序计算$P_0P_1 \times P_0Q$，$P_1P_2 \times P_1Q$，$P_2P_0 \times P_2Q$，如果三个结果的正负性相同，则点在三角形内部，否则在三角形外部。

```cpp
point P[3];//三角形三点坐标
for (int i = 0; i < 3; i ++) {
	cross(p[i],Q,p[i],p[(i+1)%3])//计算叉积
}
```

> 如果一个点在边界上，由自己定义是否在三角形内

## 包围盒（bounding box）

**作用**：不需要遍历整个屏幕，只需要遍历刚好框住图形的一个矩形

**定义**：矩形的边界恰好是所有点分别在x，y上的极值

![image-20230420152004013](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201520059.png)

但是如果三角形是非常狭长的，角度又正好是45度，类似于一个对角线的摆放，那么上述方法还是会遍历很多无效的像素

所以我们可以遍历每一行，找每一行的最左和最右

# 锯齿

光栅化后，我们点亮相应的像素但是得到的并不是我们想要的三角形

![image-20230420152849826](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304201528872.png)

得到的图形边缘是每个像素的轮廓，并不是光滑的，这就是锯齿