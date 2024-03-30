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
pubDate: 2022-04-27 14:59:18
tags:
- ACM
- ICPC
- 题解
theme: light
title: F.Cheap_Robot
---

# F. Cheap Robot

[Problem - F - Codeforces](https://codeforces.com/contest/1253/problem/F)

> 思路还行，代码贼长，多是模板的拼凑，多亏了代码片段，要不然敲死

### 题意

- 给你一个有n个点，m条边的带权无向图。
- 编号1至k的点是充电点，经过可以恢复电量到最大容量
- 每经过一条边要消耗边权的电量
- q次询问，询问要想从u到达v，电池的最小容量是多少。



### 思路

注意到询问的起点和终点都是充电点，所以我们可以先用dijkstra处理出每个点到最近的充电点的距离。



因为起点是充电点，所以开始是满电$C$，假如我们当前到了u点剩余电量是$x$，那么一定有$x <= C - dis_{u}$ 右边是从最近的一个充电点走过来剩余电量，这个值是别的点走到u的最大剩余电量。



如果要从u走到v，那么$x - w_{u->v} >= dis_{v}$



综上$C >= x + dis_{u} >= w_{u->v} + dis{v} + dis_{u}$



我们将原图的边权$w_{uv} += dis_{u} + dis_{v}$ 

问题转化为，两点路径中最大权值的最小值，这个用克鲁斯卡尔重构树解决。



我们将边从小到大排，这样构建的克鲁斯卡尔重构树是一个大根堆。

每个新加的点都是原图中的一条边，原图中的路径中边权最大的边就是新图中两点路径上点权最大的点。

由于是大根堆，我们又要最大权值最小，所以答案就是两点LCA的权值。





**样例一的重构树**

节点11开始都是新加的点，代表了原图的边

节点2,3的最近公共祖先是16，他的权值是12.

![](https://cdn.jsdelivr.net/gh/zhujuqiang/blog_img/20220427154026.png)



### 代码

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


const int maxn = 2e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;

struct E {
    int u,v,w;
    friend bool operator < (const E &a, const E &b) {
        return a.w < b.w;
    }
};


int e[maxn],w[maxn],ne[maxn],h[maxn],idx;
void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx ++;
}
void add(int a, int b, int c) {
    e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx ++;
}


vector<ll> dis(maxn,INF);
vector<int> st(maxn);
int dijkstra() {
    
    priority_queue<pair<ll, int>> q;
    for (int i = 1; i <= K; i ++) {
        q.push({0,i});
        dis[i] = 0;
    }

    while (q.size()) {
        auto [d,id] = q.top();
        d = -d;
        q.pop();
        if (st[id]) continue;
        st[id] = 1;
        for (int i = h[id]; ~i; i = ne[i]) {
            int j = e[i];
            if (dis[j] > (d + w[i])) {
                dis[j] = d + w[i];
                q.push({-dis[j],j});
            }
        }
        
    }
    return -1ll;
}

struct DSU {
    std::vector<int> f, siz;
    DSU(int n) : f(n), siz(n, 1) { std::iota(f.begin(), f.end(), 0); }
    int leader(int x) {
        while (x != f[x]) x = f[x] = f[f[x]];
        return x;
    }
    bool same(int x, int y) { return leader(x) == leader(y); }
    bool merge(int x, int y) {
        x = leader(x);
        y = leader(y);
        if (x == y) return false;
        siz[x] += siz[y];
        f[y] = x;
        return true;
    }
    int size(int x) { return siz[leader(x)]; }
};


int dep[maxn], fa[maxn][22], q[maxn];
void bfs(int root)
{
    dep[0] = 0, dep[root] = 1; int hh = 0, tt = -1;
    q[ ++ tt] = root;
    while(hh <= tt)
    {
        int u = q[hh ++];
        for(int i = h[u]; ~i ; i = ne[i]) {
            int j = e[i];
            if(!dep[j])
            {
                dep[j] = dep[u] + 1;
                q[ ++ tt] = j;
                fa[j][0] = u;
                for(int k = 1; k <= 21; k ++)
                fa[j][k] = fa[fa[j][k - 1]][k - 1];
            }
        }
    }
}

int lca(int a, int b)
{
    if(dep[a] < dep[b]) swap(a, b); 

    for(int i = 21; i >= 0; i --)
            if(dep[fa[a][i]] >= dep[b])  a = fa[a][i];

    if(a == b)  return a;
    for(int i = 21; i >= 0; i --) 
        if(fa[a][i] != fa[b][i]) {
            a = fa[a][i];
            b = fa[b][i];
        }
    return fa[a][0];
}


void solve(){
    rd(N, M, K, Q);
    memset(h,-1,sizeof(int) * (N + 10));
    vector<E> edge;
    for (int i = 1, u, v, w; i <= M; i ++) {
        rd(u, v, w);
        edge.push_back({u,v,w});//离线下来，最后要修改边权
        add(u,v,w);
        add(v,u,w);
    }
    
    dijkstra();//预处理每个点离最近充电点的距离
    
    for (auto &[u,v,w] : edge) {//更改边权
        w += dis[u] + dis[v];
    }
    
    
    //构建重构树
    sort(edge.begin(),edge.end());//按照边权从小到大排   
    //重新初始化 
    memset(h,-1,sizeof(int) * (2 * N + 10));
    idx = 0;
    //有新加的节点，方便开两倍，理论上最多2*N-1个点
    DSU g(2 * N + 10);
    vector<int> _w(2 * N + 10);
    int cnt = N;//新加编号从N+1开始
    for (auto [u, v, w] : edge) {
        u = g.leader(u);
        v = g.leader(v);
        if (u == v) continue;
        g.f[u] = g.f[v] = ++cnt;
        _w[cnt] = w ;//点权等于原来边权
        add(cnt,u);
        add(cnt,v);
    }
    
    
    bfs(cnt);//倍增求lca预处理
    
    
    for (int i = 1; i <= Q; i ++) {
        int u, v;
        rd(u, v);
        int fa = lca(u,v);
        cout << _w[fa] << endl;
    }



}
signed main()
{
    // cin >> T;
    for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

