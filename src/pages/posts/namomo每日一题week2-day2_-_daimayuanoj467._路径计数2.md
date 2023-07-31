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
pubDate: 2022-03-06 23:41:18.626000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week2-day2 - daimayuanoj467. 路径计数2
---

# [路径计数2](http://oj.daimayuan.top/problem/467)
# 题意
给你一个N*N的网格，再给你M个障碍物的坐标，问你从（1，1）点走到（M，M）点有多少种方法。

### 思路
N的大小右1e6，肯定不能正常DP，注意M的范围是3000，可以想到应该是一个M方的算法。

我们定义dp[i]是从（1，1）走到第i个点之前没碰到障碍物后面随便走，那么我们算dp[i]的转移应该为没有限制下（1，1）走到第i个点再减去dp[j](j<i),按照第一个走到的障碍物是哪个枚举了所有不合法情况。

### 代码
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

constexpr int P = 1e9+7;
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

void solve(){
    
    cin >> N >> M;
    
    vector<pair<int, int> > a(M);
    
    for (auto &[x,y] : a) {
        cin >> x >> y;
    }
    
    sort(a.begin(),a.end());
    a.push_back({N,N});
    vector<Z> dp(M+1);
    vector<Z> fact(2*N+1), infact(2*N+1);
    fact[0] = 1;
    for (int i = 1; i <= 2*N; i ++) fact[i] = i * fact[i-1];
  
    infact[2*N] = fact[2*N].inv();
    for (int i = 2*N - 1; i >= 0; i --) infact[i] = infact[i+1] * (i+1);
    
    auto combine = [&](int n, int m) {
        if (n < m || n < 0 || m < 0) return (Z)1;
        return infact[m] * infact[n-m] * fact[n];
    };
    
    for (int i = 0; i <= M; i ++) {
        dp[i] = combine(a[i].first + a[i].second - 2, a[i].first - 1);
        auto [x,y] = a[i];
        for (int j = 0; j < i; j ++) {
            auto [xx,yy] = a[j];
            if (xx > x || yy > y) continue;
            dp[i] -= dp[j]*combine(x + y - xx - yy, x - xx);
        }
    }
    
    cout << dp[M].val() << endl;

}
signed main()
{
    // cin >> T;
    for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```
