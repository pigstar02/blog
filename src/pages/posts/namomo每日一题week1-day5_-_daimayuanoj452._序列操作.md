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
pubDate: 2022-03-02 09:56:18.557000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week1-day5 - daimayuanoj452. 序列操作
---

[序列操作](http://oj.daimayuan.top/problem/452)
# **题意**
给你一个长度N的序列，有M次操作，操作有两种
- 把一个位置的数改成x
- 把小于x的数都改成x

# **思路**
注意到第二种操作是非严格单调增的。我们只需要取一个后缀的最大值。
当某个位置遇到操作一，则该位置的大小应该固定了，因为它前面的修改对其没有影响。
读入很大，cin记得关同步

# **代码**
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


const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;



void solve(){
	
	cin >> N >> M;
	vector<int> a(N), ans(N,-1);
	for (int i = 0; i < N; i ++) cin >> a[i];
		
	vector<int> x(M), y(M), z(M);
	for (int i = 0; i < M; i ++) {
		cin >> x[i];
		if (x[i] == 2) {
			cin >> y[i];
		} else {
			cin >> y[i] >> z[i];
			y[i] --;
		}
	}
	
	int mmax = -1;
	for (int i = M - 1; i >= 0; i --) {
		if (x[i] == 1) {
			if (ans[y[i]] == -1) {
				a[y[i]] = max({z[i], mmax});
				ans[y[i]] = a[y[i]];
			}
		} else {
			mmax = max(mmax, y[i]);
		}
	}
	
	for (int i = 0; i < N; i ++) {
		cout << (ans[i] == -1 ? max(a[i],mmax) : a[i]) << ' ';
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

# 线段树 区间修改最大值+单点修改
### 代码
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


const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;
vector<int> a(maxn);


struct seg{
	#define ls u << 1
	#define rs u << 1 | 1
	struct node {
		int l, r, mmax;
		int lazy;
	}tr[maxn << 2];

	void pushup(int u) {
		tr[u].mmax = max(tr[ls].mmax, tr[rs].mmax);
	}

	void pushdown(int u) {
		if (tr[u].lazy != -1) {
			tr[ls].mmax = max(tr[ls].mmax, tr[u].lazy);
			tr[rs].mmax = max(tr[rs].mmax, tr[u].lazy);
			int &la = tr[u].lazy;
			tr[ls].lazy = max(tr[ls].lazy, la);
			tr[rs].lazy = max(tr[rs].lazy, la);
			la = -1;
		}
	}
	void build(int u, int l, int r) {
		tr[u].l = l, tr[u].r = r;
		if (l == r) {
			tr[u] = {l,r,a[l], -1};
			return;
		}
		int mid = (l + r) >> 1;
		build(ls,l,mid);
		build(rs,mid + 1, r);
		pushup(u);
	}

	void update (int u, int l, int r, int x) {
		if (tr[u].l >= l && tr[u].r <=  r) {
			tr[u].mmax = max(tr[u].mmax, x);
			tr[u].lazy = max(tr[u].lazy, x);
			return;
		}
		pushdown(u);
		int mid = (tr[u].l + tr[u].r) >> 1;
		if (mid >= l) {
			update(ls,l,r,x);
		}
		if (r > mid) {
			update(rs,l,r,x);
		}
		pushup(u);
	}

	void modify (int u, int p, int x) {
		if (tr[u].l == tr[u].r) {
			tr[u].lazy = -1;
			tr[u].mmax = x;
			return;
		}
		
		pushdown(u);
		int mid = (tr[u].l + tr[u].r) >> 1;
		if (p <= mid) modify(ls,p,x);
		else modify(rs,p,x);
		pushup(u);
	}

	int query(int u, int p) {
		if (tr[u].l == tr[u].r && tr[u].l == p) {
			return tr[u].mmax;
		}
		pushdown(u);
		int mid = (tr[u].l + tr[u].r) >> 1;
		if (p <= mid) return query(ls,p);
		else return query(rs,p);
	}
}tr;


void solve(){
	
	cin >> N >> M;
	for (int i = 1; i <= N; i ++) cin >> a[i];
	tr.build(1,1,N);
	vector<int> x(M), y(M), z(M);
	for (int i = 0; i < M; i ++) {
		cin >> x[i];
		if (x[i] == 2) {
			cin >> y[i];
			tr.update(1,1,N,y[i]);
		} else {
			cin >> y[i] >> z[i];
			tr.modify(1,y[i],z[i]);
		}
	}
	
	
	
	for (int i = 1; i <= N; i ++) {
		cout << tr.query(1,i) << ' ';
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
