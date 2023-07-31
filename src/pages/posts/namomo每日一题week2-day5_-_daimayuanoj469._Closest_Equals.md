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
pubDate: 2022-03-09 13:06:16.867000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week2-day5 - daimayuanoj469. Closest Equals
---

# [Closest Equals](http://oj.daimayuan.top/course/10/problem/469)
# 题意
问你区间内任意两个相同的数的最小距离

# 思路
对于每个点和他前一个相同的点可以看成一个线段的两个端点，这样问题转化为了求完全包含于询问区间内的最短线段。

如果一条线段i包含于另一条线段j，那么线段j可以删去。因为线段j在区间内，则线段i一定也在区间内，而线段i更短。

我们枚举的i是右端点，是递增的，满足两个线段没有包含关系，则左端点也是递增的。

由此我们可以二分出一段区间，这些线段是在询问区间内的，我们只需要用rmq查询区间最小值。

# 代码
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define debug(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); cout << endl;}

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


const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;


int l[maxn], r[maxn], tot;

template<typename T>
struct RMQ {
    static int highest_bit(unsigned x) {
        return x == 0 ? -1 : 31 - __builtin_clz(x);
    }
 
    int n = 0;
    vector<vector<T>> range_min;
 
    RMQ(const vector<T> &values = {}) {
        if (!values.empty())
            build(values);
    }
 
    static T better(T a, T b) {
        return min(a, b);
    }
 
    void build(const vector<T> &values) {
        n = (int)(values.size());
        int levels = highest_bit(n) + 1;
        range_min.resize(levels);
 
        for (int k = 0; k < levels; k++)
            range_min[k].resize(n - (1 << k) + 1);
 
        if (n > 0)
            range_min[0] = values;
 
        for (int k = 1; k < levels; k++)
            for (int i = 0; i <= n - (1 << k); i++)
                range_min[k][i] = better(range_min[k - 1][i], range_min[k - 1][i + (1 << (k - 1))]);
    }
 
    T query_value(ll a, ll b) const {//[a,b),idx from 1
        // assert(0 <= a && a < b && b <= n);
        int level = highest_bit(b - a + 1);
        return better(range_min[level][a], range_min[level][b - (1 << level) + 1]);
    }
};


void solve(){
    
    cin >> N >> M;
    map<int, int> las;
    for (int i = 1; i <= N; i ++) {
        int x;
        cin >> x;
        int pre = las[x];
        if (pre == 0) {
            las[x] = i;
        } else {
            if (pre > l[tot]) {
                l[++tot] = pre;
                r[tot] = i;
            }
            las[x] = i;
        }
    }
    
    vector<int> a(tot);
    for (int i = 1; i <= tot; i ++) {
        // debug(i, l[i], r[i]);
        a[i - 1] = r[i] - l[i];
    }
    RMQ<int> rmq(a);
    
    for (int i = 0; i < M; i ++) {
        int L, R;
        cin >> L >> R;
        int LL = lower_bound(l + 1, l + 1 + tot, L) - l - 1;
        int RR = upper_bound(r + 1, r + 1 + tot, R) - r - 1;
        RR --;
        // debug(LL, RR);
        if (RR < LL) {
            cout << -1 << endl;
            continue;
        } else {
            cout << rmq.query_value(LL,RR) << endl;
        }
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
