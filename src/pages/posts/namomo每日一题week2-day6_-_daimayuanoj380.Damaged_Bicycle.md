---
author: pigstar
cover:
  alt: cover
  square: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
  url: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
description: ''
keywords: key1, key2, key3
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: key3, key4
  name: keywords
pubDate: 2022-03-10 17:07:57.709000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week2-day6 - daimayuanoj380.Damaged Bicycle
---

# [Damaged Bicycle](http://oj.daimayuan.top/course/10/problem/380)


# 题意
给你一张N个点，M条边的图，其中K个点有共享单车，每辆单车有p[i]的概率是坏的。走路的速度是t，骑车的速度是r。问你从1号点走到N号点的最小期望时间是多少。

# 思路
- 生活常识，骑车的速度比走路快，所以为了时间最小，一旦我们成功骑到车我们将沿着最短路走到终点。而在此之前我们都是走路。
- 走的路全部都是最短路，所以我们要预处理起点，终点，有车点到其他点的最短路。
- 用dp[S][i]状压代表S二进制中1的单车都坏了的情况下当前在i到终点还需要的时间的最小期望。
- 转移方程
	1. 车是好的，直接骑到终点。t_car
	2. 车是坏的
		- 走到还没确认好坏的车那里
		- 走路到终点

答案是1+min（2）
- dp[s][i] = dp[s | (1 << j)][j] + d[i][j] / v_walk;
- 最后枚举在哪个点扫到车就好了，时间是d[k][i] / t_walk + dp[1<<i][i];

# 代码
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define debug(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); }

void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
	cerr << *it << " = " << a << ' ';
	err(++it, args...);
}
typedef double db;
typedef long long ll;
typedef unsigned long long ull;

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}


const int maxn = 1e5+7;
const int maxm = 5e5+7;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;

int e[maxm],w[maxm],ne[maxm],h[maxn],idx;

void add(int a, int b) {
	e[idx] = b, ne[idx] = h[a], h[a] = idx ++;
}
void add(int a, int b, int c) {
	e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx ++;
}

int dis[maxn];
int d[21][21];
void dijkstra(int u) {
	memset(dis,0x3f,sizeof(dis));
	vector<int> st(maxn+7, 0);
	dis[u] = 0;
	priority_queue<pair<int, int> , vector<pair<int, int> >, greater<pair<int, int> >> heap;
	heap.push({0, u});      // first存储距离，second存储节点编号

    while (heap.size())
    {
        auto t = heap.top();
        heap.pop();

        int ver = t.second, distance = t.first;

        if (st[ver]) continue;
        st[ver] = true;

        for (int i = h[ver]; i != -1; i = ne[i])
        {
            int j = e[i];
            if (dis[j] > distance + w[i])
            {
                dis[j] = distance + w[i];
                heap.push({dis[j], j});
            }
        }
    }


}

double dp[1<<20][18];
void solve(){
	memset(h,-1,sizeof(int)*(maxn));
	int t, r;
	cin >> t >> r;
	cin >> N >> M;
	for (int i = 0; i < M; i ++) {
		int u, v, w;
		cin >> u >> v >> w;
		add(u, v, w);
		add(v, u, w);
	}


	cin >> K;
	vector<int> a(K + 2), p(K);
	for (int i = 0; i < K; i ++) {
		cin >> a[i] >> p[i];
	}
	a[K] = 1;
	a[K + 1] = N;
	for (int i = 0; i < K + 2; i ++) {
		dijkstra(a[i]);
		for (int j = 0; j < K + 2; j ++) {
			d[i][j] = dis[a[j]];
		}
	}
	
	if (d[K][K + 1] == INF) {
		cout << -1 << endl;
		return;
	}
	for (int S = (1 << K) - 1; S >= 0; S --) {
		for (int i = 0; i < K; i ++) {
			if ((S >> i) & 1) {
				double pbad = 0.01 * p[i];
				double t_car = 1. * d[i][K + 1] / r;//开车到终点
				double t_walk = 1. * d[i][K + 1] / t;//走路到终点
				
				for (int j = 0; j < K; j ++) {
					if ((S >> j) & 1) continue;
					t_walk = min(t_walk, 1. * d[i][j] / t + dp[S | (1 << j)][j]);
				}
				dp[S][i] = pbad * t_walk + (1 - pbad) * t_car;
				
			}
		}
	}
	
	
	double ans = 1. * d[K][K + 1] / t;
	for (int i = 0; i < K; i ++) {
		ans = min(ans, 1. * d[K][i] / t + dp[1 << i][i]);
	}
	// cout << ans << endl;
	printf("%.7lf",ans);

}
signed main()
{
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```