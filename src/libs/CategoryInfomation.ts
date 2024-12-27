import { MenuItem } from '@/types/MenuItem';
import {
  Create,
  FormatListNumbered,
  PlaylistAddCheck,
  Search,
} from '@mui/icons-material';

/**
 * メニューバーのタイトルを作成する
 * @param url 相対パス
 * @returns メニューバーのタイトル
 */
export function CreateAppbarTitle(url: string) {
  const path = url.split('?')[0];
  let title = '';
  CategoryInfomationList.map((category) => {
    category.content.map((item) => {
      if (item.link === path) title = `${category.info.name}/${item.title}`;
    });
  });
  return title;
}

/**
 * メニューバーのタイトルを作成する
 * @param url 相対パス
 * @returns メニューバーのタイトル
 */
export function GetDescription(url: string) {
  const path = url.split('?')[0];
  let description = '';
  CategoryInfomationList.map((category) => {
    category.content.map((item) => {
      if (item.link === path) description = item.description;
    });
  });
  return description;
}

export const CategoryInfomationList: MenuItem[] = [
  {
    info: {
      name: 'Top',
      link: '/',
    },
    content: [],
  },
  {
    info: {
      name: 'ロト7',
      link: '',
    },
    content: [
      {
        title: '出現回検索',
        description: '過去のデータから、数字が出現した回を検索できます',
        link: '/search/loto7/appearence',
        icon: Search,
      },
      {
        title: '予想',
        description:
          '第${nextImplementNumber}回ロト7の予想を行います。\n必要なパラメータを設定し、抽選を行ってください',
        link: '/predict/loto7',
        icon: Create,
      },
      {
        title: '予想一覧',
        description: '第${implementNumber}回ロト7の予想一覧',
        link: '/predict/loto7/list',
        icon: FormatListNumbered,
      },
      {
        title: '予想結果',
        description: 'ユーザのロト7の予想結果です。',
        link: '/predict/loto7/result',
        icon: PlaylistAddCheck,
      },
    ],
  },
];
