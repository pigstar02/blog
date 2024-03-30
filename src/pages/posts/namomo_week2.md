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
pubDate: 2022-03-06 01:50:38.394000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo week2
---

# [题单](https://vjudge.net/contest/483210#overview)
# F - Infinite Set
### 题意
给你一些数a[i]，你可以得到a[i]*2+1和a[i]*4，问能得到多少个小于2的p次方的数。

### 思路
- 对于一个数它可能是由另一个较小数转变过来，所以我们需要这两个数是否能由另一个转化而来。
- 我们来看两种操作的变化
	- a[i]*2+1，二进制末尾加个1
	- a[i]*4，二进制末尾加2个0
- 根据操作的变化我们看大的数能否回退到较小的a[i]，如果能当前数不插入

- 2的p次二进制是1后面p个0，所以小于它的数 长度小于等于p

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



void solve(){
	
	cin >> N >> M;
	
	vector<int> a (N);
	set<int> s;
	for (int i = 0; i < N; i ++) cin >> a[i];
	sort(a.begin(),a.end());
	for (int i = 0; i < N; i ++) {
		// cin >> a[i];
		int x = a[i];
		int f = 0;
		while(a[i] > 0) {
			if (s.count(a[i])) {
				f = 1;
			}
			if (a[i] & 1) {
				a[i] >>= 1;
			} else if (a[i] & 3) {
				break;
			} else {
				a[i] >>= 2;
			}
		}
		if (!f) {
			s.insert(x);
		}
	}
	
	vector<int> cnt(30,0);
	vector<int> dp(max(M+1,100ll),0);
	for (auto x : s) {
		cnt[__lg(x)] ++;
	}
	
	
	int ans = 0;
	
	for (int i = 0; i < M; i ++) {
		if (i < 30) dp[i] = cnt[i] % mod;
		if (i > 0) (dp[i] += dp[i-1])%=mod;
		if (i > 1) (dp[i] += dp[i-2])%=mod;
		(ans += dp[i]) %= mod;
	}

	cout << ans << endl;
}
signed main()
{
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```



# G - Namomo Subsequence
### 题意
给你一个字符串，问你有几个子序列满足namomo的形式。
N是**1e6**

### 思路
- 显然momo的限制更强一些，如果我们知道了momo的子序列个数只要乘上后面不同于m和o的两个不同的字母的组合（n，a）个数即可。
1. 对于两个字母的组合有多少种有个《初中数学》可以O（1）求得。
	- 记剩下每个字母i的个数是cnt[i]，则不同字母的组合数是（cnt[1] + cnt[2] + ... + cnt[k]）^ 2 - (cnt[1] ^ 2 + cnt[2] ^ 2 + .. + cnt[k] ^ 2) / 2。
	- n，a不能和m，o相同，计算时只需要把cnt[m]和cnt[o]有关的去掉就好了。
	- 维护sum1是剩余字母个数，sum2是每个字母个数平方和。sum1每次减一，sum2 - （cnt * cnt） + ((cnt - 1) * (cnt - 1))，化简之后就是sum2 -= 2 * cnt - 1。算完sum2后再把当前字母的cnt--。
2. 我们可以dp求形如momo的子序列个数。
	- 定义dp[i][j][k]为匹配了momo的第i个位置，第i个位置是k，前一个是j。c[a]是目前为止字符a出现的次数。
	- 转移方程
		- dp[2][j][a[i]] += c[j]
		- dp[3][j][a[i]] += dp[2][a[i]][j]
		- c[a[i]] ++
	-计算当前位置作为最后一位（第四位）的贡献，num_momo = dp[3][a[i]][j], num_na = ((sum1 - c[a[i]] - c[j]) * (sum1 - c[a[i]] - c[j]) - (sum2 - c[a[i]] * c[a[i]] - c[j] * c[j])) / 2 % mod。贡献为num_momo * num_na。


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
const int mod = 998244353;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;


int cal(char s) {
    if (s >= '0' && s <= '9') return (s - '0' + 1);
    if (s >= 'A' && s <= 'Z') return (s - 'A' + 11);
    if (s >= 'a' && s <= 'z') return (s - 'a' + 37);
    return 0;
}
ll dp[10][100][100];
int cnt[100];

void solve(){
    string s;
    cin >> s;
    N = s.size();
    vector<int> a(N);
    for (int i = 0; i < N; i ++) {
        a[N - i - 1] = cal(s[i]);
    }
    
    ll sum1 = N, sum2 = 0;
    vector<int> c(100);
    for (int i = 0; i < N; i ++) {
        c[a[i]] ++;
    }
    for (int i = 1; i < 63; i ++) {
        sum2 += c[i] * c[i];
    }
    
    
    ll ans = 0;
    for (int i = 0; i < N; i ++) {
        sum1 --;
        sum2 -= 2 * c[a[i]] - 1;
        c[a[i]] --;
        for (int j = 1; j < 63; j ++) {
            if (j == a[i]) continue;
            (dp[2][j][a[i]] += cnt[j]) %= mod;
            (dp[3][j][a[i]] += dp[2][a[i]][j]) %= mod;

            ll pre = dp[3][a[i]][j];
            ll af = ((sum1 - c[a[i]] - c[j]) * (sum1 - c[a[i]] - c[j]) - (sum2 - c[a[i]] * c[a[i]] - c[j] * c[j])) / 2 % mod;
            (ans += pre * af) %= mod;
        }
        cnt[a[i]] ++;
    }
    cout << ans << endl;

   	


}
signed main()
{
    // cin >> T;
    ios::sync_with_stdio(false);cin.tie(0);
    
    for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```



# H - Damaged Bicycle
### 题意
给你一张N个点，M条边的图，其中K个点有共享单车，每辆单车有p[i]的概率是坏的。走路的速度是t，骑车的速度是r。问你从1号点走到N号点的最小期望时间是多少。

### 思路
- 生活常识，骑车的速度比走路快，所以为了时间最小，一旦我们成功骑到车我们将沿着最短路走到终点。而在此之前我们都是走路。
- 走的路全部都是最短路，所以我们要预处理起点，终点，有车点到其他点的最短路。
- 用dp[S][i]状压代表S二进制中1的单车都坏了的情况下当前在i到终点还需要的时间的最小期望。
- 转移方程
	1. 车是好的，直接骑到终点。t_car
	2. 车是坏的
		- 走到还没确认好坏的车那里
		- 走路到终点

答案是1+min（2）
- dp[s][i] = dp[s | (1 << j)][j] + d[i][j] / v_walk;
- 最后枚举在哪个点扫到车就好了，时间是d[k][i] / t_walk + dp[1<<i][i];

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


const int maxn = 1e5+7;
const int maxm = 5e5+7;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;

int e[maxm],w[maxm],ne[maxm],h[maxn],idx;

void add(int a, int b) {
	e[idx] = b, ne[idx] = h[a], h[a] = idx ++;
}
void add(int a, int b, int c) {
	e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx ++;
}

int dis[maxn];
int d[21][21];
void dijkstra(int u) {
	memset(dis,0x3f,sizeof(dis));
	vector<int> st(maxn+7, 0);
	dis[u] = 0;
	priority_queue<pair<int, int> , vector<pair<int, int> >, greater<pair<int, int> >> heap;
	heap.push({0, u});      // first存储距离，second存储节点编号

    while (heap.size())
    {
        auto t = heap.top();
        heap.pop();

        int ver = t.second, distance = t.first;

        if (st[ver]) continue;
        st[ver] = true;

        for (int i = h[ver]; i != -1; i = ne[i])
        {
            int j = e[i];
            if (dis[j] > distance + w[i])
            {
                dis[j] = distance + w[i];
                heap.push({dis[j], j});
            }
        }
    }


}

double dp[1<<20][18];
void solve(){
	memset(h,-1,sizeof(int)*(maxn));
	int t, r;
	cin >> t >> r;
	cin >> N >> M;
	for (int i = 0; i < M; i ++) {
		int u, v, w;
		cin >> u >> v >> w;
		add(u, v, w);
		add(v, u, w);
	}


	cin >> K;
	vector<int> a(K + 2), p(K);
	for (int i = 0; i < K; i ++) {
		cin >> a[i] >> p[i];
	}
	a[K] = 1;
	a[K + 1] = N;
	for (int i = 0; i < K + 2; i ++) {
		dijkstra(a[i]);
		for (int j = 0; j < K + 2; j ++) {
			d[i][j] = dis[a[j]];
		}
	}
	
	if (d[K][K + 1] == INF) {
		cout << -1 << endl;
		return;
	}
	for (int S = (1 << K) - 1; S >= 0; S --) {
		for (int i = 0; i < K; i ++) {
			if ((S >> i) & 1) {
				double pbad = 0.01 * p[i];
				double t_car = 1. * d[i][K + 1] / r;//开车到终点
				double t_walk = 1. * d[i][K + 1] / t;//走路到终点
				
				for (int j = 0; j < K; j ++) {
					if ((S >> j) & 1) continue;
					t_walk = min(t_walk, 1. * d[i][j] / t + dp[S | (1 << j)][j]);
				}
				dp[S][i] = pbad * t_walk + (1 - pbad) * t_car;
				
			}
		}
	}
	
	
	double ans = 1. * d[K][K + 1] / t;
	for (int i = 0; i < K; i ++) {
		ans = min(ans, 1. * d[K][i] / t + dp[1 << i][i]);
	}
	// cout << ans << endl;
	printf("%.7lf",ans);

}
signed main()
{
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

# I - Game on Sum (Easy Version)

### 题意

Alice和Bob玩游戏，游戏一共会进行n轮，有一个数s表示总和。每一轮Alice会选择一个0到k之间的实数，Bob选择把它加到s上面或者从s中退减去。Bob至少要选择m次加法。
Bob希望最后的总和尽量小，Alice希望最后的总和尽量大。问两个人都按最优策略，答案是多少。
n < 2000

### 思路
先不要管k，只需要靠虑k=1，最后答案乘以k就好

正着想很乱，会无限递归到最后，所以我们反着想。

dp[i][j]表示还有i局，bob还要至少加j次

显然
- dp[i][0] = 0，因为bob希望总和最小所以他会无脑减，所以Alice每次都选0
- dp[i][i] = i，因为bob只能加了，所以Alice每次都选1

由此，我们可以递推

- Alice选择x，bob选择减，dp[i][j] = dp[i - 1][j] - x

- Alice选择x，bob选择加，dp[i][j] = dp[i - 1][j - 1] + x

因为Alice先选数，所以bob总是选择较小的，所以Alice选择的x使得bob不管加减都相等，即x = (dp[i - 1][j] - dp[i - 1][j - 1]) / 2。

所以 dp[i][j] = (dp[i - 1][j] + dp[i - 1][j - 1]) / 2。

### 代码
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define debug(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); cout << "\n"}

void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
	cerr << *it << " = " << a << "   ";
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

constexpr int P = 1e9 + 7;
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
vector<vector<Z>> dp(2001,vector<Z>(2001,0));

void solve(){
	
	cin >> N >> M >> K;
	Z ans = dp[N][M] * K;
	cout << ans.val() << endl;


}
signed main()
{
	for (int i = 1; i <= 2000; i ++) {
		dp[i][i]  = i;
		for (int j = 1; j < i; j ++) {
			dp[i][j] = (dp[i-1][j] + dp[i-1][j-1]) / 2;
		}
	}
	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```


# J - Game on Sum (Hard Version)
### 题意
和简单版相比n的范围变大了   n < 1000000

### 思路
转移方程像是杨辉三角，dp[i][j]的贡献会传到dp[i+1][j]和dp[i+1][j+1]，即往下或者右下走。

二所有有贡献的点是dp[i][i]，(i,i)走到(N,M)需要向下走N-i步，其中有M-i步往右下走。由于第一步走右下是(i+1,i+1)，这一步的不是转移过来的，所以第一步只能往下走，所以(i,i)走到(N,M)的路径有C(N - i - 1, M - i)种。

根据递推式，没往下走一步都要除以2，所以还要除以2^(N - i)

最后答案是K * C(N - i - 1, M - i) * i / pow(2, N - i)（1 <= i <= M）;

### 代码
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
	cerr << *it << " = " << a << "   ";
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

constexpr int P = 1e9 + 7;
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
	#define int long long
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

vector<Z> fac(maxn + 1), invfac(maxn + 1), inv(maxn + 1);
void solve(){
	
	cin >> N >> M >> K;
	if (N == M) {
		Z ans = (N * K) % mod;
		cout << ans.val() << endl;
		return;
	}
	//dp[i][i] = i, dp[i][0] = 0
	//考虑每个dp[i][i]对dp[n][m]的贡献
	
	auto combine = [&](int n, int m) {
		if (m > n || m < 0 || n < 0) return Z(0);
		return fac[n] * invfac[m] * invfac[n - m];
	};
	
	Z ans = 0;
	for (int i = 1; i <= M; i ++) {

		Z temp = qmi(2,N-i,mod);//每到下一层都要除以二
		Z x = i;
		ans = ans + combine(N - i - 1,(M - i)) / temp * x;//第一次只能往下。
	}
	// cout << ans.val() << endl;
	Z k = K;
	ans = ans * k;
	cout << ans.val() << endl;
	
	
	
	



}
signed main()
{
	fac[0] = 1;
	for (int i = 1; i <= maxn; i++) {
	    fac[i] = fac[i - 1] * i;
	}
	invfac[maxn] = fac[maxn].inv();
	for (int i = maxn; i; i--) {
	    invfac[i - 1] = invfac[i] * i;
	    inv[i] = invfac[i] * fac[i - 1];
	}
	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 

```








