# Artificial Intelligence Projects

人工智能课程项目

## 项目要求

### 环境

python >= 3.0

###启动方法：

1. 初次启动
    - 安装依赖
      ```shell
      cd ArtificialIntelligenceProjects
      pip install -r requirements.txt
      ```
    - 同步数据库
      ```shell
      cd AI_Web
      python manage.py makemigrations # 生成新增数据表命令，第一个新增的人运行即可
      python manage.py migrate # 运行新增数据表命令，所有人均需运行
      python manage.py < init.py
      ```
    - 启动本地服务器
      ```shell
      python manage.py runserver
      ```
1. 后续启动
    ```shell
    python manage.py runserver
    ```

## Simulated Annealing(模拟退火)

在 [TSPLIB](http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/)，(*其他网站还可以找到有趣的art TSP 和 national TSP*)中选一个大于100个城市数的TSP问题
1. 采用多种邻域操作的局部搜索 local search 策略求解；
2. 在局部搜索策略的基础上，加入模拟退火 simulated annealing 策略，并比较两者的效果；
3. 要求求得的解不要超过最优值的10％，并能够提供可视化，观察路径的变化和交叉程度。

## A* Algorithm

以八数码问题为对象，编程解决

1. 利用 A* 算法求解八数码问题，在输出界面上动态显示 OPEN 表的结点数和评估函值最小的结点
1. 比较两种启发函数(上课和书上讲到的 h1(n)和 h2(n))的搜索效率，在输出界面上动态显示 OPEN 表的结点数、总扩展的结点数和评估函值最小的结点
1. 输出 OPEN 表中在最佳路径上的结点及其评估函数值。
1. 验证凡A\*算法挑选出来求后继的点 n 必定满足: f(n)≤f\*(S0)
2. 验证 h1(n) 的单调性，显示凡 A\* 算法挑选出来求后继的点 ni 扩展的一个子结点nj，检查是否满足: h(ni)≤1+h(nj)
3. 如果将空格看作0，即九数码问题，利用相似的启发函数 h1(n) 和 h2(n)，求解相同的问题的搜索图是否相同？
4. 写出能否达到目标状态的判断方法

## Alpha-Beta

编写一个中国象棋博弈程序，要求用 alpha-beta 剪枝算法，可以实现人机对弈。
棋局评估方法可以参考已有文献，要求具有下棋界面，界面编程也可以参考网上程序，但正式实验报告要引用参考过的文献和程序。