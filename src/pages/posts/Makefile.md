---
author: pigstar
cover:
  alt: cover
  square: https://raw.githubusercontent.com/pigstar02/blog_img/main/202304090934026.png
  url: https://raw.githubusercontent.com/pigstar02/blog_img/main/202304090934026.png
description: ''
keywords: 计算机图形学, GAMES101
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: makefile 
  name: keywords
pubDate: 2023-04-16 10:40:00
tags:
- cpp
- Makefile
theme: light
title: Makefile入门
---

![image-20230409093450986](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304090934026.png)

# 一、语法

```
tag(生成的目标文件)：(依赖文件)
	(执行命令)

.PHONY:(目标文件)#定义伪目标
```

# 二、执行步骤

> 所有Makefile都是为了执行第一条命令

1. 执行第一条命令，查找相关依赖
2. 若相关先关依赖不存在或存在未更新的情况，则执行生成相关依赖的命令（如果有的话）
3. 重复1,2两条一直递归下去

**更新规则**

比较生成目标文件和依赖文件的时间，若依赖文件最近更改时间在生成文件之后则更新

**注意**:依赖文件为空则它的最近更改时间是最前的，即永远不会更新。

# 三、make clean

```
clean:
	rm -f *.o
```

一般clean的使用如上所示，清除一些已生成的代码。

但是除了第一次本地会已存在生成的clean文件，通过比较修改时间，命令将不会执行，提示已是最新。

**解决方法**:通过定义伪目标可不生成目标文件

```
.PHONY:clean
clean:
	rm -f *o
```

# 四、变量

## 1.自定义变量

变量名 = 变量值

## 2.预定义变量

![image-20230409101015407|wild](https://raw.githubusercontent.com/pigstar02/blog_img/main/202304091010439.png)

## 3.获取变量的值

```
$(变量名称)
```

## 4.例子

原来的代码

```
app: main.c a.c b.c
	gcc -c main.c a.c b.c
```

使用变量后

```
app: main.c a.c b.c
$(CXX) -c $^ -o &@
```

# 五、模式匹配

## 1.通配符

```
%.o:%.c
两个%匹配的是相同字符
$?
上一条命令的结果
```

## 2.例子

```
add.o:add.c
	gcc -c add.c
sub.o:sub.c
	gcc -c sub.c
div.o:div.c
	gcc -c div.c
	
...
```

使用通配符可以一条命令执行匹配模式规则的所有命令

```
%.o:%.c
	gcc -c %.c
```

# 六、函数

## wildcard

功能：获取制定目录下指定类型的文件列表

参数：指定的目录，多个目录用空格隔开

示例：

```
$(wildcard *.c ./sub/*.c)

返回值： a.c b.c c.c d.c
```

## patsubst

查找text是否符合pattern，是的话用replacement替换，返回替换的结果

```
$(patsubst %.c, %.o, a.c b.c)

返回：a.o b.o
```



