// 投放申请
export class DeliveryModule {
    // 当前页数
    public pi: number = 1;
    // 每业个数
    public size: number = 10;
    // 工作项GUID
    public guidWorkitem: string;
    // 投放申请人
    public proposer: string;

    // 投放结果 delivery_result
    // public dliveryResult: any;
    public deliveryResult: any;
    // 运行环境
    public environment: string;
}
