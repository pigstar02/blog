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
pubDate: 2022-03-08 14:50:03.806000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week2-day4 - daimayuanoj497. XOR Inverse
---

# [XOR Inverse](http://oj.daimayuan.top/problem/497)

# 题意
给你N个数，给每个数都异或上x，求使新得到的数组的逆序对最少的x，和逆序对数量，如果有多个逆序对相同的x，求最小的x。

# 思路
从高到低对于每一位考虑，然后将所有数按照这一位是0还是1分组，继续递归下去。因为不同组之间这一位一定不同，也就是说大小关系已经确认了，所以后面的变化不会影响不同组之间的逆序对数量，所以我们只需要递归考虑每一组内部的逆序对即可。

最后只有比较一下x这一位放1还是0哪个逆序对数量少，如果相同放0（保证x最小）

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


int ans = 0;
int dp[maxn][2];
void dp1(int wei, vector<int> a) {
    if (wei < 0 || a.size() == 0) return;
    int o = 0,z = 0;
    int ni = 0, ni2 = 0;
    vector<int> x, y;
    for (int i = 0; i < a.size(); i ++) {
        if ((a[i] >> wei) & 1) {
            o ++;
            x.push_back(a[i]);
            ni2 += z;
        } else {
            ni += o;
            z ++;
            y.push_back(a[i]);
        }
    }
    dp[wei][0] += ni;
    dp[wei][1] += ni2;
    
    dp1(wei-1,x);
    dp1(wei-1,y);
    
    
}

void solve(){
    
    cin >> N;
    vector<int> a(N);
    for (int i = 0; i < N; i ++) cin >> a[i];
        
    dp1(31,a);
    
    int ans = 0, res = 0;
    for (int i = 0; i <= 30; i ++) {
        if (dp[i][0] <= dp[i][1]) {
            ans += dp[i][0];
        } else {
            ans += dp[i][1];
            res |= (1 << i);
        }
    }
    cout << ans << ' ' << res << endl;
    
    // 0 1 3 2
    // 0 0 1 1
    // 0 1 1 0

}
signed main()
{
    // cin >> T;
    for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```
