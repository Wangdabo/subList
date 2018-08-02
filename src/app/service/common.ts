export let appConfig = {
    ABFUrl: 'http://localhost:3000', // 根路径地址
    RootUrl: 'http://localhost:30001', // 其他地址
    testUrl: 'http://106.15.103.14:28080',
    // testUrl: 'http://192.168.43.136:28080',
    // testUrl: 'http://10.242.125.115:28080',

    // 所有接口名
    API: {
        treeData: 'treeData',
        listData: 'listData',
        roleData: 'roleData',
        orgTreeData: 'orgTreeData',
        // 登陆接口
        login: '/login',
        logout: '/logout', // 登出
        sWorkitem: '/sWorkitem', // 查询工作项、修改、删除
        sDeliveryList: '/sDeliveryList', // 整理清单
        sProfiles: '/sProfiles/list',  // 投放申请查询
        sProfiless: '/sProfiles/packTimeVerify',  // 投放申请查询
        copyProfiless: '/sProfiles/addToNewProfiles',  // 拷贝申请查询
        allsProfiles: '/sProfiles/all',  // 投放申请查询

        getBranch: '/sProfiles/relevanceBranch', // 未支配的分支
        getStatus: '/sProfiles/status', // 修改状态
        sProfilesadd: '/sProfiles',
        delSprofiles: '/sProfiles/' ,
        list: '/deliveries/list', //
        mergeInfo: '/deliveries/merge/info', // 合并投放清单信息
        merge: '/deliveries/merge',
         deliveries: '/deliveries',
        // 分支
        sBranch: '/sBranch/list', // 分支查询
        sBranchadd: '/sBranch', // 分支增加
        NogetsBranch: '/sBranch/notAllot', // 未指配的分支
        checklist: '/checks/list', // 查看核对列表

        // 基础参数--工程
        sProject: '/sProject',  // 新增、删除、详情
        sProjectList: '/sProject/list',

        // 基础参数--工作项
        workitemAdd: '/sWorkitem/branch', // 新增工作项 后面加分支guid
        workItemList: '/sWorkitem/list', // 查询列表
        svncount: '/sSvnAccount/all', // 查询人员

        // 基础参数---分支
        notAllot: '/sWorkitem/relevanceBranch',

        // 导出清单
        export: '/deliveries/excels', // 查询可导出工作项
        excel: '/checks/delivery', // 导出接口
        newProfiles: '/deliveries/newProfiles' // 克隆投放

    },


    // 枚举值
    Enumeration : {
        exportType : [
            {label: 'jar', value: 'jar'},
            {label: 'plugins', value: 'plugins'},
            {label: 'epd', value: 'epd'},
            {label: 'ecd', value: 'ecd'},
            {label: 'sql', value: 'sql'},
            {label: '配置文件', value: '配置文件'},
            {label: '可执行jar', value: '可执行jar'},
            {label: 'war', value: 'war'},
        ],
        deployType: [
            {label: 'tws.lib', value: 'tws.lib'},
            {label: 'bs.lib', value: 'bs.lib'},
            {label: 'bs.work.user', value: 'bs.work.user'},
            {label: 'tws.work.user', value: 'tws.work.user'},
            {label: 'bs.数据库', value: 'bs.数据库'},
            {label: 'bs.config', value: 'bs.config'},
            {label: 'governor', value: 'governor'},
            {label: 'tws.plugins', value: 'tws.plugins'},
        ]
    },

    // 公共方法
    //  判断是否是空或者undefinde
    isNull(d) {
        if (d === undefined || d === null) {
            return true;
        }
        return false;
    },


}


