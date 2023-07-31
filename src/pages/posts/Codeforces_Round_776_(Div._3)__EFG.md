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
pubDate: 2022-03-09 16:04:13.918000
tags:
- ACM
- ICPC
- 题解
theme: light
title: Codeforces Round 776 (Div. 3)  EFG
---

# E. Rescheduling the Exam
### 题意
给你N个点的坐标，你可以重置一个点的位置，让每个点和前一个点的距离的最小值最大。（第一个点于前一点的距离是和原点的距离）
### 思路
要想最小距离更大，那我们要移动的点一定是最短距离的两个端点的其中一个。
那么这个点有两种去向
1. 放在最后，新增一个d - a.back()的线段
2. 放在最大区间的中间，新增一个(max - 1) / 2 的线段
对两个点进行相同操作取max

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
	vector<int> a(N + 1),b;
	// a.push_back(0);
	for (int i = 1; i <= N; i ++) cin >> a[i];
		
	int p, mmin = INF;
	for (int i = 1; i <= N; i ++) {
		if (a[i] - a[i - 1] - 1 < mmin) {
			mmin = a[i] - a[i - 1] - 1;
			p = i;
		}
	}
	
	int las = 0;
	for (int i = 0; i <= N; i ++) {
		if (i != p) {
			b.push_back(a[i]);
			las = i;
		}
	}
	

	vector<int> v;
	for (int i = 1; i < b.size(); i ++) v.push_back(b[i] - b[i-1] - 1);
	sort(v.begin(),v.end());

	int ans = min(v[0], max(M - a[las] - 1,(v.back() - 1) / 2));
	v.clear();
	if (p > 1) b[p - 1] = a[p];
	for (int i = 1; i < b.size(); i ++) v.push_back(b[i] - b[i-1] - 1);
	sort(v.begin(),v.end());
	if (las == p - 1) {
		las = p;
	}
	ans = max(ans, min(v[0], max(M - a[las] - 1,(v.back() - 1) / 2)));
	cout << ans << endl;
	
	



}
signed main()
{
	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

# Vitaly and Advanced Useless Algorithms 
### 题意
你有N个任务，第i个任务要在a[i]之前完成，然后有M种选择，每种选择你可以花费t时间完成第e个任务的百分之p。如果不能完成所有任务输出-1，否则输出选择的数量，和每种选择的数量。
### 思路
把所有选择按照是针对哪个任务的分类，对每一个任务的选择集合做一次01背包，背包容量要开到两百，那么完成这个任务的最小花费是dp[100...200]。

然后从前往后枚举每个任务，每次加上完成当前任务的最小花费，如果大于截止时间则输出-1。

由于最后要输出方案，定义dp数组第一位是花费的时间，第二位是已选选择的编号（vector）


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


struct node {
	int first,second,id;
};
void solve(){
	
	cin >> N >> M;
	vector<node> w[N];
	vector<int> tt(N);
	for (int i = 0; i < N; i ++) {
		cin >> tt[i];
	}
	for (int i = 0; i < M; i ++) {
		int e, t, p;
		cin >> e >> t >> p;
		e --;
		w[e].push_back({t,p,i + 1});
	}
	
	vector<pair<int, vector<int>>> cost(N);
	for (int i = 0; i < N; i ++) {
		vector<pair<int, vector<int> > > dp(201,{INF,vector<int> (0)});
		dp[0] = {0,vector<int> (0)};
		for (int k = 0; k < w[i].size(); k ++) {
			for (int j = 100 + w[i][k].second; j >= w[i][k].second; j --) {
				if (dp[j - w[i][k].second].first + w[i][k].first < dp[j].first) {
					dp[j] = dp[j - w[i][k].second];
					dp[j].first += w[i][k].first;
					dp[j].second.push_back(w[i][k].id);
				}
			}
			
		}
		cost[i] = {INF,vector<int> (0)};
		for (int j = 100; j <= 200; j ++) {
			if (cost[i].first > dp[j].first) {
				cost[i] = dp[j];
			}
		}
		
	}
	int now = 0;
	vector<vector<int> > ans;
	int res = 0;
	for (int i = 0; i < N; i ++) {
		now += cost[i].first;
		ans.push_back(cost[i].second);
		res += cost[i].second.size();
		// debug(cost[i].first, i);
		if (now > tt[i]) {
			cout << -1 << endl;
			return;
		}
	}
	cout << res << endl;
	for (auto x : ans) {
		for (auto y : x) {
			cout << y << ' ';
		}
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

# G. Counting Shortcuts 
### 题意
模板题，次短路计数  [原题](https://www.acwing.com/problem/content/385/)


### 思路
将数组增加一维，代表最短路和次短路，最后判断次短路是否等于最短路+1，是的话就加上次短路的路径数。
### 代码
```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <vector>
#include <queue>

using namespace std;
const int maxn = 2e5 + 10;
const int inf = 0x3f3f3f3f;
const int mod = 1e9+7;
int N, M;
struct edge { int v, c; };
vector<edge> G[maxn];
int S, F;

struct Dij
{
    int u, c, flog;
    bool operator< (const Dij& r) const
    {
        return c>r.c;
    }
};

int dist[maxn][2], vis[maxn][2], dp[maxn][2];
void dijkstra()
{
    memset(dist, 0x3f, sizeof(dist));
    memset(vis, 0, sizeof(vis));
    memset(dp, 0, sizeof(dp));
    dp[S][0]=1; dist[S][0]=0;
    priority_queue<Dij> que;
    que.push((Dij){S, 0, 0});
    while(!que.empty())
    {
        Dij tp = que.top(); que.pop();
        int u = tp.u, flog = tp.flog;    //使用这个状态更新其他的
        if(vis[u][flog]) continue;
        vis[u][flog] = 1;
        for(int i=0; i<G[u].size(); i++)
        {
            int v = G[u][i].v, c = G[u][i].c;
            int w = dist[u][flog] + c;
            if(w < dist[v][0])    //更新次短路 最短路
            {
                if(dist[v][0] != inf)
                {
                    dist[v][1] = dist[v][0];
                    dp[v][1] = dp[v][0];
                    que.push((Dij){v, dist[v][1], 1});
                }
                dist[v][0] = w;
                dp[v][0] = dp[u][flog];
                que.push((Dij){v, dist[v][0], 0});
            }
            else if(w == dist[v][0])      //更新方法数
                (dp[v][0] += dp[u][flog])%=mod;
            else if(w < dist[v][1])   //更新次短路
            {
                dist[v][1] = w;
                dp[v][1] = dp[u][flog];
                que.push((Dij){v, dist[v][1], 1});
            }
            else if(w == dist[v][1])    //更新方法数
                (dp[v][1] += dp[u][flog]) %= mod;
        }
    }
}

int main()
{
    int T;
    scanf("%d", &T);
    while(T--)
    {
        scanf("%d%d", &N, &M);
        for(int i=0; i<=N; i++) G[i].clear();
        scanf("%d%d", &S, &F);
        for(int i=0; i<M; i++)
        {
            int u, v;
            scanf("%d%d", &u, &v);
            G[u].push_back((edge){v, 1});
            G[v].push_back((edge){u, 1});
        }
        dijkstra();
        if(dist[F][1]-dist[F][0] == 1)
            printf("%d\n", (dp[F][0]+dp[F][1])%mod);
        else
            printf("%d\n", dp[F][0]);
    }
    return 0;
}
```
