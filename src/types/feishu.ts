export interface FeishuResponse<T> {
  code: number;
  data: T;
  msg?: string;
}

export interface NodeInfo {
  node: {
    creator: string;
    has_child: boolean;
    node_create_time: string;
    node_creator: string;
    node_token: string;
    node_type: string;
    obj_create_time: string;
    obj_edit_time: string;
    obj_token: string;
    obj_type: string;
    origin_node_token: string;
  };
}

export interface FeishuConfig {
  baseUrl: string;
  appId: string;
  appSecret: string;
} 