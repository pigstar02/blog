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
pubDate: 2023-04-18 10:40:03
tags:
- GAMES101
- 计算机图形学
theme: light
title: GAMES101-4.变换（模型、视图、投影）
---
## 观测变换

### 视图变换

**为什么要视角变换？**

以游戏为例，我们构建了一个三维场景，但是展示出来的是二维平面，从不同角度观察得到的画面是不同的，尽管场景里的模型没有发生任何变化
要想获得不同视角的画面就需要视角变换

#### 一个位置两个方向

1. 位置**e**

2. 拍摄方向**g**

3. 向上方向**t**（拍竖屏还是横屏）![image-20230418113814180](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304181138238.png)

#### 步骤

**关键**：当观察者和被观察物体同时移动保持相对静止的时候，观测画面是不会变化的

所以我们固定观测者在原点，拍摄方向是-Z，向上方向是Y

最后只需要移动物体即可

1. 先把位置平移到原点

$$
T_{view} = \left[{\begin{array}{r r r r}{1}&{0}&{0}&{-x_{e}}\\ {0}&{1}&{0}&{-y_{e}}\\ {0}&{0}&{1}&{-z_{e}}\\ {0}&{0}&{0}&{1}\end{array}}\right]
$$

2. 把观察方向旋转到-Z，向上方向旋转到Y，($g \times t$旋转到X)

   由于正向旋转不太好求，我们可以求逆变换的矩阵，再对它求逆

   旋转矩阵是正交矩阵，它的逆矩阵就是转置矩阵
   $$
   R_{view}^{-1}=\left[\begin{array}{c c c c}
   x_{\hat{g}\times\hat{t}}&{x_{t}}&{x_{-g}}&{0}\\ 
   {y_{\hat{g}\times\hat{t}}}&{y_{t}}&{y_{-g}}&{0}\\ 
   {z_{\hat{g}\times\hat{t}}}&{z_{t}}&{z_{-g}}&{0}\\ 
   {0}&{0}&{0}&{1}
   \end{array}\right]
   $$

$$
R_{v i e w}=\left[\begin{array}{c c c c}{{x_{\hat{g}\times\hat{t}}}}&{{y_{\hat{g}\times\hat{t}}}}&{{z_{\hat{g}\times\hat{t}}}}&{{0}}\\ {{x_{t}}}&{{y_{t}}}&{{z_{t}}}&{{0}}\\ {{x_{-g}}}&{{y_{-g}}}&{{z_{-g}}}&{{0}}\\ 0&{{0}}&{{0}}&{{1}}\end{array}\right]
$$

$$
M_{view} = R_{view}T_{view}
$$



### 投影变换

![image-20230419153530542](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304191535575.png)

类似点光源和平行光的区别

#### 正交投影

原来平行的线在投影中还是平行的，不会有近大远小的现象，更多用在工程制图中。

![image-20230419154713507](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304191547555.png)

原理就是三视图，丢掉一个维度，每个点最后的投影只和x，y有关

这就产生了一个问题，$(x,y,z_1)和(x,y,z_2)$在投影中落在了同一点，那么就要区分看到的是哪一个点了

相同z的点将会形成一条轮廓

---

上述把z扔掉的做法对人理解上很直观，但是对于计算机来说不好操作

**定义**：${[-1,1]^{3}}$叫做标准正方体，任何长方体包括正方体都可以映射成一个标准正方体

##### 步骤

1. 移动：把原来的物体的中心平移到原点

2. 伸缩变换：把$[l,r] \times [b, t] \times [f, n]$在三个维度上分别映射到${[-1,1]^3}$

   ![image-20230419233049559](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304192330585.png)

   **namo接下来我们要把它写成矩阵的形式**
   $$
   M_{ortho}=\begin{bmatrix}\frac{2}{r-l}&0&0&0\\ 0&\frac{2}{t-b}&0&0\\ 0&0&\frac{2}{n-f}&0\\ 0&0&0&1\end{bmatrix}\begin{bmatrix}1&0&0&-\frac{r+l}{2}\\ 0&1&0&-\frac{t+b}{2}\\ 0&0&1&-\frac{n+f}{2}\\0&0&0&1\\ \end{bmatrix}
   $$
   

#### 透视投影

原来平行的线在投影中不再平行，满足近大远小的现象

![image-20230419154646051](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304191546122.png)

##### 步骤

1. 远平面等比例收缩

   1. z不变
   2. 平面的中心点不变

   ![image-20230420001210135](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304200012754.png)

   图中显然显然有个相似三角形，最后$y^{'} = \frac{n}{z}y$，同理$x^{'} = \frac{n}{z}x$
   $$
   \begin{pmatrix}x\\y\\z\\1\end{pmatrix}\Rightarrow
   \begin{pmatrix}nx/z\\ny/z\\
   \text{unknown}\\
   1
   \end{pmatrix}
   \overset{\text{mult. by z}}{==}
   \begin{pmatrix}
   nx\\
   ny\\
   \text{still unknown}\\
   z
   \end{pmatrix}
   $$
   最后的z我们不在意，因为最后我们只想要远平面被挤压后在近平面的位置

   由此我们的到
   $$
   M^{(4\times4)}_{persp \to ortho}\begin{pmatrix}x\\ y\\ z\\ 1\end{pmatrix}=\begin{pmatrix}nx\\ ny\\ \text{unknown}\\ z\end{pmatrix}
   $$
   而变换矩阵中的某些元素可以确认
   $$
   M_{persp\to ortho}=\begin{pmatrix}n&0&0&0\\ 0&n&0&0\\?&?&?&?\\ 0&0&1&0\end{pmatrix}
   $$
   很好理解，结果矩阵的第一行nx是由x乘上M的第一行的每一列再相加的到的，所以除了第一列对应x的那一项其他都是0

   那么剩下的该如何确定，我们还有两个特殊点没有代入

   1. 在近平面的点没有变化
   2. 其他平面点的z没有变化

   代入z = n得：
   $$
   M^{(4\times4)}_{persp\to ortho}\begin{pmatrix}x\\ y\\ z\\ 1\end{pmatrix}=\begin{pmatrix}nx\\ ny\\ \text{unknown}\\ z\end{pmatrix} \overset{\text{代入z=n}}{=}
   \begin{pmatrix}x\\ y\\ n\\ 1\\ \end{pmatrix}\Rightarrow\begin{pmatrix}{x}\\ y\\ n\\ 1\end{pmatrix}==\begin{pmatrix}{n x}\\ n y\\ n^2\\ n\end{pmatrix}
   $$

   $$
   \begin{pmatrix}0&0&A&B\end{pmatrix}\begin{pmatrix}x\\ y\\ n\\ 1\end{pmatrix}=n^2
   $$

   

   同理代入远平面的中心点
   $$
   \begin{pmatrix}0\\0\\f\\1\end{pmatrix}\Rightarrow\begin{pmatrix}0\\0\\f\\1\end{pmatrix}==\begin{pmatrix}0\\0\\f^2\\f\end{pmatrix}
   $$
   得到
   $$
   \begin{gathered}
   An+B=n^2 \\
   Af+B=f^2
   \end{gathered}
   $$
   解得
   $$
   \begin{gathered}
   A=n+f \\
   B=-nf
   \end{gathered}
   $$
   

2. 求正交投影