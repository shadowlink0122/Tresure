import { SvgIconComponent } from "@mui/icons-material";

export type MenuItemElement = {
  /** 機能名 */
  title: string,
  /** ページ概要 */
  description: string,
  /** リンク */
  link: string,
  /** 表示アイコン */
  icon: SvgIconComponent
}

export type MenuItem = {
  /** サービスのコンテンツ名(ロト7, ロト6, etc...) */
  info: {
    /** コンテンツ名 */
    name: string,
    /** リンク */
    link: string,
  },
  /** コンテンツの機能 */
  content: MenuItemElement[]
};
