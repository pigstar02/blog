---
author: pigstar
cover:
  alt: cover
  square: null
  url: null
description: ''
keywords: 计算机图形学, GAMES101
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: linux网络编程, webserver
  name: keywords
pubDate: 2023-02-27 16:32:17
tags: [linux网络编程, webserver]
theme: light
title: webserver常用指令
---

# webserver函数

- **socket**

  ```cpp
  定义：
  int socket(int domain, int type, int protocol);
  参数domain指定套接字的域，通常使用AF_INET表示Internet域（即IPv4），或者使用AF_INET6表示IPv6。参数type指定套接字的类型，常用的有SOCK_STREAM表示流套接字（TCP协议），SOCK_DGRAM表示数据报套接字（UDP协议）。参数protocol指定套接字所使用的协议，常用的有IPPROTO_TCP表示TCP协议，IPPROTO_UDP表示UDP协议。但是，如果将参数设置为0，表示让操作系统自动根据域和类型选择协议。
    
  socket(AF_INET, SOCK_STREAM, 0);
  ```

  创建一个socket（套接字）并返回一个文件标识符，创建失败返回-1

- **bzero**

  ```cpp
  定义：
  void bzero(void *s, size_t n);
  参数s是要清零的内存块的起始地址，参数n是要清零的字节数。
    
  bzero(&serv_addr, sizeof(serv_addr));
  ```

  bzero函数将从s开始的n个字节都设置为0。

- **sockaddr_in**

  表示服务器地址的结构体

  ```cpp
  serv_addr.sin_family = AF_INET;//sin_family指定了地址族，这里将其设置为AF_INET表示IPv4。
  serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");//sin_addr指定了IP地址，inet_addr函数将字符串格式的IPv4地址转换成网络字节序的32位二进制数，赋值给s_addr字段
  serv_addr.sin_port = htons(8888);//sin_port指定了端口号，htons函数将主机字节序的16位整数转换为网络字节序的16位整数，赋值给sin_port字段
  ```

- **bind**

  ```cpp
  int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen)
  //sockfd是要绑定的套接字描述符，addr是要绑定的本地地址结构体的指针，addrlen是addr指向的结构体的长度。
  ```

  `bind()`函数通常用于将一个本地的地址和套接字进行绑定，`bind()`函数返回值为0表示绑定成功，否则会返回-1，此时可以通过`perror()`函数输出具体错误信息。

- **listen**

  ```cpp
  int listen(int sockfd, int backlog);
  //sockfd是要监听的套接字描述符，backlog是请求队列的最大长度，表示在连接还未被accept()函数处理前，连接请求可以放在队列中等待被处理的最大数量。
  ```

	`listen()`函数通常用于将一个套接字设置为被动监听状态，以等待客户端的连接请求。当有连接请求到达时，`accept()`函数会从连接请求队列中取出一个连接请求进行处理。如果请求队列已满，新的连接请求将被拒绝，客户端将收到一个`ECONNREFUSED`错误

