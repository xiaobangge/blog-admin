export const colorArray = [
  "#FF6F61", // 珊瑚色
  "#6B5B95", // 深紫色
  "#88B04B", // 清新绿
  "#F7B32B", // 亮黄
  "#C54B9C", // 玫瑰色
  "#4A90E2", // 天空蓝
  "#50B3A2", // 浅绿色
  "#E94F77", // 鲜红色
  "#9B59B6" // 淡紫色
];

const userManagement = `
  ID,用户名,邮箱,头像,状态,创建时间`
  .trim()
  .split(",");
const articleManagement = `
  ID,标题,分类,封面,热度,评论数,创建时间`
  .trim()
  .split(",");
const commentManagement = `
  ID,内容,点赞数,评论数,创建时间`
  .trim()
  .split(",");
const linkManagement = `
  ID,名称,类型,链接,logo,描述,创建时间`
  .trim()
  .split(",");
const projectManagement = `
  ID,项目名称,项目地址,项目图标,描述,创建时间`
  .trim()
  .split(",");
const findManagement = `
  ID,名称,类型,链接Url,logo,描述,创建时间`
  .trim()
  .split(",");
// 英文翻译
const translationMap = {
  ID: "id",
  用户名: "username",
  邮箱: "email",
  头像: "avatar",
  状态: "state",
  创建时间: "create_at",

  标题: "title",
  分类: "type",
  热度: "heat",
  封面: "image_url",
  评论数: "comment_count",

  点赞数: "like_count",
  内容: "content",

  名称: "name",
  类型: "type",
  链接: "url",
  logo: "avatar",
  描述: "remark",

  项目名称: "name",
  项目地址: "url",
  项目图标: "avatar",

  链接Url: "url",
};

// 生成结果数组的函数
const createResultArray = array => {
  return array.map(item => {
    const englishTranslation = translationMap[item] || "noTranslationAvailable";
    return {
      label: item,
      prop: englishTranslation
      // width: width
    };
  });
};

export const userManagementColumn = createResultArray(userManagement);
export const articleManagementColumn = createResultArray(articleManagement);
export const commentManagementColumn = createResultArray(commentManagement);
export const linkManagementColumn = createResultArray(linkManagement);
export const projectManagementColumn = createResultArray(projectManagement);
export const findManagementColumn = createResultArray(findManagement);
