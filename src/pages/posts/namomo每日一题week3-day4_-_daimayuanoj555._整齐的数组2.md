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
pubDate: 2022-03-15 10:52:00.680000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week3-day4 - daimayuanoj555. 整齐的数组2
---

# [整齐的数组](http://oj.daimayuan.top/course/10/problem/555)

# 题意
选择一个k，可以对任意数执行若干次，最后能够让数组至少一半相同。问满足条件的最大的k，如果k可以任意打，输出-1。

# 思路
首先，如果开始数组有一半相同，那么直接输出-1.

否则，枚举最后相同的数是a[i]，其他数都和a[i]作差，得到b数组，当k是b[j]的因子，则a[j]可以通过若干次操作变成a[i]。所以我们要根号枚举b[j]
。并用map记录次数，如果大于一半则更新答案。

- 枚举因子时，如果b[j]是一个完全平方数，那么只能加一次
- 如果b[j]和a[i]相等不会被根号枚举，但是可以操作0次和a[i]相等，可以在处理b数组时统计。

# 代码
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define debug(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); cout << "\n";}
void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
  cerr << *it << " = " << a << "   ";
  err(++it, args...);
}
template <typename T>inline void rd(T& t) {
   int s=0,w=1;
   char ch=getchar();
   while(ch<'0'||ch>'9'){if(ch=='-')w=-1;ch=getchar();}
   while(ch>='0'&&ch<='9') s=s*10+ch-'0',ch=getchar();
   t = s*w;
}
template <typename T,typename... Args> inline void rd(T& t, Args&... args){rd(t);rd(args...);}




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
    cin >> N;
    vector<int> a(N);
    map<int, int> cc;
    int f = 0;
    for (int i = 0; i < N; i ++) {
        cin >> a[i];
        // debug(a[i]%13);
        cc[a[i]] ++;
        if (cc[a[i]] >= N / 2) {
            f = 1;
        }
    }
    if (f) {
        cout << -1 << endl;
        return;
    }
    
    sort(a.begin(),a.end());
    
    
    int ans = 1;
    for (int i = 0; i < N; i ++) {
        vector<int> b;
        int z = 0;
        for (int j = 0; j < i; j ++) {
            b.push_back(a[i] - a[j]);
            z += (a[i] - a[j] == 0);
        }
        for (int j = i + 1; j < N; j ++) {
            b.push_back(a[j] - a[i]);
            z += (a[i] - a[j] == 0);
        }
        sort(b.begin(),b.end());
        cc.clear();
        for (int j = 0; j < b.size(); j ++) {
            for (int k = 1; k <= sqrt(b[j]); k ++) {
                if (b[j] % k == 0) {
                    cc[k] ++;
                    if (cc[k] + 1 + z >= N / 2) {
                        ans = max(ans, k);
                    }
                    if (k*k != b[j]) {
                        cc[b[j] / k] ++;
                        if (cc[b[j] / k] + 1 + z >= N / 2) {
                            ans = max(ans, b[j]/k);
                        }
                    }
                }
            }
        }
        
        
    }
    
    cout << ans << endl;


}
signed main()
{
    ios::sync_with_stdio(false);cin.tie(0);
    
  cin >> T;
  for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```



