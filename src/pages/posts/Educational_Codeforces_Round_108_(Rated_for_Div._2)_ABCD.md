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
pubDate: 2021-04-30 10:12:37
tags:
- ACM
- ICPC
- 题解
theme: light
title: Educational Codeforces Round 108 (Rated for Div. 2) ABCD
---



# A. Red and Blue Beans

**题意**：给你r个红豆，b个蓝豆，还有一个数d。将豆分在若干个盒子里。保证每个盒子里至少有一个红豆和一个蓝豆，且他们的数量差小于等于的d。

**思路**：看较少的豆最多能匹配较多豆几个，如果实际大于最多可匹配的话就输出NO，反之YES。

**代码**

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
#include <cmath>
#include <algorithm>
#include <map>
#include <vector>
#include <queue>
using namespace std;
typedef long long ll;
const int inf=0x3f3f3f3f;
const int N = 1e5+10;

void solve(){
    ll x, y, d;
    cin >> x >> y >> d;
    ll a,b;
    a = max(x,y);
    b = min(x,y);
    if(a>b*(1+d)) puts("NO");
    else puts("YES");
    return;
}
int main()
{
    int T;
    cin >> T;
    while(T--){
        solve();
    }
    return 0;
}

```

---
# B. The Cake Is a Lie

**题意**：给你一个坐标（x，y）和K，求出从（1，1）走到（x，y）的消耗能否恰好是K，只能向右下走。若向右走，消耗是当前坐标的x，若向下走，消耗是当前的y。

**思路**：刚开始想找一条最大和最小，如果K在他们之间的话是YES。结果发现最大和最小总是相等，大胆猜测消耗是唯一的。（最后通过作图确实是）。

**代码**

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
#include <cmath>
#include <algorithm>
#include <map>
#include <vector>
#include <queue>
using namespace std;
typedef long long ll;
const int inf=0x3f3f3f3f;
const int N = 1e5+10;
int dp[N];
void solve(){
    int n, m, k;
    cin >> n >> m >> k;
    int temp = n*m-1;
    if(k!=temp) puts("NO");
    else puts("YES");
    return;
}
int main()
{
    int T;
    cin >> T;
    while(T--){
        solve();
    }
    return 0;
}

```

---
# C.Berland Regional

**题意**：有n个选手，下面一行给出n个选手所在学校，在下面一行给出n个选手的能力值，当规定一个队伍为k个人时，输出所有学校可参加比赛的选手的能力值之和最大值。输出k由1到n的答案
- 1.人数不满k不能组队
- 2.不同学校的选手不能组队

**思路**：就是暴力加一些前缀和的优化。有一点贪心就是，如果人数不够，那么不能组队的一定是该学校能力值最低的几个选手。具体看注释。

**代码**

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
#include <cmath>
#include <algorithm>
#include <map>
#include <vector>
#include <queue>
using namespace std;
typedef long long ll;
const int inf=0x3f3f3f3f;
const int N = 2e5+10;
ll ans[N];//存k=i时的答案
vector<int> a[N];//第i个学校所有学生的能力值
vector<ll> b[N];//第i个学校学生能力值的前缀和
int o[N];
void solve(){
    int n;
    cin >> n;
    //初始化
    for(int i = 1; i <= n; i ++){
        a[i].clear();
        b[i].clear();
        ans[i] = 0;
    }
    //输入
    for(int i = 1; i <= n; i ++){
        int op;
        cin >> op;
        o[i] = op;
        
    }
    for(int i = 1; i <= n; i ++){
        int s;
        cin >> s;
        a[o[i]].push_back(s);//放到所在学校的后面
    }

    for(int i = 1; i <= n; i ++){
    	//求每个学校的前缀和
        sort(a[i].begin(),a[i].end());//排序利于后面贪心
        ll t = 0;
        b[i].push_back(t);
        for(int j = 0; j < a[i].size(); j ++){
            t += a[i][j];
            b[i].push_back(t);
        }
        //若学校有x个人，那么当k>x时，该学校一定没有贡献
        //先在[1,x]加上该学校的总能力值
        ans[1]+=b[i][a[i].size()];
        ans[a[i].size()+1] -= b[i][a[i].size()];
    }
    
    //前缀和
    for(int i = 2; i <= n; i ++) ans[i] = ans[i-1]+ans[i];
    //减去每个学校在k人一组情况下多出的人的能力值
    for(int i = 1; i <= n; i ++){
        int x = a[i].size();
        for(int j = 2; j < x; j ++){
            if(x%j==0) continue;//说明可以全部组队
            int mod = x%j;//有mod个人不能组队
            //因为前面排过序，前mod个就是能力值最少的mod个，减去前缀和就好
            ans[j] -= b[i][mod];
        }
    }
    for(int i = 1; i <= n; i ++) printf("%lld ",ans[i]);
    puts("");
    return;
}
int main()
{
    int T;
    cin >> T;
    while(T--){
        solve();
    }
    return 0;
}

```
**最后复杂度是O（n），虽然有两层循环，但是发现就是把每个学校的每个学生遍历一遍，总共有n个学生，所以是O（n）。**

---
# D. Maximum Sum of Products

**题意**：给你一个n，再给你长度为n的a数组和b数组。
要求你翻转a中区间[l,r]的元素，使得a，b数组对应位置元素乘积之和最大。

**思路**：就是一道很裸的区间dp题。翻转[l,r]可以在[l+1,r-1]的基础上交换第l个和第r个元素。

**注意**：当len=2；转移时会出现从区间左边大于右边的情况转移，len=0（不翻转）这两种情况初始化为最开始的sum。（直接把所有都初始化为sum，反正n<=5000）

**代码**

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
#include <cmath>
#include <algorithm>
#include <map>
#include <vector>
#include <queue>
using namespace std;
typedef long long ll;
const int inf=0x3f3f3f3f;
const int N = 5010;

ll a[N],b[N];

ll dp[N][N];
void solve(){
    int n;
    cin >> n;
    ll sum = 0;
    for(int i = 1; i <= n; i ++) cin >> a[i];
    for(int i = 1; i <= n; i ++) {
        cin >> b[i];
        sum += a[i]*b[i];
    }
    for(int i = 1; i <= n; i ++) {
        for(int j = 1; j <= n; j ++){
            dp[i][j] = sum;
        }
    }
    ll ans = sum;
    for(int len = 2; len <= n; len ++){
        for(int i = 1; i +len - 1 <= n; i++){
            int j = i+len-1;
            dp[i][j] = dp[i+1][j-1]-a[i]*b[i]-a[j]*b[j]+a[i]*b[j]+a[j]*b[i];
            ans = max(ans, dp[i][j]);
        }
    }
    cout << ans << endl;
    return;
}
int main()
{
    int T;
    T=1;
    
    while(T--){
        solve();
    }
    return 0;
}

```

