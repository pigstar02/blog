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
pubDate: 2022-02-28 22:58:52.861000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week1-day3 - daimayuanoj451. Dis
---

[#451. Dis](http://oj.daimayuan.top/submissions)
# **题意**
给你一棵树和每个点权值，每次询问你u，v路径上所有点的异或和。

# **思路**
模板题
树上前缀异或和+lca。
# **代码**
```cpp
#include<bits/stdc++.h>
using namespace std;

#define int long long
#define endl '\n'



typedef double db;
typedef long long ll;
typedef unsigned long long ull;

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}


const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;
const int INF = 0x3f3f3f3f3f3f3f3f;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;
vector<int> a(maxn);
int e[maxn],w[maxn],ne[maxn],h[maxn],idx;

void add(int a, int b) {
	e[idx] = b, ne[idx] = h[a], h[a] = idx ++;
}
void add(int a, int b, int c) {
	e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx ++;
}
int dep[maxn], fa[maxn][20], q[maxn],sum[maxn];
void bfs(int root)
{
	dep[0] = 0, dep[root] = 1; int hh = 0, tt = -1;
	sum[0] = a[root];
	q[ ++ tt] = root;
    while(hh <= tt)
    {
        int u = q[hh ++];
		for(int i = h[u]; ~i ; i = ne[i]) {
            int j = e[i];
            if(!dep[j])
            {
            	dep[j] = dep[u] + 1;
				q[ ++ tt] = j;
				sum[j] = sum[u] ^ a[j];
				fa[j][0] = u;
				for(int k = 1; k <= 19; k ++)
				fa[j][k] = fa[fa[j][k - 1]][k - 1];
			}
		}
	}
}

int lca(int a, int b)
{
	if(dep[a] < dep[b]) swap(a, b); 

	for(int i = 19; i >= 0; i --)
	        if(dep[fa[a][i]] >= dep[b])  a = fa[a][i];

	if(a == b)  return a;
	for(int i = 19; i >= 0; i --) 
		if(fa[a][i] != fa[b][i]) {
			a = fa[a][i];
            b = fa[b][i];
        }
    return fa[a][0];
}

void solve(){
	
	cin >> N >> M;
	memset(h,-1,sizeof(int)*(N+10));
	
	
	for (int i = 1; i <= N; i ++) cin >> a[i];
	
	for (int i = 0; i < N - 1; i ++) {
		int u, v;
		cin >> u >> v;
		add(u,v);
		add(v,u);
	}
	bfs(1);
	for (int i = 0; i < M; i ++) {
		int u, v;
		cin >> u >> v;
		int same = lca(u, v);
		int ans = sum[u] ^ sum[v] ^ a[same];
		cout << ans << endl;
	}




}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 

```
