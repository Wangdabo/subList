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
        sProfiles: '/sProfiles/list',  // 投放申请查询
        allsProfiles: '/sProfiles/all',  // 投放申请查询
        getBranch: '/sBranch/notAllot', // 未支配的分支
        getStatus: '/sProfiles/status',// 修改状态
        sProfilesadd: '/sProfiles',
        delSprofiles: '/sProfiles/' ,
        list: '/deliveries/list', //
        mergeInfo: '/deliveries/merge/info', // 合并投放清单信息
        merge: '/deliveries/merge',
        sBranch: '/sBranch/list', // 分支查询
        sBranchadd: '/sBranch', // 分支增加
        NogetsBranch: '/sBranch/notAllot', // 未指配的分支
        checklist: '/checks/list', // 查看核对列表

    },


    // 枚举值
    Enumeration : {
        exportType : [
            {key: 'jar', value: 'jar'},
            {key: 'plugins', value: 'plugins'},
            {key: 'epd', value: 'epd'},
            {key: 'ecd,', value: 'ecd'},
            {key: 'sql,', value: 'sql'},
            {key: '配置文件,', value: '配置文件'},
            {key: '可执行jar,', value: '可执行jar'},
            {key: 'war,', value: 'war'},
        ],
        deployType: [
            {key: 'tws.lib', value: 'tws.lib'},
            {key: 'bs.lib', value: 'bs.lib'},
            {key: 'bs.work.user', value: 'bs.work.user'},
            {key: 'tws.work.user,', value: 'tws.work.user'},
            {key: 'bs.数据库,', value: 'bs.数据库'},
            {key: 'bs.config,', value: 'bs.config'},
            {key: 'governor,', value: 'governor'},
            {key: 'tws.plugins,', value: 'tws.plugins'},
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


