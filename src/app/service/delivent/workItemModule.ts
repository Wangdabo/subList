// 工作项
export class WorkitemModule {
    //提交标识
    public artf:number;
    // 当前页数
    public pi: number = 1;
    // 每业个数
    public size: number = 10;

    // 工作项名称
    public itemName: string;

    // 需求编号
    public seqno: string;

    // 开发人员
    public developers: any;

    // 工作项负责人
    public owner: string;

    // 需求描述
    public requirementDesc: string;

    // 收到需求时间
    public receiveTime: string;

    // 启动开发时间
    public developStartTime: string;

    // 计划投产时间
    public deliveryPlanTime: string;

    // 实际投产时间
    public deliveryTime: string;

    // 工作项状态
    public itemStatus: any;

}
