---
author: pigstar
cover:
  alt: cover
  square: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
  url: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
description: 
keywords: key1, key2, key3
layout: ../../layouts/MarkdownPost.astro
meta:
  - content: pigstar
    name: author
  - content: key3, key4
    name: keywords
pubDate: 2022-03-04 13:01:59.970000
tags:
  - ACM
  - ICPC
  - 题解
theme: light
title: namomo每日一题week1-day7 - daimayuanoj454. Minimum Or Spanning Tree
---

[Minimum Or Spanning Tree](http://oj.daimayuan.top/course/10/problem/454)

# 题意
求图的最小或生成树，权值是所有边权或起来的值

# 思路

- 答案的每一位可以分开考虑
- 因为是或，答案这一位要想是0，则要求所选的边这一位上都是0，我们把边权符合的边都选上，看是否能够将所有点联通
- 我们从高到低考虑每一位，枚举当前位时，这条边还要满足前面位的要求
- 当答案这一位是0，则后面所选边的这一位必须是0，如果是1，则没有要求。

# 代码
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define error(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); }

void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
	cerr << *it << " = " << a << endl;
	err(++it, args...);
}
typedef double db;
typedef long long ll;
typedef unsigned long long ull;

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}


const int maxn = 2e5+7;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;

vector<array<int,3> > edges;

struct DSU {
    std::vector<int> f, siz;
    DSU(int n) : f(n), siz(n, 1) { std::iota(f.begin(), f.end(), 0); }
    int leader(int x) {
        while (x != f[x]) x = f[x] = f[f[x]];
        return x;
    }
    bool same(int x, int y) { return leader(x) == leader(y); }
    bool merge(int x, int y) {
        x = leader(x);
        y = leader(y);
        if (x == y) return false;
        siz[x] += siz[y];
        f[y] = x;
        return true;
    }
    int size(int x) { return siz[leader(x)]; }
};


void solve(){
	
	edges.clear();
	cin >> N >> M;
	for (int i = 0; i < M; i ++) {
		int u, v, w;
		cin >> u >> v >> w;
		u--,v--;
		edges.push_back({u,v,w});
	}
	
	int ans = 0;//逆向思维，最后减去
	
	for (int i = 29; i >= 0; i --) {
		int cur = ans + (1<<i);
		DSU g(N);
		for (auto [u,v,w] : edges) {
			if ((w & cur) == 0) {//ans是1的位，必须是0
				g.merge(u,v);
			}
		}
		int f = 1;//判断是否联通
		for (int i = 0; i < N; i ++) 
			if (!g.same(0,i)) f = 0;
		
		if (f) ans = cur;//更新答案
	}
	
	cout << (1<<30)-1-ans << endl;



}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

