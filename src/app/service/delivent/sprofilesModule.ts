// 工程
export class SprofilesModule {
 
      public page = '1';
    // 环境代码
       public profilesCode: any;
       
       
        // 环境名称
       public profilesName: any;

         // 安装路径
           public installPath: any;

         // 主机IP
           public hostIp: any;

         // 版本控制用户

           public csvUser: any;

         // 环境管理人员

           public manager: any;

            // 是否允许投放

           public isAllowDelivery = '';
         
              // 打包窗口
          public guid: number;
           public packTiming: any;
      
          public checkOptionsOne = [
                  {label: '09:00', value: '09:00', checked: true},
                  {label: '12:00', value: '12:00'},
                  {label: '15:00', value: '15:00'},
              ]

          };
          