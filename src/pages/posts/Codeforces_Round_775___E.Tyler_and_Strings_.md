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
pubDate: 2022-03-08 16:58:21.248000
tags:
- ACM
- ICPC
- 题解
theme: light
title: Codeforces Round 775   E.Tyler and Strings
---

# [Tyler and Strings ](https://codeforces.com/contest/1649/problem/E)

# 题意
给你一个a数组和一个b数组，求a数组有几种字典序比b数组小的排列（去重）

# 思路
- 类似数位dp的思路，如果a数组当前位置放置的数比b数组小，则后面可以随便放。
- 然后在当前位置放和b数组相同的数继续到下一位。如果这个数放完了，说明这个位置只能放比b数组大的数（放小于的贡献算过了），则break。
- 当前位置放小于的数的贡献计算
	- 还剩几个小于b[i]的数pre，这个可以用树状数组维护。
	- cnt[i]是数字i剩下的个数，则后面随便放去重后的排列有pre * fact[后面剩下的位数] / (fact[cnt[1]] * fact[cnt[2]] * ... * fact[cnt[k]]).

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


constexpr int P = 998244353;
using i64 = long long;
int norm(int x) {
    if (x < 0) {
        x += P;
    }
    if (x >= P) {
        x -= P;
    }
    return x;
}
template<class T>
T power(T a, int b) {
    T res = 1;
    for (; b; b /= 2, a *= a) {
        if (b % 2) {
            res *= a;
        }
    }
    return res;
}
struct Z {
    int x;
    Z(int x = 0) : x(norm(x)) {}
    int val() const {
        return x;
    }
    Z operator-() const {
        return Z(norm(P - x));
    }
    Z inv() const {
        assert(x != 0);
        return power(*this, P - 2);
    }
    Z &operator*=(const Z &rhs) {
        x = i64(x) * rhs.x % P;
        return *this;
    }
    Z &operator+=(const Z &rhs) {
        x = norm(x + rhs.x);
        return *this;
    }
    Z &operator-=(const Z &rhs) {
        x = norm(x - rhs.x);
        return *this;
    }
    Z &operator/=(const Z &rhs) {
        return *this *= rhs.inv();
    }
    friend Z operator*(const Z &lhs, const Z &rhs) {
        Z res = lhs;
        res *= rhs;
        return res;
    }
    friend Z operator+(const Z &lhs, const Z &rhs) {
        Z res = lhs;
        res += rhs;
        return res;
    }
    friend Z operator-(const Z &lhs, const Z &rhs) {
        Z res = lhs;
        res -= rhs;
        return res;
    }
    friend Z operator/(const Z &lhs, const Z &rhs) {
        Z res = lhs;
        res /= rhs;
        return res;
    }
};



template <typename T>
struct Fenwick {
    const int n;
    std::vector<T> a;
    Fenwick(int n) : n(n), a(n) {}
    void add(int x, T v) {
        for (int i = x + 1; i <= n; i += i & -i) {
            a[i - 1] += v;
        }
    }
    T sum(int x) {//小于x的前缀和
        T ans = 0;
        for (int i = x; i > 0; i -= i & -i) {
            ans += a[i - 1];
        }
        return ans;
    }
    T rangeSum(int l, int r) {
        return sum(r) - sum(l);
    }
};




void solve(){
	
	cin >> N >> M;
	Fenwick<Z> fen(2e5);
	vector<int> a(N),b(M),cnt(maxn);
	for (int i = 0; i < N; i ++) {
		cin >> a[i];
		a[i] --;
		cnt[a[i]] ++;
		fen.add(a[i],1);
	}
	
	for (int i = 0; i < M; i ++) {
		cin >> b[i];
		b[i] --;
	}
	
	vector<Z> fact(N+7), infact(N+7), inv(N + 7);
    fact[0] = 1;
    for (int i = 1; i <= N; i++) {
        fact[i] = fact[i - 1] * i;
    }
    infact[N] = fact[N].inv();
    for (int i = N; i; i--) {
        infact[i - 1] = infact[i] * i;
        inv[i] = infact[i] * fact[i - 1];
    }
	
	
	Z cur = 1;
	for (int i = 0; i < 2e5; i ++) {
		cur *= infact[cnt[i]];
	}
	Z ans = 0;
	for (int i = 0; i < min(M, N); i ++) {
		ans += cur * fen.sum(b[i]) * fact[N - i - 1];
		if (cnt[b[i]] == 0) {
			break;
		}
		cur *= cnt[b[i]];
		cnt[b[i]] --;
		fen.add(b[i], -1);
	}
	
	if (N < M && cnt == vector<int> (maxn,0)) {
		ans += 1;
	}
	
	cout << ans.val() << endl;
	
	



}
signed main()
{
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

