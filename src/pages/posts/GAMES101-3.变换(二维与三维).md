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
pubDate: 2023-04-17 10:40:06
tags:
- GAMES101
- 计算机图形学
theme: light
title: GAMES101-3.变换（二维与三维）
---


## 变换

### 缩放变换

不仅是缩放也可以是放大，只需要把坐标等比例放大或缩小，即 $s_x = s_y$
$$
\left[\begin{array}{l}{{x^{\prime}}}\\ {{y^{\prime}}}\end{array}\right]=\left[\begin{array}{l l}{{s_{x}}}&{{0}}\\ {{0}}&{{s_{y}}}\end{array}\right]\left[\begin{array}{l}{{x}}\\ {{y}}\end{array}\right]
$$

![image-20230417004839275](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304170048313.png)

当$s_x \neq s_y$时，就是一个压缩、拉长的效果

![image-20230416101401563](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304161014607.png)

### 反射变换

类似于一个镜面，选定一条轴，做轴对称图形
$$
\left[\begin{array}{l}{{x^{\prime}}}\\ {{y^{\prime}}}\end{array}\right]=
\left[\begin{array}{l l}{{-1}}&{{0}}\\ {{0}}&{{-1}}\end{array}\right]
\left[\begin{array}{l}{{x}}\\ {{y}}\end{array}\right]
$$

![image-20230416101416010](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304161014044.png)

### 剪切变换

每个点对应的垂直坐标没变，水平坐标从一条直线偏移成一条斜线，相当于乘上了一个斜率系数
$$
\left[\begin{array}{l}{{x^{\prime}}}\\ {{y^{\prime}}}\end{array}\right]=
\left[\begin{array}{l l}{{1}}&{{a}}\\ {{0}}&{{1}}\end{array}\right]
\left[\begin{array}{l}{{x}}\\ {{y}}\end{array}\right]
$$

![image-20230416101434324](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304161014355.png)

### 旋转变换

默认以原点为中心，没指定方向默认逆时针

通过待定系数，代入特殊点可得
$$
\left[\begin{array}{l}{{x^{\prime}}}\\ {{y^{\prime}}}\end{array}\right]=
\left[\begin{array}{l l}{{cos\theta}}&{{-sin\theta}}\\ {{sin\theta}}&{{cos\theta}}\end{array}\right]
\left[\begin{array}{l}{{x}}\\ {{y}}\end{array}\right]
$$

![image-20230416104556502](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304161045536.png)

> 以上变换都属于线性变换，都可以表达为乘上一个2×2的矩阵

### 平移变换

$$
\left[\begin{array}{l}{{x^{\prime}}}\\ {{y^{\prime}}}\end{array}\right]=
\left[\begin{array}{l l}{{1}}&{{0}}\\ {{0}}&{{1}}\end{array}\right]
\left[\begin{array}{l}{{x}}\\ {{y}}\end{array}\right] + 
\left[\begin{array}{l}{t_{x}}\\ {t_{y}}\end{array}\right]
$$

![image-20230416105235776](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304161052807.png)

这显然不符合线性变换的定义，它额外加上了一个常量矩阵

 

## 齐次坐标

对于点增加一个维度标记为1，向量增加一个维度标记为0（想一下，向量是两个点相减，第三维1-1=0）
$$
\left(\begin{array}{c}
x^{\prime} \\
y^{\prime} \\
w^{\prime}
\end{array}\right)=\left(\begin{array}{ccc}
1 & 0 & t_{x} \\
0 & 1 & t_{y} \\
0 & 0 & 1
\end{array}\right) \cdot\left(\begin{array}{c}
x \\
y \\
1
\end{array}\right)=\left(\begin{array}{c}
x+t_{x} \\
y+t_{y} \\
1
\end{array}\right)
$$

**为什么区分点和向量**：向量有平移不变性，那么向量乘上平移的变换矩阵，第三维的0会把平移的影响化掉

**原因**：由于上面的平移变换无法和前面的变换用一个矩阵统一起来，于是引入了齐次坐标

**缺点**：多引入了一个维度，空间占用更大

### 点、向量运算

- 向量 + 向量 = 向量

- 点 - 点 = 向量

- 点 + 向量 = 点

  上述运算对于第三维的结果都是和原来的定义匹配的

- 点 + 点本来是没有定义，认为规定等于原来两个点的中点

  **原因**：相加第三维变成了2，所有元素同除以w将它变为1

### 齐次坐标表示仿射变换

#### 一般形式 

$$
\left(\begin{array}{l}
   x^{\prime} \\
   y^{\prime} \\
   1
   \end{array}\right)=\left(\begin{array}{llc}
   a & b & t_{x} \\
   c & d & t_{y} \\
   0 & 0 & 1
   \end{array}\right) \cdot\left(\begin{array}{l}
   x \\
   y \\
   1
   \end{array}\right)
$$
#### 伸缩变换
$$
\mathbf{S}(s_{x},s_{y})={\left(\begin{array}{l l l}{s_{x}}&{0}&{0}\\ {0}&{s_{y}}&{0}\\ {0}&{0}&{1}\end{array}\right)}
$$

#### 旋转变换

$$
{\bf R}(\alpha)=\left(\begin{array}{l l l}{{\cos{\alpha}}}&{{-\sin{\alpha}}}&{{0}}\\ {{\sin{\alpha}}}&{{\cos{\alpha}}}&{{0}}\\ {{0}}&{{0}}&{{1}}\end{array}\right)
$$

#### 平移变换

$$
\mathrm{T}(t_{x},t_{y})=
\left(\begin{array}{llc}
   1 & 0 & t_{x} \\
   0 & 1 & t_{y} \\
   0 & 0 & 1
   \end{array}\right)
$$

### 逆变换

逆变换就是把图形还原到上一步的操作，只需要乘上上一次操作的**逆矩阵**

![image-20230416214611890](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304162146133.png)

### 复杂变换

要想实现复杂的变换，可以分成多个基本变换的组合

但是多个基本变换之间的**顺序不同**，最后的效果也不同（这个很好理解，每次变换都是乘上一个矩阵，而矩阵乘法是不满足交换律的）

例如先旋转再平移
$$
T_{(1,0)}\cdot R_{45}\begin{bmatrix}
x \\
y \\
1 \\
\end{bmatrix}=
\begin{bmatrix}
1 & 0 & 1 \\
0 & 1 & 0 \\
0 & 0 & 1 \\
\end{bmatrix} 
\begin{bmatrix}
\cos45^\circ & -\sin45^\circ & 0 \\
\sin45^\circ & \cos45^\circ & 0 \\
0 & 0 & 1 \\
\end{bmatrix} 
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$
**运算顺序**
$$
A_{n}(\cdot\cdot\cdot A_{2}(A_{1}(x)))=\mathrm{A_{n}\cdot\cdot\cdot A_{2}\cdot A_{1}}\cdot\left(\begin{array}{c}{{x}}\\ {{y}}\\ {{1}}\end{array}\right)
$$
由于矩阵满足结合律，我们可以对$\mathrm{A_{n}\cdot\cdot\cdot A_{2}\cdot A_{1}}$先进行运算，最后再乘上原始矩阵

所以任何一个很复杂的变化可以表示为一个三维矩阵

#### 以任意一点旋转

1. 先移动到原点

2. 旋转

3. 移动回原来的位置

![image-20230416233633693](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304162336751.png)

**切记先进行的变换矩阵在最右边**

## 三维空间中的变换

### 表示形式

- 点 = $(x, y, z, 1)^{T}$
- 向量 = $(x, y, z, 0)^{T}$

若$(x,y,z,w)(w \neq 0)$表示点$(\frac{x}{w},\frac{y}{w},\frac{z}{w},1)$

### 变换矩阵

#### 一般形式

$$
\left(\begin{array}{c}
x' \\
y' \\
z' \\
1
\end{array}\right) =
\left(\begin{array}{llc}
a & b & c & t_x \\
d & e & f & t_y \\
g & h & i & t_z \\
0 & 0 & 0 & 1
\end{array}\right)
\cdot
\left(\begin{array}{llc}
x' \\
y' \\
z' \\
1
\end{array}\right)
$$

#### 缩放变换

$$
\mathbf{S}(s_x,s_y,s_z)=\begin{pmatrix}s_x&0&0&0\\
0&s_y&0&0\\
0&0&s_z&0\\
0&0&0&1\end{pmatrix}
$$

#### 平移变换

$$
\mathbf{T}(t_x,t_y,t_z)=\begin{pmatrix}1&0&0&t_x\\ 0&1&0&t_y\\ 0&0&1&t_z\\ 0&0&0&1\end{pmatrix}\quad
$$

#### 旋转变换

##### 绕轴旋转

$$
\mathbf{R}_{x}(\alpha)={\left(\begin{array}{l l l l}{1}&{0}&{0}&{0}\\ {0}&{\cos\alpha}&{-\sin\alpha}&{0}\\ {0}&{\sin\alpha}&{\cos\alpha}&{0}\\ {0}&{0}&{0}&{1}\end{array}\right)}
$$

$$
\mathbf{R}_{y}(\alpha)=\left(\begin{array}{c c c c}{{\cos\alpha}}&{{0}}&{{\sin\alpha}}&{{0}}\\ {{0}}&{{1}}&{{0}}&{{0}}\\ {{-\sin\alpha}}&{{0}}&{{\cos\alpha}}&{{0}}\\ {{0}}&{{0}}&{{0}}&{{1}}\end{array}\right)
$$

$$
\mathbf{R}_{z}(\alpha)={\left(\begin{array}{l l l l}{\cos\alpha}&{-\sin\alpha}&{0}&{0}\\ {\sin\alpha}&{\cos\alpha}&{0}&{0}\\ {0}&{0}&{1}&{0}\\ {0}&{0}&{0}&{1}\end{array}\right)}
$$

##### 任意旋转

任意旋转都可以表示为3个绕轴旋转的组合

**罗德里格斯旋转公式是针对原点的旋转**

只需要平移到原点旋转完再平移回去

