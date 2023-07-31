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
pubDate: 2023-04-23 13:20:57
tags:
- GAMES101
- 计算机图形学
theme: light
title: GAMES101-9.着色（插值、高级纹理映射）
---

# 插值

## 为什么

我们已知三角形三个顶点的属性，想要知道三角形内部点的属性，并且他们是平滑过渡的

## 重心坐标

三角形所在平面内任何一个点都能被三个顶点线性表示
$$
\begin{aligned}
(x,y) = &\alpha A + \beta B + \gamma C \\
&\alpha + \beta + \gamma = 1\\
\text{因为在三}&\text{角形内部还需满足}\\
&\alpha , \beta , \gamma \geq 0
\end{aligned}
$$
![image-20230423141345214](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231413246.png)

如图所示可以根据面积求得$\alpha , \beta , \gamma$

化简：
$$
\begin{aligned}
&\alpha=\dfrac{-(x-x_B)(y_C-y_B)+(y-y_B)(x_C-x_B)}{-(x_A-x_B)(y_C-y_B)+(y_A-y_B)(x_C-x_B)} \\
&\beta=\dfrac{-(x-x_C)(y_A-y_C)+(y-y_C)(x_A-x_C)}{-(x_B-x_C)(y_A-y_C)+(y_B-y_C)(x_A-x_C)} \\
&\gamma=1-\alpha-\beta
\end{aligned}
$$


相应的重心的坐标就是$(\frac{1}{3}, \frac{1}{3}, \frac{1}{3})$

# 纹理贴图

![image-20230423142039408](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231420441.png)

- 知道定点对应的纹理，只需把上述插值的坐标换成纹理的属性即可插值出内部的纹理
- 在之前学到的模型中就是把对应像素的$k_d$替换，最后还是拥有原有的明暗高光
- 这只是二维平面，在三维空间中，投影后中心坐标会发生改变，所以不可用

## 纹理的放大

当我要把一个低分辨率的纹理贴到一个高分辨率的屏幕上时就会出现纹理的放大现象

本质是差值出来的uv，也就是对应纹理图的坐标不是一个整数，这个时候我们就会对它进行round，结果是周围邻近的几个点可能对应相同的uv

结果是会出现一块一块（走样现象）

![image-20230423143157013](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231431049.png)

### 双线性差值

![image-20230423143749389](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231437414.png)

- 对于非整数坐标找到离他最近的四个整数坐标点

- 接下来做三遍差值（叫双线性指水平和竖直）

  - $u_{00},u_{10}$插值出$u_0$
  - $u_{01},u_{11}$插值出$u_1$
  - 最后竖直方向$u_0,u_1$插值出目标点

- 先竖直再水平是一样的

- 效果

  ![image-20230423143922081](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231533541.png)

### Bicubic

取周围的16个

更加的精细，但是运算量更大

## 纹理过大

纹理的分辨率大于屏幕分辨率

一个像素内会包含很大一块纹理，就会出现锯齿、走样

![image-20230423144500595](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231445635.png)

可以采用超采样，相当于理论上提升屏幕的分辨率，但伴随着更大的计算花销

![image-20230423144602397](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231446433.png)

出现走样是因为采样频率跟不上像素内的高频信息

提高采样频率会带来更大花销，那如果不采样呢？

如何求得范围内的平均值？也可能是极值

## Mipmap（图像金字塔）

### 特点

- 快
- 近似查询，不是完全准确
- 查询范围是方形

![image-20230423145315809](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231453834.png)

![image-20230423145338078](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231453116.png)

- 用一张原始图生成多张图
- 每张图的大小都是前一张图的$\frac{1}{4}$
- 总的存储是原来的$1 + \frac{1}{4} + \frac{1}{16} + ... = \frac{4}{3}$，一个等比数列求和

![image-20230423150002438](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231500483.png)

取最大的L作为近似正方形的边长，查询的点是中心

![image-20230423152300813](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231523857.png)

### 查询

- 在原始图上是$L \times L$在第$log_2L$层会对应一个像素
- 但是L不是刚好是2的幂次，那就要用到插值

### 三线性插值

$D = log_2L$

![image-20230423152834272](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231528316.png)

- 在两张图中分别做双线性差值，得到两个平滑的值
- 再在层与层之间做一遍插值，这样层级之间也能平滑过渡

### 缺点

远处（单个像素包含更大纹理图区域）会过分模糊，细节全都消失

![image-20230423153223467](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231532513.png)

## 各向异性过滤（Anisotropic Filtering）

![image-20230423153453958](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231534002.png)

这可以看成一个二维矩阵，每个图片都是左边的图片宽减少一半，上面的图片高减少一半

mipmap就是对应了主对角线上的图片

空间开销是原来的4倍

### 优点

![image-20230423153737484](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231537525.png)

原来的像素对应到纹理图上不一定是规则的方形，可能是一个长条的形状，如果用方形去指代就会出现过度模糊的后果，所以需要用到更合理的区域去替代

而Anisotropic Filtering预处理了这种情况

可以对长宽类似mipmap分别求层级，就能在二维图像数组找到对应的矩形区域

在处理矩形情况会好很多

但是如图矩形是斜着的，这种方法效果也不好

## EWA

不规则的图形用多个圆形去覆盖它

### 缺点

多次查询时间复杂度高

### 优点

更准确的框图形

# 纹理的应用

## 环境光照/贴图

![image-20230423155626881](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231556938.png)

### Spherical Map

可以记录在一个球面上然后在向世界地图一样展开

![image-20230423160041952](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231600997.png)

但是会造成极点位置的扭曲

### Cube Map

把球上的光照信息记录在正方体的六个表面

![image-20230423160207972](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231602014.png)

![image-20230423160248017](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231602059.png)

## 凹凸贴图/法线贴图

纹理不仅可以定义颜色，也能定义法线的相对位移

这样就可以改变一个点的法线

![image-20230423160548894](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231605937.png)

- 黑色是原来的光滑平面
- 黄色是法线贴图
- 使p点的法线变成n点的到法线

### 计算

![image-20230423160833892](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231608942.png)

- 设原来是水平平面，法线是$(0,1)$

- 先求切线

  $dp = c \times [h(p + 1) - h(p)]$

  切线是$(1,dp)$

- 法线就是把切线逆时针旋转90度

  $n(p) = (-dp,1)$

## 位移贴图

### 区别

- 凹凸贴图是虚拟的位移
- 在边缘和影子灰露馅
- 位移贴图真实的修改了点的坐标

![image-20230423161616810](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231616858.png)

### 要求

模型足够细致，要不然就会跟不上纹理的频率

## 三维噪声

![image-20230423161937484](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304231619531.png)

## 记录数据

在着色的过程中可以处理一些信息，记录在纹理中

最后只需要把着色和纹理的结果合成就好了
