import { offsetDays } from '../shared/date'

/**
 * 种子数据：首次启动（本地还没有存档）时使用。
 *
 * 截止日期用「相对今天」生成，保证任何时候打开都能看到
 * 正常的「还剩 3 天」「逾期 2 天」，不会因为写死日期而全部过期。
 */
export const seedProjects = [
  {
    id: 'p_1',
    name: '金融数据上链存证系统',
    course: '区块链技术及应用',
    description: '基于区块链技术的金融数据上链存证系统',
    createdAt: '2026-09-12',
    folderPath: 'D:\\USY-Projects\\finance-chain',
    tasks: [
      {
        id: 't_1',
        title: '撰写开题报告和需求分析说明书',
        completed: true,
        priority: 'high',
        dueDate: offsetDays(-18)
      },
      {
        id: 't_2',
        title: '搭建 FISCO-BCOS/Hardhat 以太坊底层区块链网络',
        completed: true,
        priority: 'medium',
        dueDate: offsetDays(-12)
      },
      {
        id: 't_3',
        title: '编写存证智能合约及单元测试',
        completed: true,
        priority: 'high',
        dueDate: offsetDays(-5)
      },
      {
        id: 't_4',
        title: '开发前端可视化交互页面与接口联调',
        completed: false,
        priority: 'high',
        dueDate: offsetDays(2)
      }
    ]
  },
  {
    id: 'p_2',
    name: '三亚紫金矿业文本采集与分析平台',
    course: '动态网站开发技术',
    description: '基于动态网站开发技术的紫金矿业文本采集与分析平台',
    createdAt: '2026-10-08',
    folderPath: 'D:\\USY-Projects\\text-analysis',
    tasks: [
      {
        id: 't_201',
        title: '撰写开题报告和需求分析说明书',
        completed: true,
        priority: 'medium',
        dueDate: offsetDays(-20)
      },
      {
        id: 't_202',
        title: '设计网站架构',
        completed: true,
        priority: 'low',
        dueDate: offsetDays(-14)
      },
      {
        id: 't_203',
        title: '开发前端可视化交互页面与接口联调',
        completed: false,
        priority: 'medium',
        dueDate: offsetDays(-2)
      }
    ]
  },
  {
    id: 'p_3',
    name: '校园二手交易平台',
    course: 'Web 前端开发技术',
    description: '面向校内学生的二手物品发布与交易平台，含统一身份认证',
    createdAt: '2026-10-28',
    folderPath: 'D:\\USY-Projects\\campus-market',
    tasks: [
      {
        id: 't_301',
        title: '完成需求调研与竞品分析',
        completed: true,
        priority: 'medium',
        dueDate: offsetDays(-9)
      },
      {
        id: 't_302',
        title: '搭建 Vue3 + Vite 工程骨架',
        completed: true,
        priority: 'low',
        dueDate: offsetDays(-6)
      },
      {
        id: 't_303',
        title: '实现商品发布与列表页',
        completed: false,
        priority: 'high',
        dueDate: offsetDays(4)
      },
      {
        id: 't_304',
        title: '接入校园统一身份认证',
        completed: false,
        priority: 'medium',
        dueDate: offsetDays(0)
      }
    ]
  }
]
