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
pubDate: 2022-07-17 10:52:00.680000
tags:
- ACM
- ICPC
- 题解
theme: light
title: VP CodeforcesRound 691(Div.2)
---



# A. Red-Blue Shuffle

#### 题意

有n张牌，有红蓝两个数字（个位），对于一个排列，红蓝分别组成一个n位数，哪个数字大则谁赢，相同的话打平。问最后红蓝两方谁赢的概率更大。



#### 思路

每张牌的红蓝数字是绑定的，我们只需要统计每张牌红数字更大和蓝数字更大的个数，最后看哪种情况更多即可。



#### 代码

```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"
#define rep(pigstar,a,b) for (int pigstar = (a); pigstar <= (b); pigstar ++)
#define per(pigstar,a,b) for (int pigstar = (a); pigstar >= (b); pigstar --)
#define ReadInt(pigstar,a,b) for (int i = (a); i <= (b); i ++) cin >> pigstar[i];
#define OutInt(pigstar,a,b) for (int i = (a); i <= (b); i ++) cout << pigstar[i] << " \n"[i==b]
#define all(pigstar) pigstar.begin(),pigstar.end()
#define rvs(pigstar) reverse(pigstar.begin(),pigstar.end())
#define PII pair<int, int>
#define VI vector<int>
#define VPII vector<PII>
#define pb push_back
#define SZ(pigstar) ((int)(pigstar).size())
#define MP make_pair
#define x first
#define y second


#define CN puts("NO")
#define CY puts("YES")



//----------------debug---------------//
#define debug(args...) { string _s = #args; auto end_pos = remove(_s.begin(), _s.end(), ' '); _s.erase(end_pos, _s.end()); replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); cout << "\n";}
void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
    cerr << (*it) << " = " << a << "   ";
    err(++it, args...);
}
//----------------debug---------------//



typedef double db;
typedef long long ll;
typedef unsigned long long ull;

const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
int lowbit(int x) { return (-x)&x; }
int fac[maxn], invfac[maxn];
void fact_init() {
    fac[0] = 1;
    for (int i = 1; i < maxn; i ++) {
        fac[i] = (fac[i - 1] * i) % mod;
    }
    invfac[maxn - 1] = qmi(fac[maxn - 1], mod - 2, mod);
    for (int i = maxn - 1; i; i --) {
        invfac[i - 1] = (invfac[i] * i) % mod;
    }
}
int C (int n, int m) {
    return ((fac[n] * invfac[m]) % mod * invfac[n - m]) % mod;
}


int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;



void solve(){
    cin >> N;
    string a,b;
    cin >> a >> b;
    int num = 0;
    rep(i,0,N-1) {
        if (a[i] != b[i]) {
            if (a[i] > b[i]) {
                num ++;
            } else num --;
        }
    }
    if (!num) puts("EQUAL");
    else {
        if (num < 0) puts("BLUE");
        else puts("RED");
    }
    
}
signed main()
{
    cin >> T;
    // fact_init();
    for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```



# B. Move and Turn

#### 题意

你当前在（0,0）你可以走n步，每次选择上下左右其中一个方向，但是相邻两步不能是同一条线，必须要垂直。即上一步走了左右，这一步必须走上下；上一步走了上下，这一步必须走左右。问n步后能到达的点有几种可能，



#### 思路

因为上下和左右交替进行，则

- n为偶数

  设n = 2k

  则上下走了k步，左右走了k步。纵向上能到达的点有k + 1个，同理横向能到达的点有k + 1个，最后由(k + 1) * (k + 1)个可能点

- n位奇数

  设n = 2k + 1

  - 若上下走了2k步，左右走了2k + 1步。纵向上能到达的点有k + 1个，同理横向能到达的点有k + 2个，最后由(k + 1) * (k + 2)个可能点
  - 若上下走了2k + 1步，左右走了2k步。纵向上能到达的点有k + 2个，同理横向能到达的点有k + 1个，最后由(k + 1) * (k + 2)个可能点

  所以最后共有2 * (k + 1) * (k + 2) 个可能点



#### 代码

```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"
#define rep(pigstar,a,b) for (int pigstar = (a); pigstar <= (b); pigstar ++)
#define per(pigstar,a,b) for (int pigstar = (a); pigstar >= (b); pigstar --)
#define ReadInt(pigstar,a,b) for (int i = (a); i <= (b); i ++) cin >> pigstar[i];
#define OutInt(pigstar,a,b) for (int i = (a); i <= (b); i ++) cout << pigstar[i] << " \n"[i==b]
#define all(pigstar) pigstar.begin(),pigstar.end()
#define rvs(pigstar) reverse(pigstar.begin(),pigstar.end())
#define PII pair<int, int>
#define VI vector<int>
#define VPII vector<PII>
#define pb push_back
#define SZ(pigstar) ((int)(pigstar).size())
#define MP make_pair
#define x first
#define y second


#define CN puts("NO")
#define CY puts("YES")



//----------------debug---------------//
#define debug(args...) { string _s = #args; auto end_pos = remove(_s.begin(), _s.end(), ' '); _s.erase(end_pos, _s.end()); replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); cout << "\n";}
void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
    cerr << (*it) << " = " << a << "   ";
    err(++it, args...);
}
//----------------debug---------------//



typedef double db;
typedef long long ll;
typedef unsigned long long ull;

const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
int lowbit(int x) { return (-x)&x; }
int fac[maxn], invfac[maxn];
void fact_init() {
    fac[0] = 1;
    for (int i = 1; i < maxn; i ++) {
        fac[i] = (fac[i - 1] * i) % mod;
    }
    invfac[maxn - 1] = qmi(fac[maxn - 1], mod - 2, mod);
    for (int i = maxn - 1; i; i --) {
        invfac[i - 1] = (invfac[i] * i) % mod;
    }
}
int C (int n, int m) {
    return ((fac[n] * invfac[m]) % mod * invfac[n - m]) % mod;
}


int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;



void solve(){
    cin >> N;
    vector<int> a(N);
    int ans = 0;
    if (N & 1) {
        int y = N - 1;
        y /= 2;
        cout << (y + 1) * (y + 2) * 2 << endl;
    } else {
        N /= 2;
        int x = N + 1;
        cout << x * x << endl;
    }

    

}
signed main()
{
    // cin >> T;
    // fact_init();
    for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

# C. Row GCD

#### 题意

给你长度为n的数组a，长度为m的数组b，为与每一个$b_{i}$回答GCD($a_{1} + b_{i}, a_{2} + b_{i}, ..., a_{n} + b_{i}$)



#### 思路

假设答案是ans，那么对于每一个$a[i] + b[j]$ % ans == 0, 由于对于每个询问 $b[j]$是固定的，所以所有$a[i]$%ans也是一样的。也就是说a数组排完序的差分数组的gcd 设为g是ans的倍数。

所以
$$
ans|g\\
a[i] \% g = a[i] \% ans = M = a[0] \% g\\
b[j] \% g = b[j] \% ans = ans - M\\
(b[j] + M) \% ans == ans == 0 (\% ans)\\
ans | (b[j] + M)
$$
所以ans是$gcd(g,(b[j] + M))$

**当n=1的时候a数组没有差分数组，g=0需要特判此时答案是$b[j] + a[0]$**



#### 代码

```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"
#define rep(pigstar,a,b) for (int pigstar = (a); pigstar <= (b); pigstar ++)
#define per(pigstar,a,b) for (int pigstar = (a); pigstar >= (b); pigstar --)
#define ReadInt(pigstar,a,b) for (int i = (a); i <= (b); i ++) cin >> pigstar[i];
#define OutInt(pigstar,a,b) for (int i = (a); i <= (b); i ++) cout << pigstar[i] << " \n"[i==b]
#define all(pigstar) pigstar.begin(),pigstar.end()
#define rvs(pigstar) reverse(pigstar.begin(),pigstar.end())
#define PII pair<int, int>
#define VI vector<int>
#define VPII vector<PII>
#define pb push_back
#define SZ(pigstar) ((int)(pigstar).size())
#define MP make_pair
#define x first
#define y second


#define CN puts("NO")
#define CY puts("YES")



//----------------debug---------------//
#define debug(args...) { string _s = #args; auto end_pos = remove(_s.begin(), _s.end(), ' '); _s.erase(end_pos, _s.end()); replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); cout << "\n";}
void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
    cerr << (*it) << " = " << a << "   ";
    err(++it, args...);
}
//----------------debug---------------//



typedef double db;
typedef long long ll;
typedef unsigned long long ull;

const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
int lowbit(int x) { return (-x)&x; }
int fac[maxn], invfac[maxn];
void fact_init() {
    fac[0] = 1;
    for (int i = 1; i < maxn; i ++) {
        fac[i] = (fac[i - 1] * i) % mod;
    }
    invfac[maxn - 1] = qmi(fac[maxn - 1], mod - 2, mod);
    for (int i = maxn - 1; i; i --) {
        invfac[i - 1] = (invfac[i] * i) % mod;
    }
}
int C (int n, int m) {
    return ((fac[n] * invfac[m]) % mod * invfac[n - m]) % mod;
}


int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;



void solve(){
    cin >> N >> M;
    vector<int> a(N);
    rep(i,0,N-1) cin >> a[i];
    sort(all(a));
    int g = 0;
    rep(i,1,N-1) {
        g = gcd(g, a[i] - a[i-1]);
    }
    int m;
    if (!g) {
        rep(i,1,M) {
            int x;
            cin >> x;
            cout << (x + a[0]) << " ";
        }
        return;
    }
    else m = a[0] % g;
    rep(i,1,M) {
        int x;
        cin >> x;
        x += m;
        cout << gcd(x,g) << " ";
    }
    



}
signed main()
{
    // cin >> T;
    // fact_init();
    for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```



# D. Glass Half Spilled

#### 题意

有n个瓶子，容量为a[i]，当前有b[i]的水，你可以任意转移瓶子里的水，但每次转移过程中会损失一半水，问在一系列操作后，选择k个瓶子最多可以得到多少水。对$1 <= k <= n$作答



#### 思路

首先，贪心的想，水一定是从不要的瓶子中直接转移到选择的瓶子里，减少转移过程中的损失。

选择的瓶子中的水不用转移不会损失，其他都会减半，所以选择瓶子中已有的水要尽可能多。

设$dp[i][j][k]$ 表示前i个水瓶选j个总容量为k 不转移的情况下最多获得多少水，i这一维可以省略

转移方程为
$$
dp[k][v] = max(dp[k-1][v-a[i]] + b[i])
$$
最后对于每个k枚举$min(v,dp[k][v] + (sum - dp[k][v]) / 2)$ 的最大值



#### 代码

```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
// #define int long long
#define endl "\n"
#define rep(pigstar,a,b) for (int pigstar = (a); pigstar <= (b); pigstar ++)
#define per(pigstar,a,b) for (int pigstar = (a); pigstar >= (b); pigstar --)
#define ReadInt(pigstar,a,b) for (int i = (a); i <= (b); i ++) cin >> pigstar[i];
#define OutInt(pigstar,a,b) for (int i = (a); i <= (b); i ++) cout << pigstar[i] << " \n"[i==b]
#define all(pigstar) pigstar.begin(),pigstar.end()
#define rvs(pigstar) reverse(pigstar.begin(),pigstar.end())
#define PII pair<int, int>
#define VI vector<int>
#define VPII vector<PII>
#define pb push_back
#define SZ(pigstar) ((int)(pigstar).size())
#define MP make_pair
#define x first
#define y second


#define CN puts("NO")
#define CY puts("YES")



//----------------debug---------------//
#define debug(args...) { string _s = #args; auto end_pos = remove(_s.begin(), _s.end(), ' '); _s.erase(end_pos, _s.end()); replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); cout << "\n";}
void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
    cerr << (*it) << " = " << a << "   ";
    err(++it, args...);
}
//----------------debug---------------//



typedef double db;
typedef long long ll;
typedef unsigned long long ull;

const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
int lowbit(int x) { return (-x)&x; }
int fac[maxn], invfac[maxn];
void fact_init() {
    fac[0] = 1;
    for (int i = 1; i < maxn; i ++) {
        fac[i] = (fac[i - 1] * i) % mod;
    }
    invfac[maxn - 1] = qmi(fac[maxn - 1], mod - 2, mod);
    for (int i = maxn - 1; i; i --) {
        invfac[i - 1] = (invfac[i] * i) % mod;
    }
}
int C (int n, int m) {
    return ((fac[n] * invfac[m]) % mod * invfac[n - m]) % mod;
}


int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;


int dp[101][10001];
void solve(){
    memset(dp,-0x3f,sizeof dp);
    cin >> N;
    vector<int> a(N + 1), b(N + 1);
    int sum = 0;
    rep(i,1,N) {
        scanf("%d %d",&a[i],&b[i]);
        sum += b[i];
    }
    dp[0][0] = 0;
    rep(i,1,N) {
        per(j,i-1,0) {
            for (int v = 10000; v >= a[i]; v --) {
                dp[j + 1][v] = max(dp[j + 1][v], dp[j][v-a[i]] + b[i]);
            }
        }
    }
    rep(i,1,N) {
        double ans = 0;
        rep(v,0,10000) {
            double temp = min(1.*v, (1. * dp[i][v] + sum) / 2);
            ans = max(ans, temp);
        }
        printf("%.10lf ",ans);
    }
    



}
signed main()
{
    // ios::sync_with_stdio(false);cin.tie(0);
    // cin >> T;
    // fact_init();
    for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

