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
pubDate: 2022-02-03 17:11:51.157000
tags:
- ACM
- ICPC
- 题解
theme: light
title: Codeforces Round 769 (Div. 2) E2. Distance Tree (hard version)
---


**题意：** 
-
给你一棵树，每条边的权值为1，你可以随便连一条权值为x的边，求任何一点到1号点距离的最大值的最小值。对于x=[1,N]的每一个数输出一个值。

---

**思路：** 
-
- 用d[i]表示深度大于i的两个点的对大距离，这可以用dfs来实现，就是每个节点子树中的前二大的深度，计作x，y，那么可以更新d[min(x,y)-1],当我们取一遍后缀max后相当于i小于min(x,y)的d[i]都被更新了，符合我们对d数组的定义。
- 原来树中的最大深度就是答案的最大值，不会比它更大，因为可以完全不走新加的那条边。
- 新加的边一定是根结点和某个点连。
- 当x增加的时候，ans必然不会减少。因为我们把路径分为两类，第一类是经过新加边的，第二类是只经过原来的边的。随着x的增加一个节点到1号点的距离会不断从第一类到第二类。而第一类是随着x增加的，第二类是固定的他比之前的第一类大，比后来的第一类小。这样就可以双指针x和ans了。

**代码**
-
```cpp
#include<bits/stdc++.h>
using namespace std;

#define PII pair<int,int>
#define ll long long
#define ull unsigned long long
#define fi first
#define se second
#define PI acos(-1.0)
#define lcm(a,b) a/gcd(a,b)*b
#define INF 0x3f3f3f3f3f3f3f3f
#define debug(a) cout<<#a<<" = "<<a<<endl;
#define debug2(a,b) cout<<#a<<" = "<<a<<"-----"<<#b<<" = "<<b<<endl;
#define int long long
#define pb push_back
#define all(s) s.begin(),s.end()
#define sz(s) (int)(s.size())
#define lb(s) ((s) & (-s))
#define mk(s, t) make_pair(s, t)

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
const int maxn = 1e6;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;
int a[maxn],f[maxn],b[maxn],d[maxn],u[maxn];
vector<int> G[4000];
PII v[maxn];
int mmax;
int dfs (int u, int fa, int a[]) {
	int x = a[u], y = a[u];
	for (int j : G[u]) {
		if (j == fa) continue;
		a[j] = a[u] + 1;
		int t = dfs(j,u,a);
		if (t > x) {
			y = x;
			x = t;
		} else if (t > y) {
			y = t;
		}
	}

	int i = min(x,y) - 1;
	if (i >= 0) {
		d[i] = max(d[i], x + y - 2 * a[u] + 1);
	}
	return x;
	// return 0;
}
void solve(){
	cin >> N;
	for (int i = 1; i <= N; i ++) {
		G[i].clear();
		d[i] = 0;
	}
	
	for (int i = 1; i < N; i ++) {
		int a, b;
		cin >> a >> b;
		G[a].pb(b);
		G[b].pb(a);
	}

	int x = dfs(1,-1,a);

	for (int i = N-2; i >= 0; i --) {
		d[i] = max(d[i],d[i+1]);
	}
	

	int ans = 0;
	for (int i = 1; i <= N; i ++) {
		//ans<x因为答案不能超过原来树的最大深度
		//深度小于等于ans的节点可以不用经过新加的边
		//深度大于ans的点只要那两个深度前二大的满足其他点也满足。
		//我们只需要连到那两个点的中点看是否满足（d[ans]/2+i <= ans）
		while(ans < x && d[ans]/2+i > ans) ans ++;
		cout << ans << ' ';
	}
	cout << endl;
	



}

signed main()
{

	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
  	return (0-0); //<3
} 
```



