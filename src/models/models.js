export class User {
  constructor(id, name, email, avatar) {
    this.id = id; // 用户唯一ID
    this.name = name; // 用户名称
    this.email = email; // 用户邮箱
    this.avatar = avatar; // 用户头像
  }
}

export class Assistant {
  constructor(
    id,
    name,
    description,
    defaultPrompt,
    maxMessages,
    selected = false
  ) {
    this.id = id; // 助手唯一ID
    this.name = name; // 助手名称
    this.description = description; // 助手描述
    this.defaultPrompt = defaultPrompt; // 助手默认提示词
    this.maxMessages = maxMessages; // 单轮最大消息数
    this.selected = selected; // 是否选中助手，默认为false
  }
}

export class Message {
  constructor(id, content, role) {
    this.id = id;
    this.content = content;
    this.role = role;
  }
}
