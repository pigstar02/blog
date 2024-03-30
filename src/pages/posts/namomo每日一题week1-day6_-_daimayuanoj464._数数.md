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
pubDate: 2022-03-03 13:53:15.648000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week1-day6 - daimayuanoj464. 数数
---

# [数数](http://oj.daimayuan.top/problem/464)
# 题意
在给定 𝑁 长的数组 {𝐴} 中进行 𝑄 次询问 [𝐿𝑖,𝑅𝑖] 区间中不大于 𝐻𝑖 的元素个数。

共包含 𝑇 组数据。


# 1.莫队 + 树状数组（3e8没被卡）
### 思路
- 离散化所有a和查询的h
- 树状数组维护当前区间各种取值的个数
- 莫队修改区间
- 复杂度O(N*sqrt(N)*log(N))

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
int blo;

struct node {
	int l, r, h, id;
};
int id[maxn];

bool cmp(node a, node b) {
	if (id[a.l] != id[b.l]) return id[a.l] < id[b.l];
	else return a.r < b.r;
}


template <typename T>
struct Fenwick {
    const int n;
    std::vector<T> a;
    Fenwick(int n) : n(n), a(n) {}
    void add(int x, T v) {
        for (int i = x; i <= n-1; i += i & -i) {
            a[i] += v;
        }
    }
    T sum(int x) {
        T ans = 0;
        for (int i = x; i > 0; i -= i & -i) {
            ans += a[i];
        }
        return ans;
    }
    T rangeSum(int l, int r) {
        return sum(r) - sum(l - 1);
    }
};


void solve(){
	cin >> N >> Q;
	vector<int> a(N+1);
	vector<node> query;
	blo = (ll)sqrt((double)N);
	vector<int> v;
	for (int i = 1; i <= N; i ++) {
		cin >> a[i];
		v.push_back(a[i]);
	}
	
	for (int i = 0; i < Q; i ++) {
		int l, r, h;
		cin >> l >> r >> h;
		id[l] = l / blo;
		id[r] = r / blo;
		v.push_back(h);
		query.push_back({l, r, h, i});
	}
	
	sort(v.begin(),v.end());
	v.erase(unique(v.begin(),v.end()),v.end());
	
	M = v.size();
	for (int i = 1; i <= N; i ++) {
		a[i] = lower_bound(v.begin(),v.end(),a[i]) - v.begin() + 1;
	}
	
	for (int i = 0; i < Q; i ++) {
		query[i].h = lower_bound(v.begin(),v.end(),query[i].h) - v.begin() + 1;
	}
	
	sort(query.begin(),query.end(),cmp);
	
	
	Fenwick<int> t(M+1);
	auto move = [&](int p) {
		int f = 1;
		if (p < 0) {
			f = -1;
			p = - p;
		}
		
		t.add(p,f);
	};
	
	vector<int> ans(Q+10);
	int l = query[0].l, r = query[0].r;
	for (int i = l; i <= r; i ++) {
		ans[query[0].id] += a[i] <= query[0].h;
		t.add(a[i],1);
	}

	for (int i = 1; i < Q; i ++) {
		auto &q = query[i];
	    while (l > q.l) move(a[--l]);
	    while (r < q.r) move(a[++r]);
	    while (l < q.l) move(-a[l++]);
	    while (r > q.r) move(-a[r--]);
	    ans[q.id] = t.sum(q.h);
	}
	for (int i = 0; i < Q; i ++) {
		cout << ans[i] << ' ';
	}
	cout << endl;
	
	
	




}
signed main()
{
	// ios::sync_with_stdio(false);cin.tie(0);
	
	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

# 2.莫队+分块（2*N*sqrt(N)）
### 思路
- 和第一个做法差不多，不过莫队主要复杂度在于n*sqrt(n)次修改，树状数组的修改是log，分块修改是O(1)，查询是O(sqrt(n));
- 所以复杂度是O(2 * N*sqrt(N)）

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
int blo;

struct node {
	int l, r, h, id;
};
int id[maxn];

bool cmp(node a, node b) {
	if (id[a.l] != id[b.l]) return id[a.l] < id[b.l];
	else return a.r < b.r;
}



void solve(){
	cin >> N >> Q;
	vector<int> a(N+1);
	vector<node> query;
	blo = (ll)sqrt((double)N);
	vector<int> v;
	for (int i = 1; i <= N; i ++) {
		cin >> a[i];
		v.push_back(a[i]);
	}
	
	for (int i = 0; i < Q; i ++) {
		int l, r, h;
		cin >> l >> r >> h;
		id[l] = l / blo;
		id[r] = r / blo;
		v.push_back(h);
		query.push_back({l, r, h, i});
	}
	
	sort(v.begin(),v.end());
	v.erase(unique(v.begin(),v.end()),v.end());
	
	M = v.size();
	for (int i = 1; i <= N; i ++) {
		a[i] = lower_bound(v.begin(),v.end(),a[i]) - v.begin() + 1;
	}
	
	for (int i = 0; i < Q; i ++) {
		query[i].h = lower_bound(v.begin(),v.end(),query[i].h) - v.begin() + 1;
	}
	
	sort(query.begin(),query.end(),cmp);
	
	
	int block = sqrt(M);
	vector<int> idv(M+1),sum(block + 10),vv(M+1);
	for (int i = 0; i < M + 1; i ++) idv[i] = i / block;
	auto add = [&](int p) {
		int f = 1;
		if (p < 0) {
			f = -1;
			p = - p;
		}
		vv[p] += f;
		sum[idv[p]] += f;
		
	};
	
	auto ask = [&](int x) {
		int idr = idv[x];
		int ans = 0;
		for (int i = 0; i < idr; i ++) {
			ans += sum[i];
		}
		for (int i = idr * block; i <= x; i ++) {
			ans += vv[i];
		}
		return ans;
	};
	vector<int> ans(Q+10);
	int l = query[0].l, r = query[0].r;
	for (int i = l; i <= r; i ++) {
		ans[query[0].id] += a[i] <= query[0].h;
		add(a[i]);
	}

	for (int i = 1; i < Q; i ++) {
		auto &q = query[i];
	    while (l > q.l) add(a[--l]);
	    while (r < q.r) add(a[++r]);
	    while (l < q.l) add(-a[l++]);
	    while (r > q.r) add(-a[r--]);
	    ans[q.id] = ask(q.h);
	}
	for (int i = 0; i < Q; i ++) {
		cout << ans[i] << ' ';
	}
	cout << endl;
	
	
	




}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	
	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```


# 树状数组
### 思路
对于所有询问按照h排序，每次把小于等于h的a[i]的位置插入到树状数组，这样答案就是区间[l,r]的和。

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

struct qq{
	int l, r, h, id;
};

bool cmp(qq a, qq b) {
	return a.h < b.h;
}


template <typename T>
struct Fenwick {
    const int n;
    std::vector<T> a;
    Fenwick(int n) : n(n), a(n) {}
    void add(int x, T v) {
        for (int i = x; i <= n; i += i & -i) {
            a[i] += v;
        }
    }
    T sum(int x) {
        T ans = 0;
        for (int i = x; i > 0; i -= i & -i) {
            ans += a[i];
        }
        return ans;
    }
    T rangeSum(int l, int r) {
        return sum(r) - sum(l - 1);
    }
};


void solve(){
	cin >> N >> Q;
	vector<pair<int,int> > a(N+1);
	for (int i = 1; i <= N; i ++) {
		cin >> a[i].first;
		a[i].first = -a[i].first;
		a[i].second = i;
	}
		
	priority_queue<pair<int, int> > q;
	for (int i = 1; i <= N; i ++) {
		q.push(a[i]);
	}
	
	vector<qq> query(Q);
	for (int i = 0; i < Q; i ++) {
		int l, r, h;
		cin >> l >> r >> h;
		query[i] = {l, r, h, i};
	}
	
	sort(query.begin(),query.end(),cmp);
	
	Fenwick<int> t(100010);
	vector<int> ans(Q);
	for (int i = 0; i < Q; i ++) {
		// error(q.top().first);
		auto [l,r,h,id] = query[i];
		while (q.size() && -q.top().first <= h) {
			auto [hh,p] = q.top();
			q.pop();
			t.add(p,1);
		}
		
		ans[id] = t.rangeSum(l,r);
		
	}
	
	
	for (int i = 0; i < Q; i ++) {
		cout << ans[i] << ' ';
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
# 主席树在线做法
### 思路
主席树的版本就是查询的区间，维护的值是a[i]的个数。

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


const int maxn = 1e5+7;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;

struct node {
	int l, r, cnt;
}tr[maxn * 21];

int root[maxn], tot;

vector<int> a(maxn);



int insert(int u, int l, int r, int x) {
	int t = ++ tot;
	tr[t] = tr[u];
	tr[t].cnt ++;
	if (l == r) return t;
	int mid = (l + r) >> 1;
	if (x <= mid) {
		tr[t].l = insert(tr[u].l, l, mid, x);
	} else {
		tr[t].r = insert(tr[u].r,mid + 1, r, x);
	}
	return t;
}

int ask(int p, int l, int r, int x) {
	if (!x) return 0;
	if (l == r) return tr[p].cnt;
	
	int mid = (l + r) >> 1;
	if (x > mid) {
		return tr[tr[p].l].cnt + ask(tr[p].r, mid + 1, r, x);
	} else {
		return ask(tr[p].l, l, mid, x);
	}
}

void solve(){
	cin >> N >> Q;
	a.resize(N+1);
	tot = 0;
	vector<int> v;
	for (int i = 1; i <= N; i ++) {
		cin >> a[i];
		v.push_back(a[i]);
	}
	
	sort(v.begin(),v.end());
	v.erase(unique(v.begin(),v.end()),v.end());
	int len = v.size();
	// cout << len << endl;
	
	auto find = [&](int x) {
		return upper_bound(v.begin(),v.end(),x) - v.begin();
	};
	
	
	for (int i = 1; i <= N; i ++) {
		root[i] = insert(root[i - 1], 1, len, find(a[i]));
	}
	for (int i = 0; i < Q; i ++) {
		int l, r, h;
		cin >> l >> r >> h;
		cout << ask(root[r],1,len,find(h)) - ask(root[l-1],1,len,find(h)) << ' ';
	}
	
	cout << endl;
	
	
	




}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	
	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```
