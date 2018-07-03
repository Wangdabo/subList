export let appConfig = {
    ABFUrl: 'http://localhost:3000', // 根路径地址
    RootUrl: 'http://localhost:30001', // 其他地址
    testUrl: 'http://106.15.103.14:28080',

    // 所有接口名
    API: {
        treeData: 'treeData',
        listData: 'listData',
        roleData: 'roleData',
        orgTreeData: 'orgTreeData',
        // 登陆接口
        login: '/login',
        logout: '/logout', // 登出
        sWorkitem: '/sWorkitem', // 查询工作项
        sDeliveryList: '/sDeliveryList', // 整理清单

        list: '/deliveries/list', //
        mergeInfo: '/deliveries/merge/info' // 合并投放清单信息
    },


    // 枚举值
    Enumeration:{

    }
}


