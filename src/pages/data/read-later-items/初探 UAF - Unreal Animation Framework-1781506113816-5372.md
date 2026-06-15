Title: 初探 UAF - Unreal Animation Framework

URL Source: https://zhuanlan.zhihu.com/p/2039746839893783343

Markdown Content:
![Image 1](https://picx.zhimg.com/v2-b5f3e8cc49140334ebb97918a44de8c3_1440w.jpg)

The Witcher 4 Tech Demo

> 读前须知：笔者撰文的同时也在进行学习，对UAF的很多板块也是一知半解，整体目标只是让读者能够建立起对UAF框架的简单理解，文章的部分观点可能有错误，项目构建或者性能测试方案也不一定是最佳方法，请谅解

本文会持续更新，最近更新于 2026/5/23 18:48

**TODO** :

1.   AnimNode更新链路分析
2.   Handle ValueBundle（等官方更新）
3.   Node Description/Template
4.   SharedVariable
5.   Blend相关
6.   Event 系统
7.   UAF Layer
8.   RootMotion
9.   Notify 
10.   [Statetree](https://zhida.zhihu.com/search?content_id=275089427&content_type=Article&match_order=1&q=Statetree&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODE2Nzg5MDYsInEiOiJTdGF0ZXRyZWUiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzUwODk0MjcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.um0nWIgBblaO4b39U_PO4MnAWZSnAA0kLUEiA0BkgP4&zhida_source=entity)

## 前言

我最开始了解到UAF是在[巫师4](https://zhida.zhihu.com/search?content_id=275089427&content_type=Article&match_order=1&q=%E5%B7%AB%E5%B8%884&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODE2Nzg5MDYsInEiOiLlt6vluIg0IiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjc1MDg5NDI3LCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.FG0RjK5UWS4np6_6Q9VysvwptOgx0mB6XIy2TvjpyE0&zhida_source=entity)的技术演示demo（不过作为[CDPR](https://zhida.zhihu.com/search?content_id=275089427&content_type=Article&match_order=1&q=CDPR&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODE2Nzg5MDYsInEiOiJDRFBSIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjc1MDg5NDI3LCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.3Ks979qlwz7lzWh0ELxOiYu1Ru1d0lh1WXu8ngT4CwE&zhida_source=entity)的粉丝当时只对巫师4的内容感到激动🤣，没对其中动画技术有太多关注）

最近刚好在学习MM和ControlRig，顺便又了解到UAF也是完全跑在RigVM上的

UE官方对RigVM的宣传就是有巨大的性能提升，于是我产生好奇想看看UAF在这方面表现如何，阅读源码后发现其优化方案几乎涉及到动画框架的各个方面，并且针对 **CPU架构** 也进行了深度优化

我目前认为如果框架搭建完毕的话，UAF会是ABP的完全上位（尤其是对于想做动画驱动移动的项目，也就是**FullRootMotion**），但是由于开发进度问题，UAF还无法构建很复杂的动画框架，只能使用简单示例来进行演示

整篇文章可能不像那么严肃的技术解析，而更像我个人在实践过程中的总结，我觉得这样会更有助于对细节的理解，所以会有一些比较大段繁杂的描述以引用方式给出，如果嫌话太多也可以让AI辅助总结，比如

> 这是一段详细但废话较多逻辑混乱的描述

同时文章参考资料较多，已都在文中以链接形式给出

本文内容 **不由AI生成**，本于对内容和读者负责的宗旨，我倾向于把一个板块完全弄懂再写分析，所以有些章节可能较长时间不会更新，暂时只在开头列出要点

文章结构大致如下

1.   UAF的开发背景和简介
2.   简单框架搭建
3.   简单性能测试
4.   Trait 介绍
5.   System / Module 介绍
6.   底层数据容器
7.   Trait 管线更新链
8.   AnimNode 更新链（待更新）
9.   输出链路
10.   Graph混合机制 （待更新）
11.   注入系统
12.   RootMotion改进（待更新）
13.   Notify 改进 （待更新）
14.   Statetree （待更新）

撰文期间了参考一些前辈和官方的文章：

* * *

## 1. 开篇

### 1.1 开发背景介绍

![Image 2](https://pic1.zhimg.com/v2-7f04367a344708bf668f8c3fc3f96120_1440w.jpg)

UE 动画系统发展

Unreal最开始的动画系统只是使用Unreal Script和简单的BlendTree进行动画制作

![Image 3](https://pic1.zhimg.com/v2-cad6c9d0007135d6b2665947f7b164a6_1440w.jpg)

UE3的AnimNode_MultiBlendPerBone

> 感兴趣的同学可以看UDK文档 [UDK Animation](https://link.zhihu.com/?target=https%3A//docs.unrealengine.com/udk/Three/AnimationOverview.html)，里面涵盖对Unreal Script和旧动画系统的介绍

*   当时一个场景有十多个角色，主要由胶囊体驱动，比如UE3代表作 **[Gears of WAR](https://zhida.zhihu.com/search?content_id=275089427&content_type=Article&match_order=1&q=Gears+of+WAR&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODE2Nzg5MDYsInEiOiJHZWFycyBvZiBXQVIiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzUwODk0MjcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.n1GVWYtbIoLED7F481IKS1s_NlyCvLIdg8jMEdbSWvk&zhida_source=entity)**

进入UE4时代，Epic开始研发**[Animation Blueprint](https://zhida.zhihu.com/search?content_id=275089427&content_type=Article&match_order=1&q=Animation+Blueprint&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODE2Nzg5MDYsInEiOiJBbmltYXRpb24gQmx1ZXByaW50IiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjc1MDg5NDI3LCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.f9uzqkRLlUM1q-k8DUc41OvFXhehDz0627Kr7RvP97s&zhida_source=entity)**（动画蓝图，后文简称 ABP）系统，彼时主要有三个目标

1.   把 BlendTree 转向更为强大的动画图来提升表达能力
2.   想让 GamePlay 和 Animation 使用统一的蓝图工作流
3.   希望尽可能地将动画工作放在 **Worker Thread**

这在当前的游戏环境中表现不错，可以支持像[堡垒之夜](https://zhida.zhihu.com/search?content_id=275089427&content_type=Article&match_order=1&q=%E5%A0%A1%E5%9E%92%E4%B9%8B%E5%A4%9C&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODE2Nzg5MDYsInEiOiLloKHlnpLkuYvlpJwiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzUwODk0MjcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.ndG0Hf4zhIY7G1TJwL1vM99m9WVoVVMZAXi9hM-A4X8&zhida_source=entity)这样的100+玩家同屏的性能需求，但是堡垒职业也对动画系统进行大量的针对性优化，参考

但是展望元宇宙或未来拥有更高真实度和更大场景的游戏，可能需要**1k+玩家**在同一场景，这时候管理高效并发的处理十分重要

之前想要达到相同目标的游戏实现都采取了不同的方法，但是大部分处理方法都会导致**人物只是“木桩”**，而不是一个个鲜活的可以与你进行真实交互的人物，这虽然能有震撼的视觉效果但是并不能带来充足沉浸感

这里可以参照 Youtube博主Mister Chedda的视频（b站也有搬运），其中提到了一些现有游戏场景的局限性，也对UAF的性能进行了分析

* * *

### 1.1 千人同屏方案与限制

这里拿视频中提到的《**刺客信条：大革命》、[《杀手5：赦免》](https://zhida.zhihu.com/search?content_id=275089427&content_type=Article&match_order=1&q=%E3%80%8A%E6%9D%80%E6%89%8B5%EF%BC%9A%E8%B5%A6%E5%85%8D%E3%80%8B&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODE2Nzg5MDYsInEiOiLjgIrmnYDmiYs177ya6LWm5YWN44CLIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjc1MDg5NDI3LCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.-H5-oDsg0x8EwJIo014Vb-DN63hB2i_Bwz6GaXJK5RU&zhida_source=entity)、**《**天国：拯救2》**举例，技术分享详情请见

![Image 4](https://pic1.zhimg.com/v2-b95842d5f1754a8ac2e848ee168cf990_1440w.jpg)

赦免在唐人街一关中有1200+的NPC

《杀手5：赦免》做到了1200+ agent crowd位于同一场景且同屏500+ agent的情况下可以保持主机**30fps**渲染，整体思路应该与**UE Mass****AI**比较相近

*   这里agent crowd 指的是可以有简单交互（比如可以在收到惊吓的情况下逃离）的人群，其中每个角色不是有完整 Controller 的 NPC Actor，而是一种被称之为agent core的表现形式，与 **Mass Entity**比较类似
*   思路来源于 **GDC 1999：Steering Behaviors For Autonomous Characters**

*   简单来说，就是把角色简化为 **一个带位置、速度、半径的可转向粒子**，这样可以大大减少角色交互、移动带来的计算量

* * *

![Image 5](https://pic2.zhimg.com/v2-bfe0d793d2e19c9f0bd424aa424315eb_1440w.jpg)

大革命的万人同屏

刺客信条：大革命则采取的是一种完全不同的技术方案，被称为 **AI LOD**

即 **根据距离来切换AI人群的表现**

![Image 6](https://picx.zhimg.com/v2-d704d7d2650a13ba52a4bde633dd5425_1440w.jpg)

三种不同形态的Bulk

育碧将人群中每一个基础角色称为 **Bulk**，而 Bulk 有三种形态

*   **Low Res Bulk**

    *   >40m，只有 **11根骨骼**和2000面左右的Mesh，拥有最基础的reaction

*   **Puppet Bulk**

    *   12 - 40m，视觉表现提高，但行为依旧简单

*   **Autonomous Bulk**

    *   < 12m，完整的NPC实体，但是 **数量上限为40**

![Image 7](https://pic4.zhimg.com/v2-4ccbcaad0508468f821c967e1c57a2a7_1440w.jpg)

按照距离分类Bulk

这样分类后，Autonomous 和 Low Res 能有高达100倍的性能差距

育碧会使用 **Full NPC Pool**在不同LOD之间无缝切换NPC的表现，这篇文章里就不深入探讨了

* * *

![Image 8](https://pica.zhimg.com/v2-74c07866585384cc0fc7b74eb3244a64_1440w.jpg)

KCD2在库滕贝格里加入了1400个NPC

天国拯救2整体也是采用了类似大革命的 AI LOD 技术，不过涉及到了更多技术细节，因为天国拯救不止是要像大革命一样同屏渲染就行了，每个NPC还会有自己的日程且会被主角的行为影响

大革命的LOD切换基本上只是渲染状态和简单AI逻辑切换，但天国拯救里所有NPC都会持续运行模拟逻辑，切换时人物表现必须要跟模拟状态对应

但是同样的，运行完整功能的Actor还是会被 **限制在70个**

![Image 9](https://pic1.zhimg.com/v2-3834337684eeab90c079396027a65e62_1440w.jpg)

可以发现，三者的技术方案其实都基于一种思想：**对人群进行简化**

*   杀手采用了整体简化的方案
*   刺客信条/天国拯救采用类似LOD的部分简化

这样可以做到千人同屏，但是就表现层面来说，这些角色基本上只是一些木偶，没有太多真实的互动或者表现，并且近处真实角色的数量依旧有限制（<100）

* * *

### 1.2 展望巫师4

> 如果大家有玩过巫师3或者2077会发现，CDPR最擅长的事情就是讲故事（往日之影yyds），无论是巫师还是赛博朋克都会通过剧情故事让玩家能够深入代入到游戏所设计的背景中去，极大地提高了游玩沉浸感，这也是为什么我喜欢玩2077，蠢驴对整个赛博朋克世界观的塑造可谓是前无古人后无来者

而巫师4作为CDPR的看家IP时隔10年后要推出的下一部作品，目标是打造一个沉浸度更高的中世纪世界，他们总结出了想达到这个要求的关键理念

*   整个世界需要处于 **动态**环境，而这来自于角色/环境之间进行充分的 **高真实度交互**
*   要让游戏世界真正鲜活起来，远远不止需要逼真的 Locomotion，真正关键的是角色与角色、角色与环境之间**细微、连续且可信的互动**

    *   比如技术演示中，希里撞倒了商人手中的苹果，**旁边小孩立马跑来拿苹果，远处的猪也过来吃苹果**

![Image 10](https://pic1.zhimg.com/v2-3c86930e99fb5333c3322db65803ee4a_1440w.jpg)

    *   鱼摊老板和客户的精细交互

![Image 11](https://pic4.zhimg.com/v2-6c23d6de5fcbeaa3833b394a87e2b617_1440w.jpg)

手和鱼的接触点非常精确

这些表现意味着

*   需要与GamePlay精确配合，以确保交互接触点的准确性
*   RootMotion很重要，可以大幅度提高动画真实度

最后，巫师4 demo做到了

*   整个市场有300+的 **完整NPC**（非粒子，非GPU顶点动画）

    *   这些 NPC 具备所有角色特性，不是前面提到的简单agent

*   使用 **Motionmatching**框架
*   使用**ControlRig**做 坡面适配 和 LookingAt
*   在标准PS5上以60fps运行

这时候如果使用旧的ABP会有以下限制

*   如果使用 Full RootMotion（RootMotion from everything），动画 Evaluation 会强制跑在 GameThread
*   屏幕外的角色即使不更新动画也需要更新 RootMotion 来更新角色的位置，进一步增加了GT的负担

这时候就需要重构动画框架，也就是新推出的 **Unreal Animation Framework**

巫师4原始演讲我已经搬运到了b站，这一部分内容大约位于21.40

* * *

### 1.3 UAF 简介

*   Unreal Animation Framework，简称 UAF，是[虚幻引擎](https://zhida.zhihu.com/search?content_id=275089427&content_type=Article&match_order=1&q=%E8%99%9A%E5%B9%BB%E5%BC%95%E6%93%8E&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODE2Nzg5MDYsInEiOiLomZrlubvlvJXmk44iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzUwODk0MjcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.LTie68T9Ua6kDwMVRI93xVTZZkSpLRNjgxmHP2uYBVY&zhida_source=entity)的下一代骨骼动画框架，从头开始就是为了高性能设计的，核心观念是 **按需付费**，并提高了**动画控制的精细度**

性能优化点在于

    *   大大减少与游戏线程(GameThread)的交互，**提高了并发性能**

    
        *   最终目标是**完全移除和 GameThread 的交互**
        *   这一部分涉及到**RootMotion**、**Notify**的逻辑改进以及一些数据结构的优化，比如 **双缓冲动画变量**

![Image 12](https://pic4.zhimg.com/v2-013d04ecccac9587441c86efa3c14a03_1440w.jpg)

400个完整的AnimGraph只在GameThread上有收尾阶段的2.6ms消耗

    *   大幅度改进了对 CPU Cache 的利用方式，**提高了单线程的性能**

    
        *   比如动画Pose的存储结构改为了 **SoA** 布局，将 Translation，Rotation，Scale 分别存储，可以提高 Cache Block 的利用率
        *   SoA 还会有助于 **SIMD** 的优化，这部分内容参考后面的SIMD的详细解析

    *   **RootMotion**不再区别对待，会当成一个普通的 Attribute(属性) 来看待，可以与其他属性一样在动画图表中流动，允许任意 Warp 和 Blend
    *   整体运行在 RigVM 上，相比于原本的 BP 有大幅度性能提升

关于 **GameThread** 和 **WorkerThread**/**RenderThread** 的知识介绍，可以参考其他博主的优秀文章，这里给出两个我认为写的比较全面和详细的，来自于小木子和quabqi前辈：

控制精细度优化则主要体现在**按需消费**，同时也是某种意义上对 **组合优于继承**的实践

*   原本的每个动画节点 FAnimNode 都是一层继承链，能力来自于父类

    *   比如 FAnimNode_Steering -> FAnimNode_SkeletalControlBase -> FAnimNode_Base
    *   并且使用继承还会带来虚函数的开销，可以参考 [【CppCon22】虚函数隐藏的性能代价](https://link.zhihu.com/?target=https%3A//www.youtube.com/watch%3Fv%3DkRdbqjw2WIs)
    *   ABP还会运行额外功能

    
        *   比如`UAnimInstance::UpdateAnimation`中，无论是否真的有蒙太奇播放，都还是会运行 `UpdateMontage`

![Image 13](https://pica.zhimg.com/v2-ff3eb4c2bd74753f9e054318aa837516_1440w.jpg)

UAnimInstance::UpdateAnimation

并且这部分开销还是跑在GameThread的，这里使用源代码版引擎自定义一个SCOPE可以在Insights中看到额外开销

![Image 14](https://pica.zhimg.com/v2-6a0f0d0e7469cad86c27afa53e209dae_1440w.jpg)

![Image 15](https://pic4.zhimg.com/v2-f0e72e30b235b9c5357bef757c85423d_1440w.jpg)

![Image 16](https://pica.zhimg.com/v2-2cf5a0984b27154256b2136468d12c76_1440w.jpg)

这里使用了20个运行单个Sequence Player的场景，可以看到UpdateMontage消耗占到了1.7%

*   而UAF主要使用 **Trait**（可以类比Rust Trait）,通过实现接口来定义节点的功能，**需要什么功能就实现什么接口**，没有实现的功能则完全不会有运行时消耗

    *   这里我推测 Trait 应该与 Rust Trait 这样的编程概念相仿，如果非要翻译可以叫做“特征 ”，但在UAF框架内我比较倾向于将其理解为“**能力**”
    *   每个动画节点不再是一个具体的 C++类实例，而是一个 **用 Trait 拼积木拼起来的运行栈**
    *   想要什么能力就往运行栈里加入什么样的“积木”，完全没有多余操作，控制精细度很高

*   Trait 本身其实也是由不同接口“堆”起来的

    *   比如接口`IUpdate` 对应 “更新”能力，`IEvaluate` 对应“评估”能力

这里拿SequencePlayerTrait举例，.cpp文件里会通过宏来声明这个Trait继承了哪些接口：

```
AUTO_REGISTER_ANIM_TRAIT(FSequencePlayerTrait)

// Trait implementation boilerplate
#define TRAIT_INTERFACE_ENUMERATOR(GeneratorMacro) \
    GeneratorMacro(IEvaluate) \
    GeneratorMacro(IAttributeProvider) \
    GeneratorMacro(ITimeline) \
    GeneratorMacro(ITimelinePlayer) \
    GeneratorMacro(IUpdate) \
    GeneratorMacro(IGarbageCollection) \
    GeneratorMacro(INotifySource) \
```

*   比如动画同步功能，在ABP中节点无论是否进行同步，都会有对是否同步的检查，而UAF里只要不继承同步接口（`IGroupSynchronization`），这个Trait就是完全的0开销

UE还提供了对ABP的兼容，可以通过一部分节点将UAF接入到原来的ABP中，这里也不过多展开

![Image 17](https://pic3.zhimg.com/v2-b31dd0d7ca49137dfcf1bf35a23db27e_1440w.jpg)

值得注意的是，UAF 现在还有第二套管线 **UAF AnimNode**，并不是完全是原本ABP的Node思路，而是一个抽象层级更高（也可以说适配性更广）的动画更新路线，比如 Run AnimNode 的输出 ValueBundle 是一个通用数据容器

UE还在同步开发一个叫做 **抽象骨骼**（官方还称之为 Skeleton Family）的系统，意图在进一步降低骨骼和动画逻辑的耦合性，可以在更高的抽象层面编写动画逻辑，而在运行时再对应到具体的骨骼

这套系统应该会与AnimNode管线配合，比如只有在开启了`UseAbstractSkeletonRuntime`时ValueBundle才算真正可用（详见 6.4 Handle/Bundle 章节）

这样可以让一套动画框架轻松适配多种骨骼，不过目前还处于不可用状态，涉及到的资产有 Set Binding/Collection

*   **Collection** 用于定义分区，比如将骨骼分为UpperBody LowerBody
*   **Binding** 将分区映射到具体的骨骼

> 这里只是演示，还不能实际应用，不过感觉挺像Maya/MotionBuilder的Character Mapping List

![Image 18](https://picx.zhimg.com/v2-a765df7a644c641267bd95176d4db047_1440w.jpg)

![Image 19](https://pic2.zhimg.com/v2-918e17a399cf9a2f5928c93311f28663_1440w.jpg)

![Image 20](https://pica.zhimg.com/v2-3402eb7694034875fffc061477a294b2_1440w.jpg)

此处也能看到RootMotion可以作为一个普通属性

![Image 21](https://pica.zhimg.com/v2-4fb2434eae8901e97b32991168b91030_1440w.jpg)

MB 的 HIK 重定向

* * *

## 2. Quick Start

这里先演示如何搭建最基础的UAF框架，并对其中涉及到的资产和概念进行简单解释，使用 UE 5.8 Preview/UE main（5.9.0，5/17 commit 5bf4109） 进行演示，所以可能功能完整度有所不同

演示目前主要包括四个比较常见的功能，**但都只是非常基础的演示，旨在让读者能快速上手**（求轻喷），而更深层次的内容可以自行探索（比如Additive功能，现在的UAF已经有 `Apply Additive``Make Dynamic Additive` Trait）

1.   简单Sequence播放
2.   混合与分层混合
3.   蒙太奇相关(Injection)
4.   Statetree

PS：WorkSpace 的设计有大幅变换，5.7之前AnimNext WorkSpace是作为独立资产的，但是目前已经合并到了UAF资产中

**请频繁手动保存改动**，由于现在框架不稳定所以随时随地都会遇到崩溃

* * *

### 2.1 基础概念与SequencePlayer

想要启用UAF需要开启相关插件，基础框架只需要 `UAF` 以及 `UAF AnimGraph` ，不过可以选择全部开启

![Image 22](https://picx.zhimg.com/v2-93152cd9bea9f875a4fe00409b8a3ded_1440w.jpg)

资产均位于`Animation` ->`Animation Framework`

![Image 23](https://picx.zhimg.com/v2-0572f5ffb636cf2fb84cf592a422340b_1440w.jpg)

`UAF Asset Wizard`是可以快速根据模板创建资产的工具，不过为了更好的解释资产，演示选择手动逐步搭建

![Image 24](https://picx.zhimg.com/v2-c47dea86065308c629e3edc21aa8194d_1440w.jpg)

最重要的资产有三个

*   **UAF Component**

    *   挂在角色上的组件，用来调用UAF

*   **UAF System**

    *   可以粗略的看作ABP里AnimGraph和EventGraph的集合体

    
        *   但是实际上对动画只是起调用的作用，真正的动画逻辑位于 UAF AnimGraph

    *   在其中有Initialize/PrePhysics Event，相当于初始化和Tick

*   **UAF AnimGraph**

    *   形式上可以看作是独立的动画节点，每个 Graph 里都可以自定义一组动画逻辑

要让角色使用UAF，首先需要添加UAF Component

![Image 25](https://pica.zhimg.com/v2-b20d4fc767ee09a3bca097f00324424e_1440w.jpg)

在Detail面板里可以选择Component需要运行的资产，这里可以选择需要运行的资产，可以直接运行 AnimationSequence，但多数情况下会选择 Graph / System

![Image 26](https://pica.zhimg.com/v2-475933ad38b53233ec93cfcc3eaa8352_1440w.jpg)

![Image 27](https://pic4.zhimg.com/v2-ab6b1f07b46768ade4fa06259fe6e9a3_1440w.jpg)

可以选择直接播放单个动画

同时还有 Init Method，这里默认选择 `Initialize and Pause in Editor`

然后在角色Mesh组件里，**需要将`Enable Animation`取消勾选**，不然UAF是无法运行的

![Image 28](https://pic1.zhimg.com/v2-ea03ab3e5f36f2c38c0bb918617c672c_1440w.jpg)

写入姿势的函数 WritePose 如果检测到 Enable Animation 会直接返回，不进行之后的更新

```
// We cannot write to the skeletal mesh component if it is using anim BP  
if(InOutputComponent->bEnableAnimation) 
{ 
    UE_LOGF(...); 
    return; 
}
```

* * *

然后就需要创建UAF System，按我的理解System可以看作 AnimGraph 和 EventGraph 的集合，既可以在这里进行数值运算也可以播放动画逻辑

不过实际上动画逻辑是通过 Run Graph/AnimNode 进行调用的，实际逻辑存在于 AnimGraph AnimNode

System中主要涉及到两个Event：`Initialize`和`PrePhysics`，也就是初始化和Tick

*   其中Tick其实还分为 `PrePhysic`s和`PostPhysics`，顾名思义就是物理更新前后

![Image 29](https://pic4.zhimg.com/v2-a553f334ea8c291f42ba3e9b3ba2a9c9_1440w.jpg)

System中运行动画逻辑主要靠Run Graph/Anim Node节点，而写回姿势则靠 Write Pose/SystemOutput

其中Graph要连接Pose，Anim Node 要连接 System Output，详细区别在后文阐述

![Image 30](https://picx.zhimg.com/v2-5804364fb928eef52f3e0047bafd774d_1440w.jpg)

创建完System后就可以在之前的UAF Component中指定运行这个System了，然后来创建一个简单播放 Sequence 的AnimGraph并接入System

* * *

AnimGraph 里主要使用 `TraitStack` 来运行动画逻辑，这是一个运行栈，每个栈里可以有多个Trait，每个Trait都代表了一种“ 动画能力“

Trait 分为 `Base Trait` 和 `Additive Trait`

*   Base 是可以独立运行的 Trait
*   Additive 不能独立运行，必须依赖Base，可以对Base的“ 能力 ”进行 **加强**或者 **覆盖**

在 Trait Stack 的细节面板添加需要的 Trait，这里只添加最基础的 `Sequence Player` 并连接到Output，同时选择Loop为Force来循环播放Jog动画

![Image 31](https://pic2.zhimg.com/v2-5a18fda6c6ac10eaf0d2ff6fc2309af3_1440w.jpg)

![Image 32](https://pic1.zhimg.com/v2-7dd67ed6708c15942e6c22209d0773e8_1440w.jpg)

这样连接完后，就可以在System里面使用 `Run Graph` 和 `Write Pose`

![Image 33](https://picx.zhimg.com/v2-11f9a310e81766de831ce8ce7af994d3_1440w.jpg)

指定Graph后，在System资产左侧Outliner里就可以直接双击进入Graph，这也是WorkSpace整合的地方

![Image 34](https://pic3.zhimg.com/v2-98b81e6eceac8937de5949f6d013b132_1440w.jpg)

整个流程可以注意到一个细节，那就是完全 **没有绑定特定的Skeleton**，而原有的ABP在创建最开始就需要指定Skeleton，除非使用 ABP Template

这时候其实已经搭建了一个最小框架，角色可以正常播放Jog动画

![Image 35](https://pic1.zhimg.com/v2-ccb2fee781a1d914500bbcafc5321c81.jpg?source=25ab7b06)

播放Jog动画，可以看到UAF组件正常运行

但是会发现日志在编辑器状态会持续报错

```
FRigUnit_AnimNextRunAnimationGraph_v2::Execute: Could not run graph - Ref Pose is invalid 
Could not write to skeletal mesh component - LOD Pose is not valid.
```

![Image 36](https://pic3.zhimg.com/v2-8951c7ca7fbc3a5961c2514a15baf520_1440w.jpg)

如果观察Wizard所创建的模版会发现，运行还要传入一个 `Reference Pose` 和角色的 `Skeletal Mesh Component`，不过奇怪的是进入运行时不会报错也能正常运行，而Graph内容并没有任何改动

这里推测是与Editor模式的资源加载顺序有关，因为报错只会在 `Initialize and Pause in Editor` 模式才会出现

如果将 UAF Component 改为 `Initialize and Run`，那么编辑器状态也不会报错，说明是有自动生成 Ref Pose的方法的，但是自动生成方法应该是有局限性的，比如一个角色要使用两个骨架，这里都放在后文的数据与变量传递进行解析

初次遇到时我也无法理解其中缘由，但在阅读源代码后有了一些了解，跟性能优化和动画/骨骼解耦都有关系

简单理解就是 **UAF AnimGraph 不跟具体的骨骼绑定，可以被多套不同骨骼复用**，因此运行时需要能够解析出具体的骨骼信息。这里先只简述使用方法，详细解析放在后面

在System的变量中，创建一个 `RefPose`（类型为 `ReferencePose`）和`Skeletal Mesh Component`，这时SKM可以通过非常类似 ABP 的 **Property Access** 的方法绑定到当前 Actor的组件

![Image 37](https://pic4.zhimg.com/v2-fe03e1d8749199fc8603bb0e2da59727_1440w.jpg)

![Image 38](https://pica.zhimg.com/v2-8ba1b4b6402388a91b2b71a77ba5945e_1440w.jpg)

点击箭头展开

![Image 39](https://pic3.zhimg.com/v2-7205d02ebf29ca2141805f8cfadcfcaa_1440w.jpg)

这里点击Component可以选择具体类型

`Initialize`里传入 SkeletalMeshComponent 并 `Make Reference Pose`

![Image 40](https://pic1.zhimg.com/v2-086f3bede5e041a922a5edab907486a8_1440w.jpg)

`Run Graph`和`Write Pose`同时传入

![Image 41](https://picx.zhimg.com/v2-b74237521dcd17cc1722848e87eec4b9_1440w.jpg)

不过经过测试，如果只有播放Sequence这样的简单逻辑，System即使不传入RefPose和SMC也能正常工作，比如将Graph中的动画序列提升为变量，再在角色蓝图里使用Set Variable来覆盖变量，可以做到同时在两套不同骨架运行一个System

![Image 42](https://pic4.zhimg.com/v2-2b015740aefbe88fc23c2bf43527ce09_1440w.jpg)

![Image 43](https://picx.zhimg.com/v2-b3b57d8fc4c54bca6f70b3e0f4d26831_1440w.jpg)

![Image 44](https://pic1.zhimg.com/v2-3b38a52505b522538bf8e8e8771c6059.jpg?source=25ab7b06)

*   这里Set Variable / Override Variable 仅做测试用

> 顺带一提，现在UAF没有专门的Sequence Evaluator，不知道是还没有实现还是会整合，但是目前可以将Player的PlayRate设为0以及指定StartPosition进行模拟

![Image 45](https://pic4.zhimg.com/v2-8e5dd82db0b1c6108ccf093455a8ae4f_1440w.jpg)

![Image 46](https://pic3.zhimg.com/v2-095f20d4302be7f719e870216ae322a0_1440w.jpg)

* * *

### 2.2 蒙太奇/注入

UAF将ABP里蒙太奇的插入进行了拓展，以后会使用一个适配性更强的注入系统 **Injection**

同时也保留有对旧PlayMontage的兼容

这里进行较简略的测试，按下 1 触发`PlayMontage`，而在AnimGraph里增添一个`MontageTrait`

![Image 47](https://pic3.zhimg.com/v2-3a38cd6104c94e5c4fc136309628b3ee_1440w.jpg)

![Image 48](https://pic2.zhimg.com/v2-9532854632f41eac41ebe2869153d5eb_1440w.jpg)

注意SlotName要与Montage对应

![Image 49](https://picx.zhimg.com/v2-11f73f29bd740dc0c3ba894c53a5c61d.jpg?source=25ab7b06)

MontageTrait实际上是在复用ABP的`MontageInstance` ，是通过**UAFMontageComponent**起作用的（见5.1 子组件）

* * *

**Injection 则**是一套拓展性更高的运行时动画注入系统，简单来说是 **可以通过传入Factory Params来使用工厂方法将任何动画资源转换为UAF AnimGraph并在运行时注入**（推入BlendStack）

> 虽然没有全部实践，但我觉得理论上这个注入机制是可以适配大部分资产的
> 
> 官方目前适配了Sequence BlendSpace
> 
> 但是目前由于RootMotion相关的开发进度问题，使用Inject只能播放动画表现，而没有RootMotion位移

其中`Injection Site`则类似 `Montage Slot` ，表现形式是 `Injection Site Trait`

现在有`Play Animation`节点，本质上也是对Inject的包装 ，注入的是Anim Sequence

![Image 50](https://pic4.zhimg.com/v2-252bc500a6edcba6f26c6d0d4f4c167d_1440w.jpg)

角色蓝图可调用

![Image 51](https://pica.zhimg.com/v2-e9169cf20aafba0768f5426b9e1a235e_1440w.jpg)

PlayAnimation -- PlayAnimHandle -- Inject

调用Inject时需要指定 `InjectionSite`，实际上就是指定与`InjectionSiteTarit`连接的AnimGraph，对于PlayAnim，只需要指定其名字

在System里面创建一个UAF Graph变量，名字为TestGraph并通过Shared Variable传入Graph

![Image 52](https://pica.zhimg.com/v2-36b7e381092a7cdf800a4b077f72ff02_1440w.jpg)

在左侧Variable面板里，点击 + ，选择`Add Shared Variable` 并选择更新变量的System，这样System里的变量都会成为Statetree的共享变量

![Image 53](https://pica.zhimg.com/v2-6e80fe916f874c55e786262b2a3c8dee_1440w.jpg)

![Image 54](https://pic1.zhimg.com/v2-4c2359ccf0a6f51ac09ef07d27dda9f4_1440w.jpg)

在Graph里连接一个含有`Injection Site Trait`的Traitstack，注意这里Base Trait需要是`BlendStack`，因为Inject涉及到AnimGraph的切换，需要BlendStack来管理

![Image 55](https://pic3.zhimg.com/v2-affdc72be6815bd3a8721c0ec0c00aa6_1440w.jpg)

接着在角色蓝图按键触发就能成功播放Sequence

![Image 56](https://pic2.zhimg.com/v2-a0f1ad7048c2a5e8d7c6747cbe1edddb_1440w.jpg)

而对于普通 Inject，需要展开Site手动选择Graph变量

![Image 57](https://pic4.zhimg.com/v2-f43d7cc07edc3596f870f7fc38702e53_1440w.jpg)

这里普通Inject如果传入的Object是AnimSequence是可以正常播放的，但是如果传入Montage会提示没有对应的工厂方法，应该是需要自定义Factory Params来进行转换的

![Image 58](https://pica.zhimg.com/v2-dec68ce56247a949d46fea54d35548f2_1440w.jpg)

![Image 59](https://pic2.zhimg.com/v2-083a1dba295f2586ec832157f5f5d973_1440w.jpg)

官方演讲中自定义资产适配的示例流程：

![Image 60](https://pic1.zhimg.com/v2-b15dc33beedb043a69df571ee71096c0_1440w.jpg)

* * *

### 2.3 混合与分层混合

单纯两个动画资源混合比较清晰，UAF现在已有`Blend Two Way``Blend By Bool`

![Image 61](https://pic2.zhimg.com/v2-60e771bfc382496940761bdf91179db9_1440w.jpg)

分层或者BlendPerBone则需要使用BlendLayer Trait，其中会指定`BlendMask`资产

UAF最大的改进在于`BlendMask` 会作为独立资产存储，并且可以 **独立对骨骼，曲线，属性进行调整**

这意味着可以对曲线混合进行更精细和方便的调整，而不是之前只有固定的Override BlendByWeight 几种模式，这里也是对控制更加精细化的体现

![Image 62](https://pic4.zhimg.com/v2-59ae740351cd1b78e5fa77b403ff6ecd_1440w.jpg)

至于更新的UAF Layer 系统，我还没有进行研究

![Image 63](https://pic1.zhimg.com/v2-2ca7769249578bd075f0e4acdd21f554_1440w.jpg)

* * *

### 2.4 Statetree和属性绑定

参考：[https://eyad.tv/blog/unreal-ani mation-framework-uaf](https://link.zhihu.com/?target=https%3A//eyad.tv/blog/unreal-animation-framework-uaf)

UAF里面选择采用Statetree替代ABP的Statemachine来模拟状态切换，这比原本的Statemachine更为灵活，不过细节就不在这里过多阐述

UAF目前可以使用两种Statetree

*   一种是原生Statetree，需要在角色身上挂Statetree组件来运行，可以作为 Additive trait
*   第二种是UAF Statetree，可以用Run AnimNode运行

    *   不能使用 Evaluator
    *   并且变量只能通过UAF的 Shared Variable 传入，不能自定义变量

> 在现在的开发进度下，Statetree与动画的结合还不是特别完善，比如特定state之间的过渡不好调整（我只找到能够对单独state的blend in/out 进行调整，而无法准确调整 A → B），并且似乎对运行AnimGraph还没有进行完全适配

> 实践过程中我对两种 Statetree 都进行了尝试，但是普通的Statetree会需要自定义Evaluator来更新角色数据的，这样会多一层逻辑编写，而 UAF Statetree 则只需要创建共享变量

> 同时普通Statetree并没有专门的UAF Task，如果在UAF中使用Statetree trait来模拟Statemachine的话，UAF其实充其量只是作为一个Statetree的调用口

> 而 UAF statetree 则编写了专门的UAF Graph Task，作用是可以将特定资产（Sequence BlendSpace AnimGraph）推入UAF的BlendStack，虽然需要使用 Run AnimNode来运行，但本质上还是属于 Tarit 管线

> 另一个问题是我没有找到比较合适的ControlRig使用方法，CR可以作为一个 Additive Trait 或者使用 UAF Task 指定，但是不像ABP的不同节点之间都是直接传递姿势，输入输出引脚都会使用相同的`CompactPose`/`FPoseLink`，UAF节点之间传递的是使用不同机制的`AnimNextTraitHandle`/`ValueBundle`而不是直接传递Pose数据，在实际使用中会有AnimNode与Trait管线的冲突问题

> PS：初次写完文章后的5.22官方又新添加了ControlRigNode

![Image 64](https://pic4.zhimg.com/v2-b9c24196a867df744b23d7e09308a12f_1440w.jpg)

使用 Control Rig Trait

![Image 65](https://pic4.zhimg.com/v2-5a3d9527719ad497ad0da34f2c32b857_1440w.jpg)

使用UAF Task

前面在Sequence Player示例里已经使用属性绑定获取了`Current Actor`的`Skeletal Mesh Component`，实际上属性绑定基于UE 的反射系统，还可以获取其他很多角色参数，比如CMC的各类数值

下面的搭建过程仅基于个人想法，看起来应该会非常丑陋，只是对 Statetree + UAF 的非常简单的实践，给更复杂状态搭建提供参考，需要有一些Statetree知识基础

整体框架是搭建出Thirdperson模版的简单状态机，省略WalkRun 的 BlendSpace 和 Control Rig，每个状态只是简单的播放 Sequence 而不是使用独立的 AnimGraph，并且因为精细的过渡还不方便调整所以整体动作过渡效果比较差

效果：

![Image 66](https://picx.zhimg.com/v2-7e3737c774e1b0e2ea00af197b0505cf.jpg?source=25ab7b06)

构建基于5.7+版本的普通Thirdperson模版，使用一个 UAF System 和一个 UAF Statetree

首先是类似ABP的EventGraph的运动数据更新，这里需要从CMC获取`Velocity``Acceleration``IsFalling` 并从其中计算出 `GroundSpeed`，`ShouldMove`，`VelocityZ`计算逻辑不过多阐述，这里重要的在于获取数据

PS：`Add New Category` 可以进行变量分组

![Image 67](https://picx.zhimg.com/v2-c51b9f89b4c7a9e7e7da27b8c0118221_1440w.jpg)

与之前获取`Skeletal Mesh Component` 一样，也可以获取到Current Actor 的 `Character Movement Component` 并调用其中函数，这里能调用的函数是根据变量类型动态生成的：

![Image 68](https://pic2.zhimg.com/v2-6fe777af9f383ce30b095be8216506ad_1440w.jpg)

拿取到速度加速度数据后，就可以在`PrePhysics`里进行数据更新：

![Image 69](https://pica.zhimg.com/v2-cc78f9b2a1b257115614910c678d629a_1440w.jpg)

然后调用RunAnimNode选择我们的UAF Statetree，并使用Write SystemOutput输出姿势：

![Image 70](https://pica.zhimg.com/v2-b74be5a645fdc6a260731c40426de760_1440w.jpg)

* * *

*   对于 Statetree，状态划分会与Statemachine稍有不同，因为Statemachine是图结构而Statetree则是树结构

    *   Statemachine是根据Transition Rule在不同State之间跳转
    *   Statetree每次都会遍历树，找到应该激活的路径，更适合使用父子层级表达

不过为了专注于Statetree的搭建，这里尽量还是按照原有状态划分，并且也使用原来的变量作为 Transition Condition

原本的ABP划分思路是

![Image 71](https://pic1.zhimg.com/v2-215e2f0452034522969acd5efd0b9808_1440w.jpg)

Statetree划分为三种父状态

![Image 72](https://pica.zhimg.com/v2-450f76d7ce7580f59fb64c0ff0f93a06_1440w.jpg)

通过 Shared Variable获取到System的变量

![Image 73](https://pic2.zhimg.com/v2-c6ce1d2148a5115f53577f1fc40719ad_1440w.jpg)

在 Enter/Transition Condition 中也都要选择以UAF为前缀的Compare条件

![Image 74](https://pica.zhimg.com/v2-2b2891fbbf7bc809c490b08e8aaccbe0_1440w.jpg)

这样就可以选定 System 里面的变量

![Image 75](https://pica.zhimg.com/v2-ce25415ffd19be9c1128f9fb06f1a608_1440w.jpg)

由于状态较多，这里将 Enter/Transition以文字形式列出，注意Transition Trigger都选择`OnTick`

![Image 76](https://pic4.zhimg.com/v2-212bea1fa02cdcdbe95259dac4a7f719_1440w.jpg)

同时需要注意，Statetree是从上到下遍历，所以这里State的排列顺序也需要一致

*   `InAir`

    *   Enter : `IsFalling == True`
    *   Transitions : To Land(`IsFalling == False`)

*   `Locomotion`

    *   Enter : `IsFalling == False`
    *   Transitions : To InAir(`IsFalling == True`)

*   `Land`

    *   无 Enter
    *   Transitions : To Locomotion(`No Conditions`)

*   `Jump`

    *   Enter : `VelocityZ > 100.0`
    *   Transitions : To Fall Loop(`Velocity <= 0.0`)

*   `Fall Loop`

    *   无 Enter
    *   无 Transition

*   `Jog`

    *   Enter : `ShouldMove == True`
    *   Transitions : To Idle(`ShouldMove == False`)

*   `Idle`

    *   No Enter
    *   Transitions : To Jog(`ShouldMove == True`)

* * *

## 3. 简单性能测试

> 我对性能方面不是特别了解，因而这里的测试方法比较简单，也可能不够严谨，如果不合适还请各位大佬指出

采用最简单的场景，用最简单的Character运行循环动画，逐渐增加Character数量，对比ABP和UAF的GameThread时间（低角色数量时帧数上限在于渲染，因而比对GT）

场景固定摄像头并采用Standalone模式渲染1080p，测试采用的CPU为i9-13980hx

![Image 77](https://pic3.zhimg.com/v2-31c6b39905978c3a17e22efa349970d6_1440w.jpg)

使用20 40 80 100 200 300 500 800 1000 1200 十个采样点，只进行了单次简单统计，故数据可能有误差，统计完后 GameThread 的时间对比如图

![Image 78](https://picx.zhimg.com/v2-cc6fff01382465767233cec557b1ef17_1440w.jpg)

可以看到低角色数量（<50）时两者GT时间差距不大，数量来到100以后差距会越来越大，在500角色数量时两者帧数已经有一般的差距，ABP此时只有约30帧，而UAF还能够保持60帧，可见UAF对GameThread的优化是非常大的

* * *

后面会对每个模块进行更为详细的分析，但不会过于深入，一是会导致篇幅过长二，是无法快速建立对框架整体的感知

同时也会带有更多源代码和偏底层的内容，会使用较多编程和计算机基础的概念(比如实例，栈/堆，内存，CPU Cache)，如有不清楚的地方建议使用AI辅助阅读

> 顺带一提，知乎的代码编辑器实在是又难用可读性也差，最好边读文章边对照IDE的源代码

## 4. Trait

> 这里的框架思路涉及到一些操作系统的多线程以及并发编程知识，本人只有过粗略学习所以描述可能有误差

前面已经有对Trait的简单描述，如果以更书面化的方式来定义的话，Trait 就是一种 _**可以互相组合的基础动画逻辑单元**_

*   核心设计是 **单例/无状态**+**接口查询代替虚函数调用**+**操作原子性**

    *   Trait 本身主要表示一段可复用的行为逻辑，运行时每种 Trait 只有一个 **全局的只读实例**，不保存具体节点的运行时状态，并被所有节点实例和工作线程共享

    
        *   状态/数据等信息则放在 `FSharedData`（同种Trait共享）和 `FInstanceData`（节点独立数据） 里
        *   比如 FSequencePlayerTrait，在运行时只有一个实例对象，而每个具体的 Trait 参数比如播放哪个Sequence、PlayRate 则位于 Shared/InstanceData

    *   **运行时不按类型调用**，而是每次在 TraitStack 上 **按接口 UID 查询接口**："谁实现了 IUpdate？谁实现了IEvaluate？"

    
        *   查询结果写入 `FTraitBinding`（凭据），后续通过凭据直接定位接口和数据偏移
        *   调用方不关心当前节点是 SequencePlayer 还是 BlendSpace，也不依赖继承链，没有虚函数调用

    *   Trait实现多个接口来为自己增添能力，而每个 TraitInterface 只 **声明单一职责**

    
        *   比如`IUpdate` 只管更新、`IEvaluate` 只管评估、`ITimeline` 只管时间查询
        *   一次接口调用只做一件明确的事，不做连带工作
        *   这让共享的只读单例无需锁，独立的状态数据天然隔离

这种无内部状态以及操作的单一性的让Trait天生 **适合多线程运行**

### 4.1 FTrait

*   `FTrait` 是所有 trait 的基类，有两种类型的 FTrait，`Base` 和 `Additive`

```
enum class ETraitMode 
{ 
    Invalid = 0,
    Base,
    Additive, 
    Num = Additive  
};
```

*   `Base Trait` 可以独立存在，并且是 Trait Stack 栈的栈底节点(没有Super)，也是接口查询的边界
*   `Additive Trait` 不能独立存在，必须基于 Base，可以 **覆盖** 或 **增强**_相同的接口功能_

    *   _**覆盖**_：Additive / Base 实现了相同的接口，但 Additive 在栈的更高位置

    
        *   `GetStackInterface<T>()` 从栈顶向下搜索接口时会先找到 Additive 的实现，Base 的实现被遮盖了

    *   _**增强**_：类似进行了一层包装/装饰，在Additive里会调用子节点的接口，比如CallFunction

```
void FCallFunctionTrait::PreUpdate(...) const 
{ 
    // 额外运行一个Function增强逻辑
    CallFunctionForMatchingSite(...);
    // 将 PreUpdate 转发给下层 trait
    IUpdate::PreUpdate(Context, Binding, TraitState); 
}
```

每种Trait有共享数据和属于每个节点实例(NodeInstance)的数据

> 这里涉及到NodeInstance NodeDescription NodeTemplate等代码，可以非常粗略的理解为调用了这种Trait的那个节点，InstanceData就是这个Trait的节点个性化数据

同时会使用 **全局唯一UID**来标识这一类节点，确保单例

```
struct FTrait
{
    // Trait shared data
    using FSharedData = FAnimNextTraitSharedData;
    // Trait instance data
    using FInstanceData = FTraitInstanceData;

    // The globally unique UID for this trait
    // Derived types will have their own TraitUID member that
    // hides/aliases/shadows this one
    // @see DECLARE_ANIM_TRAIT
    static constexpr FTraitUID TraitUID = FTraitUID::MakeUID(TEXT("FTrait"));

    // Returns the globally unique UID for this trait
    virtual FTraitUID GetTraitUID() const { return TraitUID; };
}
```

**接口查询会向下传递**，比如 Additive 没有实现查询的接口，会继续往下查询，直到找到实现该接口的 trait 或者查询到 Base 结束

*   此处详细见 `FTraitStackBinding::GetInterfaceImpl` ，不过多展开

* * *

### 4.2 TraitInterface

`TraitInterface` 就是 “ 能力调用接口 ”，给 Trait Stack 提供一种 **按能力调用** 的运行机制

*   Trait 只有实现了特定接口才拥有这个接口定义的能力

UAF 运行 Trait Stack 时并不关心遇到的 Trait 是不是 SequencePlayer，只会询问 Stack 里有没有一个Trait 实现了`IUpdate`能力

*   如果有，就调用它的 `PreUpdate()`
*   但是对于Evaluate，UAF不会立即调用，而是会加入调用栈 ，之后统一执行

> 这也是与ABP的一大区别，ABP因为节点之间直接传递姿势数据，所以需要原地调用Evaluate修改姿势，并且Update是递归调用

> 而UAF的Evaluate会先加入Task列表，最后统一按先后顺序评估
> 
> Update虽然也是当场调用，但是遍历形式是手写 while 循环 + 维护调用栈，调用栈是平坦的

这里可以见 IUpdate的`void UpdateGraph(FUpdateGraphContext& UpdateGraphContext)`

```
void UpdateGraph(FUpdateGraphContext& UpdateGraphContext)
{
    // 压入根节点
    Private::FUpdateEntry RootEntry(GraphInstance.GetGraphRootPtr(), RootState);
    TraversalContext.PushUpdateEntry(&RootEntry);

    //  while 循环而不是 递归
    while (Private::FUpdateEntry* Entry = TraversalContext.PopUpdateEntry())
    {
        if (!Entry->bHasPreUpdated) // 第一次访问
        {
            // 接口查询
            const bool bImplementsIUpdate = Entry->TraitStack.GetInterface(Entry->UpdateTrait);

            // 原地调用 PreUpdate
            if (bImplementsIUpdate)
                Entry->UpdateTrait.PreUpdate(...);

            Entry->bHasPreUpdated = true;

            // 把自己重新压回栈（等子节点处理完再 PostUpdate）
            TraversalContext.PushUpdateEntry(Entry);

            // 发现子节点，逆序压入
            while (遍历栈上每个 Trait)
            {
                if (Trait 实现了 IHierarchy)
                    GetChildren(Children);
                // 逆序压：最后一个子节点最先被 Pop
                for (int i = Children.Num() - 1; i >= 0; i--)
                    TraversalContext.PushUpdateEntry(Children[i]);
            }
        }
        else // 第二次访问 — 子节点全处理完了
        {
            // PostUpdate
            if (Entry->UpdateTrait.IsValid())
                Entry->UpdateTrait.PostUpdate(...);

            // 回收
            TraversalContext.PushFreeEntry(Entry);
        }
    }
}
```

* * *

### 4.3 各类 Interface

不同接口负责不同功能，都继承自`ITraitInterface`，这个基类规定了每类接口也必须有全局唯一的UID，用于接口查询

```
struct ITraitInterface 
{ 
    virtual ~ITraitInterface() {} 
 
    // 这个接口的全局唯一 UID
    // Derived types will have their own InterfaceUID member that hides/aliases/shadows this one
    // @see DECLARE_ANIM_TRAIT_INTERFACE       
    static constexpr FTraitInterfaceUID InterfaceUID = 
    FTraitInterfaceUID::MakeUID(TEXT("ITraitInterface")); 
 
    // 返回接口 UID
    virtual FTraitInterfaceUID GetInterfaceUID() const { return InterfaceUID;}; 
};
```

比如`IUpdate`负责更新，类比`Update_AnyThread`

```
struct IUpdate : ITraitInterface 
{ 
    DECLARE_ANIM_TRAIT_INTERFACE(IUpdate) 
 
    // Called before the first update when a trait stack becomes relevant  
    UE_API virtual void OnBecomeRelevant(...) const; 
 
    // Called before a traits children are updated  
    UE_API virtual void PreUpdate(
        FUpdateTraversalContext& Context,
        const TTraitBinding<IUpdate>& Binding,
        const FTraitUpdateState& TraitState
    ) const; 
 
    // Called after a traits children have been updated  
    UE_API virtual void PostUpdate(...) const; 
};
```

`IEvaluate` 负责评估动画，类比`Evaluate_AnyThread`

```
struct IEvaluate : ITraitInterface 
{ 
    DECLARE_ANIM_TRAIT_INTERFACE(IEvaluate) 
 
    // Called before a traits children are evaluated  
    UE_API virtual void PreEvaluate(
        FEvaluateTraversalContext& Context,
        const TTraitBinding<IEvaluate>& Binding
    ) const; 
 
    // Called after a traits children have been evaluated  
    UE_API virtual void PostEvaluate(...) const; 
};
```

还有一个比较重要的接口：`IHierarchy`，用于定义节点父子关系，**描述有哪些，有多少子节点**

```
struct IHierarchy : ITraitInterface
{
    // 有多少个子节点（含非活跃的）
    virtual uint32 GetNumChildren(Context, Binding) const;

    // 返回子节点的 FWeakTraitPtr 列表
    virtual void GetChildren(Context, Binding, FChildrenArray& Children) const;

    // 返回 “ 转发子节点 ” ，用于接口查询沿图向下穿透
    virtual FWeakTraitPtr GetStackForwardingChild(Context, Binding) const;
 
    // 查询 Stack，并为每个 trait 调用 GetChildren 方法，然后将结果追加到数组中  
    UAFANIMGRAPH_API static void GetStackChildren(
        const FExecutionContext& Context, 
        const FTraitStackBinding& Binding, 
        FChildrenArray& Children
    );
};
```

比如`BlendByBool`就进行了覆写，描述两个子节点

```
uint32 FBlendByBoolTrait::GetNumChildren(...) const 
{ 
    return 2; 
} 
 
void FBlendByBoolTrait::GetChildren(...) const 
{ 
    const FInstanceData* InstanceData = Binding.GetInstanceData<FInstanceData>(); 
 
    // Add the two children, even if the handles are empty  
    Children.Add(InstanceData->TrueChild); 
    Children.Add(InstanceData->FalseChild); 
}
```

Trait 的 cpp 文件会使用很多宏来注册Trait以及表明继承了哪些接口

```
AUTO_REGISTER_ANIM_TRAIT(FSequencePlayerTrait) 
 
// Trait implementation boilerplate  
#define TRAIT_INTERFACE_ENUMERATOR(GeneratorMacro) \  
 GeneratorMacro(IEvaluate) \  
 GeneratorMacro(IAttributeProvider) \  
 GeneratorMacro(ITimeline) \  
 GeneratorMacro(ITimelinePlayer) \  
 GeneratorMacro(IUpdate) \  
 GeneratorMacro(IGarbageCollection) \  
 GeneratorMacro(INotifySource) \  
 
GENERATE_ANIM_TRAIT_IMPLEMENTATION(
    FSequencePlayerTrait,
    TRAIT_INTERFACE_ENUMERATOR,
    NULL_ANIM_TRAIT_INTERFACE_ENUMERATOR,
    NULL_ANIM_TRAIT_EVENT_ENUMERATOR
)
#undef TRAIT_INTERFACE_ENUMERATOR
```

* * *

### 4.4 接口查询（待更新）

*   此处涉及到 TraitBinding TraitStackBinding GetInterfaceImpl

* * *

## 5. System/Module

*   `UAF System / Module`是整个动画框架的 **容器和调度器**，本身**不负责任何动画逻辑**，

    *   负责 _管理和调度多个动画图 + 变量 + 事件 + 输出_

*   UAF System 可以看作是能被重复使用的AnimBlueprint，其在运行时会生成 `ModuleInstance` 实例

```
// Root asset represented by a component when instantiated  
UCLASS(MinimalAPI, BlueprintType, DisplayName="UAF System") 
class UUAFSystem : public UUAFSharedVariables
{
protected: 
    // ...
    friend FAnimNextModuleInstance;
}
```

System包含Event（Initialize PrePhysics），这些Event会在编译时生成`FModuleEventTickFunction`

```
/** Schedule event called before world physics is updated */
USTRUCT(meta=(DisplayName="PrePhysics", Keywords="Start,Before"))
struct FRigUnit_AnimNextPrePhysicsEvent : public FRigUnit_AnimNextUserEvent
{
    GENERATED_BODY()

    static inline const FLazyName DefaultEventName = FLazyName("PrePhysics");

    FRigUnit_AnimNextPrePhysicsEvent()
    {
        Name = DefaultEventName;
        TickGroup = ETickingGroup::TG_PrePhysics;
    }

    RIGVM_METHOD()
    UE_API virtual void Execute() override;
};
```

并且 ModuleEventTickFuntion 默认开启 `bRunOnAnyThread`，这样允许跑在 WorkerThread

```
FModuleEventTickFunction()
{
    bCanEverTick = true;
    bStartWithTickEnabled = true;
    bRunOnAnyThread = true;
 }
```

ModuleInstance 则会负责将这些 TickFuntion **注册到 TickTaskManager**

```
// Register our tick functions
if(World)
{
    ULevel* Level = World->PersistentLevel;
    for (FModuleEventTickFunction& TickFunction : TickFunctions)
    {
        TickFunction.RegisterTickFunction(Level);
     }
 }
```

* * *

### 5.1 子组件

ModuleInstance 本身通过多个 **子组件** 来完成任务，子组件定义位于ModuleInstance的父类 `FUAFAssetInstance`

```
protected:
    // Array of components
    UPROPERTY(Transient)
    TArray<TInstancedStruct<FUAFAssetInstanceComponent>> Components;
```

`FAnimNextModuleInstance::Initialize`会在初始化时调用`CopyDefaultComponents` 添加默认组件，包括

![Image 79](https://picx.zhimg.com/v2-6f503a80505f1361adf721aa27e49b41_1440w.jpg)

比如这里使用了之前蒙太奇示例里的角色，就需要`InjectionComponent`来给予注入能力，这里处于 **编辑器状态**（Initialize and pause in editor），并没有实际触发动画更新，所以没有输出组件

而需要特定功能时，就会通过AssetInstance的`GetOrAddComponent`**动态添加组件**

开始 **游玩状态**，就会需要输出组件`SystemOutputComponent`来承担姿势输出的能力

RigUnit_RunAnimGraph 会调用 `GetOrAddComponent`

```
FUAFSystemOutputComponent& OutputComponent = ModuleInstance.GetOrAddComponent<FUAFSystemOutputComponent>();
FDataHandle RefPoseDataHandle = OutputComponent.GetRefPose().ReferencePose;
```

![Image 80](https://pic4.zhimg.com/v2-16d2883f11dfbb92ee538a9d194f5e41_1440w.jpg)

* * *

### 5.2 SystemOutputComponent

> 这里提前涉及了一些底层数据形式，可以与数据传递章节一起对照阅读

**SystemOutput**负责管理动画输出的相关内容， 一个 System 只有一个实例

可以看作是 UAF 动画系统与外部世界（SkeletalMeshComponent / 渲染）通信的桥梁，持有Pose数据容器、SKM组件、RefPose 等

```
USTRUCT()
struct FUAFSystemOutputComponent : public FUAFModuleInstanceComponent
{
    // The output pose that was written this time around
    FAnimNextGraphLODPose Pose;

    // The mesh we use to determine the final pose format
    UPROPERTY(Transient)
    TObjectPtr<USkeletalMesh> Mesh;

    // Legacy skeletal mesh component, if any
    UPROPERTY(Transient)
    TObjectPtr<USkeletalMeshComponent> MeshComponent;

    // Refpose generated from the mesh
    UPROPERTY(Transient)
    FAnimNextGraphReferencePose RefPose;

    // Adapter to use for output
    UE::UAF::ISystemOutputAdapter* SystemOutputAdapter = nullptr;

    // The LOD that our system is running at this tick
    int32 LOD = 0;
};
```

其中 `FUAFSystemOutputComponent::WriteOutput` 会 **解包ValueBundle**（通用数据结构，详见6.4 Handle/Bundle）

并通过 `RemapLODPoseToOutput` 将解包出的LODPose 映射到 SKM索引

*   LODPose会根据LOD等级排序，**index不一定跟真实骨骼一一对应**（详见6.1 LODPose）

```
if (InValue.IsRefPose())
{
    Pose.LODPose.SetRefPose();
}
else
{
    // 解包ValueBundle
    UE::UAF::IVirtualValueBundle& Impl = InValue.GetImplChecked();

    // TODO: Value bundle version of this
    if (const FAnimNextGraphLODPose* ValuePose = Impl.GetLODPose())
    {
        // 重映射 LODPose
        RemapLODPoseToOutput(*ValuePose, Pose);
    }
}
```

最后发出信号，让`UAFComponent`调用`WritePose`写姿势数据

```
if (SystemOutputAdapter != nullptr)
{
 SystemOutputAdapter->SignalOutputWritten(UE::UAF::FModuleTaskContext(GetModuleInstance()));
}
```

* * *

### 5.3 Trait Tick 流程简述

> 这里描述的是UAF Trait 以及 RunGraph 相关的Tick 流程

![Image 81](https://pic4.zhimg.com/v2-c877532b2f59a069139b4fc4cf8e1ac5_1440w.jpg)

中间为 UAF_UpdatePose，末尾为 UAF_Module_EndTick

每一帧`FModuleEventTickFunction::ExecuteTick`调用 Run函数执行Tick逻辑

```
void FModuleEventTickFunction::Run(float InDeltaTime)
{
    // Insight 标记为 Module_EventTick
    SCOPED_NAMED_EVENT(UAF_Module_EventTick, FColor::Orange);
    
    // 执行 Pre 任务
    {  
        TUniqueFunction<void(const FModuleTaskContext&)> Function;  
        while (PreExecuteTasks.Dequeue(Function))  
        {  
            Function(FModuleTaskContext(*ModuleInstance));  
        }  
    }

    if (bFirstUserEvent)
    {
        ExecuteBindings_WT(InDeltaTime);   // 双缓冲变量同步
        Initialize(InDeltaTime);
        ModuleInstance->BeginExecution(InDeltaTime);
    }

    // 处理输入事件 (如 Injection 的 InjectEvent)
    ModuleInstance->RaiseTraitEvents(ModuleInstance->InputEventList);

    // 重新应用注入 (防止 RigVM 绑定覆盖 SerialNumber)
    OnPreModuleEvent.Broadcast(FModuleTaskContext(*ModuleInstance));

    // 运行 RigVM 脚本 → 触发图的 Update + Evaluate
    ModuleInstance->RunScriptEvent(Event, InDeltaTime);

    // 处理输出事件 (如 StatusUpdateEvent → 回调到 GameThread)
    ModuleInstance->RaiseTraitEvents(ModuleInstance->OutputEventList);

    // 执行 Post 任务
    {  
        TUniqueFunction<void(const FModuleTaskContext&)> Function;  
        while (PostExecuteTasks.Dequeue(Function))  
        {  
            Function(FModuleTaskContext(*ModuleInstance));  
        }  
    }

    if (bLastUserEvent)  // 最后一个Event Tick
    {
        EndTick(InDeltaTime);  // 清理输出事件, 调度 GameThread 回调
    }
}
```

`RunScriptEvent(Event, InDeltaTime)` 会触发 `AnimNextRunAnimationGraph_Execute`

*   `UpdateGraph` → `EvaluateGraph` → `EvaluatePose`

后面先介绍更新流程中传输的数据格式再详细介绍Tick流程

* * *

## 6. 数据传递

### 6.1 LODPose

`struct FLODPose` 用于存储动画姿势数据，有多种Flag来表示姿势类型

```
enum class ELODPoseFlags : uint8 
{ 
    None               = 0, 
    Additive           = 1 << 0, 
    DisableRetargeting = 1 << 1, 
    UseRawData         = 1 << 2, 
    UseSourceData      = 1 << 3, 
    MeshSpaceAdditive  = 1 << 4, 
    LocalSpaceAdditive = 1 << 5, 
};
```

主要数据

```
static constexpr int32 INVALID_LOD_LEVEL = -1; 
 
FTransformArrayView LocalTransformsView;   // 骨骼数据
const FReferencePose* RefPose = nullptr;   // RefPose
int32 LODLevel = INVALID_LOD_LEVEL;        // LOD 等级
ELODPoseFlags Flags = ELODPoseFlags::None; // 姿势Flag
```

有两种模板实例化

    *   `FLODPoseHeap = TLODPose<FDefaultAllocator>`

    
        *   堆分配，跨帧存储，作为输入输出容器

    *   `FLODPoseStack = TLODPose<FAnimStackAllocator>`

    
        *   栈分配，Evaluate 期间临时使用

最终输出结构`FAnimNextGraphLODPose`使用堆分配

```
USTRUCT(BlueprintType, meta = (DisplayName = "LODPose")) 
struct FAnimNextGraphLODPose 
{ 
    GENERATED_BODY() 
 
    // Joint transforms  
    UE::UAF::FLODPoseHeap LODPose; 
 
    // Float curves  
    FBlendedHeapCurve Curves; 
 
    // Attributes  
    // Note that attribute bone indices are LOD bone indices matching the LOD pose    
    UE::Anim::FHeapAttributeContainer Attributes; 
}
```

中间数值传递 `KeyframeState` 使用栈分配

```
/*  
 * Key Frame State 
 * 
 * This struct holds sampled keyframe state or interpolated keyframe state.  
 * It holds a pose, trajectory, curves, attributes, etc that one might find in 
 * an animation sequence or as an output of an animation node. 
 */
struct FKeyframeState 
{ 
    // Joint transforms at a particular LOD (on memstack)  
    FLODPoseStack Pose; 
 
    // Float curves at a particular LOD (on memstack)  
    FBlendedCurve Curves; 
 
    // Attributes at a particular LOD (on memstack)  
    UE::Anim::FStackAttributeContainer Attributes; 
};
```

最重要的设计在于 `LocalTransformsView` 采用的是 **SoA**（Struct of Arrays）布局，数组结构体

    *   即 Translation / Rotation / Scale 分离

ABP 实际上在使用 `FBasePose`作为底层传递的数据结构，使用的是 **AoS**（Arrays of Struct）

```
template<class BoneIndexType, typename InAllocator> 
struct FBasePose
{
protected: 
    TArray<FTransform, InAllocator> Bones;
    // Transform 连续排列为一个数组
}
```

* * *

### 6.2 AoS / SoA

*   **AoS** 就是 Array of Struct，结构体数组，将多个 FTransform 结构体存为一个数组

```
using FTransformArrayAoSView = TArrayView<FTransform>;
```

*   **SoA** 则是 Struct of Array，数组结构体，将 TRS 分开存为连续数据，放在一个统一结构体

```
struct FTransformArraySoAView 
{ 
    TArrayView<FVector> Translations; 
    TArrayView<FQuat> Rotations; 
    TArrayView<FVector> Scales3D;
}
```

![Image 82](https://pic3.zhimg.com/v2-56d3b09a09ee09fdf3b91766cec076be_1440w.jpg)

AoS 和 SoA 主要区别在于数据的内存布局

    *   AoS 是连续多个结构体存放，每个结构体都包含了 TRS
    *   SoA 则是把不同属性拆开，Translation 会连续存放，Rotation 也会连续存放

使用 AoS 时，如果只想 **批量处理同一类数据**，内存访问模式很差

    *   这会经常性的把不需要处理的数据一起读进 CPU Cache，导致 cache block 利用率低

而如果使用 SoA，在这种情况下 _**缓存利用率就会大大增加**_

同时 AoS 也对 SIMD 没那么友好

    *   这里 SIMD 是一种优化方法，简单来说是一条指令同时处理多个数据(**Single Instruction Multiple Data)**

    
        *   会编写成ispc文件
        *   参考微软文档的优化建议，其中提到尽可能的使用SoA布局

比如 ABP 和 UAF 都对Mesh/Local Space的互相转换逻辑使用了simd优化

    *   ABP：`AnimationRuntime.ispc` 中的 ConvertRotationsToMeshSpace 
    *   UAF：`ConvertRotationSpace.ispc`

    
        *   而这里实际上只会处理Rotation这一类数据，UAF 的 SoA 布局显然是更好的选择

* * *

### 6.3 Reference Pose

UAF的Reference Pose并非简单的 Bind Pose，而是一个用来 **存储骨骼信息**的数据结构，尤其对LOD有存储优化

```
template <typename AllocatorType, typename SetAllocator>
struct TReferencePose
{
    // BindPose 变换
    TTransformArray<AllocatorType> ReferenceLocalTransforms;
 
    // 不同索引规则的映射表
    TArray<TArray<FBoneIndexType>> LODBoneIndexToParentLODBoneIndexMapPerLOD;
    TArray<TArray<FBoneIndexType>> LODBoneIndexToMeshBoneIndexMapPerLOD;
    TArray<TArray<FBoneIndexType>> LODBoneIndexToSkeletonBoneIndexMapPerLOD;
 
    TArray<FBoneIndexType> MeshBoneIndexToLODBoneIndexMap;
    TArray<FBoneIndexType> SkeletonBoneIndexToLODBoneIndexMap;
 
    // 表明不同LOD使用多少骨骼
    TArray<int32> LODNumBones;
    UE::Anim::FBulkCurveFlags CurveFlags;
 
    TWeakObjectPtr<const USkeletalMeshComponent> SkeletalMeshComponent = nullptr; 
    TWeakObjectPtr<const USkeletalMesh> SkeletalMesh = nullptr; 
    TWeakObjectPtr<const USkeleton> Skeleton = nullptr; 
    EReferencePoseGenerationFlags GenerationFlags = EReferencePoseGenerationFlags::None; 
 
    static constexpr FBoneIndexType RootBoneIndex = 0;
};
```

不只是存骨骼 Transform，还存了大量 **索引映射表**，用来在不同骨骼编号体系之间转换

其中最大的优化在于 `ReferenceLocalTransforms` 会 **根据 LOD 进行排序**

    *   保证低细节 LOD 需要的核心骨骼排在前面
    *   这样可以做到 LOD2 只取前 3 个 LOD1 只取前 5 个 LOD0 取全部

![Image 83](https://pica.zhimg.com/v2-26a0e5e5a29d71223612d74dd13c7ae6_1440w.jpg)

不同 LOD 可以直接通过 **截断数组**来快速得到当前 LOD 的骨骼集合，而截断数就来自于 `LODNumBones`

比如当前为LOD2，那么就直接取前10个数据

    *   位于 `FGenerationTools::GenerateOrderedBoneList`，算法细节略

*   **FastPath 模式**：所有 LOD 共享 这个`ReferenceLocalTransforms` 数组，运行时通过 `LODNumBones[LOD]` 截断
*   非 FastPath则需要每个 LOD 维护独立的 `LODBoneIndexToParentLODBoneIndexMapPerLOD[LOD]`

而 ABP 中是没有类似优化的，究其原因是动画图与骨骼的耦合

UAF 的图可以**被多个不同骨骼的角色共享使用**，所以必须在求值时显式告诉它 " 当前在算哪个骨架 "

*   Reference Pose 就是承担这个作用的 " 骨架说明书 "

而ABP 的 AnimInstance 和 SkeletalMeshComponent 是 1对1 强绑定的，骨架信息通过 `FPoseContext& Output` 在每个节点之间传递

Output 自带 `FCompactPose Pose`，底层就是 `FBaseCompactPose`，每个 AnimNode 都是通过Evaluate 直接原地修改这个 Pose的数据

    *   FPoseContext 同时包含 `FAnimInstanceProxy`，含有 `RequiredBones` 和 `LODLevel`，表明了不同 LOD 级别下需要的骨骼

```
/**  
  * Temporary array of bone indices required this frame. Should be subset of Skeleton and Mesh's RequiredBones.  
  * Shared between all anim instances on a skeletal mesh component if it has a skeletal mesh and a skeleton present.  
  */
TSharedPtr<FBoneContainer> RequiredBones; 
 
/** LODLevel used by RequiredBones */ 
int32 LODLevel = 0;
```

LOD 切换时，`RequiredBones` 会被重建（少了一部分不需要的骨骼），`CompactBoneIndex` 全部重映射

    *   同一个 SkeletonBoneIndex 在 LOD0 和 LOD1 可能对应不同的 CompactBoneIndex

`USkeletalMeshComponent::TickAnimation`会检测是否需要重建

```
// Recalculate the RequiredBones array, if necessary  
if (!bRequiredBonesUpToDate) 
{ 
    QUICK_SCOPE_CYCLE_COUNTER(STAT_USkeletalMeshComponent_RefreshBoneTransforms_RecalcRequiredBones); 
    RecalcRequiredBones(GetPredictedLODLevel()); 
}
```

这里 `RecalcRequiredBones` 会带来性能消耗，通过自定义Scope可以看到，在切换时会有非常大的消耗，并且同样的这是跑在GameThread的

![Image 84](https://pic1.zhimg.com/v2-b4cf8a39ba4210b708b766ad27cc8e68_1440w.jpg)

触发重计算会占到非常大的性能消耗，可能会导致帧数跳变

![Image 85](https://pic3.zhimg.com/v2-88dd3760582cff4814b3341e26681de8_1440w.jpg)

假设采用前面刺客信条天国拯救的LOD方案，在人物快速移动时可想而知会带来频繁的重新计算

而 UAF 则完全不需要重建，只需要根据不同 LOD 等级截断就行了，这也是UAF的一个优化表现

* * *

### 6.4 Handle/Bundle（待更新）

> 这里代码抽象程度较高，我的理解还不是非常清晰，只能进行简单阐述
> 
> 最开始发现问题是在于视图用ABP的思路来理解UAF的节点连接，比如想要将Graph的结果当作另外一个Graph的输入，或者将Run Graph 与 Run AnimNode结合，但是会发现不像ABP所有节点的输入输出基本上都是统一的数据

UAF 使用`TraitHandle`和`ValueBundle`分别解决 “ 图的连接 ” 和 “ 值的流动 ”

*   Handle 定义图的结构（谁连谁），图中的数据以 ValueBundle 形式沿 Handle 定义的结构流动、混合、输出

AnimGraph 图由节点构成，每个节点内部有一个 TraitStack，节点之间的边用 `FAnimNextTraitHandle` 表示

比如 `BlendByBool` 有 True/False Child

![Image 86](https://pic4.zhimg.com/v2-f3fbd45ba069ab37c549fc9df3ae2f5f_1440w.jpg)

```
/** First output to be blended. */ 
UPROPERTY() 
FAnimNextTraitHandle TrueChild; 
 
/** Second output to be blended. */ 
UPROPERTY() 
FAnimNextTraitHandle FalseChild;
```

`FAnimNextTraitHandle` 内部是一个编译时解析的索引，运行时指向另一个节点的 `FNodeDescription`

    *   编译后图的拓扑是固定的，**哪个节点连到哪个节点，在编译时已经确定**

* * *

`ValueBundle`是除了KeyFrameState外的第二种数据容器，重点在于通用性，不分骨骼曲线或者属性，可以任意决定里面有哪些，有哪种类型的数据

比如输出函数之一 `WriteSystemOutput` 接受的是ValueBundle

![Image 87](https://pic3.zhimg.com/v2-9b79c778aa243b43ceba9a04cb6eaa46_1440w.jpg)

```
struct FValueBundle
{
    FAttributeNamedSetPtr NamedSet;      // 这个 Bundle 里有哪些属性类型
    FBoundMapCollection BoundMaps;
    FUnboundMapCollection UnboundMaps;
    FValueSpace ValueSpace;
};
```

其中NamedSet的运行机制要依赖`SkeletonSetBinding / Collection`，但是目前抽象骨骼代码开发尚不完整，此处不再进行分析

现在默认依旧使用`KeyFrameState` 形式的数据

![Image 88](https://pic3.zhimg.com/v2-157aac3ff13b75470a9c56f45f647426_1440w.jpg)

WriteSystemOutput断点可以看到Value里只有Pose信息，Bundle相关为Empty

相比之下，`Run Graph`则是直接输出`LODPose`

![Image 89](https://pic1.zhimg.com/v2-4e4de7a64f032a92ecf6cbbf191af806_1440w.jpg)

* * *

## 7. Trait 管线 Tick流程（待更新）

前面已经分析到的更新链路是：

每个`Event`(Initialize Pre/PostPhysics)在编译时注册一个 `FModuleEventTickFunction`

→ `ModuleInstance` 将这些 `TickFunction` 注册到 `TickTaskManager`

→ 每一帧`FModuleEventTickFunction::ExecuteTick`会调用 `FModuleEventTickFunction::Run`

→ `ModuleInstance->RunScriptEvent(Event, InDeltaTime)`

→ 触发`AnimNextRunAnimationGraph` 的Execute任务，按次序调用

*   `UpdateGraph`
*   `EvaluateGraph`
*   `EvaluatePose`

![Image 90](https://pic2.zhimg.com/v2-fcd7f312e1465320908f6d6712471a9d_1440w.jpg)

> 这里Execute不是简单调用Execute函数，涉及到RigVM的运行机制

* * *

### 7.1 双缓冲变量读写

Run函数在第一次更新时还有非常重要的一步 `ExecuteBindings_WT` ，会进行变量的 **双缓冲**写入

```
if (bFirstUserEvent)
{
     ExecuteBindings_WT(InDeltaTime); // 双缓冲变量同步
     Initialize(InDeltaTime);
     ModuleInstance->BeginExecution(InDeltaTime);
 }
```

渲染方向的TA同学应该对双缓冲的概念比较熟悉，简单来说就是增加一个缓冲区，**让需要进行动态读写的数据的写入和读取的操作不冲突**，这对于动画的并行更新非常重要

如果没有双缓冲，GameThread 写入和 Worker Thread 读取同一块内存就会导致数据竞争，这时候就会需要读写锁，进而会降低并发性

UAF使用`ProxyVariables`作为缓冲区，通过`DirtyFlags`/`bIsDirty`来标记变量在写 Buffer 中是否被修改过

`ProxyVariable` 存储在 `ModuleInstance` 内部

```
// Proxy public variables, double-buffered
UPROPERTY(Transient)
FUAFInstanceVariableDataProxy ProxyVariables[2];
```

![Image 91](https://pic2.zhimg.com/v2-1edf9afbc31e3b36202ffb32bdf3ccd9_1440w.jpg)

`FAnimNextModuleInstance::CopyProxyVariables()` 会进行缓冲区的翻转，并在翻转时上写锁

```
void FAnimNextModuleInstance::CopyProxyVariables()
{
    int32 ProxyReadIndex = 0;
    {
        // 上写锁
        UE::TWriteScopeLock WriteLock(ProxyLock);

        // Flip the write buffer index
        ProxyReadIndex = ProxyWriteIndex;
        ProxyWriteIndex = 1 - ProxyWriteIndex;
    }

    FUAFInstanceVariableDataProxy& ProxyVariablesRead = ProxyVariables[ProxyReadIndex];
    ProxyVariablesRead.CopyDirty();
}
```

这里不继续深入探讨技术细节，如果有更了解OS和并发编程的同学可以写更详细的分析文章~

可以看一眼调用栈：

![Image 92](https://pic1.zhimg.com/v2-ac5e9e55bb586b198691d1526f32f5a4_1440w.jpg)

* * *

### 7.2 RunGraph / HostGraph

```
FRigUnit_AnimNextRunAnimationGraph_v2_Execute() 
{ 
    // Insight 标记为 Run_Graph
    SCOPED_NAMED_EVENT(UAF_Run_Graph_V2, FColor::Orange);
 
    // ...
}
```

RunAnimationGraph 整体来看就是在 Module 的 RigVM Event 里运行一个 UAF AnimGraph

1.   获取 ModuleInstance，准备 RefPose / LOD
2.   找到或创建 GraphInstance
3.   把目标 Graph **注入**`HostGraph`
4.   执行 `UpdateGraph()` 和 `EvaluateGraph()`
5.   最后把事件结果写回 ModuleInstance

其他步骤这里不进行展开，重点在于 **注入HostGraph**这一步，这里的意思是

Graph的Update/Evaluate不是直接对这个AnimGraph本身进行的，而是先将其注入一个外壳容器 **HostGraph**，之后Update/Evaluate都是在Host上进行

观察 `Run Graph` 节点也可以看到

![Image 93](https://pica.zhimg.com/v2-17bc7c6f8fdf0998342687b2a289d1aa_1440w.jpg)

```
// Get a host to run this graph  
const UUAFAnimGraph* HostGraph 
 = Graph.HostGraph ? Graph.HostGraph.Get() : FAnimGraphFactory::GetDefaultGraphHost(); 
FAnimNextModuleAnimGraphComponent& AnimationGraphComponent = 
    ModuleInstance.GetOrAddComponent<FAnimNextModuleAnimGraphComponent>(); 

// 没有HostGraph不能运行
if(HostGraph == nullptr) 
{ 
    AnimationGraphComponent.ReleaseInstance(WorkData.WeakHost); 
    UAF_RIGUNIT_LOG(Warning, TEXT("Could not run graph - ..."),...); 
    return; 
}
```

这里会动态添加 `AnimNextModuleAnimGraphComponent`，其会管理一个 HostGraph 实例

，这是 AnimGraph 在 Module 的运行时实例，负责 **保存运行时状态**

*   不会每帧都重新创建 GraphInstance，会缓存在`WorkData.WeakHost`
*   如果之前缓存的 HostInstance 还有效，但不是当前的 HostGraph，就释放旧实例
*   创建新实例的同时还会 **拿到 HostGraph 的注入点**

```
// Lazily (re-)allocate graph instance if required  
if(!WorkData.WeakHost.IsValid()) 
{ 
    // Reset our graph reference, we may be allocating a new graph  
    WorkData.InjectedGraphReference.Reset(); 
 
    TSharedPtr<FAnimNextGraphInstance> NewGraphInstance = AnimationGraphComponent.AllocateInstance(HostGraph, Overrides.GetOverrides().Pin()).Pin(); 
    if (NewGraphInstance.IsValid()) 
    { 
        WorkData.WeakHost = NewGraphInstance; 
 
        // 拿取到Host的 Injection Site
        FGraphInstanceInjectionComponent& HostInjectionComponent = NewGraphInstance->GetOrAddComponent<FGraphInstanceInjectionComponent>(); 
        WorkData.InjectedGraphReference = HostInjectionComponent.GetInjectionInfo().GetDefaultInjectionSite(); 
    } 
}
```

* * *

可以把 `HostGraph` 看作是一层外壳，用于 **接入 Module**，而 Graph 是代表具体运行逻辑，注入到 Host 里再与 Module 相连接

*   如果没有 HostGraph，每次更换要播放的 AnimGraph 时就会销毁旧的 GraphInstance，并且会 **丢失原本数据**

    *   当前播放进度(Timeline 状态)
    *   过渡平滑状态(比如混合权重)

*   如果有一层持续存在的 Host 外壳，那么可以**由 Host 来负责维护这些运行时数据**，每次更换时只需要替换 Asset ，即要播放的 AnimGraph 就行了，

`AnimGraphFactory` 定义了创建默认 HostGraph 的方法

```
const UUAFAnimGraph* FAnimGraphFactory::GetDefaultGraphHost() 
{ 
 const TPair<FAnimNextFactoryParams, FParamsInitializer>* ParamsTask = FindGraphParamsForAssetData(FUAFGraphFactoryAsset_Graph() ); 
 return BuildGraph(ParamsTask->Key.GetBuilder()); 
}
```

`AnimNextAnimGraphModule` 实现了一些工厂方法，定义了哪些 UObject 类型可以被动态编译成什么样的 AnimGraph，其中定义了默认 Host 的样式

```
void FAnimNextAnimGraphModule::RegisterGraphFactories()
{
    // 注册默认 Graph Host
    FAnimNextFactoryParams Params;
    Params.AddTraitStruct<FBlendStackCoreTraitData>(ETraitVariableMapping::None, 0); // Base
    Params.AddTraitStruct<FBlendSmootherCoreData>(ETraitVariableMapping::None, 0); // Add
    Params.AddTraitStruct<FInjectionSiteTraitData>(ETraitVariableMapping::All, 0); // Add

    FAnimGraphFactory::RegisterAsset<FUAFGraphFactoryAsset_Graph>(
        MoveTemp(Params),
        [](const FUAFGraphFactoryAsset_Graph& AssetData, FAnimNextFactoryParams& InOutParams)
        {
            // 将 AssetData.AnimationGraph 写入 InjectionSite 的 Graph 引脚
            InOutParams.AccessTraitStruct<FInjectionSiteTraitData>(0, [&](FInjectionSiteTraitData& InStruct)
           {
                InStruct.Graph.Asset = AssetData.AnimationGraph;
            });
            
            // 复制被注入图的变量到 HostGraph
            InOutParams.AddPublicVariablesAsset(AssetData.AnimationGraph);
    });
 
    // ...
}
```

默认 Host 就是 `BlendStack` + `Smooth` + `Injection Site`

每个普通的 AnimGraph 都有一个 Host

```
USTRUCT(BlueprintType, DisplayName="UAF Graph")
struct FAnimNextAnimGraph
{
    // 要运行的图资产 (用户通过 RunGraph 节点的 Graph 引脚连线)
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category=Graph)
    TObjectPtr<const UObject> Asset;

private:
    // 注入数据: SerialNumber (用于路由) + EvaluationModifier
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category=Graph)
    FAnimNextGraphInjectionData InjectionData;

    // "We use a host graph to be able to blend between graph sources at the
    // top level of a module when a RunGraph's input graph changes."
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category=Graph, AdvancedDisplay)
    TObjectPtr<UUAFAnimGraph> HostGraph;
};
```

* * *

### 7.3 UpdateGraph（待更新）

Update的主要设计思路在于 **接口查询** + **IHierarchy寻找子节点** + **手动栈 DFS**

碍于篇幅原因，这里不太进行很详细的分析，只提几个关键点

函数通过While循环遍历Graph调用Update

```
while (Private::FUpdateEntry* Entry = TraversalContext.PopUpdateEntry())
```

接口查询

```
// 查询Stack是否有实现了Update的Trait
const bool bImplementsIUpdate = Entry->TraitStack.GetInterface(Entry->UpdateTrait);

// Before we PreUpdate, signal that we became newly relevant
if (bImplementsIUpdate && Entry->TraitState.IsNewlyRelevant())
{
    Entry->UpdateTrait.OnBecomeRelevant(TraversalContext, Entry->TraitState);
}

// Raise our input events
Private::RaiseTraitEvents(TraversalContext, Entry, *TraversalContext.InputEventList);

// Main update before our children
if (bImplementsIUpdate)
{
    Entry->UpdateTrait.PreUpdate(TraversalContext, Entry->TraitState);
}
```

其中GetInterface底层调用的是 `FTraitStackBinding::GetInterfaceImpl`，会从栈顶往Base Trait 查询

之后查询并将子节点压入栈

> 这里源代码里有非常详细的注释，推荐阅读并断点调试观察

![Image 94](https://picx.zhimg.com/v2-4031900345376942d7f444733d690b6f_1440w.jpg)

* * *

### 7.4 EvaluateGraph

`IEvaluate` 里有两种重载的 EvaluateGraph，作用和 Insight 里的标记不同

*   第一种负责决定 “ **要做哪些计算** ”，生成 Task 栈，叫做 `EvaluateGraph`

    *   主要是接口查询和追加 Task
    *   会返回任务列表`FEvaluationProgram`

*   第二种则接受 Program ，并负责 **真正的 Pose 更新**，叫做`EvaluatePose`

```
FEvaluationProgram EvaluateGraph(
    const FEvaluateGraphContext& EvaluateGraphContext,
    const FWeakTraitPtr& GraphRootPtr
)
{
    // Insight 标记为 EvaluateGraph
    SCOPED_NAMED_EVENT(UAF_EvaluateGraph, FColor::Orange);
 
    FEvaluationProgram EvaluationProgram;

    // ...

    return EvaluationProgram;
 }
```

比如单独播放Sequence只有一个Task

![Image 95](https://pic4.zhimg.com/v2-3a276240a65f59c11edd1679cd2ccdbf_1440w.jpg)

`BlendLayer`混合两个动画时除了两个动画评估Task还有混合Task

![Image 96](https://pica.zhimg.com/v2-978fa168b535dc015e3770aaae312a8a_1440w.jpg)

* * *

### 7.5 EvaluatePose

```
void EvaluateGraph(const FEvaluateGraphContext& EvaluateGraphContext, FAnimNextGraphLODPose& OutputPose)
{
    FAnimNextGraphInstance& GraphInstance = EvaluateGraphContext.GetGraphInstance();
    const FReferencePose& RefPose = EvaluateGraphContext.GetRefPose();
    const int32 GraphLODLevel = EvaluateGraphContext.GetGraphLODLevel();

    // 调用前面的 EvaluateGraph 获取 Program
    const FEvaluationProgram EvaluationProgram = EvaluateGraph(EvaluateGraphContext);

    TRACE_UAF_EVALUATIONPROGRAM(EvaluationProgram, GraphInstance);
    {
        // Insight 标记为 EvaluatePose
        SCOPED_NAMED_EVENT(UAF_EvaluatePose, FColor::Orange);

        // ...
        TUniquePtr<FKeyframeState> EvaluatedKeyframe;
    
        if (!bHasValidOutput && EvaluationVM.PopValue(KEYFRAME_STACK_NAME, EvaluatedKeyframe))
        {    
            OutputPose.LODPose.CopyFrom(EvaluatedKeyframe->Pose);
            OutputPose.Curves.CopyFrom(EvaluatedKeyframe->Curves);
            OutputPose.Attributes.CopyFrom(EvaluatedKeyframe->Attributes);
            bHasValidOutput = true;
        }
    }

    if (!bHasValidOutput)
    {
        // We need to output a valid pose, generate one
        FKeyframeState ReferenceKeyframe = EvaluationVM.MakeReferenceKeyframe(false);
        OutputPose.LODPose.CopyFrom(ReferenceKeyframe.Pose);
        OutputPose.Curves.CopyFrom(ReferenceKeyframe.Curves);
        OutputPose.Attributes.CopyFrom(ReferenceKeyframe.Attributes);
    }
}
```

这里如果启用了抽象骨骼还会根据Binding和Collection映射骨骼

```
if (!Collection->IsEmpty())
{
    ConvertBones(FPoseValueBundle::From(*Collection), OutputPose.LODPose);
    ConvertCurves(FPoseValueBundle::From(*Collection), OutputPose.Curves);
    ConvertAttributes(FPoseValueBundle::From(*Collection), OutputPose.Attributes);
}
```

* * *

## 8. AnimNode 管线Tick流程（待更新）

## 9. 输出链路

输出有`WritePose`和`WriteSystemOutput`，分别接受LODPose 和 ValueBundle 输入

```
FRigUnit_AnimNextWriteSkeletalMeshComponentPose::WritePose(
    USkeletalMeshComponent* InOutputComponent,
    const FAnimNextGraphLODPose& InPose
)
```

后者实际上是`OutputPoseComponent.WriteOutput`，最终还是在调用 WritePose，是解包ValueBundle后拿取其中的LODPose进行WritePose

WritePose简单来说就是将Pose Curve Attribute写回SkeletalMeshComponent

**Pose**

```
UE::Anim::FSkinnedMeshComponentExtensions::CompleteAndDispatch(
    InOutputComponent,
    InPose.LODPose,
    MoveTemp(GameThreadCallback)
);
```

CompleteAndDispatch 会进行Local Space 到 ComponentSpace 的转换

**Curve**

```
InOutputComponent->AnimCurves.CopyFrom(InPose.Curves);
```

**Attribute**

```
FGenerationTools::RemapAttributes(
    InPose.LODPose, 
    InPose.Attributes, 
    InOutputComponent->GetEditableCustomAttributes()
);
```

这里最大的改进在于**RootMotion在Evaluate阶段不再被特殊看待**，与其他属性使用一套处理逻辑，就是 Attributes 里普通的一个 FTransform 条目

这也是UAF能让大部分工作在WorkerThread的关键点，详解见 12.RootMotion

* * *

## 10. Blend（待更新）

UAF 会靠 BlendStack 来管理 AnimGraph

## 11. Injection

在 2.2 里已经对Injection的概念和使用有个简单介绍，这里给出一个更准确的描述

UAF 的注入系统注入的不是 “ Montage”，而是一个 **由 Factory 方法动态编译的完整`UAF AnimGraph`子图**，注入到 TraitStack 中的 `InjectionSite Trait` 上，并通过 `BlendStack` 管理混合过渡

> 这里Factory是编程里的工厂方法的概念

PS：还能够注入一个 **Evaluate Modifier** 来动态修改Evaluate阶段的逻辑，但此部分我并未研究

下面分析注入是怎么作用于整个UAF动画系统的

整体流程是Inject会发出一个**注入申请**(Request)，这个注入申请会被加入 **InputEventList**，之后由**InjectionComponent** 和 **InjectionSite Trait** 配合处理这个请求

跟PlayMontage一样，注入有几种状态

```
UENUM()
enum class EAnimNextInjectionStatus : uint8
{
    //////////////////////////////////////////////////////////////////////////
    // Primary status is held in the bottom 5 bits
    // These are mutually exclusive

    // No current status
    None        = 0x00,

    // Animation request has been queue but hasn't been processed yet
    Pending     = 0x01,

    // Animation is playing (may be blending in or out, may be interrupted)
    Playing     = 0x02,

    // Animation has finished playing (may have the interrupted flag to signal that it didn't stop on its own)
    Completed   = 0x04,

    // Animation request expired without playing
    Expired     = 0x10,

    //////////////////////////////////////////////////////////////////////////
    // Additive status is held in the top 3 bits

    // Animation was interrupted by another animation request (or a stop request)
    Interrupted = 0x40,

    // Animation is blending out
    BlendingOut = 0x80,
};
```

所有注入最后都是在调用

```
FInjectionRequestPtr FInjectionUtils::Inject(
    UObject* InHost, 
    FUAFWeakSystemReference InSystemReference, 
    FInjectionRequestArgs&& InArgs, 
    FInjectionLifetimeEvents&& InLifetimeEvents
)
```

会检查是否在 GameThread，并调用 `FInjectionRequest::Inject` 发出注入请求

```
check(IsInGameThread());

FInjectionRequestPtr Request = MakeInjectionRequest();
if(Request->Inject(MoveTemp(InArgs), MoveTemp(InLifetimeEvents), InHost, InSystemReference))
{
    return Request;
}
return nullptr;
```

Request会把申请转为Trait Event并将其加入`InputEvent`

```
auto InjectEvent = MakeTraitEvent<FInjection_InjectEvent>();
InjectEvent->Request = AsShared();

Reference.QueueInputTraitEvent(InjectEvent);
```

Run 中先于Update/Evaluate 处理InputEvent

```
ModuleInstance->RaiseTraitEvents(ModuleInstance->InputEventList);
```

前面提到过，ModuleInstance是通过子组件 InjectionComponent 实现注入功能的，因此Event触发时在调用这个组件的`OnInjectionEvent` 来处理这个注入请求，但是这里 **不会消费注入对象**

其中会寻找`InjectionSite`

```
FAnimNextVariableReference FoundSite = InjectionInfo.FindInjectionSite(RequestArgs.Site);
if(FoundSite.IsNone())
{
    UE_LOGFMT(LogAnimation, Warning, 
        "Could not find injection site '{SiteName}' for injection request", 
        RequestArgs.Site.DesiredSite.GetName());
    InEvent.MarkConsumed();
    return;
}
```

会给每个Inject Event 分配一个序号 SerialNumber 来进行区别

```
case EAnimNextInjectionType::InjectObject:
    // Bump serial number to identify this injection routing
    ensureAlways(RequestArgs.Object != nullptr);
       InGraph.InjectionData.InjectionSerialNumber = IncrementSerialNumber();
       InEvent.SerialNumber = InGraph.InjectionData.InjectionSerialNumber;
       InjectionRecord.SerialNumber = InGraph.InjectionData.InjectionSerialNumber;
       InjectionRecord.GraphRequest = InEvent.Request;

    // Note we dont consume here, as we want the event to forward to the injection site trait
    break;
```

RunAnimationGraph 里，会将 Module 级别的InputEvent拷贝进Graph

```
UE::TReadScopeLock ReadLock(ModuleInstance.EventListLock);
InputEventList = ModuleInstance.InputEventList;
```

之后UpdateGraph时便会再次处理 InputEvent

```
// Raise our input events
Private::RaiseTraitEvents(TraversalContext, Entry, *TraversalContext.InputEventList);
```

这次则由注入点`InjectionSite Trait` 的 `OnInjectionEvent`来处理请求

对比 SerialNumber 无误后 **存储注入请求到`PendingRequest`**并标记为已消费

```
ensure(Event.SerialNumber != 0);
if (Graph.InjectionData.InjectionSerialNumber == Event.SerialNumber)
{
    const FAnimNextInjectionRequestArgs& RequestArgs = Event.Request->GetArgs();
    ensureMsgf(!InstanceData->PendingRequest.IsValid(), TEXT("Injection site %s already contained a pending request, it will be overwritten"), *RequestArgs.Site.DesiredSite.GetName().ToString());

    // Overwrite any request we might have, we'll pick it up on the next update
    InstanceData->PendingRequest.Reset();
    InstanceData->PendingRequest.Request = Event.Request;

    Event.MarkConsumed();
}
```

在Injectionsite的PreUpdate里，如果检测到`PendingRequest`里面有请求就会进入处理逻辑

```
if (InstanceData->PendingRequest.IsValid() || bInjectionSiteChanged || !bHasActiveSubGraph)
{
    // ...
}
```

里面会中断现有Graph，把需要注入的Graph通过`BlendStackTrait.PushGraph`推入`BlendStack`

```
ActiveChildIndex = BlendStackTrait.PushGraph(Context, MoveTemp(BlendStackRequest));
```

* * *

## 12.RootMotion（待更新）

> 这里不对RootMotion的具体概念展开，并且基于CMC（Character Movement Component），同时不涉及网络同步的问题

最关键的区别和改动点在于

ABP中 RootMotion 会被特殊处理，是一个共享变量（`FAnimInstanceProxy` 里的 `ExtractedRootMotion`），跨线程读写不安全

*   为了避免不同线程的数据竞争，会用`NeedsImmediateUpdate`强行把动画更新拉到GameThread
*   这就会导致如果使用 **RootMotionFromEverything** 时会强制在GT更新动画，导致如果使用DataDriven（动画驱动位移）的动画系统在GT开销会很大
*   **RootMotionFromMontageOnly** 则有所改善，不会使用Proxy里的RootMotion数据，能够并行更新，这应该也是绝大多数CodeDriven（代码驱动位移）的动画系统所采取的模式

这里非常非常推荐阅读Daniel Holden的文章 Code Driven vs Data Driven Displacement，其中探讨了两种位移系统

> Daniel 应该算游戏动画届非常出名的大神，以前在Ubi Lafan，现在是UE的动画程序员，虚幻引擎的Deadblending就是他写的

UAF 中 RootMotion 不再被特殊看待，而是当作动画数据里的一个普通属性，更新链中每个Task会对其进行本地处理，没有跨线程读写同一个共享数据导致冲突的隐患

比如之前ABP的混合会对 RootMotion进行独立处理，而UAF里会与其他属性走同一个逻辑 `BlendAttributes`

> 但是在目前开发进度下，只能说上面还只限于理论分析
> 
> ABP这么设计是会要与CMC相配合处理RootMotion的（比如碰撞检测，网络同步），并非完全没有原因
> 
> 但是目前UAF缺少了这方面的内容，还没有解决RootMotion怎么驱动角色运动
> 
> 比如如果使用前面示例注入系统播放带有RootMotion的动画表现会是原地动画，UAF将RootMotion写入了Attribute，但是并没有消费者

* * *

## 13. Notify（待更新）

UAF 在动画通知上也有与GameThread交互的优化

## 14. Statetree（待更新）

*   题外话：笔者正在找动画向TA/技术动画的实习（27届），可联系

    *   `zhangxiaorui1523@163.com`
    *   qq `1523871672`
