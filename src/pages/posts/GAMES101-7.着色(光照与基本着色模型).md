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
pubDate: 2023-04-20 20:23:57
tags:
- GAMES101
- 计算机图形学
theme: light
title: GAMES101-7.着色（光照与基本着色模型）
---
# 可见性

## 画家算法

近的物体会遮挡住远处的物体，只要从远到近依次画出物体，近物覆盖远物，就可以画出正确的画面

由远到近需要用到排序，复杂度是$O(nlogn)$

但是会出现一个环形互相叠的环就无法区分哪个最远

![image-20230422222538972](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304222225676.png)

所以显然想要用画家算法需要找到一个拓扑序

**想想挑竹签的游戏**

## Z-Buffer(深度缓存)

- 记录每一个像素最画面中最前（靠近相机）的距离
- 需要记录两个信息
  - 深度缓存：记录深度，颜色深代表距离近
  - frame缓存：记录颜色，如果当前像素最浅深度被更新，则用当前物体的颜色更新当前像素颜色

![image-20230422223255472](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304222232498.png)

```cpp
//zbuffer初始化为无限大，因为下面我们取min，无限大相当于一个无用操作
for (each triangle T）//遍历每个三角形
	for (each sample (x,y,z) in T) //遍历每个像素
		if (z < zbuffer[x,y]) //按照深度更新
			framebuffer[x,y] = rgb; //深度更新了，更新对应颜色
			zbuffer[x,y] = z;
		else
```

只需要遍历每个三角形和每个三角形包含的像素，如果像素个数是个常数，复杂度是$O(n)$

> Q:如何处理透明物体？
>
> A:自己想的，先说结论，透明像素直接continue。首先透明物体会表现后一个较远距离的颜色，颜色肯定不更新，那距离也不应该更新，试想一下有三个物体远(红)中(黄)近(透明)，先遍历远的像素成红色，再遍历近的透明像素，如果更新了距离，接下来遍历中距离的黄色物体就无法更新颜色了（实际是远红借用了近透明的距离）

# 着色

用不同的材质处理物体不同的面

## Blinn-Phong 反射模型

对于每个着色点，我们都认为它是平的。就算是曲面无限微分近似成平面。

![image-20230422230930274](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304222309299.png)

**局部性**

着色的过程中，我们只关注要被着色的物体，不考虑其他物体对他的影响

比如下图物体背面的地面应该有影子是黑色，但是给地面着色的时候我们视物体不存在

![image-20230422231147062](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304222311090.png)

### 漫反射

打到这个点的光从不同的角度均匀的反射出去

![image-20230422231335928](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304222313025.png)

但是不同的角度和反射光线强度的关系是什么样的？

![image-20230422231644315](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304222316337.png)

首先认为光源的平行光是均匀的，那么如图接收到的光就和接收到的长度成正比。

倾斜后的有效长度就是红线部分，是入射光强度$\times \cos\theta$，$\theta$是入射光线和法线的夹角

### 光源

![image-20230422233538321](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304222335350.png)

点光源每一时刻发出的光能量相同，都集中在一个球壳上(图是二维的，其实是三维中的一个球的表面)

球表面面积公式是$S = 4 \pi r^2$，所以和$r^2$成反比

### 总结

![image-20230422234036173](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304222340201.png)

- 吸收要和0取max，当余弦是负数是从下面照过来，不考虑折射没有实际物理含义
- $k_d$是一个系数，不同的材质、颜色对光的反射效果是不一样的