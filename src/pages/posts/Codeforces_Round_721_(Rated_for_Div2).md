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
pubDate: 2021-05-21 01:34:14
tags:
- ACM
- ICPC
- 题解
theme: light
title: Codeforces Round
---






# A. And Then There Were K
## 题意：
给你一个n，求𝑛 & (𝑛−1) & (𝑛−2) & (𝑛−3) & ... (𝑘) = 0  k的最大值

## 思路
1. 打表
2. 将原来的数转化为二进制后，首先第一位想要变成0，一定要&一个二进制位数少一的数，然后从j位减小到j-1位一定会&上100...000（j-1个0，共j位），此时除了第一位别的一定是0，再&上一个j-1位的数即可让首位为0，j-1位最大的数就是11...11(j-1个1)，即2^（j-1）-1；

## 代码

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



///////////代码在这//////////////////
void solve(){
    int n;
    cin >> n;
    vector<int> nums;
    while(n){
        nums.push_back(n%2);
        n/=2;
    }
    int len = nums.size()-1;
    // cout << len << endl;
    int ans = 1;
    for(int i = 1; i <= len; i ++){
        ans*=2;
    }
    cout << ans-1 << endl;
    return;
}

// 10  01
// 101 011
// 10001 01111
// 1010
// 1001
// 1000
// 0111
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

## B1. Palindrome Game (easy version)
## 题意
一个回文01序列，可以对其进行以下操作
- 使其中一个0变1，消耗1
- 当序列不是回文时可以使用该操作使得序列反转，没消耗

谁消耗少谁赢

## 思路
如果只有一个0，那么BOB必赢
剩下若干对对应位置为0情况下，Alice先选一个0，BOB选与其回文对应的那个0，直到最后剩下两个0，且其是对称位置，这时轮到Alice，他取完后，Bob反转，剩下只能Alice取，所以bob必赢

如果长度为奇数，且中间是0，那么Alice选中间那个，问题转化为上面分析的情况但是bob先手

## 代码

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

///////////代码在这//////////////////
void solve(){
    int n;
    string s;
    cin >> n >> s;
    int sum=0;
    for(int i = 0;i < n; i ++){
        if(s[i]=='0') sum++;
    }
    if(sum==1) {
        puts("BOB");
        return;
    }
    if(n%2==0)puts("BOB");
    else{
        if(s[n/2]=='0') puts("ALICE");//长度为奇数
        else puts("BOB");
        
    }
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

	b2感觉快了，但是搞不出来，vegetable
---
## C. Sequence Pair Weight
## 题意：
给你一个序列，其中数值相同的两个元素能组成一对，求这个序列中所以字串中的对数和

- 字串指去掉一个前缀和一个后缀，前后缀长度可以是0
## 思路：
对于每一对相同元素，他们被计算的次数应该是前一个元素前面有几个元素（包括前一个元素）乘上后一个元素后面有几个元素（包括后一个元素）

对于每一对我们都可以通过下标O（1）算出来

枚举每一对只需枚举当前元素与前面相同元素组成一对的情况就可以做到不重复不遗漏

## 代码

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


const int N = 2e5+10;
int a[N];
///////////代码在这//////////////////
void solve(){
    ll n;
    ll ans = 0;
    ll sum1=0,sum2=0;
    cin >> n;
    map<int, ll> qian_mp; 
    for(int i = 0; i < n; i ++){
        cin >> a[i];
        ans += qian_mp[a[i]] * (n - i);
        qian_mp[a[i]]+=i+1;
    }
   
    cout << ans << endl;
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

